// Service Worker с автоматическим обновлением

// Версия: 2.0.0 - Исправлена проблема кэширования

const CACHE_VERSION = 'v2.0.0-' + Date.now(); // Уникальная версия при каждом деплое
const CACHE_NAME = 'uk-zelenaya-dolina-' + CACHE_VERSION;

// Файлы для кэширования
const urlsToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/css/mobile.css',
  '/js/app.js',
  '/js/camera.js',
  '/js/mobile.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing version:', CACHE_VERSION);
  
  // Пропускаем ожидание и активируем немедленно
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Opened cache:', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('[SW] Cache installation failed:', error);
      })
  );
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating version:', CACHE_VERSION);
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Удаляем старые кэши
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Захватываем контроль над всеми клиентами немедленно
      return self.clients.claim();
    })
  );
});

// Fetch с стратегией Network First (сначала сеть, потом кэш)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Если запрос успешен, обновляем кэш
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Если сеть недоступна, используем кэш
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Если ничего нет в кэше, возвращаем offline страницу
          return caches.match('/index.html');
        });
      })
  );
});

// Слушаем сообщения от клиента
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
