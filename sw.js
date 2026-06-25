/* Examen AI service worker — offline-first cache of the app shell.
   Bump CACHE on every deploy so clients pick up new code. */
const CACHE = 'examen-v15';
const ASSETS = [
  './', './index.html', './styles.css', './app.js',
  './examination.js', './attention-examen.js',
  './manifest.webmanifest', './icon.svg', './brain.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request).then((res) => {
      // runtime-cache same-origin GETs so the app keeps working offline
      const copy = res.clone();
      caches.open(CACHE).then((c) => { try { c.put(e.request, copy); } catch (_) {} });
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
