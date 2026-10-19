/* 在真实渲染结果里查名字残留：数据文件干净 ≠ 页面干净（可能被浏览器缓存）。 */
const { execFileSync } = require('child_process');
const path = require('path'), os = require('os'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const base = 'file:///' + ROOT.replace(/\\/g, '/') + '/index.html';

function dom(hash) {
  const profile = path.join(os.tmpdir(), 'wdt-scan-' + process.pid + '-' + Math.random().toString(36).slice(2));
  return execFileSync(EDGE, ['--headless=new', '--disable-gpu', '--no-first-run',
    '--user-data-dir=' + profile, '--virtual-time-budget=3500', '--dump-dom',
    base + hash], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

const pages = ['#syn-topic-same', '#syn-var', '#syn-func', '#syn-dict', '#syn-format', '#syn-param', '#__syntax-table'];
let bad = 0;
pages.forEach(function (h) {
  const html = dom(h);
  const agave = (html.match(/Agave/g) || []).length;
  const xiaoming = (html.match(/小明/g) || []).length;
  console.log((agave ? 'FAIL' : 'PASS') + '  ' + h + '  Agave=' + agave + '  小明=' + xiaoming);
  if (agave) bad++;
});
process.exit(bad ? 1 : 0);
