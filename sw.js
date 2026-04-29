// ══════════════════════════════════════
// CBT Pro — Service Worker (fixed)
// ══════════════════════════════════════
const CACHE_NAME = 'cbt-pro-v2';
const STATIC_CACHE = 'cbt-pro-static-v2';

// Aset wajib — HARUS ada
const STATIC_ASSETS_REQUIRED = [
  './index.html',
  './manifest.json',
];

// Aset opsional — gagal diabaikan
const STATIC_ASSETS_OPTIONAL = [
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
];

// Domain yang selalu network-only (Firebase & Google APIs)
const NETWORK_ONLY_DOMAINS = [
  'firebaseapp.com',
  'firebase.google.com',
  'googleapis.com',
  'gstatic.com',
  'firestore.googleapis.com',
  'identitytoolkit.googleapis.com',
  'securetoken.googleapis.com',
];

// ── INSTALL ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(async cache => {
      await cache.addAll(STATIC_ASSETS_REQUIRED);
      await Promise.allSettled(
        STATIC_ASSETS_OPTIONAL.map(url =>
          fetch(url, { cache: 'no-store' })
            .then(res => { if (res.ok) return cache.put(url, res); })
            .catch(() => {})
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== STATIC_CACHE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH ──
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Network-only untuk Firebase & Google APIs
  const isNetworkOnly = NETWORK_ONLY_DOMAINS.some(d => url.hostname.includes(d));
  if (isNetworkOnly) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Google Fonts: cache-first
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(event.request).then(cached => {
          if (cached) return cached;
          return fetch(event.request).then(res => {
            if (res && res.status === 200) cache.put(event.request, res.clone());
            return res;
          }).catch(() => cached);
        })
      )
    );
    return;
  }

  // GET requests: network-first, fallback cache
  if (event.request.method === 'GET') {
    event.respondWith(
      fetch(event.request).then(res => {
        if (res && res.status === 200 && res.type !== 'opaque') {
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, res.clone()));
        }
        return res;
      }).catch(() =>
        caches.match(event.request).then(cached => {
          if (cached) return cached;
          if (event.request.mode === 'navigate') return caches.match('./index.html');
        })
      )
    );
    return;
  }

  event.respondWith(fetch(event.request));
});

self.addEventListener('sync', event => {
  if (event.tag === 'sync-results') event.waitUntil(Promise.resolve());
});
