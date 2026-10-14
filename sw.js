/* ==========================================================================
   sw.js — 离线缓存
   --------------------------------------------------------------------------
   作用：装到手机主屏幕后，断网也能打开。
   策略很简单：同源 GET 请求优先走缓存，缓存没有再去网络并把结果存下来。
   首次访问时把全部资源预缓存一遍。

   注意：Service Worker 只在 https 或 localhost 下有效。
   如果你是用双击 index.html（file://）的方式打开，app.js 里会跳过注册，不影响使用。
   ========================================================================== */

const CACHE = 'wdt-v1';

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/style.css',
  './js/data.js',
  './js/search.js',
  './js/playground.js',
  './js/app.js',
  './js/data/html-tags.js',
  './js/data/html-attrs.js',
  './js/data/css-props.js',
  './js/data/js-methods.js',
  './js/data/concepts.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      // 逐个添加：某一个失败（比如图标没生成）不影响其余的缓存
      return Promise.all(ASSETS.map(function (u) {
        return c.add(u).catch(function () { /* 忽略单个失败 */ });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  const req = e.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (err) { return; }
  if (url.origin !== location.origin) return;   // 跨域的不碰

  e.respondWith(
    caches.match(req).then(function (hit) {
      if (hit) {
        // 后台顺手更新一次，下次打开就是新的
        fetch(req).then(function (res) {
          if (res && res.ok) caches.open(CACHE).then(function (c) { c.put(req, res); });
        }).catch(function () {});
        return hit;
      }
      return fetch(req).then(function (res) {
        if (res && res.ok && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () {
        // 断网又没缓存：导航请求兜底回首页
        if (req.mode === 'navigate') return caches.match('./index.html');
      });
    })
  );
});
