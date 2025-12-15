// Service Worker для УК "Зелёная долина" PWA
const CACHE_NAME = 'zelenaya-dolina-v7.2.6-FORCE-CLEAR';
const OFFLINE_URL = '/zelenaya-dolina/index.html';

// Критически важные файлы для кэширования (login.html ИСКЛЮЧЁН!)
const STATIC_CACHE = [
  '/zelenaya-dolina/',
  '/zelenaya-dolina/index.html',
  '/zelenaya-dolina/manifest.json',
  '/zelenaya-dolina/icon-192x192.png',
  '/zelenaya-dolina/icon-512x512.png'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_CACHE);
      })
      .then(() => {
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Ошибка кэширования:', error);
      })
  );
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Обработка сетевых запросов (Network First стратегия)
self.addEventListener('fetch', (event) => {
  // Игнорируем запросы к расширениям браузера
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // КРИТИЧНО: НЕ кэшировать auth.js, residents.json и login.html - всегда брать с сервера!
  const url = new URL(event.request.url);
  const noCacheFiles = ['auth.js', 'residents.json', 'login.html'];
  const shouldSkipCache = noCacheFiles.some(file => url.pathname.includes(file));

  if (shouldSkipCache) {
    // Всегда загружать с сервера, игнорируя кэш
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response('Требуется подключение к интернету', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      })
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Клонируем ответ для сохранения в кэше
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      })
      .catch(() => {
        // Если сеть недоступна, ищем в кэше
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }

            // Для навигационных запросов возвращаем главную страницу
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }

            return new Response('Контент недоступен офлайн', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});


