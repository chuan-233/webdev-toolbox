/* 内容语法核对：Python 用 compile()，JS 用 new Function，CSS/HTML 做结构配对。
   运行：node tests/content-check.js */
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
// 直接读数据文件：它只依赖 window，给个空对象就能加载
global.window = {};
require(path.join(ROOT, 'js/data/syntax-compare.js'));
const DATA = window.WDT_SYNTAX;

const failures = [];

/* ---------- Python ---------- */
const pyItems = [];
DATA.forEach(function (e) {
  const c = e.cmp && e.cmp.python;
  if (c && c.code) pyItems.push({ id: e.id, b64: Buffer.from(c.code, 'utf8').toString('base64') });
});
const tmpJson = path.join(os.tmpdir(), 'wdt-py-' + process.pid + '.json');
const tmpPy = path.join(os.tmpdir(), 'wdt-pycheck-' + process.pid + '.py');
fs.writeFileSync(tmpJson, JSON.stringify(pyItems), 'utf8');
fs.writeFileSync(tmpPy, [
  'import json, base64, sys',
  'items = json.load(open(sys.argv[1], encoding="utf-8"))',
  'errs = []',
  'for it in items:',
  '    code = base64.b64decode(it["b64"]).decode("utf-8")',
  '    try:',
  '        compile(code, it["id"], "exec")',
  '    except SyntaxError as e:',
  '        errs.append(it["id"] + ": " + str(e))',
  'print(json.dumps(errs, ensure_ascii=False))'
].join('\n'), 'utf8');
let pyErrs = [];
try {
  const out = execFileSync('python', [tmpPy, tmpJson], { encoding: 'utf8' });
  pyErrs = JSON.parse(out.trim() || '[]');
} catch (e) {
  failures.push('Python 检查器没有跑起来：' + e.message);
}
pyErrs.forEach(function (x) { failures.push('Python ' + x); });
console.log('Python 示例: ' + pyItems.length + ' 段，' + (pyErrs.length ? pyErrs.length + ' 段语法错误' : '全部通过'));

/* ---------- JavaScript ---------- */
let jsCount = 0;
DATA.forEach(function (e) {
  const c = e.cmp && e.cmp.js;
  if (!c || !c.code) return;
  const code = c.code;
  // import/export 只能在模块里解析，new Function 不支持；这两条在详情里已经注明
  if (/(^|\n)\s*(import|export)\s/.test(code)) return;
  jsCount++;
  try { new Function(code); }
  catch (err) { failures.push('JS ' + e.id + '：' + err.message); }
});
console.log('JavaScript 示例: ' + jsCount + ' 段，' + (failures.filter(function (x) { return x.indexOf('JS ') === 0; }).length ? '有语法错误' : '全部通过'));

/* ---------- CSS 结构 ---------- */
function stripCssNoise(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/"(?:\\.|[^"\\])*"/g, '""')
    .replace(/'(?:\\.|[^'\\])*'/g, "''");
}
let cssCount = 0;
DATA.forEach(function (e) {
  const c = e.cmp && e.cmp.css;
  if (!c || !c.code) return;
  cssCount++;
  const s = stripCssNoise(c.code);
  const pairs = { '{': '}', '(': ')' };
  const stack = [];
  for (const ch of s) {
    if (pairs[ch]) stack.push(ch);
    else if (ch === '}' || ch === ')') {
      const want = ch === '}' ? '{' : '(';
      if (stack.pop() !== want) { failures.push('CSS ' + e.id + '：括号不配对'); break; }
    }
  }
  if (stack.length) failures.push('CSS ' + e.id + '：有未闭合的 ' + stack.join(''));
  // 声明块里不该出现全角冒号/分号（注释和字符串已经剥掉了）
  if (/[：；]/.test(s)) failures.push('CSS ' + e.id + '：语法位置出现全角冒号或分号');
});
console.log('CSS 示例: ' + cssCount + ' 段，结构检查完成');

/* ---------- HTML 标签配对 ---------- */
const VOID = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
let htmlCount = 0;
DATA.forEach(function (e) {
  const c = e.cmp && e.cmp.html;
  if (!c || !c.code) return;
  htmlCount++;
  const src = c.code.replace(/<!--[\s\S]*?-->/g, '');
  const stack = [];
  const re = /<\/?([a-zA-Z][a-zA-Z0-9-]*)(?:\s[^<>]*?)?\s*\/?>/g;
  let m, bad = false;
  while ((m = re.exec(src))) {
    const raw = m[0], tag = m[1].toLowerCase();
    if (raw.indexOf('</') === 0) {
      if (VOID.has(tag)) { failures.push('HTML ' + e.id + '：空元素 </' + tag + '> 不应有结束标签'); bad = true; break; }
      const top = stack.pop();
      if (top !== tag) { failures.push('HTML ' + e.id + '：结束标签 </' + tag + '> 与 <' + top + '> 不匹配'); bad = true; break; }
    } else if (!VOID.has(tag) && !/\/\s*>$/.test(raw)) {
      stack.push(tag);
    }
  }
  if (!bad && stack.length) failures.push('HTML ' + e.id + '：标签未闭合 ' + stack.join(' > '));
});
console.log('HTML 示例: ' + htmlCount + ' 段，标签配对检查完成');

/* ---------- 结果 ---------- */
console.log('');
if (failures.length) {
  console.log('发现 ' + failures.length + ' 个问题：');
  failures.forEach(function (x) { console.log(' - ' + x); });
  process.exit(1);
}
console.log('全部通过：Python / JavaScript / CSS / HTML 示例语法核对无问题。');
