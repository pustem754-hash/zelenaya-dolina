// УК Зелёная Долина - Основной JavaScript

class ZelenayaDolinaApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.isOnline = navigator.onLine;
        this.init();
    }

    init() {
        console.log('🏠 УК Зелёная Долина - инициализация...');
        
        // Hide loading screen and show app
        setTimeout(() => {
            this.hideLoadingScreen();
            this.showApp();
        }, 2000);

        // Setup event listeners
        this.setupEventListeners();
        
        // Setup network monitoring
        this.setupNetworkMonitoring();
        
        console.log('✅ УК Зелёная Долина - инициализировано успешно');
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
            estimatedCompletion: null
        };

        console.log('📝 Подача заявки:', request);
        
        // Show success message
        alert('✅ Заявка подана успешно! Номер заявки: #' + Date.now());
        
        // Reset form
        form.reset();
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

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.zelenayaDolinaApp = new ZelenayaDolinaApp();
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
