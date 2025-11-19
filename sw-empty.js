// ПУСТОЙ SERVICE WORKER - НИЧЕГО НЕ ДЕЛАЕТ
// Используется только для замены старых SW

const VERSION = 'empty-v1';

console.log(`[${VERSION}] Пустой Service Worker загружен`);

// Немедленная активация
self.addEventListener('install', (event) => {
  console.log(`[${VERSION}] Install - пропускаем waiting`);
  self.skipWaiting();
});

// Немедленное управление клиентами
self.addEventListener('activate', (event) => {
  console.log(`[${VERSION}] Activate - берём контроль`);
  event.waitUntil(
    self.clients.claim().then(() => {
      console.log(`[${VERSION}] Контроль захвачен`);
    })
  );
});

// НЕ перехватываем fetch - все запросы идут в сеть напрямую
self.addEventListener('fetch', (event) => {
  // НИЧЕГО НЕ ДЕЛАЕМ - запрос идёт в сеть
  return;
});

console.log(`[${VERSION}] Пустой SW инициализирован - fetch НЕ перехватывается`);

