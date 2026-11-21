const CACHE = 'upsc-hub-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './tools/style.css',
  './tools/constitution.html',
  './tools/timeline.html',
  './tools/timer.html',
  './tools/pomodoro.html',
  './tools/ca.html',
  './tools/topper-copies.html',
  './tools/interviews.html',
  './tools/map.html',
  './tools/pre-pyqs.html',
  './tools/mains-pyqs.html',
  './tools/history-map.html',
  './tools/your-tests.html',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Network-first for data APIs so content stays fresh
  if (e.request.url.includes('/data/')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
