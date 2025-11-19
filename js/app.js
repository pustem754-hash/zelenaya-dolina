// УК Зелёная Долина - Основной JavaScript

class ZelenayaDolinaApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.isOnline = navigator.onLine;
        this.init();
    }

    init() {
        console.log('🏠 УК Зелёная Долина - инициализация...');
        
        try {
            // Setup event listeners
            this.setupEventListeners();
            
            // Setup network monitoring
            this.setupNetworkMonitoring();
            
            // Hide loading screen and show app
            setTimeout(() => {
                this.hideLoadingScreen();
                this.showApp();
            }, 1000);
            
            console.log('✅ УК Зелёная Долина - инициализировано успешно');
        } catch (error) {
            console.error('Ошибка при инициализации:', error);
            // Все равно показать приложение
            setTimeout(() => {
                this.hideLoadingScreen();
                this.showApp();
            }, 500);
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    showApp() {
        const app = document.getElementById('app');
        if (app) {
            app.style.display = 'block';
            app.style.opacity = '1';
        } else {
            console.error('Элемент #app не найден!');
        }
    }

    setupEventListeners() {
        // Navigation buttons
        document.querySelectorAll('.nav-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.showSection(section);
            });
        });

        // Request form submission
        const requestForm = document.getElementById('requestForm');
        if (requestForm) {
            requestForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitRequest();
            });
        }

        // Quick action buttons
        document.querySelectorAll('.action-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.currentTarget.textContent.trim();
                this.handleQuickAction(action);
            });
        });

    }

    setupNetworkMonitoring() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.updateNetworkStatus('online');
            console.log('🌐 Подключение к интернету восстановлено');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.updateNetworkStatus('offline');
            console.log('📱 Подключение к интернету потеряно');
        });

        // Initial network status
        this.updateNetworkStatus(this.isOnline ? 'online' : 'offline');
    }

    updateNetworkStatus(status) {
        const networkStatus = document.getElementById('network-status');
        if (networkStatus) {
            networkStatus.className = `network-status ${status}`;
            networkStatus.querySelector('.status-text').textContent = 
                status === 'online' ? 'Онлайн' : 'Офлайн режим';
        }
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Add active class to nav item
        const navItem = document.querySelector(`[data-section="${sectionName}"]`);
        if (navItem) {
            navItem.classList.add('active');
        }

        this.currentSection = sectionName;
        console.log(`📊 Переход к разделу: ${sectionName}`);
    }

    submitRequest() {
        const form = document.getElementById('requestForm');
        const formData = new FormData(form);
        
        const request = {
            type: formData.get('requestType') || document.getElementById('requestType').value,
            title: formData.get('requestTitle') || document.getElementById('requestTitle').value,
            description: formData.get('requestDescription') || document.getElementById('requestDescription').value,
            priority: formData.get('requestPriority') || document.getElementById('requestPriority').value,
            submittedDate: new Date().toLocaleDateString('ru-RU'),
            status: 'ожидает',
            assignedTo: null,
            estimatedCompletion: null,
            attachedPhoto: window.cameraManager?.photoData || null // Сохранить фото в base64
        };

        console.log('📝 Подача заявки:', request);
        
        // Добавить заявку в список
        this.addRequestToList(request);
        
        // Show success message
        alert('✅ Заявка подана успешно! Номер заявки: #' + Date.now());
        
        // Reset form
        form.reset();
        
        // Очистить фото
        if (window.cameraManager) {
            window.cameraManager.photoData = null;
        }
        const thumbnailContainer = document.getElementById('photoThumbnailContainer');
        if (thumbnailContainer) {
            thumbnailContainer.style.display = 'none';
        }
    }

    // Добавить заявку в список
    addRequestToList(request) {
        const requestsList = document.getElementById('requestsList');
        if (!requestsList) return;

        const listItem = document.createElement('div');
        listItem.className = 'list-item';
        
        // Определить класс статуса для приоритета
        const priorityClass = request.priority === 'высокий' ? 'status-high' : 
                              request.priority === 'средний' ? 'status-medium' : 'status-low';
        
        // Определить класс статуса для статуса заявки
        const statusClass = request.status === 'ожидает' ? 'status-pending' : 
                           request.status === 'в работе' ? 'status-active' : 
                           request.status === 'завершено' ? 'status-completed' : 'status-pending';
        
        // Иконка фото если есть
        const photoIcon = request.attachedPhoto ? ' 📷' : '';
        
        // Экранировать специальные символы для безопасного использования в innerHTML
        const safeTitle = this.escapeHtml(request.title);
        const safeType = this.escapeHtml(request.type);
        const safePriority = this.escapeHtml(request.priority);
        const safeDescription = this.escapeHtml(request.description);
        const safeDate = this.escapeHtml(request.submittedDate);
        
        listItem.innerHTML = `
            <h3>${safeTitle}${photoIcon} <span class="status-badge ${statusClass}">${request.status}</span></h3>
            <p><strong>Тип:</strong> ${safeType}</p>
            <p><strong>Приоритет:</strong> <span class="status-badge ${priorityClass}">${safePriority}</span></p>
            <p><strong>Квартира:</strong> №15</p>
            <p><strong>Описание:</strong> ${safeDescription}</p>
            <p><strong>Дата:</strong> ${safeDate}</p>
        `;
        
        // Вставить в начало списка
        requestsList.insertBefore(listItem, requestsList.firstChild);
    }

    handleQuickAction(action) {
        console.log('⚡ Быстрое действие:', action);
        
        switch(action) {
            case 'Оплатить':
                this.showSection('payments');
                break;
            case 'Подать заявку':
                this.showSection('requests');
                break;
            case 'Уведомления':
                this.showSection('notifications');
                break;
            case 'Мои квартиры':
                this.showSection('apartments');
                break;
        }
    }

    // Экранирование HTML для безопасности
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Global functions for HTML onclick handlers
function showSection(sectionName) {
    if (window.zelenayaDolinaApp) {
        window.zelenayaDolinaApp.showSection(sectionName);
    }
}

