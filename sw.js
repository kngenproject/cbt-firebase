// ══════════════════════════════════════
// CBT Pro — Service Worker
// ══════════════════════════════════════
const CACHE_NAME = 'cbt-pro-v1';
const STATIC_CACHE = 'cbt-pro-static-v1';

// Aset yang di-cache saat install
const STATIC_ASSETS = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
];

// Domain yang selalu pakai jaringan (Firebase, Google Fonts, dll)
const NETWORK_ONLY_DOMAINS = [
  'firebaseapp.com',
  'firebase.google.com',
  'googleapis.com',
  'gstatic.com',
  'firestore.googleapis.com',
  'identitytoolkit.googleapis.com',
];

// ── INSTALL ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
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

// ── FETCH STRATEGY ──
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Selalu gunakan jaringan untuk Firebase & Google APIs
  const isNetworkOnly = NETWORK_ONLY_DOMAINS.some(d => url.hostname.includes(d));
  if (isNetworkOnly) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Untuk Google Fonts: cache-first dengan fallback
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(event.request).then(cached => {
          if (cached) return cached;
          return fetch(event.request).then(response => {
            cache.put(event.request, response.clone());
            return response;
          }).catch(() => cached);
        })
      )
    );
    return;
  }

  // Untuk aset statis: cache-first
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          // Cache response baru
          if (response && response.status === 200 && response.type !== 'opaque') {
            const responseClone = response.clone(); // clone DULU sebelum return
            caches.open(CACHE_NAME).then(cache =>
              cache.put(event.request, responseClone)
            );
          }
          return response;
        }).catch(() => {
          // Offline fallback: kembalikan index.html
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
    );
    return;
  }

  // Default: gunakan jaringan
  event.respondWith(fetch(event.request));
});

// ── BACKGROUND SYNC (opsional untuk sinkronisasi hasil ujian) ──
self.addEventListener('sync', event => {
  if (event.tag === 'sync-results') {
    event.waitUntil(syncPendingResults());
  }
});

async function syncPendingResults() {
  // Placeholder — implementasi sesuai kebutuhan
  console.log('[SW] Syncing pending results...');
}
