// УК Зелёная Долина - Основной JavaScript
// Версия 3.0.0 с полным логированием

class ZelenayaDolinaApp {
    constructor() {
        console.log('🔧 [ZelenayaDolinaApp] constructor() - начало');
        this.currentSection = 'dashboard';
        this.isOnline = navigator.onLine;
        console.log('🔧 [ZelenayaDolinaApp] constructor() - установлены начальные значения:', {
            currentSection: this.currentSection,
            isOnline: this.isOnline
        });
        this.init();
        console.log('✅ [ZelenayaDolinaApp] constructor() - завершено');
    }

    init() {
        console.log('🚀 [ZelenayaDolinaApp] init() - начало инициализации');
        
        try {
            console.log('📋 [ZelenayaDolinaApp] init() - настройка обработчиков событий');
            this.setupEventListeners();
            
            console.log('🌐 [ZelenayaDolinaApp] init() - настройка мониторинга сети');
            this.setupNetworkMonitoring();
            
            console.log('⏱️ [ZelenayaDolinaApp] init() - планирование показа приложения через 1 секунду');
            setTimeout(() => {
                console.log('👁️ [ZelenayaDolinaApp] init() - таймер сработал, скрываем экран загрузки');
                this.hideLoadingScreen();
                this.showApp();
            }, 1000);
            
            console.log('✅ [ZelenayaDolinaApp] init() - инициализация завершена успешно');
        } catch (error) {
            console.error('❌ [ZelenayaDolinaApp] init() - ОШИБКА при инициализации:', error);
            console.error('📊 [ZelenayaDolinaApp] init() - стек ошибки:', error.stack);
            // Все равно показать приложение
            setTimeout(() => {
                console.log('🔄 [ZelenayaDolinaApp] init() - принудительное отображение приложения');
                this.hideLoadingScreen();
                this.showApp();
            }, 500);
        }
    }

