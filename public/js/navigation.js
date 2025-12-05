// js/navigation.js - Единая навигация для всех страниц

const PAGES = {
    home: {
        url: 'index.html',
        title: 'Главная',
        icon: '🏠'
    },
    payments: {
        url: 'payments.html',
        title: 'Платежи',
        icon: '💳'
    },
    meters: {
        url: 'meters.html',
        title: 'Счётчики',
        icon: '📊'
    },
    requests: {
        url: 'create-request.html',
        title: 'Заявки',
        icon: '📝'
    },
    cameras: {
        url: 'cameras.html',
        title: 'Камеры',
        icon: '📹'
    }
};

// Определить текущую страницу
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

// Получить соседние страницы (предыдущая и следующая)
function getAdjacentPages(currentPage) {
    const pageKeys = Object.keys(PAGES);
    const currentIndex = pageKeys.indexOf(currentPage);
    
    return {
        prev: currentIndex > 0 ? pageKeys[currentIndex - 1] : null,
        next: currentIndex < pageKeys.length - 1 ? pageKeys[currentIndex + 1] : null
    };
}

// Создать HTML для навигационных стрелок
function createNavigationArrows() {
    const currentPage = getCurrentPage();
    const adjacent = getAdjacentPages(currentPage);
    
    let html = '<div class="page-navigation">';
    
    // Стрелка назад (предыдущая страница)
    if (adjacent.prev) {
        const prevPage = PAGES[adjacent.prev];
        html += `
            <a href="${prevPage.url}" class="nav-arrow nav-arrow-left" title="${prevPage.title}">
                <span class="arrow">←</span>
                <span class="nav-label">${prevPage.icon} ${prevPage.title}</span>
            </a>
        `;
    }
    
    // Стрелка вперед (следующая страница)
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

// Создать быстрое меню (все страницы)
function createQuickMenu() {
    const currentPage = getCurrentPage();
    
    let html = '<div class="quick-menu">';
    html += '<button class="quick-menu-toggle" id="quickMenuBtn">☰ Навигация</button>';
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

// Не обновлять навигацию во время записи аудио
function shouldSkipNavigationUpdate() {
    // Проверяем глобальную переменную isRecording из create-request.html
    if (typeof window.isRecording !== 'undefined') {
        return window.isRecording;
    }
    return false;
}

// Инициализация навигации
function initNavigation() {
    // Проверка: не обновлять навигацию во время записи аудио
    if (shouldSkipNavigationUpdate()) {
        console.log('[Navigation] Пропуск обновления навигации (идёт запись аудио)');
        return;
    }
    
    // Добавить стрелки навигации в начало body
    const navigationHTML = createNavigationArrows();
    document.body.insertAdjacentHTML('afterbegin', navigationHTML);
    
    // Добавить быстрое меню в header (если есть)
    const header = document.querySelector('header') || document.querySelector('.header');
    if (header) {
        // Добавить класс для стилизации
        header.classList.add('with-quick-menu');
        
        const quickMenuHTML = createQuickMenu();
        header.insertAdjacentHTML('beforeend', quickMenuHTML);
        
        // Добавить обработчик для открытия/закрытия меню
        const menuBtn = document.getElementById('quickMenuBtn');
        const menuDropdown = document.getElementById('quickMenuDropdown');
        
        if (menuBtn && menuDropdown) {
            menuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                menuDropdown.classList.toggle('show');
            });
            
            // Закрыть меню при клике вне его
            document.addEventListener('click', (e) => {
                if (!menuBtn.contains(e.target) && !menuDropdown.contains(e.target)) {
                    menuDropdown.classList.remove('show');
                }
            });
        }
    }
}

// Автоматическая инициализация при загрузке страницы
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
} else {
    initNavigation();
}

