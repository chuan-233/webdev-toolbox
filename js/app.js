/* ==========================================================================
   app.js — 界面渲染、路由、搜索交互、主题、收藏、自检
   ========================================================================== */

(function () {

  const D = window.WDT;
  const SYN = window.WDT.syntax;
  const $ = function (s, root) { return (root || document).querySelector(s); };

  /* ---------- 安全存储（file:// 下某些浏览器会禁用 localStorage） ---------- */
  const LS = {
    get: function (k, fallback) {
      try {
        const v = localStorage.getItem(k);
        return v === null ? fallback : JSON.parse(v);
      } catch (e) { return fallback; }
    },
    set: function (k, v) {
      try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
    }
  };

  const K_FAV = 'wdt.fav', K_RECENT = 'wdt.recent', K_THEME = 'wdt.theme';
  const MAX_RECENT = 12;

  /* ---------- 状态 ---------- */
  const state = {
    cat: 'all',
    q: '',
    results: null,     // 搜索命中结果（{entry,score}）
    sel: null,         // 当前打开的词条 id
    cursor: 0,         // 搜索结果键盘高亮位置
    view: 'entry',     // entry | welcome | audit | syntax-table
    synLang: 'all',    // 语法对照：语言筛选
    synGroup: 'all',   // 语法对照：二级分类筛选
    synView: 'list'    // 语法对照：list（详情）| table（总表）
  };

  let favSet = new Set(LS.get(K_FAV, []));
  let recent = LS.get(K_RECENT, []);

  /* ---------- 小工具 ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function copyText(text, btn) {
    const done = function () {
      const old = btn.textContent;
      btn.textContent = '已复制';
      setTimeout(function () { btn.textContent = old; }, 1200);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallback(); });
    } else { fallback(); }

    function fallback() {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); } catch (e) {}
      document.body.removeChild(ta);
    }
  }

  function codeBlock(text, label) {
    if (!text || !String(text).trim()) return '';
    return '<div class="section">' +
      (label ? '<h2 class="section-title">' + esc(label) + '</h2>' : '') +
      '<div class="code-block"><pre>' + esc(text) + '</pre>' +
      '<button type="button" class="copy" data-copy>复制</button></div></div>';
  }

  /* ---------- 分类导航 ---------- */
  function catItems() {
    const counts = D.countsByCat();
    const items = [{ key: 'all', label: '全部词条', hex: 'var(--fg-dim)', n: D.ALL.length }];
    D.CATS.forEach(function (c) {
      items.push({ key: c.key, label: c.label, hex: c.hex, n: counts[c.key] || 0 });
    });
    items.push({ key: 'fav', label: '我的收藏', hex: 'var(--warn)', n: favSet.size });
    items.push({ key: 'recent', label: '最近查看', hex: 'var(--ok)', n: recent.length });
    return items;
  }

  function renderCats() {
    const box = $('#cats');
    box.innerHTML = '';
    catItems().forEach(function (c) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'cat' + (state.cat === c.key && !state.q ? ' is-active' : '');
      b.dataset.cat = c.key;
      b.innerHTML = '<span class="cat-dot" style="--dot:' + c.hex + '"></span>' +
        '<span class="cat-name">' + esc(c.label) + '</span>' +
        '<span class="cat-n">' + c.n + '</span>';
      b.addEventListener('click', function () {
        state.cat = c.key;
        state.q = '';
        state.results = null;
        $('#q').value = '';
        $('#q-clear').hidden = true;
        state.cursor = 0;
        renderCats();
        renderList();
        if (c.key === 'syntax') {
          state.synView = 'table';
          paintSyntaxTable();
        }
        closeDrawer();
      });
      box.appendChild(b);
    });
  }

  /* ---------- 当前该显示哪些词条 ---------- */
  function visibleEntries() {
    let list;
    if (state.q) list = (state.results || []).map(function (r) { return r.entry; });
    else if (state.cat === 'fav') {
      list = Array.from(favSet).map(function (id) { return D.BY_ID.get(id); }).filter(Boolean);
    }
    else if (state.cat === 'recent') {
      list = recent.map(function (id) { return D.BY_ID.get(id); }).filter(Boolean);
    }
    else if (state.cat === 'all') list = D.ALL;
    else list = D.ALL.filter(function (e) { return e.cat === state.cat; });

    // 语法对照的二级筛选只在「语法对照」分类里生效，免得把全站搜索结果筛没
    if (state.cat === 'syntax') {
      if (state.q) list = list.filter(function (e) { return e.cat === 'syntax'; });
      if (state.synGroup !== 'all') {
        list = list.filter(function (e) { return e.group === state.synGroup; });
      }
      if (state.synLang !== 'all') {
        list = list.filter(function (e) {
          const c = e.cmp && e.cmp[state.synLang];
          return !!(c && !c.na);
        });
      }
    }
    return list;
  }

  /* ---------- 语法对照筛选栏 ---------- */
  function renderSynFilters() {
    const box = $('#syn-filters');
    if (!box) return;
    if (state.cat !== 'syntax') { box.hidden = true; box.innerHTML = ''; return; }
    box.hidden = false;

    const langs = [{ key: 'all', label: '全部' }].concat(SYN.LANGS);
    let h = '<div class="syn-filter-row"><span class="syn-filter-label">语言</span><div class="syn-chips">';
    langs.forEach(function (l) {
      h += '<button type="button" class="syn-chip' + (state.synLang === l.key ? ' is-on' : '') +
           '" data-lang="' + l.key + '">' + esc(l.label) + '</button>';
    });
    h += '</div></div>';

    h += '<div class="syn-filter-row"><span class="syn-filter-label">分类</span>';
    h += '<select id="syn-group" class="syn-select" aria-label="语法对照分类">';
    h += '<option value="all">全部分类</option>';
    SYN.groups().forEach(function (g) {
      h += '<option value="' + esc(g) + '"' + (state.synGroup === g ? ' selected' : '') + '>' + esc(g) + '</option>';
    });
    h += '</select>';
    h += '<button type="button" class="ghost-btn syn-view-btn" id="syn-view-btn">' +
         (state.synView === 'table' ? '详情视图' : '表格视图') + '</button>';
    h += '</div>';

    h += '<div class="syn-filter-meta">当前 <b>' + visibleEntries().length + '</b> 条 · 收藏/最近查看照常可用</div>';
    box.innerHTML = h;

    box.querySelectorAll('[data-lang]').forEach(function (b) {
      b.addEventListener('click', function () {
        state.synLang = b.dataset.lang;
        renderSynFilters();
        renderList();
        if (state.synView === 'table') paintSyntaxTable();
      });
    });
    const sel = box.querySelector('#syn-group');
    if (sel) sel.addEventListener('change', function () {
      state.synGroup = sel.value;
      renderSynFilters();
      renderList();
      if (state.synView === 'table') paintSyntaxTable();
    });
    const vb = box.querySelector('#syn-view-btn');
    if (vb) vb.addEventListener('click', function () {
      state.synView = state.synView === 'table' ? 'list' : 'table';
      renderSynFilters();
      if (state.synView === 'table') paintSyntaxTable();
      else if (state.sel && D.BY_ID.has(state.sel)) select(state.sel, { silent: true });
      else {
        const first = visibleEntries()[0];
        if (first) select(first.id); else renderWelcome();
      }
    });
  }

  function renderList() {
    const list = $('#entries');
    const items = visibleEntries();
    const titleBox = $('#list-title');
    const countBox = $('#list-count');

    renderSynFilters();

    if (state.q) titleBox.textContent = state.fallback ? '宽松匹配' : '搜索结果';
    else {
      const c = catItems().filter(function (x) { return x.key === state.cat; })[0];
      titleBox.textContent = c ? c.label : '词条';
    }
    countBox.textContent = items.length + ' 条';

    list.innerHTML = '';

    if (!items.length) {
      const li = document.createElement('li');
      li.className = 'empty-note';
      if (state.q) {
        li.textContent = '没找到「' + state.q + '」。试试更短的关键词，比如只输 div、颜色、居中。';
      } else if (state.cat === 'syntax') {
        li.textContent = '没有符合当前筛选条件的对照。换一个语言或分类，或点「全部分类」再试。';
      } else if (state.cat === 'fav') {
        li.textContent = '还没有收藏。打开任意词条，点标题右边的「收藏」就会出现在这里。';
      } else if (state.cat === 'recent') {
        li.textContent = '还没有浏览记录。看过的词条会自动记在这里。';
      } else {
        li.textContent = '这个分类下暂时没有词条。';
      }
      list.appendChild(li);
      return;
    }

    items.forEach(function (e, i) {
      const li = document.createElement('li');
      if (state.q && state.fallback && i === 0) {
        const note = document.createElement('div');
        note.className = 'empty-note';
        note.textContent = '没有同时包含这几个词的词条，下面是包含其中任意一个的：';
        li.appendChild(note);
      }
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'entry-item' +
        (e.id === state.sel ? ' is-active' : '') +
        (state.q && i === state.cursor ? ' is-cursor' : '');
      b.dataset.id = e.id;
      const isFav = favSet.has(e.id);
      b.innerHTML = (isFav ? '<span class="ei-star">★</span>' : '') +
        '<span class="ei-mark">' + esc(e.name) + '</span>' +
        '<span class="ei-zh">' + esc(e.zh) + '</span>' +
        (e.cat === 'syntax' ? '<span class="ei-group">' + esc(e.group) + '</span>' : '');
      b.title = e.catLabel + ' · ' + e.name + (e.zh ? '（' + e.zh + '）' : '');
      b.addEventListener('click', function () { select(e.id); });
      li.appendChild(b);
      list.appendChild(li);
    });
  }

  /* ---------- 详情 ---------- */
  function renderWelcome() {
    state.view = 'welcome';
    $('#detail').innerHTML =
      '<div class="welcome">' +
      '<h2>边查边改，看它真的会发生什么</h2>' +
      '<p>左边挑一个词条，中间读讲解，右边那块代码可以直接改 —— 改完立刻能看到效果，' +
      '不用新建文件、不用配环境。</p>' +
      '<p>当前收录 <b>' + D.ALL.length + '</b> 条：' +
      D.CATS.map(function (c) { return c.label + ' ' + (D.countsByCat()[c.key] || 0); }).join(' · ') +
      '</p>' +
      '<div class="audit-out">' +
      '<h3>三件值得先做的事</h3><ul>' +
      '<li>按 <b>/</b> 跳到搜索框，输入 <b>居中</b>、<b>显示</b>、<b>数组</b> 试试</li>' +
      '<li>先看「基础概念」里的 <b>HTML 属性 vs CSS 属性</b> —— 那是初学者最容易混的地方</li>' +
      '<li>在右边改一行代码，按 <b>Ctrl+Enter</b> 重新运行，看看哪里变了</li>' +
      '</ul></div>' +
      '<div class="audit-out">' +
      '<h3>怎么知道一条写法是不是过时了</h3>' +
      '<p class="muted" style="margin:0">带橙色徽章的就是：' +
      '「已废弃」表示标准不再推荐，「旧写法」表示能用但新代码不该这么写。' +
      '每条都会写清楚现在该用什么代替。</p>' +
      '</div>' +
      '</div>';
    renderPlaygroundHint();
  }

  function renderPlaygroundHint() {
    window.WDT.playground.load(null);
  }

  function select(id, opts) {
    const e = D.BY_ID.get(id);
    if (!e) return;
    if (e.cat === 'syntax') state.synView = 'list';
    state.sel = id;
    state.view = 'entry';

    // 记进最近查看
    recent = [id].concat(recent.filter(function (x) { return x !== id; })).slice(0, MAX_RECENT);
    LS.set(K_RECENT, recent);

    // 地址栏同步，方便收藏和分享
    if (!opts || !opts.silent) {
      try { history.replaceState(null, '', '#' + id); } catch (err) { location.hash = id; }
    }

    paintDetail(e);
    renderCats();
    renderList();
    window.WDT.playground.load(e.cat === 'syntax'
      ? { name: e.name, example: e.playground || { html: '', css: '', js: '' } }
      : e);
    $('#detail').scrollTop = 0;
    closeDrawer();
  }

  function paintDetail(e) {
    if (e.cat === 'syntax') { paintSyntaxDetail(e); return; }
    const items = visibleEntries();
    const idx = items.map(function (x) { return x.id; }).indexOf(e.id);
    const st = D.statusLabel(e.status);
    const isFav = favSet.has(e.id);

    let h = '';
    h += '<div class="entry-head">';
    h += '<div class="crumbs"><b>' + esc(e.catLabel) + '</b>' +
         (idx >= 0 ? ' · 第 ' + (idx + 1) + ' / ' + items.length + ' 条' : '') + '</div>';
    h += '<h1 class="entry-title"' + (e.cat === 'concept' ? ' style="font-family:var(--sans)"' : '') + '>' +
         esc(e.name) + (e.zh ? '<span class="t-zh">' + esc(e.zh) + '</span>' : '') + '</h1>';
    h += '<div class="badges">';
    h += '<span class="badge badge-cat" style="--bc:' + e.catHex + '">' + esc(e.catLabel) + '</span>';
    if (st) h += '<span class="badge badge-warn">' + esc(st) + '</span>';
    else h += '<span class="badge badge-ok">推荐写法</span>';
    h += '<button type="button" class="star-btn' + (isFav ? ' is-on' : '') + '" id="star">' +
         (isFav ? '★ 已收藏' : '☆ 收藏') + '</button>';
    h += '</div></div>';

    h += '<div class="section"><h2 class="section-title">用途</h2>' +
         '<p class="purpose">' + esc(e.purpose) + '</p></div>';

    h += codeBlock(e.syntax, '语法');

    // 示例：三段分开列
    const ex = e.example || {};
    const hasEx = String(ex.html || '').trim() || String(ex.css || '').trim() || String(ex.js || '').trim();
    if (hasEx) {
      h += '<div class="section"><h2 class="section-title">示例' +
           '<span style="font-weight:400;text-transform:none;letter-spacing:0">（右边实验区里可以直接改）</span>' +
           '</h2>';
      if (String(ex.html || '').trim()) h += codeBlock(ex.html, null);
      if (String(ex.css || '').trim()) h += codeBlock(ex.css, null);
      if (String(ex.js || '').trim()) h += codeBlock(ex.js, null);
      h += '</div>';
    }

    if ((e.errors || []).length) {
      h += '<div class="section"><h2 class="section-title">常见错误</h2><ul class="err-list">';
      e.errors.forEach(function (x) { h += '<li>' + esc(x) + '</li>'; });
      h += '</ul></div>';
    }

    if (e.tip) {
      h += '<div class="section"><h2 class="section-title">新手提示</h2>' +
           '<div class="tip">' + e.tip + '</div></div>';
    }

    const rel = (e.related || []).map(function (id) { return D.BY_ID.get(id); }).filter(Boolean);
    if (rel.length) {
      h += '<div class="section"><h2 class="section-title">相关概念</h2><div class="chips">';
      rel.forEach(function (r) {
        h += '<button type="button" class="chip" data-goto="' + esc(r.id) + '">' +
             esc(r.name) + '<span class="chip-zh">' + esc(r.zh) + '</span></button>';
      });
      h += '</div></div>';
    }

    const det = $('#detail');
    det.innerHTML = h;
    bindDetailActions(e);
  }

  /* 语法对照的详情：模板在 syntax.js 里，这里只负责挂载和事件 */
  function paintSyntaxDetail(e) {
    state.view = 'entry';
    const det = $('#detail');
    det.innerHTML = SYN.detailHtml(e);
    const star = det.querySelector('#star');
    if (star && favSet.has(e.id)) {
      star.textContent = '★ 已收藏';
      star.classList.add('is-on');
    }
    bindDetailActions(e);
    det.scrollTop = 0;
  }

  /* 语法对照的总表：横向看所有条目 */
  function paintSyntaxTable() {
    state.view = 'syntax-table';
    const det = $('#detail');
    det.innerHTML = SYN.tableHtml(visibleEntries());
    det.querySelectorAll('[data-goto]').forEach(function (btn) {
      btn.addEventListener('click', function () { select(btn.dataset.goto); });
    });
    det.scrollTop = 0;
  }

  function bindDetailActions(e) {
    const det = $('#detail');
    det.querySelectorAll('[data-copy]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const pre = btn.parentNode.querySelector('pre');
        copyText(pre ? pre.textContent : '', btn);
      });
    });
    det.querySelectorAll('[data-goto]').forEach(function (btn) {
      btn.addEventListener('click', function () { select(btn.dataset.goto); });
    });
    const star = det.querySelector('#star');
    if (star) star.addEventListener('click', function () {
      if (favSet.has(e.id)) favSet.delete(e.id); else favSet.add(e.id);
      LS.set(K_FAV, Array.from(favSet));
      paintDetail(e);
      renderCats();
      renderList();
    });
  }

  /* ---------- 词条自检 ---------- */
  function showAudit() {
    state.view = 'audit';
    const issues = D.validate();
    let h = '<div class="entry-head"><div class="crumbs"><b>词条自检</b></div>' +
            '<h1 class="entry-title" style="font-family:var(--sans);font-size:24px">词条库检查结果</h1></div>';

    h += '<div class="section"><p class="purpose">共检查 <b>' + D.ALL.length + '</b> 条词条：' +
         '字段是否齐全、id 有没有重复、status 取值对不对、' +
         'example 三段是否都在、related 是否指向真实存在的词条。</p></div>';

    if (!issues.length) {
      h += '<div class="audit-out"><div class="audit-ok">✓ 全部通过，没有发现问题。</div>' +
           '<p class="muted" style="margin:8px 0 0">你新加的词条也可以通过这里确认一下再提交。</p></div>';
    } else {
      h += '<div class="audit-out"><h3>发现 ' + issues.length + ' 个问题</h3><ul>';
      issues.forEach(function (x) { h += '<li>' + esc(x) + '</li>'; });
      h += '</ul></div>';
    }

    h += '<div class="section"><h2 class="section-title">各分类条数</h2><ul class="ok-list">';
    D.CATS.forEach(function (c) {
      h += '<li>' + esc(c.label) + '：' + (D.countsByCat()[c.key] || 0) + ' 条</li>';
    });
    h += '</ul></div>';

    h += '<div class="section"><button type="button" class="ghost-btn" id="back-entry">回到刚才的词条</button></div>';

    const det = $('#detail');
    det.innerHTML = h;
    det.scrollTop = 0;
    const back = det.querySelector('#back-entry');
    if (back) back.addEventListener('click', function () {
      if (state.sel) select(state.sel, { silent: true }); else renderWelcome();
    });
  }

  /* ---------- 搜索 ---------- */
  function doSearch(q) {
    state.q = String(q || '').trim();
    state.fallback = false;
    // 输入关键词时先把「语法对照」的二级筛选清掉：
    // 否则在「注释」分类下搜 calc 会得到 0 条，看起来像搜索坏了。
    // 搜索之后仍然可以再点语言/分类继续收窄。
    if (state.q && state.cat === 'syntax') {
      state.synLang = 'all';
      state.synGroup = 'all';
    }

    if (!state.q) {
      state.results = null;
    } else {
      state.results = window.WDT.search.run(state.q);
      // 多个关键词一个都没同时命中时，退一步：只要命中任意一个就列出来，并说明原因
      if (!state.results.length && state.q.split(/\s+/).length > 1) {
        const loose = window.WDT.search.run(state.q, { or: true });
        if (loose.length) { state.results = loose; state.fallback = true; }
      }
    }

    state.cursor = 0;
    renderCats();
    renderList();
  }

  function moveCursor(d) {
    const n = visibleEntries().length;
    if (!n) return;
    state.cursor = (state.cursor + d + n) % n;
    renderList();
    const cur = $('#entries .is-cursor');
    if (cur) cur.scrollIntoView({ block: 'nearest' });
  }

  /* ---------- 打开「语法对照」总表 ---------- */
  function openSyntaxTable() {
    state.cat = 'syntax';
    state.q = '';
    state.results = null;
    state.synLang = 'all';
    state.synGroup = 'all';
    state.synView = 'table';
    state.cursor = 0;
    $('#q').value = '';
    $('#q-clear').hidden = true;
    renderCats();
    renderList();
    paintSyntaxTable();
    closeDrawer();
  }

  /* ---------- 主题 ---------- */
  function readParam(k) {
    try { return new URLSearchParams(location.search).get(k) || ''; } catch (e) { return ''; }
  }

  function applyTheme(t, skipSave) {
    document.documentElement.setAttribute('data-theme', t);
    if (!skipSave) LS.set(K_THEME, t);
    const b = $('#theme-btn');
    if (b) b.textContent = t === 'dark' ? '浅色' : '深色';
  }

  /* ---------- 手机端抽屉 ---------- */
  function openDrawer() { $('#sidebar').classList.add('is-open'); $('#scrim').hidden = false; }
  function closeDrawer() {
    $('#sidebar').classList.remove('is-open');
    $('#scrim').hidden = true;
  }

  /* ---------- 初始化 ---------- */
  function init() {
    // 地址栏上强制指定主题（?theme=light）时不写入本地设置，免得分享链接改掉了别人的偏好
    const forcedTheme = readParam('theme');
    if (forcedTheme === 'light' || forcedTheme === 'dark') applyTheme(forcedTheme, true);
    else applyTheme(LS.get(K_THEME, 'dark'));

    $('#stats').textContent = '共 ' + D.ALL.length + ' 条';

    window.WDT.playground.init('#playground');

    // 搜索框
    const q = $('#q');
    q.addEventListener('input', function () {
      $('#q-clear').hidden = !q.value;
      doSearch(q.value);
    });
    q.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); moveCursor(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); moveCursor(-1); }
      else if (e.key === 'Enter') {
        const items = visibleEntries();
        if (items.length) select(items[Math.min(state.cursor, items.length - 1)].id);
      } else if (e.key === 'Escape') { q.value = ''; $('#q-clear').hidden = true; doSearch(''); q.blur(); }
    });
    $('#q-clear').addEventListener('click', function () {
      q.value = ''; $('#q-clear').hidden = true; doSearch(''); q.focus();
    });

    // 顶栏按钮
    $('#theme-btn').addEventListener('click', function () {
      applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
    $('#random-btn').addEventListener('click', function () {
      select(D.ALL[Math.floor(Math.random() * D.ALL.length)].id);
    });
    $('#audit-btn').addEventListener('click', showAudit);
    const syntaxBtn = $('#syntax-btn');
    if (syntaxBtn) syntaxBtn.addEventListener('click', openSyntaxTable);
    $('#menu-btn').addEventListener('click', function () {
      if ($('#sidebar').classList.contains('is-open')) closeDrawer(); else openDrawer();
    });
    $('#scrim').addEventListener('click', closeDrawer);

    // 全局快捷键
    document.addEventListener('keydown', function (e) {
      const tag = (e.target.tagName || '').toLowerCase();
      const typing = tag === 'input' || tag === 'textarea';
      if (e.key === '/' && !typing) { e.preventDefault(); $('#q').focus(); }
      else if (e.key === 'Escape' && !typing) { closeDrawer(); }
      else if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !typing && state.q) {
        e.preventDefault(); moveCursor(e.key === 'ArrowDown' ? 1 : -1);
      }
    });

    // 地址栏 hash → 打开对应词条
    function fromHash() {
      const id = String(location.hash || '').replace(/^#/, '');
      if (id === '__syntax-table' || id === '__syntax') { openSyntaxTable(); return; }
      if (id === '__audit') { showAudit(); return; }
      if (id && D.BY_ID.has(id)) select(id, { silent: true });
    }
    window.addEventListener('hashchange', fromHash);

    // ?q=居中 这种链接可以直接分享出去，打开就带着搜索结果
    const preset = readParam('q');
    if (preset) {
      q.value = preset;
      $('#q-clear').hidden = false;
      doSearch(preset);
    }

    renderCats();
    renderList();

    const id = String(location.hash || '').replace(/^#/, '');
    if (id && D.BY_ID.has(id)) select(id, { silent: true });
    else renderWelcome();

    // 自检模式：index.html#__audit 直接打开检查面板（方便加词条后验证）
    if (id === '__audit') showAudit();
    // 语法对照总表：index.html#__syntax-table
    if (id === '__syntax-table' || id === '__syntax') openSyntaxTable();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // 暴露给调试和自动化使用
  window.WDT.app = { select: select, audit: showAudit, state: state, search: function (q) { return window.WDT.search.run(q); } };
})();