function downloadReceipt(receiptName) {
    console.log('📄 Скачивание квитанции:', receiptName);
    alert('📄 Квитанция скачивается: ' + receiptName);
}

function markAsPaid(paymentId) {
    console.log('✅ Отметка платежа как оплаченного:', paymentId);
    alert('✅ Платеж отмечен как оплаченный!');
}

function markAsRead(notificationId) {
    console.log('✅ Отметка уведомления как прочитанного:', notificationId);
    alert('✅ Уведомление отмечено как прочитанное!');
}

function submitCounterReading(counterId) {
    console.log('📊 Передача показаний счетчика:', counterId);
    alert('📊 Показания счетчика переданы!');
}

function removePhoto() {
    if (window.cameraManager) {
        window.cameraManager.photoData = null;
    }
    const thumbnailContainer = document.getElementById('photoThumbnailContainer');
    if (thumbnailContainer) {
        thumbnailContainer.style.display = 'none';
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Инициализация основного приложения
        window.zelenayaDolinaApp = new ZelenayaDolinaApp();
        
        // Инициализация камеры (если класс доступен)
        if (typeof CameraManager !== 'undefined') {
            const cameraManager = new CameraManager();
            window.cameraManager = cameraManager;

            // Обработчик открытия камеры
            const openCameraBtn = document.getElementById('openCameraBtn');
            if (openCameraBtn) {
                openCameraBtn.addEventListener('click', () => {
                    cameraManager.openCamera((photoData) => {
                        // Фото уже обработано в usePhoto()
                    });
                });
            }

            // Обработчики кнопок камеры
            const captureBtn = document.getElementById('captureBtn');
            if (captureBtn) {
                captureBtn.addEventListener('click', () => {
                    cameraManager.capturePhoto();
                });
            }

            const switchCameraBtn = document.getElementById('switchCameraBtn');
            if (switchCameraBtn) {
                switchCameraBtn.addEventListener('click', () => {
                    cameraManager.switchCamera();
                });
            }

            const closeCameraBtn = document.getElementById('closeCameraBtn');
            if (closeCameraBtn) {
                closeCameraBtn.addEventListener('click', () => {
                    cameraManager.closeCamera();
                });
            }

            const retakeBtn = document.getElementById('retakeBtn');
            if (retakeBtn) {
                retakeBtn.addEventListener('click', () => {
                    cameraManager.retakePhoto();
                });
            }

            const usePhotoBtn = document.getElementById('usePhotoBtn');
            if (usePhotoBtn) {
                usePhotoBtn.addEventListener('click', () => {
                    cameraManager.usePhoto();
                });
            }
        } else {
            console.warn('CameraManager не найден. Камера недоступна.');
        }

        // Обработчик удаления фото
        const removePhotoBtn = document.getElementById('removePhotoBtn');
        if (removePhotoBtn) {
            removePhotoBtn.addEventListener('click', () => {
                removePhoto();
            });
        }
    } catch (error) {
        console.error('Ошибка при инициализации приложения:', error);
        // Все равно попытаться показать приложение
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
        
        if (app) {
            app.style.display = 'block';
            console.log('Приложение показано несмотря на ошибку инициализации');
        } else {
            console.error('Критическая ошибка: элемент #app не найден!');
            document.body.innerHTML = '<div style="padding: 2rem; text-align: center; color: red;"><h2>Критическая ошибка</h2><p>Элемент приложения не найден. Проверьте файл index.html</p></div>';
        }
    }
});

// Service Worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('✅ Service Worker зарегистрирован:', registration.scope);
            })
            .catch(error => {
                console.log('❌ Service Worker регистрация не удалась:', error);
            });
    });
}
