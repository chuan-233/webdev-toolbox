/* ==========================================================================
   search.js — 搜索与排序
   --------------------------------------------------------------------------
   支持：按名称、中文别名、用途、关键词搜索；空格分隔多个关键词（要全中）。
   计分方式简单直白：匹配得越"靠前、越完整"，分越高。
   ========================================================================== */

window.WDT.search = (function () {

  const norm = window.WDT.norm;

  /* 单条词条 vs 单个关键词的最高得分；0 表示不匹配 */
  function scoreOne(entry, t) {
    const name = norm(entry.name);
    const zh = String(entry.zh || '').toLowerCase();
    const purpose = String(entry.purpose || '').toLowerCase();
    const kws = (entry.keywords || []).map(function (k) { return String(k).toLowerCase(); });

    /* 单个 ASCII 字母（比如 a、p）走严格模式：只认完全相等或名字开头。
       否则搜 "a" 会因为 "background-color" 里含 a 而返回一大片，没法用。
       单个汉字不受此限 —— "居" 这种半截词是常见输入。 */
    const singleAscii = t.length === 1 && t.charCodeAt(0) < 128;

    let best = 0;

    if (name === t) best = Math.max(best, 120);
    else if (name.indexOf(t) === 0) best = Math.max(best, 90);
    else if (!singleAscii && name.indexOf(t) >= 0) best = Math.max(best, 70);

    if (zh === t) best = Math.max(best, 100);
    else if (!singleAscii && zh.indexOf(t) >= 0) best = Math.max(best, 60);

    kws.forEach(function (k) {
      if (k === t) best = Math.max(best, 80);
      else if (!singleAscii && k.indexOf(t) >= 0) best = Math.max(best, 45);
    });

    if (singleAscii) return best;

    const catLabel = String(entry.catLabel || '').toLowerCase();
    if (catLabel.indexOf(t) >= 0) best = Math.max(best, 20);

    if (purpose.indexOf(t) >= 0) best = Math.max(best, 30);

    const tip = String(entry.tip || '').toLowerCase();
    if (tip.indexOf(t) >= 0) best = Math.max(best, 12);

    const errs = (entry.errors || []).join(' ').toLowerCase();
    if (errs.indexOf(t) >= 0) best = Math.max(best, 10);

    /* 语法对照的附加文本：四语言示例、说明、专题表格。
       没有它，搜「calc」「elif」「addEventListener」只能碰运气命中 name。 */
    const extra = String(entry.searchExtra || '').toLowerCase();
    if (!singleAscii && extra.indexOf(t) >= 0) best = Math.max(best, 24);

    return best;
  }

  /**
   * 搜索入口。
   * @param {string} query 原始查询串
   * @param {{or?: boolean}} [opts] or=true 时只要命中任一个关键词就算（用于兜底）
   * @returns {Array<{entry, score, hit}>} 按分数从高到低
   */
  function run(query, opts) {
    const or = !!(opts && opts.or);
    const q = String(query || '').trim();
    if (!q) return [];

    const tokens = q.split(/\s+/).map(norm).filter(Boolean);
    if (!tokens.length) return [];

    const out = [];
    window.WDT.ALL.forEach(function (entry) {
      let total = 0;
      let hits = 0;
      let firstHit = 0;

      for (let i = 0; i < tokens.length; i++) {
        const s = scoreOne(entry, tokens[i]);
        if (!s) continue;
        hits++;
        total += s;
        if (!firstHit) firstHit = s;
      }

      if (or ? hits === 0 : hits !== tokens.length) return;

      // 命中越多关键词排越前；名称命中再加权
      const boost = or ? hits * 60 : (tokens.length - 1) * 15;
      out.push({ entry: entry, score: total + firstHit * 0.5 + boost, hit: firstHit, hits: hits });
    });

    out.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return a.entry.name.localeCompare(b.entry.name);
    });

    return out;
  }

  /* 生成一小段"为什么这条会被搜到"的摘要 */
  function snippet(entry, query) {
    const text = String(entry.purpose || '');
    const tokens = String(query || '').split(/\s+/).map(norm).filter(Boolean);
    const lower = text.toLowerCase();
    let idx = -1;
    tokens.forEach(function (t) {
      if (idx >= 0) return;
      idx = lower.indexOf(t);
    });
    if (idx < 0) return text.length > 60 ? text.slice(0, 60) + '…' : text;
    const start = Math.max(0, idx - 12);
    const end = Math.min(text.length, idx + 48);
    return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
  }

  return { run: run, snippet: snippet };
})();