    hideLoadingScreen() {
        console.log('👁️ [ZelenayaDolinaApp] hideLoadingScreen() - начало');
        const loadingScreen = document.getElementById('loading-screen');
        console.log('🔍 [ZelenayaDolinaApp] hideLoadingScreen() - элемент найден:', !!loadingScreen);
        
        if (loadingScreen) {
            console.log('🎨 [ZelenayaDolinaApp] hideLoadingScreen() - установка opacity: 0');
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                console.log('🚫 [ZelenayaDolinaApp] hideLoadingScreen() - скрытие элемента');
                loadingScreen.style.display = 'none';
            }, 500);
        } else {
            console.warn('⚠️ [ZelenayaDolinaApp] hideLoadingScreen() - элемент #loading-screen не найден');
        }
        console.log('✅ [ZelenayaDolinaApp] hideLoadingScreen() - завершено');
    }

    showApp() {
        console.log('👁️ [ZelenayaDolinaApp] showApp() - начало');
        const app = document.getElementById('app');
        console.log('🔍 [ZelenayaDolinaApp] showApp() - элемент #app найден:', !!app);
        
        if (app) {
            console.log('🎨 [ZelenayaDolinaApp] showApp() - отображение приложения');
            app.style.display = 'block';
            app.style.opacity = '1';
            console.log('✅ [ZelenayaDolinaApp] showApp() - приложение отображено');
        } else {
            console.error('❌ [ZelenayaDolinaApp] showApp() - элемент #app не найден!');
        }
    }

    setupEventListeners() {
        console.log('📋 [ZelenayaDolinaApp] setupEventListeners() - начало настройки');
        
        // Navigation buttons
        const navItems = document.querySelectorAll('.nav-item');
        console.log('🔘 [ZelenayaDolinaApp] setupEventListeners() - найдено кнопок навигации:', navItems.length);
        
        navItems.forEach((button, index) => {
            const section = button.dataset.section;
            console.log(`🔘 [ZelenayaDolinaApp] setupEventListeners() - настройка кнопки ${index + 1}:`, section);
            button.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                console.log(`🖱️ [ZelenayaDolinaApp] setupEventListeners() - клик по кнопке навигации:`, section);
                this.showSection(section);
            });
        });

        // Request form submission
        const requestForm = document.getElementById('requestForm');
        console.log('📝 [ZelenayaDolinaApp] setupEventListeners() - форма заявки найдена:', !!requestForm);
        
        if (requestForm) {
            requestForm.addEventListener('submit', (e) => {
                console.log('📝 [ZelenayaDolinaApp] setupEventListeners() - отправка формы заявки');
                e.preventDefault();
                this.submitRequest();
            });
        }

        // Quick action buttons
        const actionButtons = document.querySelectorAll('.action-btn');
        console.log('⚡ [ZelenayaDolinaApp] setupEventListeners() - найдено кнопок быстрых действий:', actionButtons.length);
        
        actionButtons.forEach((button, index) => {
            button.addEventListener('click', (e) => {
                const action = e.currentTarget.textContent.trim();
                console.log(`⚡ [ZelenayaDolinaApp] setupEventListeners() - клик по быстрому действию ${index + 1}:`, action);
                this.handleQuickAction(action);
            });
        });

        console.log('✅ [ZelenayaDolinaApp] setupEventListeners() - настройка завершена');
    }

    setupNetworkMonitoring() {
        console.log('🌐 [ZelenayaDolinaApp] setupNetworkMonitoring() - начало настройки');
        
        window.addEventListener('online', () => {
            console.log('🌐 [ZelenayaDolinaApp] setupNetworkMonitoring() - событие: online');
            this.isOnline = true;
            this.updateNetworkStatus('online');
            console.log('✅ [ZelenayaDolinaApp] setupNetworkMonitoring() - подключение восстановлено');
        });

        window.addEventListener('offline', () => {
            console.log('📱 [ZelenayaDolinaApp] setupNetworkMonitoring() - событие: offline');
            this.isOnline = false;
            this.updateNetworkStatus('offline');
            console.log('⚠️ [ZelenayaDolinaApp] setupNetworkMonitoring() - подключение потеряно');
        });

        // Initial network status
        const initialStatus = this.isOnline ? 'online' : 'offline';
        console.log('🌐 [ZelenayaDolinaApp] setupNetworkMonitoring() - начальный статус:', initialStatus);
        this.updateNetworkStatus(initialStatus);
        
        console.log('✅ [ZelenayaDolinaApp] setupNetworkMonitoring() - настройка завершена');
    }

    updateNetworkStatus(status) {
        console.log('🌐 [ZelenayaDolinaApp] updateNetworkStatus() - начало, статус:', status);
        const networkStatus = document.getElementById('network-status');
        console.log('🔍 [ZelenayaDolinaApp] updateNetworkStatus() - элемент найден:', !!networkStatus);
        
        if (networkStatus) {
            const oldClass = networkStatus.className;
            networkStatus.className = `network-status ${status}`;
            console.log('🎨 [ZelenayaDolinaApp] updateNetworkStatus() - класс изменен:', oldClass, '->', networkStatus.className);
            
            const statusText = networkStatus.querySelector('.status-text');
            if (statusText) {
                const text = status === 'online' ? 'Онлайн' : 'Офлайн режим';
                statusText.textContent = text;
                console.log('📝 [ZelenayaDolinaApp] updateNetworkStatus() - текст обновлен:', text);
            } else {
                console.warn('⚠️ [ZelenayaDolinaApp] updateNetworkStatus() - элемент .status-text не найден');
            }
        } else {
            console.warn('⚠️ [ZelenayaDolinaApp] updateNetworkStatus() - элемент #network-status не найден');
        }
        console.log('✅ [ZelenayaDolinaApp] updateNetworkStatus() - завершено');
    }

    showSection(sectionName) {
        console.log(`📊 [ZelenayaDolinaApp] showSection() - начало, секция:`, sectionName);
        
        // Hide all sections
        const allSections = document.querySelectorAll('.content-section');
        console.log(`📊 [ZelenayaDolinaApp] showSection() - найдено секций:`, allSections.length);
        
        allSections.forEach((section, index) => {
            const wasActive = section.classList.contains('active');
            section.classList.remove('active');
            if (wasActive) {
                console.log(`📊 [ZelenayaDolinaApp] showSection() - секция ${index + 1} (${section.id}) скрыта`);
            }
        });

        // Remove active class from nav items
        const navItems = document.querySelectorAll('.nav-item');
        console.log(`📊 [ZelenayaDolinaApp] showSection() - найдено элементов навигации:`, navItems.length);
        
        navItems.forEach((item, index) => {
            const wasActive = item.classList.contains('active');
            item.classList.remove('active');
            if (wasActive) {
                console.log(`📊 [ZelenayaDolinaApp] showSection() - элемент навигации ${index + 1} деактивирован`);
            }
        });

        // Show selected section
        const targetSection = document.getElementById(sectionName);
        console.log(`📊 [ZelenayaDolinaApp] showSection() - целевая секция найдена:`, !!targetSection);
        
        if (targetSection) {
            targetSection.classList.add('active');
            console.log(`📊 [ZelenayaDolinaApp] showSection() - секция ${sectionName} активирована`);
        } else {
            console.error(`❌ [ZelenayaDolinaApp] showSection() - секция ${sectionName} не найдена!`);
        }

        // Add active class to nav item
        const navItem = document.querySelector(`[data-section="${sectionName}"]`);
        console.log(`📊 [ZelenayaDolinaApp] showSection() - элемент навигации найден:`, !!navItem);
        
        if (navItem) {
            navItem.classList.add('active');
            console.log(`📊 [ZelenayaDolinaApp] showSection() - элемент навигации для ${sectionName} активирован`);
        } else {
            console.warn(`⚠️ [ZelenayaDolinaApp] showSection() - элемент навигации для ${sectionName} не найден`);
        }

        this.currentSection = sectionName;
        console.log(`✅ [ZelenayaDolinaApp] showSection() - завершено, текущая секция:`, this.currentSection);
    }

    submitRequest() {
        console.log('📝 [ZelenayaDolinaApp] submitRequest() - начало');
        const form = document.getElementById('requestForm');
        console.log('🔍 [ZelenayaDolinaApp] submitRequest() - форма найдена:', !!form);
        
        if (!form) {
            console.error('❌ [ZelenayaDolinaApp] submitRequest() - форма не найдена!');
            return;
        }
        
        const formData = new FormData(form);
        
        const requestType = formData.get('requestType') || document.getElementById('requestType')?.value;
        const requestTitle = formData.get('requestTitle') || document.getElementById('requestTitle')?.value;
        const requestDescription = formData.get('requestDescription') || document.getElementById('requestDescription')?.value;
        const requestPriority = formData.get('requestPriority') || document.getElementById('requestPriority')?.value;
        
        console.log('📝 [ZelenayaDolinaApp] submitRequest() - данные формы:', {
            type: requestType,
            title: requestTitle,
            description: requestDescription?.substring(0, 50) + '...',
            priority: requestPriority
        });
        
        const request = {
            type: requestType,
            title: requestTitle,
            description: requestDescription,
            priority: requestPriority,
            submittedDate: new Date().toLocaleDateString('ru-RU'),
            status: 'ожидает',
            assignedTo: null,
            estimatedCompletion: null,
            attachedPhoto: window.cameraManager?.photoData || null
        };

        console.log('📝 [ZelenayaDolinaApp] submitRequest() - создан объект заявки:', {
            ...request,
            description: request.description?.substring(0, 50) + '...',
            hasPhoto: !!request.attachedPhoto
        });
        
        // Добавить заявку в список
        console.log('📝 [ZelenayaDolinaApp] submitRequest() - добавление заявки в список');
        this.addRequestToList(request);
        
        // Show success message
        const requestId = Date.now();
        console.log('📝 [ZelenayaDolinaApp] submitRequest() - номер заявки:', requestId);
        alert('✅ Заявка подана успешно! Номер заявки: #' + requestId);
        
        // Reset form
        console.log('📝 [ZelenayaDolinaApp] submitRequest() - сброс формы');
        form.reset();
        
        // Очистить фото
        if (window.cameraManager) {
            console.log('📝 [ZelenayaDolinaApp] submitRequest() - очистка фото из cameraManager');
            window.cameraManager.photoData = null;
        }
        const thumbnailContainer = document.getElementById('photoThumbnailContainer');
        if (thumbnailContainer) {
            console.log('📝 [ZelenayaDolinaApp] submitRequest() - скрытие контейнера миниатюры');
            thumbnailContainer.style.display = 'none';
        }
        
        console.log('✅ [ZelenayaDolinaApp] submitRequest() - завершено');
    }

    addRequestToList(request) {
        console.log('📋 [ZelenayaDolinaApp] addRequestToList() - начало');
        const requestsList = document.getElementById('requestsList');
        console.log('🔍 [ZelenayaDolinaApp] addRequestToList() - список найден:', !!requestsList);
        
        if (!requestsList) {
            console.error('❌ [ZelenayaDolinaApp] addRequestToList() - список заявок не найден!');
            return;
        }

        console.log('📋 [ZelenayaDolinaApp] addRequestToList() - создание элемента заявки');
        const listItem = document.createElement('div');
        listItem.className = 'list-item';
        
        // Определить класс статуса для приоритета
        const priorityClass = request.priority === 'высокий' ? 'status-high' : 
                              request.priority === 'средний' ? 'status-medium' : 'status-low';
        
        // Определить класс статуса для статуса заявки
        const statusClass = request.status === 'ожидает' ? 'status-pending' : 
                           request.status === 'в работе' ? 'status-active' : 
                           request.status === 'завершено' ? 'status-completed' : 'status-pending';
        
        console.log('📋 [ZelenayaDolinaApp] addRequestToList() - классы:', {
            priorityClass,
            statusClass
        });
        
        // Иконка фото если есть
        const photoIcon = request.attachedPhoto ? ' 📷' : '';
        console.log('📋 [ZelenayaDolinaApp] addRequestToList() - есть фото:', !!request.attachedPhoto);
        
        // Экранировать специальные символы для безопасного использования в innerHTML
        const safeTitle = this.escapeHtml(request.title);
        const safeType = this.escapeHtml(request.type);
        const safePriority = this.escapeHtml(request.priority);
        const safeDescription = this.escapeHtml(request.description);
        const safeDate = this.escapeHtml(request.submittedDate);
        
        console.log('📋 [ZelenayaDolinaApp] addRequestToList() - экранирование HTML завершено');
        
        listItem.innerHTML = `
            <h3>${safeTitle}${photoIcon} <span class="status-badge ${statusClass}">${request.status}</span></h3>
            <p><strong>Тип:</strong> ${safeType}</p>
            <p><strong>Приоритет:</strong> <span class="status-badge ${priorityClass}">${safePriority}</span></p>
            <p><strong>Квартира:</strong> №15</p>
            <p><strong>Описание:</strong> ${safeDescription}</p>
            <p><strong>Дата:</strong> ${safeDate}</p>
        `;
        
        console.log('📋 [ZelenayaDolinaApp] addRequestToList() - HTML создан, вставка в список');
        // Вставить в начало списка
        requestsList.insertBefore(listItem, requestsList.firstChild);
        console.log('✅ [ZelenayaDolinaApp] addRequestToList() - заявка добавлена в список');
    }

    handleQuickAction(action) {
        console.log('⚡ [ZelenayaDolinaApp] handleQuickAction() - начало, действие:', action);
        
        switch(action) {
            case 'Оплатить':
                console.log('⚡ [ZelenayaDolinaApp] handleQuickAction() - переход к платежам');
                this.showSection('payments');
                break;
            case 'Подать заявку':
                console.log('⚡ [ZelenayaDolinaApp] handleQuickAction() - переход к заявкам');
                this.showSection('requests');
                break;
            case 'Уведомления':
                console.log('⚡ [ZelenayaDolinaApp] handleQuickAction() - переход к уведомлениям');
                this.showSection('notifications');
                break;
            case 'Мои квартиры':
                console.log('⚡ [ZelenayaDolinaApp] handleQuickAction() - переход к квартирам');
                this.showSection('apartments');
                break;
            default:
                console.warn('⚠️ [ZelenayaDolinaApp] handleQuickAction() - неизвестное действие:', action);
        }
        
        console.log('✅ [ZelenayaDolinaApp] handleQuickAction() - завершено');
    }

    escapeHtml(text) {
        console.log('🔒 [ZelenayaDolinaApp] escapeHtml() - начало, длина текста:', text?.length || 0);
        if (!text) {
            console.log('🔒 [ZelenayaDolinaApp] escapeHtml() - текст пустой, возврат пустой строки');
            return '';
        }
        const div = document.createElement('div');
        div.textContent = text;
        const escaped = div.innerHTML;
        console.log('🔒 [ZelenayaDolinaApp] escapeHtml() - экранирование завершено');
        return escaped;
    }
}

