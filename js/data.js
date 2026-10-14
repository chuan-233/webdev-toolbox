/* ==========================================================================
   data.js — 汇总词条、定义分类、提供校验
   --------------------------------------------------------------------------
   加载顺序在 js/data/*.js 之后。它把五个数据文件合并成一个总表，
   并给每条词条补上「类别」信息，供搜索和界面使用。
   ========================================================================== */

window.WDT = (function () {

  /* 五个类别。加新类别时：在这里加一项，再新建对应的 js/data/xxx.js，
     并在 index.html 里加一行 <script>。 */
  const CATS = [
    { key: 'html-tag',  label: 'HTML 标签', short: '标签', hex: '#ff9e64', arr: window.WDT_HTML_TAGS },
    { key: 'html-attr', label: 'HTML 属性', short: '属性', hex: '#e0af68', arr: window.WDT_HTML_ATTRS },
    { key: 'css-prop',  label: 'CSS 属性',  short: 'CSS',  hex: '#7dcfff', arr: window.WDT_CSS_PROPS },
    { key: 'js-method', label: 'JS 方法',   short: 'JS',   hex: '#bb9af7', arr: window.WDT_JS_METHODS },
    { key: 'concept',   label: '基础概念',  short: '概念', hex: '#9aa5ce', arr: window.WDT_CONCEPTS }
  ];

  const ALL = [];
  CATS.forEach(function (c) {
    (c.arr || []).forEach(function (e) {
      e.cat = c.key;
      e.catLabel = c.label;
      e.catHex = c.hex;
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

  const STATUS_ZH = {
    modern:     null,               // 推荐写法不显示徽章，减少干扰
    legacy:     '旧写法',
    deprecated: '已废弃'
  };

  function statusLabel(st) { return STATUS_ZH[st] || null; }

  /* 需要哪些字段（自检用） */
  const REQUIRED = ['id', 'name', 'zh', 'purpose', 'syntax', 'status', 'keywords', 'example', 'errors', 'related'];
  const STATUSES = ['modern', 'legacy', 'deprecated'];

  function validate() {
    const issues = [];
    const seen = new Set();

    ALL.forEach(function (e, i) {
      const where = (e && e.id) ? e.id : ('第 ' + (i + 1) + ' 条（没有 id）');

      REQUIRED.forEach(function (f) {
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
        if (blank) issues.push(where + '：example 三段全是空的，实验区会是一片空白');
      }

      ['keywords', 'errors', 'related'].forEach(function (k) {
        if (e[k] && !Array.isArray(e[k])) issues.push(where + '：' + k + ' 应该是数组');
      });
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
