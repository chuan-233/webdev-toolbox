/* 交互冒烟测试（CDP，无第三方依赖）：真的点按钮、改筛选、复制、切主题。
   运行：node tests/cdp-smoke.js
   需要本机 Edge；测试结束自动关闭浏览器。 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9333 + (process.pid % 400);
const PROFILE = path.join(os.tmpdir(), 'wdt-cdp-' + process.pid);
const URL = 'file:///' + ROOT.replace(/\\/g, '/') + '/index.html';

const sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

async function main() {
  const proc = spawn(EDGE, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--remote-debugging-port=' + PORT, '--user-data-dir=' + PROFILE,
    '--window-size=1440,900', URL
  ], { stdio: 'ignore' });

  let wsUrl = '';
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch('http://127.0.0.1:' + PORT + '/json/list');
      const list = await res.json();
      const page = list.filter(function (t) { return t.type === 'page'; })[0];
      if (page && page.webSocketDebuggerUrl) { wsUrl = page.webSocketDebuggerUrl; break; }
    } catch (e) {}
    await sleep(250);
  }
  if (!wsUrl) throw new Error('连不上 Edge CDP');

  const ws = new WebSocket(wsUrl);
  await new Promise(function (res, rej) { ws.onopen = res; ws.onerror = rej; });

  let seq = 0;
  const pending = new Map();
  const exceptions = [];
  ws.onmessage = function (ev) {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const p = pending.get(msg.id); pending.delete(msg.id);
      if (msg.error) p.rej(new Error(msg.error.message)); else p.res(msg.result);
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      const d = msg.params.exceptionDetails;
      exceptions.push((d.exception && d.exception.description) || d.text);
    }
  };
  function send(method, params) {
    return new Promise(function (res, rej) {
      const id = ++seq;
      pending.set(id, { res: res, rej: rej });
      ws.send(JSON.stringify({ id: id, method: method, params: params || {} }));
    });
  }
  async function evaluate(expression) {
    const r = await send('Runtime.evaluate', {
      expression: expression, returnByValue: true, awaitPromise: true, userGesture: true
    });
    if (r.exceptionDetails) {
      throw new Error((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || r.exceptionDetails.text);
    }
    return r.result.value;
  }

  await send('Runtime.enable');
  await send('Page.enable');
  await send('Page.reload');
  for (let i = 0; i < 40; i++) {
    try {
      if (await evaluate('!!(window.WDT && window.WDT.app && document.getElementById("entries"))')) break;
    } catch (e) {}
    await sleep(150);
  }
  await sleep(400);

  let pass = 0, fail = 0;
  async function check(name, fn) {
    try {
      const v = await fn();
      if (v === true || (v && v.ok)) { console.log('PASS  ' + name); pass++; }
      else { console.log('FAIL  ' + name + (v && v.why ? ' — ' + v.why : '')); fail++; }
    } catch (e) {
      console.log('FAIL  ' + name + ' — ' + String(e.message).slice(0, 220));
      fail++;
    }
  }

  await check('初始加载：188 条词条', async function () {
    const n = await evaluate('WDT.ALL.length');
    return n === 188 || { why: '实际 ' + n };
  });

  await check('点顶栏「语法对照」进入总表', async function () {
    await evaluate('document.getElementById("syntax-btn").click()');
    await sleep(150);
    const s = await evaluate('JSON.stringify({cat:WDT.app.state.cat, view:WDT.app.state.synView, has:document.getElementById("detail").textContent.includes("四种语言对照总表")})');
    const o = JSON.parse(s);
    return (o.cat === 'syntax' && o.view === 'table' && o.has) || { why: s };
  });

  await check('语言筛选 Python', async function () {
    await evaluate('document.querySelector(\'#syn-filters [data-lang="python"]\').click()');
    await sleep(150);
    const r = await evaluate('JSON.stringify({lang:WDT.app.state.synLang, n:document.querySelectorAll("#entries .entry-item").length, table:document.getElementById("detail").textContent.includes("对照总表")})');
    const o = JSON.parse(r);
    return (o.lang === 'python' && o.n > 40 && o.table) || { why: r };
  });

  await check('分类筛选「注释」只剩 2 条', async function () {
    await evaluate('const s=document.getElementById("syn-group"); s.value="注释"; s.dispatchEvent(new Event("change"));');
    await sleep(150);
    const r = await evaluate('JSON.stringify({group:WDT.app.state.synGroup, n:document.querySelectorAll("#entries .entry-item").length})');
    const o = JSON.parse(r);
    return (o.group === '注释' && o.n === 2) || { why: r };
  });

  await check('打开块注释详情并渲染四个语言格', async function () {
    await evaluate('WDT.app.select("syn-comment-block")');
    await sleep(150);
    const r = await evaluate('JSON.stringify({cards:document.querySelectorAll("#detail .syn-lang").length, copies:document.querySelectorAll("#detail [data-copy]").length, text:document.getElementById("detail").textContent.includes("块注释")})');
    const o = JSON.parse(r);
    return (o.cards === 4 && o.copies >= 4 && o.text) || { why: r };
  });

  await check('复制按钮可用（反馈「已复制」）', async function () {
    await evaluate('document.querySelector("#detail [data-copy]").click()');
    await sleep(120);
    const t = await evaluate('document.querySelector("#detail [data-copy]").textContent');
    return t === '已复制' || { why: '按钮文字=' + t };
  });

  await check('收藏会写入 localStorage 并出现在收藏分类', async function () {
    await evaluate('document.getElementById("star").click()');
    await sleep(120);
    const r = await evaluate('JSON.stringify({fav:JSON.parse(localStorage.getItem("wdt.fav")||"[]"), star:document.getElementById("star").textContent, on:document.getElementById("star").classList.contains("is-on")})');
    const o = JSON.parse(r);
    return (o.fav.indexOf('syn-comment-block') >= 0 && o.on && o.star.indexOf('已收藏') >= 0) || { why: r };
  });

  await check('浅色 / 深色主题切换', async function () {
    const before = await evaluate('document.documentElement.getAttribute("data-theme")');
    await evaluate('document.getElementById("theme-btn").click()');
    const after = await evaluate('document.documentElement.getAttribute("data-theme")');
    return before !== after || { why: before + ' -> ' + after };
  });

  await check('搜索 calc 有结果并显示语法对照条目', async function () {
    await evaluate('const q=document.getElementById("q"); q.value="calc"; q.dispatchEvent(new Event("input"));');
    await sleep(250);
    const r = await evaluate('JSON.stringify({n:WDT.app.state.results.length, first:WDT.app.state.results[0]&&WDT.app.state.results[0].entry.id, list:document.querySelectorAll("#entries .entry-item").length})');
    const o = JSON.parse(r);
    return (o.n > 0 && o.list > 0) || { why: r };
  });

  await check('语法对照实验区载入了示例代码', async function () {
    await evaluate('document.getElementById("q").value=""; document.getElementById("q").dispatchEvent(new Event("input")); WDT.app.select("syn-paren")');
    await sleep(300);
    const ok = await evaluate('!!(document.getElementById("pg-frame") && document.getElementById("pg-frame").srcdoc.indexOf("(1 + 2)") >= 0)');
    return ok || { why: 'iframe 没有载入示例' };
  });

  await check('地址栏 #__syntax-table 能打开总表', async function () {
    await evaluate('location.hash="__syntax-table"');
    await sleep(300);
    const ok = await evaluate('document.getElementById("detail").textContent.includes("四种语言对照总表")');
    return ok || { why: '总表未渲染' };
  });

  await check('原有 CSS 词条仍能打开并使用实验区', async function () {
    const r = await evaluate(`(function(){
      document.querySelector('#cats .cat[data-cat="all"]').click();
      const e = WDT.ALL.find(function(x){ return x.cat === 'css-prop' && x.example && x.example.css; });
      WDT.app.select(e.id);
      return JSON.stringify({
        id: e.id,
        title: document.querySelector('.entry-title') ? document.querySelector('.entry-title').textContent : '',
        pg: document.getElementById('pg-frame').srcdoc.length,
        isSyntax: !!document.querySelector('.syn-langs')
      });
    })()`);
    const o = JSON.parse(r);
    return (o.id && o.title.length > 0 && o.pg > 0 && !o.isSyntax) || { why: r };
  });

  await check('无未捕获 JS 异常', async function () {
    return exceptions.length === 0 || { why: exceptions.join(' | ').slice(0, 300) };
  });

  console.log('\n结果: ' + pass + ' 通过 / ' + fail + ' 失败');
  try { ws.close(); } catch (e) {}
  proc.kill();
  await sleep(300);
  process.exit(fail ? 1 : 0);
}

main().catch(function (e) {
  console.error('测试启动失败：', e);
  process.exit(2);
});