// Global functions for HTML onclick handlers
function showSection(sectionName) {
    console.log(`🌐 [showSection] - вызов глобальной функции, секция:`, sectionName);
    if (window.zelenayaDolinaApp) {
        console.log(`🌐 [showSection] - приложение найдено, вызов метода`);
        window.zelenayaDolinaApp.showSection(sectionName);
    } else {
        console.error(`❌ [showSection] - приложение не найдено!`);
    }
}

function downloadReceipt(receiptName) {
    console.log('📄 [downloadReceipt] - начало, квитанция:', receiptName);
    alert('📄 Квитанция скачивается: ' + receiptName);
    console.log('✅ [downloadReceipt] - завершено');
}

function markAsPaid(paymentId) {
    console.log('✅ [markAsPaid] - начало, ID платежа:', paymentId);
    alert('✅ Платеж отмечен как оплаченный!');
    console.log('✅ [markAsPaid] - завершено');
}

function markAsRead(notificationId) {
    console.log('✅ [markAsRead] - начало, ID уведомления:', notificationId);
    alert('✅ Уведомление отмечено как прочитанное!');
    console.log('✅ [markAsRead] - завершено');
}

function submitCounterReading(counterId) {
    console.log('📊 [submitCounterReading] - начало, ID счетчика:', counterId);
    alert('📊 Показания счетчика переданы!');
    console.log('✅ [submitCounterReading] - завершено');
}

