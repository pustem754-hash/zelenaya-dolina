// УК Зелёная Долина - Service Worker

const CACHE_NAME = 'uk-zelenaya-dolina-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/css/styles.css',
    '/css/mobile.css',
    '/js/app.js',
    '/js/mobile.js',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

// Install event
self.addEventListener('install', event => {
    console.log('🔧 Service Worker устанавливается...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 Кэширование ресурсов приложения...');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('✅ Ресурсы приложения закэшированы успешно');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ Ошибка кэширования ресурсов:', error);
                return self.skipWaiting();
            })
    );
});

// Activate event
self.addEventListener('activate', event => {
    console.log('🚀 Service Worker активируется...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Удаление старого кэша:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('✅ Service Worker активирован');
            return self.clients.claim();
        })
    );
});

// Fetch event
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip external requests
    if (url.origin !== location.origin) {
        return;
    }
    
    event.respondWith(
        caches.match(request)
            .then(response => {
                // Return cached version if available
                if (response) {
                    console.log('📦 Обслуживание из кэша:', request.url);
                    return response;
                }
                
                // Otherwise fetch from network
                console.log('🌐 Загрузка из сети:', request.url);
                return fetch(request)
                    .then(response => {
                        // Check if response is valid
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone response for caching
                        const responseToCache = response.clone();
                        
                        // Cache the response
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(request, responseToCache);
                            })
                            .catch(error => {
                                console.error('❌ Ошибка кэширования ответа:', error);
                            });
                        
                        return response;
                    })
                    .catch(error => {
                        console.error('❌ Ошибка загрузки из сети:', error);
                        
                        // Return offline page for navigation requests
                        if (request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }
                        
                        // Return generic offline response for other requests
                        return new Response('Офлайн режим', {
                            status: 200,
                            statusText: 'OK',
                            headers: {
                                'Content-Type': 'text/plain'
                            }
                        });
                    });
            })
    );
});

// Background sync
self.addEventListener('sync', event => {
    console.log('🔄 Фоновая синхронизация:', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(
            // Perform background sync operations
            syncData()
        );
    }
});

// Push notifications
self.addEventListener('push', event => {
    console.log('📢 Получено push-уведомление');
    
    const options = {
        body: event.data ? event.data.text() : 'Новое уведомление от УК Зелёная Долина',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Просмотреть',
                icon: '/icons/icon-192x192.png'
            },
            {
                action: 'close',
                title: 'Закрыть',
                icon: '/icons/icon-192x192.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('УК Зелёная Долина', options)
    );
});

// Notification click
self.addEventListener('notificationclick', event => {
    console.log('🔔 Нажато уведомление:', event.notification.tag);
    
    event.notification.close();
    
    if (event.action === 'explore') {
        // Open the app
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handling
self.addEventListener('message', event => {
    console.log('💬 Получено сообщение:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({
            version: CACHE_NAME
        });
    }
});

// Helper functions
async function syncData() {
    try {
        console.log('🔄 Синхронизация данных...');
        
        // Perform data synchronization
        // This would typically involve syncing offline data with server
        
        console.log('✅ Синхронизация данных завершена');
    } catch (error) {
        console.error('❌ Ошибка синхронизации данных:', error);
    }
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', event => {
    if (event.tag === 'content-sync') {
        event.waitUntil(syncData());
    }
});

console.log('🔧 Service Worker УК Зелёная Долина загружен');