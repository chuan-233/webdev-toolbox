/* ==========================================================================
   syntax.js — 「语法对照」专用渲染
   --------------------------------------------------------------------------
   为什么单独一个文件：
   普通词条是「一个标签 / 一个属性」，详情面板用固定模板就够了；
   语法对照的一条词条里装着四种语言的格子，还有专题表格，模板不一样。
   所以这里只负责把一条对照词条渲染成 HTML，app.js 负责挂事件和路由。

   对外接口：
     WDT.syntax.detailHtml(entry)     详情面板 HTML
     WDT.syntax.tableHtml(entries)    横向总表 HTML
     WDT.syntax.groups()              所有二级分类
     WDT.syntax.LANGS                 四种语言的元信息
     WDT.syntax.searchText(entry)     给搜索引擎用的附加文本
   ========================================================================== */

window.WDT.syntax = (function () {

  const LANGS = [
    { key: 'python', label: 'Python', short: 'PY' },
    { key: 'html',   label: 'HTML',   short: 'HTML' },
    { key: 'css',    label: 'CSS',    short: 'CSS' },
    { key: 'js',     label: 'JavaScript', short: 'JS' }
  ];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function langMeta(key) {
    return LANGS.filter(function (l) { return l.key === key; })[0] || { key: key, label: key, short: key };
  }

  function copyBlock(code, label) {
    if (!code || !String(code).trim()) return '';
    return '<div class="code-block">' +
      '<pre>' + esc(code) + '</pre>' +
      '<button type="button" class="copy" data-copy>复制</button>' +
      '</div>';
  }

  function firstLine(code, max) {
    const s = String(code || '').trim().split('\n')[0].replace(/\s+/g, ' ');
    const n = max || 34;
    return s.length > n ? s.slice(0, n) + '…' : s;
  }

  function confuseLabel(n) {
    if (n >= 3) return '很容易混';
    if (n === 2) return '偶尔会混';
    return '基本不会混';
  }

  /* ---------- 一条对照词条 ---------- */
  function detailHtml(e) {
    const isTopic = !!e.topic;
    let h = '';

    h += '<div class="entry-head">';
    h += '<div class="crumbs"><b>' + esc(e.catLabel) + '</b> · ' + esc(e.group) + '</div>';
    h += '<h1 class="entry-title syn-title">' + esc(e.name) +
         (e.zh ? '<span class="t-zh">' + esc(e.zh) + '</span>' : '') + '</h1>';
    h += '<div class="badges">';
    h += '<span class="badge badge-cat" style="--bc:' + e.catHex + '">' + esc(e.catLabel) + '</span>';
    h += '<span class="badge">' + esc(e.group) + '</span>';
    if (e.confuse) h += '<span class="badge badge-confuse c' + e.confuse + '">' + confuseLabel(e.confuse) + '</span>';
    h += '<button type="button" class="star-btn" id="star">☆ 收藏</button>';
    h += '</div></div>';

    h += '<div class="section"><h2 class="section-title">用途</h2>' +
         '<p class="purpose">' + esc(e.purpose) + '</p></div>';

    if (e.explanation) {
      h += '<div class="section"><h2 class="section-title">中文解释</h2>' +
           '<p class="syn-explain">' + esc(e.explanation) + '</p></div>';
    }

    if (isTopic) {
      h += topicHtml(e.topic);
    } else {
      h += '<div class="section"><h2 class="section-title">四种语言怎么写' +
           '<span class="syn-sub">不适用的会写明原因</span></h2>';
      h += '<div class="syn-langs">';
      LANGS.forEach(function (l) {
        const c = (e.cmp || {})[l.key] || { na: '没有这一项。' };
        h += '<div class="syn-lang lang-' + l.key + (c.na ? ' is-na' : '') + '">';
        h += '<div class="syn-lang-head"><span class="syn-lang-name">' + l.label + '</span>';
        h += c.na ? '<span class="syn-lang-tag">不适用</span>' : '<span class="syn-lang-tag ok">适用</span>';
        h += '</div>';
        if (c.na) {
          h += '<p class="syn-na">' + esc(c.na) + '</p>';
        } else {
          h += copyBlock(c.code, null);
          if (c.note) h += '<p class="syn-note">' + esc(c.note) + '</p>';
        }
        h += '</div>';
      });
      h += '</div></div>';
      h += '<p class="syn-play-hint">右边实验区只能运行 HTML / CSS / JavaScript；Python 示例请复制到本地解释器运行。</p>';
    }

    if ((e.errors || []).length) {
      h += '<div class="section"><h2 class="section-title">常见错误与纠正</h2><ul class="err-list">';
      e.errors.forEach(function (x) { h += '<li>' + esc(x) + '</li>'; });
      h += '</ul></div>';
    }

    if (e.notes) {
      h += '<div class="section"><h2 class="section-title">适用范围与注意</h2>' +
           '<div class="tip">' + esc(e.notes) + '</div></div>';
    }

    const rel = (e.related || []).map(function (id) { return window.WDT.BY_ID.get(id); }).filter(Boolean);
    if (rel.length) {
      h += '<div class="section"><h2 class="section-title">相关对照</h2><div class="chips">';
      rel.forEach(function (r) {
        h += '<button type="button" class="chip" data-goto="' + esc(r.id) + '">' +
             esc(r.name) + '<span class="chip-zh">' + esc(r.zh) + '</span></button>';
      });
      h += '</div></div>';
    }

    return h;
  }

  /* ---------- 专题 ---------- */
  function topicHtml(t) {
    let h = '';
    if (t.intro) {
      h += '<div class="section"><div class="syn-intro">' + esc(t.intro) + '</div></div>';
    }

    (t.tables || []).forEach(function (tb) {
      h += '<div class="section"><h2 class="section-title">' + esc(tb.title) + '</h2>';
      h += '<div class="syn-table-wrap"><table class="syn-table">';
      h += '<thead><tr>';
      (tb.head || []).forEach(function (x) { h += '<th>' + esc(x) + '</th>'; });
      h += '</tr></thead><tbody>';
      (tb.rows || []).forEach(function (row) {
        h += '<tr>';
        row.forEach(function (cell, i) {
          h += '<td' + (i === 0 ? ' class="syn-td-key"' : '') + '>' + esc(cell) + '</td>';
        });
        h += '</tr>';
      });
      h += '</tbody></table></div></div>';
    });

    (t.blocks || []).forEach(function (b) {
      h += '<div class="section"><h2 class="section-title">' + esc(b.title) + '</h2>';
      h += '<div class="syn-block-rows">';
      (b.rows || []).forEach(function (r) {
        const lang = langMeta(r.langKey || langOfLabel(r.lang));
        h += '<div class="syn-block-row lang-' + lang.key + '">';
        h += '<div class="syn-block-lang">' + esc(r.lang) + '</div>';
        h += '<div class="syn-block-code">' + copyBlock(r.code, null) +
             (r.note ? '<p class="syn-note">' + esc(r.note) + '</p>' : '') + '</div>';
        h += '</div>';
      });
      h += '</div></div>';
    });

    if ((t.notes || []).length) {
      h += '<div class="section"><h2 class="section-title">记住这几条</h2><ul class="ok-list">';
      t.notes.forEach(function (x) { h += '<li>' + esc(x) + '</li>'; });
      h += '</ul></div>';
    }
    return h;
  }

  /* 专题里的 lang 可能是「Python（可选，需要 Flask）」，取前缀判断颜色 */
  function langOfLabel(label) {
    const s = String(label || '').toLowerCase();
    if (s.indexOf('python') === 0) return 'python';
    if (s.indexOf('html') === 0) return 'html';
    if (s.indexOf('css') === 0) return 'css';
    if (s.indexOf('javascript') === 0 || s.indexOf('js') === 0) return 'js';
    return 'concept';
  }

  /* ---------- 横向总表 ---------- */
  function tableHtml(entries) {
    if (!entries.length) {
      return '<div class="welcome"><h2>没有符合条件的对照</h2>' +
        '<p>换一个语言或分类筛选，或清空搜索词再试。</p></div>';
    }
    let h = '<div class="syn-table-page">';
    h += '<div class="entry-head"><div class="crumbs"><b>语法对照</b> · 表格视图</div>' +
         '<h1 class="entry-title syn-title">四种语言对照总表</h1>' +
         '<div class="badges"><span class="badge">' + entries.length + ' 条</span>' +
         '<span class="badge">点名称看详情</span></div></div>';
    h += '<p class="syn-scroll-hint">↔ 表格可左右滑动，查看 HTML / CSS / JavaScript 三列</p>';
    h += '<div class="syn-table-wrap"><table class="syn-table syn-table-wide">';
    h += '<thead><tr><th>语法 / 主题</th><th>分类</th>';
    LANGS.forEach(function (l) {
      h += '<th class="th-' + l.key + '">' + l.label + '</th>';
    });
    h += '<th>易混</th></tr></thead><tbody>';

    entries.forEach(function (e) {
      h += '<tr>';
      h += '<td class="syn-td-key"><button type="button" class="syn-link" data-goto="' + esc(e.id) + '">' +
           esc(e.name) + '<span class="syn-link-zh">' + esc(e.zh) + '</span></button></td>';
      h += '<td class="syn-td-group">' + esc(e.group) + '</td>';
      LANGS.forEach(function (l) {
        const c = (e.cmp || {})[l.key] || { na: '—' };
        if (c.na) {
          h += '<td class="syn-td-na" title="' + esc(c.na) + '">不适用</td>';
        } else {
          h += '<td class="syn-td-code" title="' + esc(c.code) + '">' + esc(firstLine(c.code)) + '</td>';
        }
      });
      h += '<td class="syn-td-confuse">' + (e.confuse >= 3 ? '●' : e.confuse === 2 ? '◐' : '○') + '</td>';
      h += '</tr>';
      h += '<tr class="syn-row-note"><td colspan="7">' + esc(e.purpose) + '</td></tr>';
    });

    h += '</tbody></table></div>';
    h += '<p class="muted syn-foot">表格里的代码只显示第一行，完整示例点名称进入详情查看、复制。</p>';
    h += '</div>';
    return h;
  }

  /* ---------- 搜索附加文本 ---------- */
  function searchText(e) {
    const parts = [e.group || '', e.explanation || '', e.notes || ''];
    Object.keys(e.cmp || {}).forEach(function (k) {
      const c = e.cmp[k];
      if (!c) return;
      if (c.code) parts.push(c.code);
      if (c.note) parts.push(c.note);
      if (c.na) parts.push(c.na);
    });
    if (e.topic) {
      (e.topic.tables || []).forEach(function (tb) {
        parts.push(tb.title || '');
        (tb.rows || []).forEach(function (row) { parts.push(row.join(' ')); });
      });
      (e.topic.blocks || []).forEach(function (b) {
        parts.push(b.title || '');
        (b.rows || []).forEach(function (r) { parts.push(r.lang || '', r.code || '', r.note || ''); });
      });
      (e.topic.notes || []).forEach(function (x) { parts.push(x); });
      if (e.topic.intro) parts.push(e.topic.intro);
    }
    return parts.join(' ').toLowerCase();
  }

  function groups() {
    return (window.WDT_SYNTAX || []).reduce(function (acc, e) {
      if (acc.indexOf(e.group) < 0) acc.push(e.group);
      return acc;
    }, []);
  }

  return {
    LANGS: LANGS,
    detailHtml: detailHtml,
    tableHtml: tableHtml,
    searchText: searchText,
    groups: groups
  };
})();
