// УК Зелёная Долина - Мобильные оптимизации
// Версия 3.0.0 с полным логированием

class MobileOptimizer {
    constructor() {
        console.log('📱 [MobileOptimizer] constructor() - начало');
        this.isMobile = this.detectMobile();
        this.touchStartY = 0;
        this.touchEndY = 0;
        console.log('📱 [MobileOptimizer] constructor() - начальные значения:', {
            isMobile: this.isMobile,
            touchStartY: this.touchStartY,
            touchEndY: this.touchEndY
        });
        this.init();
        console.log('✅ [MobileOptimizer] constructor() - завершено');
    }

    init() {
        console.log('📱 [MobileOptimizer] init() - начало инициализации');
        
        if (this.isMobile) {
            console.log('📱 [MobileOptimizer] init() - мобильное устройство обнаружено');
            this.setupMobileOptimizations();
            this.setupTouchGestures();
            this.setupMobileViewport();
            this.preventZoomOnInput();
        } else {
            console.log('💻 [MobileOptimizer] init() - десктопное устройство');
        }
        
        this.setupPWAFeatures();
        this.setupOfflineHandling();
        
        console.log('✅ [MobileOptimizer] init() - инициализация завершена');
    }

    detectMobile() {
        console.log('🔍 [MobileOptimizer] detectMobile() - начало проверки');
        const userAgent = navigator.userAgent;
        const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        const isSmallScreen = window.innerWidth <= 768;
        const hasTouch = 'ontouchstart' in window;
        
        const result = isMobileUA || isSmallScreen || hasTouch;
        console.log('🔍 [MobileOptimizer] detectMobile() - результат:', {
            userAgent: userAgent.substring(0, 50) + '...',
            isMobileUA,
            isSmallScreen,
            hasTouch,
            result
        });
        return result;
    }

    setupMobileOptimizations() {
        console.log('📱 [MobileOptimizer] setupMobileOptimizations() - начало');
        
        // Add mobile class to body
        console.log('📱 [MobileOptimizer] setupMobileOptimizations() - добавление класса mobile-device');
        document.body.classList.add('mobile-device');
        
        // Optimize touch targets
        console.log('📱 [MobileOptimizer] setupMobileOptimizations() - оптимизация touch targets');
        this.optimizeTouchTargets();
        
        // Setup mobile-specific event listeners
        console.log('📱 [MobileOptimizer] setupMobileOptimizations() - настройка обработчиков событий');
        this.setupMobileEventListeners();
        
        // Handle orientation changes
        console.log('📱 [MobileOptimizer] setupMobileOptimizations() - настройка обработки ориентации');
        this.setupOrientationHandling();
        
        console.log('✅ [MobileOptimizer] setupMobileOptimizations() - завершено');
    }

