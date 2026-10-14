/* ==========================================================================
   playground.js — 代码实验区
   --------------------------------------------------------------------------
   三块可编辑代码（HTML / CSS / JS）拼成一份完整文档，
   塞进 sandbox iframe 的 srcdoc 里运行 —— 与主页面完全隔离。
   子页面里的 console.log 会通过 postMessage 回传到这里显示。
   ========================================================================== */

window.WDT.playground = (function () {

  /* 预览网页的基础样式：让示例看起来干净一点。
     用户自己的 CSS 写在它后面，所以可以覆盖它。 */
  const BASE_CSS = [
    '*{box-sizing:border-box}',
    'body{margin:0;padding:14px;background:#fff;color:#1c2129;' +
      'font:15px/1.7 system-ui,-apple-system,"Segoe UI","Microsoft YaHei","PingFang SC",sans-serif}',
    'p{margin:0 0 10px}',
    'img{max-width:100%}',
    'button,input,select,textarea{font:inherit}'
  ].join('\n');

  /* 注入到预览页里的小工具：转发 console 输出 + 捕获未处理错误 */
  const BRIDGE = [
    '(function(){',
    '  function fmt(v){',
    '    if (typeof v === "string") return v;',
    '    if (v === null) return "null";',
    '    if (v === undefined) return "undefined";',
    '    if (typeof v === "function") return "[函数]";',
    '    if (v instanceof Error) return v.message;',
    '    if (v && v.nodeType === 1) return "<" + String(v.tagName).toLowerCase() + ">";',
    '    try { var s = JSON.stringify(v); return s === undefined ? String(v) : s; }',
    '    catch (e) { return String(v); }',
    '  }',
    '  function send(level, args){',
    '    try {',
    '      var parts = [];',
    '      for (var i = 0; i < args.length; i++) parts.push(fmt(args[i]));',
    '      parent.postMessage({ __wdt: 1, level: level, text: parts.join(" ") }, "*");',
    '    } catch (e) {}',
    '  }',
    '  ["log","info","warn","error"].forEach(function(k){',
    '    var old = console[k];',
    '    console[k] = function(){',
    '      send(k === "info" ? "log" : k, arguments);',
    '      try { old.apply(console, arguments); } catch (e) {}',
    '    };',
    '  });',
    '  window.addEventListener("error", function(e){',
    '    send("error", ["未捕获错误：" + e.message + (e.lineno ? "（第 " + e.lineno + " 行）" : "")]);',
    '  });',
    '})();'
  ].join('\n');

  const TABS = [
    { k: 'html', label: 'HTML' },
    { k: 'css',  label: 'CSS' },
    { k: 'js',   label: 'JS' }
  ];
  const MAX_LOGS = 80;

  let mount = null;
  let tabsEl = null;
  let editorEl = null;
  let frameEl = null;
  let consoleEl = null;
  let titleEl = null;

  let cur = 'html';
  const code = { html: '', css: '', js: '' };
  let loaded = null;          // 当前加载的词条
  let timer = null;

  /* ---------- 组装文档 ---------- */
  function escapeScript(js) {
    // 避免用户代码里的 </script> 提前结束脚本块
    return String(js || '').replace(/<\/script/gi, '<\\/script');
  }

  function buildDoc() {
    return '<!DOCTYPE html>\n' +
      '<html lang="zh-CN">\n<head>\n<meta charset="utf-8">\n<style>\n' +
      BASE_CSS + '\n' + code.css + '\n</style>\n</head>\n<body>\n' +
      code.html +
      '\n<script>\n' + BRIDGE + '\n<\/script>\n' +
      '<script>\n' + escapeScript(code.js) + '\n<\/script>\n' +
      '</body>\n</html>';
  }

  /* ---------- 控制台 ---------- */
  function pushLog(level, text) {
    if (!consoleEl) return;
    const line = document.createElement('div');
    line.className = 'console-line lv-' + (level || 'log');
    const tag = document.createElement('span');
    tag.className = 'lv';
    tag.textContent = level === 'error' ? '✕' : (level === 'warn' ? '!' : '›');
    line.appendChild(tag);
    line.appendChild(document.createTextNode(text));
    consoleEl.appendChild(line);
    while (consoleEl.childNodes.length > MAX_LOGS) consoleEl.removeChild(consoleEl.firstChild);
    consoleEl.scrollTop = consoleEl.scrollHeight;
  }

  function clearLogs() { if (consoleEl) consoleEl.textContent = ''; }

  /* ---------- 运行 ---------- */
  function stash() {
    if (editorEl) code[cur] = editorEl.value;
  }

  function run() {
    stash();
    if (!frameEl) return;
    clearLogs();
    frameEl.srcdoc = buildDoc();
  }

  function scheduleRun() {
    clearTimeout(timer);
    timer = setTimeout(run, 500);
  }

  /* ---------- 标签页 ---------- */
  function paintTabs() {
    if (!tabsEl) return;
    tabsEl.querySelectorAll('.pg-tab').forEach(function (b) {
      const k = b.dataset.k;
      b.classList.toggle('is-active', k === cur);
      b.classList.toggle('has-code', String(code[k] || '').trim().length > 0);
    });
    if (editorEl) {
      editorEl.value = code[cur] || '';
      editorEl.placeholder = cur === 'html' ? '<!-- 在这里写 HTML -->'
        : cur === 'css' ? '/* 在这里写 CSS */'
        : '// 在这里写 JavaScript';
    }
  }

  function switchTo(k) {
    if (k === cur) return;
    stash();
    cur = k;
    paintTabs();
  }

  /* ---------- 挂载 ---------- */
  function mountUI() {
    mount.innerHTML = '';

    const head = document.createElement('div');
    head.className = 'pg-head';
    head.innerHTML =
      '<div class="pg-title">代码实验区</div>' +
      '<div class="pg-tabs"></div>';
    mount.appendChild(head);
    tabsEl = head.querySelector('.pg-tabs');

    TABS.forEach(function (t) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'pg-tab';
      b.dataset.k = t.k;
      b.innerHTML = t.label + '<span class="dot"></span>';
      b.addEventListener('click', function () { switchTo(t.k); });
      tabsEl.appendChild(b);
    });

    const body = document.createElement('div');
    body.className = 'pg-body';
    mount.appendChild(body);

    const codeWrap = document.createElement('div');
    codeWrap.className = 'pg-code';
    editorEl = document.createElement('textarea');
    editorEl.spellcheck = false;
    editorEl.setAttribute('wrap', 'off');
    editorEl.setAttribute('aria-label', '代码编辑区');
    editorEl.addEventListener('input', function () { code[cur] = editorEl.value; paintTabs(); scheduleRun(); });
    editorEl.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        const s = editorEl.selectionStart, en = editorEl.selectionEnd;
        editorEl.value = editorEl.value.slice(0, s) + '  ' + editorEl.value.slice(en);
        editorEl.selectionStart = editorEl.selectionEnd = s + 2;
        code[cur] = editorEl.value;
        paintTabs();
        scheduleRun();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(); }
    });
    codeWrap.appendChild(editorEl);
    body.appendChild(codeWrap);

    const actions = document.createElement('div');
    actions.className = 'pg-actions';
    actions.innerHTML =
      '<button type="button" class="btn-run">运行</button>' +
      '<button type="button" class="ghost-btn" id="pg-reset">重置</button>' +
      '<span class="pg-hint">Ctrl+Enter 运行</span>';
    body.appendChild(actions);
    actions.querySelector('.btn-run').addEventListener('click', run);
    actions.querySelector('#pg-reset').addEventListener('click', function () {
      if (loaded) load(loaded); else run();
    });

    const pv = document.createElement('div');
    pv.className = 'pg-preview-wrap';
    pv.innerHTML =
      '<div class="pg-preview-head">预览<span class="live" id="pg-live"></span></div>' +
      '<iframe id="pg-frame" sandbox="allow-scripts allow-modals" title="预览"></iframe>';
    body.appendChild(pv);
    frameEl = pv.querySelector('#pg-frame');
    titleEl = pv.querySelector('#pg-live');

    consoleEl = document.createElement('div');
    consoleEl.className = 'pg-console';
    consoleEl.setAttribute('aria-live', 'polite');
    mount.appendChild(consoleEl);
  }

  /* ---------- 对外接口 ---------- */
  function load(entry) {
    loaded = entry || null;
    const ex = (entry && entry.example) || { html: '', css: '', js: '' };
    code.html = ex.html || '';
    code.css = ex.css || '';
    code.js = ex.js || '';
    cur = 'html';
    paintTabs();
    if (titleEl) {
      titleEl.textContent = entry ? ('正在实验：' + entry.name) : '还没有载入示例';
    }
    run();
  }

  function init(selector) {
    mount = document.querySelector(selector);
    if (!mount) return;
    mountUI();
    paintTabs();
    load(null);

    // 子页面回传的 console 与错误
    window.addEventListener('message', function (ev) {
      const d = ev.data;
      if (!d || d.__wdt !== 1) return;
      pushLog(d.level, d.text);
    });
  }

  return { init: init, load: load, run: run, getLoaded: function () { return loaded; } };
})();
