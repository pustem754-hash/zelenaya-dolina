// Service Worker для УК "Зелёная долина" PWA v1.0
const CACHE_NAME = 'zelenaya-dolina-v1.0.0';
const OFFLINE_URL = '/zelenaya-dolina/index.html';

// Критически важные ресурсы для кэширования
const STATIC_CACHE = [
  '/zelenaya-dolina/',
  '/zelenaya-dolina/index.html',
  '/zelenaya-dolina/login.html',
  '/zelenaya-dolina/manifest.json',
  '/zelenaya-dolina/auth.js',
  '/zelenaya-dolina/icon-192x192.png',
  '/zelenaya-dolina/icon-512x512.png'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] 📦 Установка Service Worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] ✅ Кэш открыт, добавляем ресурсы...');
        return cache.addAll(STATIC_CACHE);
      })
      .then(() => {
        console.log('[SW] ✅ Ресурсы закэшированы');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] ❌ Ошибка установки:', error);
      })
  );
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] 🔄 Активация Service Worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] 🗑️ Удаление старого кэша:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] ✅ Service Worker активирован');
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
              console.log('[SW] 📋 Возвращаем из кэша:', event.request.url);
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
