/* 验收线上站点：真的用浏览器打开 GitHub Pages，而不是只看 HTTP 200。
   运行：node tests/live-check.js */
const { execFileSync } = require('child_process');
const path = require('path');
const os = require('os');

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE = 'https://chuan-233.github.io/webdev-toolbox/';

function dom(hash) {
  const profile = path.join(os.tmpdir(), 'wdt-live-' + process.pid + '-' + Math.random().toString(36).slice(2));
  return execFileSync(EDGE, ['--headless=new', '--disable-gpu', '--no-first-run',
    '--user-data-dir=' + profile, '--virtual-time-budget=8000', '--dump-dom',
    BASE + hash], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

function expect(name, html, musts, mustNots) {
  const miss = musts.filter(function (s) { return html.indexOf(s) < 0; });
  const bad = (mustNots || []).filter(function (s) { return html.indexOf(s) >= 0; });
  console.log((!miss.length && !bad.length ? 'PASS  ' : 'FAIL  ') + name);
  if (miss.length) console.log('  缺少: ' + miss.join(' | '));
  if (bad.length) console.log('  不应出现: ' + bad.join(' | '));
  return !miss.length && !bad.length;
}

let pass = 0, total = 0;
function run(name, hash, musts, mustNots) {
  total++;
  let html = '';
  try { html = dom(hash); } catch (e) {
    console.log('FAIL  ' + name + '（打不开线上页面：' + e.message.slice(0, 100) + '）');
    return;
  }
  if (expect(name, html, musts, mustNots)) pass++;
}

// 负向断言不写具体人名：需要查的人名放在本地 .private-names（已 gitignore），
// 这样测试脚本本身就是「可公开」的。
const PRIVATE = loadPrivateNames();

function loadPrivateNames() {
  try {
    return require('fs').readFileSync(path.join(__dirname, '..', '.private-names'), 'utf8')
      .split('\n').map(function (x) { return x.trim(); }).filter(Boolean);
  } catch (e) { return []; }
}

run('首页：188 条 + 语法对照分类', '', ['188', '语法对照'], PRIVATE);
run('线上语法对照总表', '#__syntax-table', ['四种语言对照总表', '小括号', '不适用'], PRIVATE);
run('线上详情页', '#syn-paren', ['四种语言怎么写', 'calc'], PRIVATE);
run('线上专题：中英文标点', '#syn-topic-punct', ['中英文标点对照', '全角'], []);

console.log('\n线上验收: ' + pass + ' / ' + total + ' 通过');
process.exit(pass === total ? 0 : 1);