    optimizeTouchTargets() {
        console.log('👆 [MobileOptimizer] optimizeTouchTargets() - начало');
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
        console.log('👆 [MobileOptimizer] optimizeTouchTargets() - найдено элементов:', interactiveElements.length);
        
        let optimized = 0;
        interactiveElements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            if (rect.width < 44 || rect.height < 44) {
                element.style.minWidth = '44px';
                element.style.minHeight = '44px';
                optimized++;
                if (index < 5) {
                    console.log(`👆 [MobileOptimizer] optimizeTouchTargets() - элемент ${index + 1} оптимизирован:`, rect.width, 'x', rect.height);
                }
            }
        });
        console.log(`✅ [MobileOptimizer] optimizeTouchTargets() - оптимизировано элементов:`, optimized);
    }

    setupMobileEventListeners() {
        console.log('📱 [MobileOptimizer] setupMobileEventListeners() - начало');
        
        // Prevent context menu on long press
        document.addEventListener('contextmenu', (e) => {
            console.log('📱 [MobileOptimizer] setupMobileEventListeners() - contextmenu предотвращен');
            e.preventDefault();
        });

        // Handle back button (Android)
        window.addEventListener('popstate', () => {
            console.log('📱 [MobileOptimizer] setupMobileEventListeners() - событие popstate');
            this.handleBackButton();
        });

        // Handle app state changes
        document.addEventListener('visibilitychange', () => {
            console.log('📱 [MobileOptimizer] setupMobileEventListeners() - событие visibilitychange, hidden:', document.hidden);
            this.handleVisibilityChange();
        });
        
        console.log('✅ [MobileOptimizer] setupMobileEventListeners() - завершено');
    }

    setupTouchGestures() {
        console.log('👆 [MobileOptimizer] setupTouchGestures() - начало');
        
        // Swipe gestures for navigation
        document.addEventListener('touchstart', (e) => {
            this.touchStartY = e.touches[0].clientY;
            console.log('👆 [MobileOptimizer] setupTouchGestures() - touchstart, Y:', this.touchStartY);
        });

        document.addEventListener('touchend', (e) => {
            this.touchEndY = e.changedTouches[0].clientY;
            console.log('👆 [MobileOptimizer] setupTouchGestures() - touchend, Y:', this.touchEndY);
            this.handleSwipe();
        });

        // Prevent pull-to-refresh
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                if (touch.clientY > this.touchStartY && window.scrollY === 0) {
                    console.log('👆 [MobileOptimizer] setupTouchGestures() - pull-to-refresh предотвращен');
                    e.preventDefault();
                }
            }
        }, { passive: false });
        
        console.log('✅ [MobileOptimizer] setupTouchGestures() - завершено');
    }

    handleSwipe() {
        console.log('👆 [MobileOptimizer] handleSwipe() - начало');
        const swipeThreshold = 50;
        const diff = this.touchStartY - this.touchEndY;
        console.log('👆 [MobileOptimizer] handleSwipe() - разница:', diff, 'порог:', swipeThreshold);

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                console.log('👆 [MobileOptimizer] handleSwipe() - свайп вверх');
            } else {
                console.log('👆 [MobileOptimizer] handleSwipe() - свайп вниз');
            }
        } else {
            console.log('👆 [MobileOptimizer] handleSwipe() - свайп недостаточен');
        }
    }

    setupMobileViewport() {
        console.log('📱 [MobileOptimizer] setupMobileViewport() - начало');
        let viewport = document.querySelector('meta[name="viewport"]');
        console.log('🔍 [MobileOptimizer] setupMobileViewport() - viewport найден:', !!viewport);
        
        if (!viewport) {
            console.log('📱 [MobileOptimizer] setupMobileViewport() - создание нового viewport');
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            document.head.appendChild(viewport);
        }
        
        const content = 'width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0';
        viewport.content = content;
        console.log('📱 [MobileOptimizer] setupMobileViewport() - viewport установлен:', content);
        console.log('✅ [MobileOptimizer] setupMobileViewport() - завершено');
    }

    preventZoomOnInput() {
        console.log('🔍 [MobileOptimizer] preventZoomOnInput() - начало');
        const inputs = document.querySelectorAll('input, select, textarea');
        console.log('🔍 [MobileOptimizer] preventZoomOnInput() - найдено элементов:', inputs.length);
        
        inputs.forEach((input, index) => {
            input.addEventListener('focus', () => {
                if (this.isIOS()) {
                    console.log(`🔍 [MobileOptimizer] preventZoomOnInput() - focus на элементе ${index + 1}, iOS обнаружен`);
                    document.querySelector('meta[name="viewport"]').content = 
                        'width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0';
                }
            });
            
            input.addEventListener('blur', () => {
                if (this.isIOS()) {
                    console.log(`🔍 [MobileOptimizer] preventZoomOnInput() - blur на элементе ${index + 1}, iOS обнаружен`);
                    document.querySelector('meta[name="viewport"]').content = 
                        'width=device-width, initial-scale=1.0, user-scalable=yes, maximum-scale=5.0';
                }
            });
        });
        console.log('✅ [MobileOptimizer] preventZoomOnInput() - завершено');
    }

    isIOS() {
        const result = /iPad|iPhone|iPod/.test(navigator.userAgent);
        console.log('🍎 [MobileOptimizer] isIOS() - результат:', result);
        return result;
    }

    setupOrientationHandling() {
        console.log('📱 [MobileOptimizer] setupOrientationHandling() - начало');
        
        window.addEventListener('orientationchange', () => {
            console.log('📱 [MobileOptimizer] setupOrientationHandling() - событие orientationchange');
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });

        window.addEventListener('resize', () => {
            console.log('📱 [MobileOptimizer] setupOrientationHandling() - событие resize');
            this.handleResize();
        });
        
        console.log('✅ [MobileOptimizer] setupOrientationHandling() - завершено');
    }

    handleOrientationChange() {
        console.log('📱 [MobileOptimizer] handleOrientationChange() - начало');
        
        // Recalculate layout
        console.log('📱 [MobileOptimizer] handleOrientationChange() - пересчет layout');
        this.optimizeTouchTargets();
        
        // Update viewport if needed
        console.log('📱 [MobileOptimizer] handleOrientationChange() - обновление viewport');
        this.setupMobileViewport();
        
        // Trigger resize event for responsive adjustments
        console.log('📱 [MobileOptimizer] handleOrientationChange() - триггер события resize');
        window.dispatchEvent(new Event('resize'));
        
        console.log('✅ [MobileOptimizer] handleOrientationChange() - завершено');
    }

    handleResize() {
        console.log('📱 [MobileOptimizer] handleResize() - начало');
        const wasMobile = this.isMobile;
        this.isMobile = this.detectMobile();
        console.log('📱 [MobileOptimizer] handleResize() - статус мобильного:', wasMobile, '->', this.isMobile);
        
        if (wasMobile !== this.isMobile) {
            console.log('📱 [MobileOptimizer] handleResize() - изменение статуса, обновление класса');
            document.body.classList.toggle('mobile-device', this.isMobile);
        }
        console.log('✅ [MobileOptimizer] handleResize() - завершено');
    }

    setupPWAFeatures() {
        console.log('📱 [MobileOptimizer] setupPWAFeatures() - начало');
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('📱 [MobileOptimizer] setupPWAFeatures() - событие beforeinstallprompt');
            e.preventDefault();
            deferredPrompt = e;
            this.showInstallPrompt(deferredPrompt);
        });

        window.addEventListener('appinstalled', () => {
            console.log('📱 [MobileOptimizer] setupPWAFeatures() - событие appinstalled');
            this.hideInstallPrompt();
        });
        
        console.log('✅ [MobileOptimizer] setupPWAFeatures() - завершено');
    }

    showInstallPrompt(deferredPrompt) {
        console.log('📱 [MobileOptimizer] showInstallPrompt() - начало');
        const installButton = document.createElement('button');
        installButton.textContent = '📱 Установить приложение';
        installButton.className = 'install-prompt-btn';
        installButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
            z-index: 1000;
            transition: all 0.3s ease;
        `;

        installButton.addEventListener('click', async () => {
            console.log('📱 [MobileOptimizer] showInstallPrompt() - клик по кнопке установки');
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`📱 [MobileOptimizer] showInstallPrompt() - результат установки:`, outcome);
                deferredPrompt = null;
                installButton.remove();
            }
        });

        document.body.appendChild(installButton);
        console.log('✅ [MobileOptimizer] showInstallPrompt() - кнопка добавлена');
    }

    hideInstallPrompt() {
        console.log('📱 [MobileOptimizer] hideInstallPrompt() - начало');
        const installButton = document.querySelector('.install-prompt-btn');
        if (installButton) {
            console.log('📱 [MobileOptimizer] hideInstallPrompt() - кнопка найдена, удаление');
            installButton.remove();
        } else {
            console.log('📱 [MobileOptimizer] hideInstallPrompt() - кнопка не найдена');
        }
        console.log('✅ [MobileOptimizer] hideInstallPrompt() - завершено');
    }

    setupOfflineHandling() {
        console.log('🌐 [MobileOptimizer] setupOfflineHandling() - начало');
        const updateOnlineStatus = () => {
            const status = navigator.onLine ? 'online' : 'offline';
            console.log('🌐 [MobileOptimizer] setupOfflineHandling() - обновление статуса:', status);
            this.updateOfflineStatus(status);
        };

        window.addEventListener('online', () => {
            console.log('🌐 [MobileOptimizer] setupOfflineHandling() - событие online');
            updateOnlineStatus();
        });
        window.addEventListener('offline', () => {
            console.log('🌐 [MobileOptimizer] setupOfflineHandling() - событие offline');
            updateOnlineStatus();
        });
        
        // Initial status
        updateOnlineStatus();
        console.log('✅ [MobileOptimizer] setupOfflineHandling() - завершено');
    }

    updateOfflineStatus(status) {
        console.log('🌐 [MobileOptimizer] updateOfflineStatus() - начало, статус:', status);
        const networkStatus = document.getElementById('network-status');
        console.log('🔍 [MobileOptimizer] updateOfflineStatus() - элемент найден:', !!networkStatus);
        
        if (networkStatus) {
            networkStatus.className = `network-status ${status}`;
            const statusText = networkStatus.querySelector('.status-text');
            if (statusText) {
                const text = status === 'online' ? 'Онлайн' : 'Офлайн режим';
                statusText.textContent = text;
                console.log('🌐 [MobileOptimizer] updateOfflineStatus() - текст обновлен:', text);
            }
        }

        // Show offline message
        if (status === 'offline') {
            console.log('🌐 [MobileOptimizer] updateOfflineStatus() - показ сообщения об офлайне');
            this.showOfflineMessage();
        } else {
            console.log('🌐 [MobileOptimizer] updateOfflineStatus() - скрытие сообщения об офлайне');
            this.hideOfflineMessage();
        }
        console.log('✅ [MobileOptimizer] updateOfflineStatus() - завершено');
    }

    showOfflineMessage() {
        console.log('📱 [MobileOptimizer] showOfflineMessage() - начало');
        let offlineMessage = document.getElementById('offline-message');
        if (!offlineMessage) {
            console.log('📱 [MobileOptimizer] showOfflineMessage() - создание сообщения');
            offlineMessage = document.createElement('div');
            offlineMessage.id = 'offline-message';
            offlineMessage.innerHTML = `
                <div style="
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 20px;
                    border-radius: 10px;
                    text-align: center;
                    z-index: 10000;
                    max-width: 300px;
                    width: 90%;
                ">
                    <h3>📱 Офлайн режим</h3>
                    <p>Вы сейчас офлайн. Некоторые функции могут быть ограничены.</p>
                    <button onclick="this.parentElement.parentElement.remove()" style="
                        background: #10b981;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 5px;
                        margin-top: 10px;
                        cursor: pointer;
                    ">OK</button>
                </div>
            `;
            document.body.appendChild(offlineMessage);
            console.log('✅ [MobileOptimizer] showOfflineMessage() - сообщение добавлено');
        } else {
            console.log('📱 [MobileOptimizer] showOfflineMessage() - сообщение уже существует');
        }
    }

    hideOfflineMessage() {
        console.log('📱 [MobileOptimizer] hideOfflineMessage() - начало');
        const offlineMessage = document.getElementById('offline-message');
        if (offlineMessage) {
            console.log('📱 [MobileOptimizer] hideOfflineMessage() - удаление сообщения');
            offlineMessage.remove();
        } else {
            console.log('📱 [MobileOptimizer] hideOfflineMessage() - сообщение не найдено');
        }
        console.log('✅ [MobileOptimizer] hideOfflineMessage() - завершено');
    }

    handleBackButton() {
        console.log('📱 [MobileOptimizer] handleBackButton() - начало');
        if (window.zelenayaDolinaApp && window.zelenayaDolinaApp.currentSection !== 'dashboard') {
            console.log('📱 [MobileOptimizer] handleBackButton() - переход к dashboard');
            window.zelenayaDolinaApp.showSection('dashboard');
        } else {
            console.log('📱 [MobileOptimizer] handleBackButton() - уже на dashboard');
        }
        console.log('✅ [MobileOptimizer] handleBackButton() - завершено');
    }

    handleVisibilityChange() {
        console.log('📱 [MobileOptimizer] handleVisibilityChange() - начало, hidden:', document.hidden);
        if (document.hidden) {
            console.log('📱 [MobileOptimizer] handleVisibilityChange() - приложение скрыто');
        } else {
            console.log('📱 [MobileOptimizer] handleVisibilityChange() - приложение видимо');
        }
        console.log('✅ [MobileOptimizer] handleVisibilityChange() - завершено');
    }

    // Utility methods
    vibrate(pattern = [100]) {
        console.log('📳 [MobileOptimizer] vibrate() - начало, паттерн:', pattern);
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
            console.log('✅ [MobileOptimizer] vibrate() - вибрация запущена');
        } else {
            console.log('📳 [MobileOptimizer] vibrate() - вибрация не поддерживается');
        }
    }

    share(data) {
        console.log('📤 [MobileOptimizer] share() - начало, данные:', data);
        if ('share' in navigator) {
            navigator.share(data).then(() => {
                console.log('✅ [MobileOptimizer] share() - успешно');
            }).catch((error) => {
                console.error('❌ [MobileOptimizer] share() - ошибка:', error);
            });
        } else {
            console.log('📤 [MobileOptimizer] share() - share API не поддерживается');
        }
    }

    getDeviceInfo() {
        console.log('📱 [MobileOptimizer] getDeviceInfo() - начало');
        const info = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            pixelRatio: window.devicePixelRatio,
            isMobile: this.isMobile,
            isIOS: this.isIOS(),
            isAndroid: /Android/.test(navigator.userAgent),
            isOnline: navigator.onLine
        };
        console.log('📱 [MobileOptimizer] getDeviceInfo() - информация:', info);
        return info;
    }
}

// Initialize mobile optimizer
console.log('🚀 [mobile.js] - начало инициализации MobileOptimizer');
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 [mobile.js] DOMContentLoaded - создание MobileOptimizer');
    window.mobileOptimizer = new MobileOptimizer();
    console.log('✅ [mobile.js] DOMContentLoaded - MobileOptimizer создан');
});

// Export for global access
window.MobileOptimizer = MobileOptimizer;
console.log('✅ [mobile.js] - файл загружен, версия 3.0.0');
