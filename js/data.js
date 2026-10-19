/* ==========================================================================
   data.js — 汇总词条、定义分类、提供校验
   --------------------------------------------------------------------------
   加载顺序在 js/data/*.js 之后。它把五个数据文件合并成一个总表，
   并给每条词条补上「类别」信息，供搜索和界面使用。
   ========================================================================== */

window.WDT = (function () {

  /* 六个类别。加新类别时：在这里加一项，再新建对应的 js/data/xxx.js，
     并在 index.html 里加一行 <script>。 */
  const CATS = [
    { key: 'html-tag',  label: 'HTML 标签', short: '标签', hex: '#ff9e64', arr: window.WDT_HTML_TAGS },
    { key: 'html-attr', label: 'HTML 属性', short: '属性', hex: '#e0af68', arr: window.WDT_HTML_ATTRS },
    { key: 'css-prop',  label: 'CSS 属性',  short: 'CSS',  hex: '#7dcfff', arr: window.WDT_CSS_PROPS },
    { key: 'js-method', label: 'JS 方法',   short: 'JS',   hex: '#bb9af7', arr: window.WDT_JS_METHODS },
    { key: 'concept',   label: '基础概念',  short: '概念', hex: '#9aa5ce', arr: window.WDT_CONCEPTS },
    { key: 'syntax',    label: '语法对照',  short: '对照', hex: '#73daca', arr: window.WDT_SYNTAX }
  ];

  const ALL = [];
  CATS.forEach(function (c) {
    (c.arr || []).forEach(function (e) {
      e.cat = c.key;
      e.catLabel = c.label;
      e.catHex = c.hex;
      // 语法对照的示例不一定能在实验区里跑（比如纯 Python 示例），
      // 统一补一个空的三段结构，避免详情/自检到处判空。
      if (!e.example) e.example = { html: '', css: '', js: '' };
      // 搜索时把四语言示例和专题表格也算进去，否则搜「calc」找不到 CSS 那格。
      if (c.key === 'syntax') e.searchExtra = syntaxSearchText(e);
      ALL.push(e);
    });
  });

  const BY_ID = new Map();
  ALL.forEach(function (e) { BY_ID.set(e.id, e); });

  /* 搜索用的归一化：去掉尖括号、括号、空格，统一小写。
     这样搜 "<div>" 和 "div" 效果一样。 */
  function norm(s) {
    return String(s == null ? '' : s)
      .toLowerCase()
      .replace(/[<>()（）]/g, '')
      .trim();
  }

  /* 语法对照专用的附加搜索文本（在 search.js 里会被再搜一遍） */
  function syntaxSearchText(e) {
    const parts = [e.group || '', e.explanation || '', e.notes || ''];
    const langNames = { python: 'Python', html: 'HTML', css: 'CSS', js: 'JavaScript' };
    Object.keys(e.cmp || {}).forEach(function (k) {
      const c = e.cmp[k];
      if (!c) return;
      if (!c.na && langNames[k]) parts.push(langNames[k]);
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

  const STATUS_ZH = {
    modern:     null,               // 推荐写法不显示徽章，减少干扰
    legacy:     '旧写法',
    deprecated: '已废弃'
  };

  function statusLabel(st) { return STATUS_ZH[st] || null; }

  /* 需要哪些字段（自检用） */
  const REQUIRED = ['id', 'name', 'zh', 'purpose', 'syntax', 'status', 'keywords', 'example', 'errors', 'related'];
  const STATUSES = ['modern', 'legacy', 'deprecated'];
  const SYNTAX_REQUIRED = ['id', 'name', 'zh', 'purpose', 'explanation', 'group', 'syntax',
                           'status', 'keywords', 'cmp', 'errors', 'related'];
  const SYNTAX_GROUPS = ['符号', '运算符', '变量与数据类型', '字符串', '条件与循环', '函数',
                         '代码块', '注释', '模块与导入', 'HTML 元素与属性', 'CSS 选择器与声明',
                         'JavaScript DOM 操作', '专题'];
  const LANG_KEYS = ['python', 'html', 'css', 'js'];

  function validate() {
    const issues = [];
    const seen = new Set();

    ALL.forEach(function (e, i) {
      const where = (e && e.id) ? e.id : ('第 ' + (i + 1) + ' 条（没有 id）');
      const isSyntax = e && e.cat === 'syntax';
      const required = isSyntax ? SYNTAX_REQUIRED : REQUIRED;

      required.forEach(function (f) {
        const v = e[f];
        if (v === undefined || v === null || v === '') {
          issues.push(where + '：缺字段 ' + f);
        }
      });

      if (e.id) {
        if (seen.has(e.id)) issues.push(where + '：id 重复');
        seen.add(e.id);
      }

      if (e.status && STATUSES.indexOf(e.status) < 0) {
        issues.push(where + '：status 只能是 modern / legacy / deprecated，现在是 "' + e.status + '"');
      }

      if (e.example) {
        ['html', 'css', 'js'].forEach(function (k) {
          if (typeof e.example[k] !== 'string') {
            issues.push(where + '：example 缺 "' + k + '"（不用的话给空字符串）');
          }
        });
        const blank = !e.example.html && !e.example.css && !e.example.js;
        // 语法对照里很多条目只有 Python 示例，实验区空着是正常的
        if (blank && !isSyntax) issues.push(where + '：example 三段全是空的，实验区会是一片空白');
      }

      ['keywords', 'errors', 'related'].forEach(function (k) {
        if (e[k] && !Array.isArray(e[k])) issues.push(where + '：' + k + ' 应该是数组');
      });

      if (isSyntax) {
        if (SYNTAX_GROUPS.indexOf(e.group) < 0) {
          issues.push(where + '：group 不在允许的分类里（' + e.group + '）');
        }
        if (typeof e.confuse !== 'number' || e.confuse < 1 || e.confuse > 3) {
          issues.push(where + '：confuse 应该是 1 / 2 / 3');
        }
        if (!e.topic) {
          LANG_KEYS.forEach(function (lk) {
            const c = (e.cmp || {})[lk];
            if (!c) {
              issues.push(where + '：cmp 缺 ' + lk);
            } else if (!c.na && typeof c.code !== 'string') {
              issues.push(where + '：cmp.' + lk + ' 既没有 code 也没有 na');
            }
          });
        }
      }
    });

    // 相关概念指向的词条必须真实存在
    ALL.forEach(function (e) {
      (e.related || []).forEach(function (rid) {
        if (!BY_ID.has(rid)) {
          issues.push(e.id + '：related 里的 "' + rid + '" 不存在');
        }
        if (rid === e.id) {
          issues.push(e.id + '：related 指向了自己');
        }
      });
    });

    return issues;
  }

  function countsByCat() {
    const m = {};
    CATS.forEach(function (c) { m[c.key] = 0; });
    ALL.forEach(function (e) { m[e.cat] = (m[e.cat] || 0) + 1; });
    return m;
  }

  return {
    CATS: CATS,
    ALL: ALL,
    BY_ID: BY_ID,
    norm: norm,
    statusLabel: statusLabel,
    validate: validate,
    countsByCat: countsByCat,
    meta: {
      title: 'Web 学习工具箱',
      total: ALL.length
    }
  };
})();