function removePhoto() {
    console.log('🗑️ [removePhoto] - начало');
    if (window.cameraManager) {
        console.log('🗑️ [removePhoto] - очистка фото из cameraManager');
        window.cameraManager.photoData = null;
    }
    const thumbnailContainer = document.getElementById('photoThumbnailContainer');
    if (thumbnailContainer) {
        console.log('🗑️ [removePhoto] - скрытие контейнера миниатюры');
        thumbnailContainer.style.display = 'none';
    }
    console.log('✅ [removePhoto] - завершено');
}

// Initialize app when DOM is loaded
console.log('🚀 [DOMContentLoaded] - начало инициализации приложения');
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 [DOMContentLoaded] - DOM загружен, начало инициализации');
    try {
        // Инициализация основного приложения
        console.log('🏠 [DOMContentLoaded] - создание экземпляра ZelenayaDolinaApp');
        window.zelenayaDolinaApp = new ZelenayaDolinaApp();
        console.log('✅ [DOMContentLoaded] - ZelenayaDolinaApp создан');
        
        // Инициализация камеры (если класс доступен)
        if (typeof CameraManager !== 'undefined') {
            console.log('📷 [DOMContentLoaded] - CameraManager найден, создание экземпляра');
            const cameraManager = new CameraManager();
            window.cameraManager = cameraManager;
            console.log('✅ [DOMContentLoaded] - CameraManager создан');

            // Обработчик открытия камеры
            const openCameraBtn = document.getElementById('openCameraBtn');
            console.log('📷 [DOMContentLoaded] - кнопка открытия камеры найдена:', !!openCameraBtn);
            
            if (openCameraBtn) {
                openCameraBtn.addEventListener('click', () => {
                    console.log('📷 [DOMContentLoaded] - клик по кнопке открытия камеры');
                    cameraManager.openCamera((photoData) => {
                        console.log('📷 [DOMContentLoaded] - фото получено, callback вызван');
                    });
                });
            }

            // Обработчики кнопок камеры
            const captureBtn = document.getElementById('captureBtn');
            console.log('📷 [DOMContentLoaded] - кнопка съемки найдена:', !!captureBtn);
            
            if (captureBtn) {
                captureBtn.addEventListener('click', () => {
                    console.log('📷 [DOMContentLoaded] - клик по кнопке съемки');
                    cameraManager.capturePhoto();
                });
            }

            const switchCameraBtn = document.getElementById('switchCameraBtn');
            console.log('📷 [DOMContentLoaded] - кнопка переключения камеры найдена:', !!switchCameraBtn);
            
            if (switchCameraBtn) {
                switchCameraBtn.addEventListener('click', () => {
                    console.log('📷 [DOMContentLoaded] - клик по кнопке переключения камеры');
                    cameraManager.switchCamera();
                });
            }

            const closeCameraBtn = document.getElementById('closeCameraBtn');
            console.log('📷 [DOMContentLoaded] - кнопка закрытия камеры найдена:', !!closeCameraBtn);
            
            if (closeCameraBtn) {
                closeCameraBtn.addEventListener('click', () => {
                    console.log('📷 [DOMContentLoaded] - клик по кнопке закрытия камеры');
                    cameraManager.closeCamera();
                });
            }

            const retakeBtn = document.getElementById('retakeBtn');
            console.log('📷 [DOMContentLoaded] - кнопка пересъемки найдена:', !!retakeBtn);
            
            if (retakeBtn) {
                retakeBtn.addEventListener('click', () => {
                    console.log('📷 [DOMContentLoaded] - клик по кнопке пересъемки');
                    cameraManager.retakePhoto();
                });
            }

            const usePhotoBtn = document.getElementById('usePhotoBtn');
            console.log('📷 [DOMContentLoaded] - кнопка использования фото найдена:', !!usePhotoBtn);
            
            if (usePhotoBtn) {
                usePhotoBtn.addEventListener('click', () => {
                    console.log('📷 [DOMContentLoaded] - клик по кнопке использования фото');
                    cameraManager.usePhoto();
                });
            }
        } else {
            console.warn('⚠️ [DOMContentLoaded] - CameraManager не найден. Камера недоступна.');
        }

        // Обработчик удаления фото
        const removePhotoBtn = document.getElementById('removePhotoBtn');
        console.log('🗑️ [DOMContentLoaded] - кнопка удаления фото найдена:', !!removePhotoBtn);
        
        if (removePhotoBtn) {
            removePhotoBtn.addEventListener('click', () => {
                console.log('🗑️ [DOMContentLoaded] - клик по кнопке удаления фото');
                removePhoto();
            });
        }
        
        console.log('✅ [DOMContentLoaded] - инициализация завершена успешно');
    } catch (error) {
        console.error('❌ [DOMContentLoaded] - ОШИБКА при инициализации приложения:', error);
        console.error('📊 [DOMContentLoaded] - стек ошибки:', error.stack);
        // Все равно попытаться показать приложение
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        
        console.log('🔄 [DOMContentLoaded] - попытка принудительного отображения приложения');
        
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
        
        if (app) {
            app.style.display = 'block';
            console.log('✅ [DOMContentLoaded] - приложение показано несмотря на ошибку инициализации');
        } else {
            console.error('❌ [DOMContentLoaded] - КРИТИЧЕСКАЯ ОШИБКА: элемент #app не найден!');
            document.body.innerHTML = '<div style="padding: 2rem; text-align: center; color: red;"><h2>Критическая ошибка</h2><p>Элемент приложения не найден. Проверьте файл index.html</p></div>';
        }
    }
});

// Service Worker registration - ОТКЛЮЧЕНО для GitHub Pages
// Все Service Workers удаляются через Nuclear Cleanup в index.html
console.log('✅ [app.js] - файл загружен, версия 3.0.0');
