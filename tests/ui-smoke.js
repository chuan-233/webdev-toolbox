/* 无头 Edge 冒烟测试：打开几个关键地址，把渲染后的 DOM 抓回来看关键字。
   运行：node tests/ui-smoke.js
   不依赖任何 npm 包；只用本机 Edge 的 --dump-dom。 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PROFILE = path.join(os.tmpdir(), 'wdt-edge-smoke-' + process.pid);

function dump(url) {
  const args = [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--user-data-dir=' + PROFILE, '--virtual-time-budget=4000',
    '--dump-dom', url
  ];
  return execFileSync(EDGE, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

function check(name, html, musts, mustNots) {
  const miss = (musts || []).filter(function (s) { return html.indexOf(s) < 0; });
  const bad = (mustNots || []).filter(function (s) { return html.indexOf(s) >= 0; });
  const ok = !miss.length && !bad.length;
  console.log((ok ? 'PASS' : 'FAIL') + '  ' + name);
  if (miss.length) console.log('  缺少: ' + miss.join(' | '));
  if (bad.length) console.log('  不应出现: ' + bad.join(' | '));
  return ok;
}

const file = 'file:///' + ROOT.replace(/\\/g, '/') + '/index.html';
const cases = [
  ['词条自检', file + '#__audit', ['词条库检查结果', '全部通过'], []],
  ['语法对照详情', file + '#syn-paren', ['四种语言怎么写', '小括号', 'Python', '不适用', 'calc'], ['没有符合']],
  ['语法对照总表', file + '#__syntax-table', ['四种语言对照总表', '57 条', '小括号', '不适用'], []],
  ['搜索 calc', file + '?q=calc', ['搜索结果', '算术运算符', '小括号'], []],
  ['浅色主题', file + '?theme=light#syn-brace', ['data-theme="light"', '花括号'], []],
  ['专题-中英文标点', file + '#syn-topic-punct', ['中英文标点对照', '全角', '语法位置'], []],
  ['专题-四种写法', file + '#syn-topic-same', ['同一功能的四种写法', '按钮', '不适用'], []]
  ,['导入示例（含 </script> 字符串）', file + '#syn-import', ['导入 / 引入', 'type="module"', '不适用'], []]
  ,['易混总表（长表格）', file + '#syn-topic-confusing', ['易混淆语法总表', '同一个符号，不同角色'], []]
];

// 单文件版是 build_single.py 的产物；存在就一起验，省得打包后才坏
const singlePath = path.join(ROOT, '工具箱-单文件.html');
if (fs.existsSync(singlePath)) {
  const single = 'file:///' + singlePath.replace(/\\/g, '/');
  cases.push(['单文件版：语法对照详情', single + '#syn-paren', ['四种语言怎么写', '小括号', 'Python'], []]);
  cases.push(['单文件版：词条自检', single + '#__audit', ['词条库检查结果', '全部通过'], []]);
}

let pass = 0;
for (const c of cases) {
  let html = '';
  try { html = dump(c[1]); }
  catch (e) { console.log('FAIL  ' + c[0] + '（浏览器启动失败：' + e.message.slice(0, 120) + '）'); continue; }
  if (check(c[0], html, c[2], c[3])) pass++;
}

console.log('\n结果: ' + pass + ' / ' + cases.length + ' 通过');
process.exit(pass === cases.length ? 0 : 1);
