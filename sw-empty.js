// ПУСТОЙ SERVICE WORKER - НИЧЕГО НЕ ДЕЛАЕТ
// Используется только для замены старых SW

const VERSION = 'empty-v1';

console.log(`[${VERSION}] Пустой Service Worker загружен`);

// Немедленная активация
self.addEventListener('install', (event) => {
  console.log(`[${VERSION}] Install - пропускаем waiting`);
  self.skipWaiting();
});

// Немедленное управление клиентами и самоуничтожение
self.addEventListener('activate', (event) => {
  console.log(`[${VERSION}] Activate - берём контроль и самоуничтожаемся`);
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Самоуничтожение через 1 секунду
      new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
        console.log(`[${VERSION}] Самоуничтожение...`);
        return self.registration.unregister().catch(() => {});
      })
    ]).then(() => {
      console.log(`[${VERSION}] ✅ Самоуничтожение завершено`);
    })
  );
});

// НЕ перехватываем fetch - все запросы идут в сеть напрямую
self.addEventListener('fetch', (event) => {
  // НИЧЕГО НЕ ДЕЛАЕМ - запрос идёт в сеть
  return;
});

console.log(`[${VERSION}] Пустой SW инициализирован - fetch НЕ перехватывается`);

