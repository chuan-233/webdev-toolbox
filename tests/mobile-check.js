/* 手机宽度实测：用 CDP 设成 390×844，检查有没有横向溢出，并截图。
   运行：node tests/mobile-check.js */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9800 + (process.pid % 100);
const PROFILE = path.join(os.tmpdir(), 'wdt-mobile-' + process.pid);
const URL = 'file:///' + ROOT.replace(/\\/g, '/') + '/index.html';
const sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

async function main() {
  const proc = spawn(EDGE, [
    '--headless=new', '--disable-gpu', '--no-first-run',
    '--remote-debugging-port=' + PORT, '--user-data-dir=' + PROFILE, URL
  ], { stdio: 'ignore' });

  let wsUrl = '';
  for (let i = 0; i < 60; i++) {
    try {
      const list = await (await fetch('http://127.0.0.1:' + PORT + '/json/list')).json();
      const page = list.filter(function (t) { return t.type === 'page'; })[0];
      if (page) { wsUrl = page.webSocketDebuggerUrl; break; }
    } catch (e) {}
    await sleep(250);
  }
  if (!wsUrl) throw new Error('no CDP');

  const ws = new WebSocket(wsUrl);
  await new Promise(function (r, j) { ws.onopen = r; ws.onerror = j; });
  let seq = 0; const pending = new Map();
  ws.onmessage = function (ev) {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) {
      const p = pending.get(m.id); pending.delete(m.id);
      m.error ? p.rej(new Error(m.error.message)) : p.res(m.result);
    }
  };
  const send = function (method, params) {
    return new Promise(function (res, rej) {
      const id = ++seq; pending.set(id, { res: res, rej: rej });
      ws.send(JSON.stringify({ id: id, method: method, params: params || {} }));
    });
  };
  const ev = async function (expression) {
    const r = await send('Runtime.evaluate', { expression: expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text);
    return r.result.value;
  };

  await send('Emulation.setDeviceMetricsOverride', {
    width: 390, height: 844, deviceScaleFactor: 1, mobile: true
  });
  await send('Page.enable');
  await send('Page.navigate', { url: URL + '#syn-paren' });
  await sleep(1800);

  const report = async function (name) {
    const r = await ev(`JSON.stringify({
      inner: innerWidth,
      doc: document.documentElement.scrollWidth,
      body: document.body.scrollWidth,
      detail: document.getElementById('detail').scrollWidth,
      detailClient: document.getElementById('detail').clientWidth,
      title: document.querySelector('.entry-title') ? document.querySelector('.entry-title').getBoundingClientRect().width : null
    })`);
    console.log(name, r);
    return JSON.parse(r);
  };

  const a = await report('详情页 390px');
  const shot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  fs.mkdirSync(path.join(ROOT, '.shots'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, '.shots', 'mobile-390-detail.png'), Buffer.from(shot.data, 'base64'));

  await ev('location.hash="__syntax-table"');
  await sleep(700);
  const b = await report('总表 390px');
  const shot2 = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  fs.writeFileSync(path.join(ROOT, '.shots', 'mobile-390-table.png'), Buffer.from(shot2.data, 'base64'));

  // 再验 600 / 820 两个断点：顶栏按钮和两栏布局最容易在这里挤出去
  let ok = a.doc <= 390 && b.doc <= 390;
  for (const w of [600, 820]) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: w, height: 900, deviceScaleFactor: 1, mobile: false
    });
    await ev('location.hash="syn-paren"');
    await sleep(500);
    const d = await report('详情页 ' + w + 'px');
    await ev('location.hash="__syntax-table"');
    await sleep(500);
    const t = await report('总表 ' + w + 'px');
    ok = ok && d.doc <= w && t.doc <= w;
  }

  console.log('\n横向溢出: ' + (ok ? '无（390 / 600 / 820 都检查过）' : '有，见上面的文档宽度'));
  ws.close(); proc.kill();
  process.exit(ok ? 0 : 1);
}

main().catch(function (e) { console.error(e); process.exit(2); });
