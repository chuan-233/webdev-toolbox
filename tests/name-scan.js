/* 在真实渲染结果里查名字残留：数据文件干净 ≠ 页面干净（可能被浏览器缓存）。 */
const { execFileSync } = require('child_process');
const path = require('path'), os = require('os'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const base = 'file:///' + ROOT.replace(/\\/g, '/') + '/index.html';

/* 需要排查的人名从本地 .private-names 读（该文件已 gitignore，不会公开）。
   测试脚本里不写死任何人名，这样脚本本身可以直接公开。 */
const PRIVATE = (function () {
  try {
    return fs.readFileSync(path.join(ROOT, '.private-names'), 'utf8')
      .split('\n').map(function (x) { return x.trim(); }).filter(Boolean);
  } catch (e) { return []; }
})();

function dom(hash) {
  const profile = path.join(os.tmpdir(), 'wdt-scan-' + process.pid + '-' + Math.random().toString(36).slice(2));
  return execFileSync(EDGE, ['--headless=new', '--disable-gpu', '--no-first-run',
    '--user-data-dir=' + profile, '--virtual-time-budget=3500', '--dump-dom',
    base + hash], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

const pages = ['#syn-topic-same', '#syn-var', '#syn-func', '#syn-dict', '#syn-format', '#syn-param', '#__syntax-table'];
let bad = 0;
if (!PRIVATE.length) {
  console.log('提示：没有 .private-names，只检查教材占位名是否出现。');
}
pages.forEach(function (h) {
  const html = dom(h);
  const found = PRIVATE.filter(function (n) { return html.indexOf(n) >= 0; });
  const placeholder = (html.match(/小明/g) || []).length;
  console.log((found.length ? 'FAIL' : 'PASS') + '  ' + h +
              '  私名命中=' + (found.length ? found.join(',') : 0) +
              '  教材占位名=' + placeholder);
  if (found.length) bad++;
});
process.exit(bad ? 1 : 0);
