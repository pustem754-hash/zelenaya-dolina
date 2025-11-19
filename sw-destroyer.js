// SW DESTROYER - безжалостный убийца Service Workers
// Этот SW сам себя уничтожает после очистки

const SW_VERSION = 'destroyer-v1';

console.log(`[${SW_VERSION}] SW Destroyer запущен`);

// Немедленная активация
self.addEventListener('install', (event) => {
  console.log(`[${SW_VERSION}] Install - пропускаем waiting`);
  event.waitUntil(self.skipWaiting());
});

// При активации - удаляем всё и самоуничтожаемся
self.addEventListener('activate', (event) => {
  console.log(`[${SW_VERSION}] Activate - начинаем уничтожение`);
  
  event.waitUntil(
    (async () => {
      try {
        // 1. Берём контроль над всеми клиентами
        await self.clients.claim();
        console.log(`[${SW_VERSION}] Контроль над клиентами захвачен`);
        
        // 2. Удаляем ВСЕ кеши
        const cacheNames = await caches.keys();
        console.log(`[${SW_VERSION}] Найдено кешей: ${cacheNames.length}`);
        
        await Promise.all(
          cacheNames.map(async (cacheName) => {
            console.log(`[${SW_VERSION}] Удаление кеша: ${cacheName}`);
            return await caches.delete(cacheName);
          })
        );
        
        // 3. Получаем всех клиентов
        const clients = await self.clients.matchAll({ 
          includeUncontrolled: true,
          type: 'window' 
        });
        
        console.log(`[${SW_VERSION}] Найдено клиентов: ${clients.length}`);
        
        // 4. Отправляем сообщение всем клиентам
        clients.forEach((client) => {
          console.log(`[${SW_VERSION}] Уведомление клиента: ${client.url}`);
          client.postMessage({
            type: 'SW_DESTROYED',
            message: 'Service Worker самоуничтожен, перезагрузите страницу'
          });
        });
        
        // 5. Ждём немного для доставки сообщений
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 6. САМОУНИЧТОЖЕНИЕ
        console.log(`[${SW_VERSION}] САМОУНИЧТОЖЕНИЕ...`);
        await self.registration.unregister();
        
        console.log(`[${SW_VERSION}] ✅ Самоуничтожение завершено`);
        
      } catch (error) {
        console.error(`[${SW_VERSION}] ❌ Ошибка при уничтожении:`, error);
      }
    })()
  );
});

// НЕ перехватываем fetch - пропускаем все запросы
self.addEventListener('fetch', (event) => {
  // Ничего не делаем - пропускаем запрос к сети
  return;
});

console.log(`[${SW_VERSION}] SW Destroyer инициализирован`);

