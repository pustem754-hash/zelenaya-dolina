// js/navigation.js - Навигация между страницами приложения

const PAGES = {
    home: {
        url: 'index.html',
        title: 'Главная страница',
        icon: '🏠'
    },
    payments: {
        url: 'payments.html',
        title: 'Платежи',
        icon: '💳'
    },
    meters: {
        url: 'meters.html',
        title: 'Показания счётчиков',
        icon: '📊'
    },
    requests: {
        url: 'create-request.html',
        title: 'Создать заявку',
        icon: '📝'
    },
    cameras: {
        url: 'cameras.html',
        title: 'Камеры',
        icon: '📹'
    }
};

// Определение текущей страницы
function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    
    for (let key in PAGES) {
        if (PAGES[key].url === filename) {
            return key;
        }
    }
    return 'home';
}

// Получение соседних страниц (для навигации стрелками)
function getAdjacentPages(currentPage) {
    const pageKeys = Object.keys(PAGES);
    const currentIndex = pageKeys.indexOf(currentPage);
    
    return {
        prev: currentIndex > 0 ? pageKeys[currentIndex - 1] : null,
        next: currentIndex < pageKeys.length - 1 ? pageKeys[currentIndex + 1] : null
    };
}

// Создание HTML для навигационных стрелок
function createNavigationArrows() {
    const currentPage = getCurrentPage();
    const adjacent = getAdjacentPages(currentPage);
    
    let html = '<div class="page-navigation">';
    
    // Предыдущая страница (слева)
    if (adjacent.prev) {
        const prevPage = PAGES[adjacent.prev];
        html += `
            <a href="${prevPage.url}" class="nav-arrow nav-arrow-left" title="${prevPage.title}">
                <span class="arrow">←</span>
                <span class="nav-label">${prevPage.icon} ${prevPage.title}</span>
            </a>
        `;
    }
    
    // Следующая страница (справа)
    if (adjacent.next) {
        const nextPage = PAGES[adjacent.next];
        html += `
            <a href="${nextPage.url}" class="nav-arrow nav-arrow-right" title="${nextPage.title}">
                <span class="nav-label">${nextPage.title} ${nextPage.icon}</span>
                <span class="arrow">→</span>
            </a>
        `;
    }
    
    html += '</div>';
    
    return html;
}

// Создание быстрого меню (выпадающее меню)
function createQuickMenu() {
    const currentPage = getCurrentPage();
    
    let html = '<div class="quick-menu">';
    html += '<button class="quick-menu-toggle" id="quickMenuBtn">☰ Меню</button>';
    html += '<div class="quick-menu-dropdown" id="quickMenuDropdown">';
    
    for (let key in PAGES) {
        const page = PAGES[key];
        const isActive = key === currentPage ? 'active' : '';
        html += `
            <a href="${page.url}" class="quick-menu-item ${isActive}">
                <span class="menu-icon">${page.icon}</span>
                <span class="menu-title">${page.title}</span>
            </a>
        `;
    }
    
    html += '</div>';
    html += '</div>';
    
    return html;
}

// Проверка, нужно ли пропустить обновление навигации
function shouldSkipNavigationUpdate() {
    // Пропускаем обновление навигации, если isRecording в create-request.html
    if (typeof window.isRecording !== 'undefined') {
        return window.isRecording;
    }
    return false;
}

// Инициализация навигации
function initNavigation() {
    // Проверка: пропускаем обновление навигации, если нужно
    if (shouldSkipNavigationUpdate()) {
        return;
    }
    
    // Добавление навигационных стрелок в начало body
    const navigationHTML = createNavigationArrows();
    document.body.insertAdjacentHTML('afterbegin', navigationHTML);
    
    // Добавление быстрого меню в header (если есть)
    const header = document.querySelector('header') || document.querySelector('.header');
    if (header) {
        // Добавление класса и вставка меню
        header.classList.add('with-quick-menu');
        
        const quickMenuHTML = createQuickMenu();
        header.insertAdjacentHTML('beforeend', quickMenuHTML);
        
        // Обработка кликов на кнопку меню
        const menuBtn = document.getElementById('quickMenuBtn');
        const menuDropdown = document.getElementById('quickMenuDropdown');
        
        if (menuBtn && menuDropdown) {
            menuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                menuDropdown.classList.toggle('show');
            });
            
            // Закрытие меню при клике вне его
            document.addEventListener('click', (e) => {
                if (!menuBtn.contains(e.target) && !menuDropdown.contains(e.target)) {
                    menuDropdown.classList.remove('show');
                }
            });
        }
    }
}

// Автоматическая инициализация при загрузке
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
} else {
    initNavigation();
}
