// ====================================
// 🔐 МОДУЛЬ АВТОРИЗАЦИИ v6.4.6
// ====================================

// Глобальная переменная для отключения расширений браузера
window.addEventListener('error', function(e) {
    if (e.message && e.message.includes('message channel closed')) {
        e.preventDefault();
        e.stopPropagation();
        console.warn('[Auth] Игнорируем ошибку расширения браузера');
        return false;
    }
});

// Отключить конфликтующие Promise от расширений
window.addEventListener('unhandledrejection', function(e) {
    if (e.reason && e.reason.message && e.reason.message.includes('message channel')) {
        e.preventDefault();
        console.warn('[Auth] Игнорируем unhandled rejection от расширения');
    }
});

// ====================================
// ПРОВЕРКА АВТОРИЗАЦИИ
// ====================================

function isAuthenticated() {
    try {
        const session = localStorage.getItem('userSession');
        if (!session) {
            console.log('[Auth] ❌ Сессия отсутствует');
            return false;
        }

        const sessionData = JSON.parse(session);
        const now = Date.now();
        const sessionAge = now - sessionData.createdAt;
        const maxAge = 24 * 60 * 60 * 1000; // 24 часа

        if (sessionAge > maxAge) {
            console.log('[Auth] ❌ Сессия истекла');
            localStorage.removeItem('userSession');
            return false;
        }

        console.log('[Auth] ✅ Сессия активна');
        return true;
    } catch (error) {
        console.error('[Auth] ❌ Ошибка проверки сессии:', error);
        return false;
    }
}

// ====================================
// ЗАЩИТА СТРАНИЦ
// ====================================

function requireAuth() {
    try {
        const currentPage = window.location.pathname.split('/').pop();
        
        // Если уже на странице логина, не редиректить
        if (currentPage === 'login.html') {
            console.log('[Auth] Уже на странице логина');
            return;
        }

        // Проверить авторизацию
        if (!isAuthenticated()) {
            console.warn('[Auth] ⚠️ Доступ запрещён, редирект на login.html');
            window.location.replace('login.html');
        } else {
            console.log('[Auth] ✅ Доступ разрешён');
        }
    } catch (error) {
        console.error('[Auth] ❌ Ошибка requireAuth:', error);
        window.location.replace('login.html');
    }
}

// ====================================
// СОЗДАНИЕ СЕССИИ
// ====================================

function createSession(phone) {
    try {
        const sessionData = {
            phone: phone,
            createdAt: Date.now(),
            isAuthenticated: true
        };
        
        localStorage.setItem('userSession', JSON.stringify(sessionData));
        console.log('[Auth] ✅ Сессия создана для:', phone);
        return true;
    } catch (error) {
        console.error('[Auth] ❌ Ошибка создания сессии:', error);
        return false;
    }
}

// ====================================
// ПОЛУЧЕНИЕ СЕССИИ
// ====================================

function getSession() {
    try {
        const session = localStorage.getItem('userSession');
        return session ? JSON.parse(session) : null;
    } catch (error) {
        console.error('[Auth] ❌ Ошибка получения сессии:', error);
        return null;
    }
}

// ====================================
// ВЫХОД
// ====================================

function logout() {
    try {
        localStorage.removeItem('userSession');
        console.log('[Auth] ✅ Пользователь вышел');
        window.location.replace('login.html');
    } catch (error) {
        console.error('[Auth] ❌ Ошибка выхода:', error);
        window.location.replace('login.html');
    }
}

// ====================================
// ЭКСПОРТ (для использования в других файлах)
// ====================================

if (typeof window !== 'undefined') {
    window.isAuthenticated = isAuthenticated;
    window.requireAuth = requireAuth;
    window.createSession = createSession;
    window.getSession = getSession;
    window.logout = logout;
}

console.log('[Auth] 🔐 Модуль авторизации v6.4.6 загружен');
