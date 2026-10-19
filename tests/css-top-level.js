// 找出「顶层直接写声明」的 CSS 示例（缺选择器包裹，属于无效 CSS）
const fs = require('fs');
const path = require('path');
global.window = {};
require(path.join(__dirname, '..', 'js/data/syntax-compare.js'));
const DATA = window.WDT_SYNTAX;

function topLevelText(src) {
  const s = src.replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/"(?:\\.|[^"\\])*"/g, '""')
    .replace(/'(?:\\.|[^'\\])*'/g, "''");
  let out = '', depth = 0;
  for (const ch of s) {
    if (ch === '{') { depth++; continue; }
    if (ch === '}') { depth = Math.max(0, depth - 1); continue; }
    if (depth === 0) out += ch;
  }
  return out;
}

const bad = [];
DATA.forEach(function (e) {
  const c = e.cmp && e.cmp.css;
  if (!c || !c.code) return;
  const top = topLevelText(c.code);
  // 顶层出现 "属性: 值;" 形式，说明少了选择器
  const decl = top.split('\n').filter(function (line) {
    return /^\s*[-a-zA-Z]+\s*:\s*[^;]+;\s*$/.test(line);
  });
  if (decl.length) bad.push({ id: e.id, lines: decl.map(function (x) { return x.trim(); }) });
});

if (!bad.length) console.log('CSS 顶层声明检查：全部通过（没有裸声明）');
else {
  console.log('发现 ' + bad.length + ' 条示例缺少选择器：');
  bad.forEach(function (b) { console.log(' - ' + b.id + '：' + b.lines.join(' / ')); });
  process.exit(1);
}
