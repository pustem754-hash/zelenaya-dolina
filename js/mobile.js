// УК Зелёная Долина - Мобильные оптимизации

class MobileOptimizer {
    constructor() {
        this.isMobile = this.detectMobile();
        this.touchStartY = 0;
        this.touchEndY = 0;
        this.init();
    }

    init() {
        console.log('📱 Мобильный оптимизатор инициализируется...');
        
        if (this.isMobile) {
            this.setupMobileOptimizations();
            this.setupTouchGestures();
            this.setupMobileViewport();
            this.preventZoomOnInput();
        }
        
        this.setupPWAFeatures();
        this.setupOfflineHandling();
        
        console.log('✅ Мобильный оптимизатор инициализирован');
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768 ||
               ('ontouchstart' in window);
    }

    setupMobileOptimizations() {
        // Add mobile class to body
        document.body.classList.add('mobile-device');
        
        // Optimize touch targets
        this.optimizeTouchTargets();
        
        // Setup mobile-specific event listeners
        this.setupMobileEventListeners();
        
        // Handle orientation changes
        this.setupOrientationHandling();
    }

    optimizeTouchTargets() {
        // Ensure all interactive elements meet minimum touch target size
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
        
        interactiveElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.width < 44 || rect.height < 44) {
                element.style.minWidth = '44px';
                element.style.minHeight = '44px';
            }
        });
    }

    setupMobileEventListeners() {
        // Prevent context menu on long press
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });

        // Handle back button (Android)
        window.addEventListener('popstate', () => {
            this.handleBackButton();
        });

        // Handle app state changes
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
    }

    setupTouchGestures() {
        // Swipe gestures for navigation
        document.addEventListener('touchstart', (e) => {
            this.touchStartY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            this.touchEndY = e.changedTouches[0].clientY;
            this.handleSwipe();
        });

        // Prevent pull-to-refresh
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                if (touch.clientY > this.touchStartY && window.scrollY === 0) {
                    e.preventDefault();
                }
            }
        }, { passive: false });
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartY - this.touchEndY;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe up - could be used for navigation
                console.log('📱 Обнаружен свайп вверх');
            } else {
                // Swipe down - could be used for refresh
                console.log('📱 Обнаружен свайп вниз');
            }
        }
    }

    setupMobileViewport() {
        // Set viewport meta tag dynamically if needed
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            document.head.appendChild(viewport);
        }
        
        viewport.content = 'width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0';
    }

    preventZoomOnInput() {
        // Prevent zoom on input focus (iOS)
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                if (this.isIOS()) {
                    document.querySelector('meta[name="viewport"]').content = 
                        'width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0';
                }
            });
            
            input.addEventListener('blur', () => {
                if (this.isIOS()) {
                    document.querySelector('meta[name="viewport"]').content = 
                        'width=device-width, initial-scale=1.0, user-scalable=yes, maximum-scale=5.0';
                }
            });
        });
    }

    isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent);
    }

    setupOrientationHandling() {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });

        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    handleOrientationChange() {
        console.log('📱 Изменение ориентации');
        
        // Recalculate layout
        this.optimizeTouchTargets();
        
        // Update viewport if needed
        this.setupMobileViewport();
        
        // Trigger resize event for responsive adjustments
        window.dispatchEvent(new Event('resize'));
    }

    handleResize() {
        // Update mobile detection
        const wasMobile = this.isMobile;
        this.isMobile = this.detectMobile();
        
        if (wasMobile !== this.isMobile) {
            document.body.classList.toggle('mobile-device', this.isMobile);
        }
    }

    setupPWAFeatures() {
        // Install prompt handling
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            this.showInstallPrompt(deferredPrompt);
        });

        // App installed event
        window.addEventListener('appinstalled', () => {
            console.log('📱 PWA установлено успешно');
            this.hideInstallPrompt();
        });
    }

    showInstallPrompt(deferredPrompt) {
        // Create install button
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
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`📱 Результат установки: ${outcome}`);
                deferredPrompt = null;
                installButton.remove();
            }
        });

        document.body.appendChild(installButton);
    }

    hideInstallPrompt() {
        const installButton = document.querySelector('.install-prompt-btn');
        if (installButton) {
            installButton.remove();
        }
    }

    setupOfflineHandling() {
        // Offline detection
        const updateOnlineStatus = () => {
            const status = navigator.onLine ? 'online' : 'offline';
            this.updateOfflineStatus(status);
        };

        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
        
        // Initial status
        updateOnlineStatus();
    }

    updateOfflineStatus(status) {
        const networkStatus = document.getElementById('network-status');
        if (networkStatus) {
            networkStatus.className = `network-status ${status}`;
            const statusText = networkStatus.querySelector('.status-text');
            if (statusText) {
                statusText.textContent = status === 'online' ? 'Онлайн' : 'Офлайн режим';
            }
        }

        // Show offline message
        if (status === 'offline') {
            this.showOfflineMessage();
        } else {
            this.hideOfflineMessage();
        }
    }

    showOfflineMessage() {
        let offlineMessage = document.getElementById('offline-message');
        if (!offlineMessage) {
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
        }
    }

    hideOfflineMessage() {
        const offlineMessage = document.getElementById('offline-message');
        if (offlineMessage) {
            offlineMessage.remove();
        }
    }

    handleBackButton() {
        // Handle Android back button
        console.log('📱 Нажата кнопка "Назад"');
        
        // If not on dashboard, go to dashboard
        if (window.zelenayaDolinaApp && window.zelenayaDolinaApp.currentSection !== 'dashboard') {
            window.zelenayaDolinaApp.showSection('dashboard');
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            console.log('📱 Приложение скрыто');
        } else {
            console.log('📱 Приложение видимо');
        }
    }

    // Utility methods
    vibrate(pattern = [100]) {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    }

    share(data) {
        if ('share' in navigator) {
            navigator.share(data).catch(console.error);
        }
    }

    getDeviceInfo() {
        return {
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
    }
}

// Initialize mobile optimizer
document.addEventListener('DOMContentLoaded', () => {
    window.mobileOptimizer = new MobileOptimizer();
});

// Export for global access
window.MobileOptimizer = MobileOptimizer;
