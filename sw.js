// Bump VERSION whenever any file changes, so phones pick up the new copy.
const VERSION = 'guia-ing-v11';
const ASSETS = [
  './',
  './index.html',
  './support.js',
  './manifest.webmanifest',
  './vendor/react.production.min.js',
  './vendor/react-dom.production.min.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './capa.webp',
  './bg-voo.webp',
  './bg-02.webp', './bg-03.webp', './bg-04.webp', './bg-05.webp',
  './bg-06.webp', './bg-07.webp', './bg-08.webp', './bg-09.webp', './bg-10.webp',
  './bg-extra.webp', './bg-lojas-londres.webp', './bg-lojas-campo.webp'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Cache first: the guide never needs the network once installed.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => hit ||
      fetch(e.request).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(e.request, copy));
        }
        return res;
      }).catch(() => e.request.mode === 'navigate' ? caches.match('./index.html') : Response.error())
    )
  );
});
