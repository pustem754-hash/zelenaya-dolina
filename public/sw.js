const CACHE_NAME = 'uk-zelenaya-dolina-v4.0.0';

const urlsToCache = [
  './',
  './index.html',
  './css/styles.css',
  './css/mobile.css',
  './js/app.js',
  './js/mobile.js',
  './js/camera.js',
  './manifest.json'
];

// Установка - кешируем минимум
self.addEventListener('install', (event) => {
  console.log('[SW] Install v4.0.0');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Активация - удаляем старые кеши
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate v4.0.0');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - Network First стратегия (всегда свежий контент)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Клонируем ответ для кеша
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        // Если сеть недоступна - берём из кеша
        return caches.match(event.request);
      })
  );
});

