// Service Worker - полная деактивация
self.addEventListener('install', function(event) {
  console.log('[SW] Деактивация - немедленная активация');
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('[SW] Удаление всех кэшей');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          console.log('[SW] Удаление кэша:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(function() {
      console.log('[SW] Деактивация Service Worker');
      return self.registration.unregister();
    }).then(function() {
      console.log('[SW] Захват всех клиентов');
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  // НЕ КЭШИРУЕМ - пропускаем все запросы
  return;
});

