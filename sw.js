// Этот SW удалит сам себя и все старые SW

self.addEventListener('install', function(event) {
  console.log('[SW KILLER] Установка - принудительная активация');
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('[SW KILLER] Активация - удаление всего');
  
  event.waitUntil(
    Promise.all([
      // Удаляем ВСЕ кэши
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            console.log('[SW KILLER] Удаление кэша:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }),
      // Получаем всех клиентов
      self.clients.matchAll().then(function(clients) {
        clients.forEach(function(client) {
          console.log('[SW KILLER] Перезагрузка клиента:', client.url);
          client.postMessage({
            type: 'SW_KILLED',
            message: 'Service Worker удалён, перезагрузите страницу'
          });
        });
      }),
      // Захватываем всех клиентов
      self.clients.claim()
    ]).then(function() {
      console.log('[SW KILLER] Самоуничтожение через 1 секунду');
      // Удаляем сами себя через 1 секунду
      setTimeout(function() {
        self.registration.unregister().then(function(success) {
          console.log('[SW KILLER] Деактивация:', success ? 'успешно' : 'ошибка');
        });
      }, 1000);
    })
  );
});

self.addEventListener('fetch', function(event) {
  // НЕ ПЕРЕХВАТЫВАЕМ ЗАПРОСЫ - пропускаем всё
  console.log('[SW KILLER] Пропуск запроса:', event.request.url);
  return;
});

self.addEventListener('message', function(event) {
  console.log('[SW KILLER] Получено сообщение:', event.data);
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

