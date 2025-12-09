// ===== АВТОРИЗАЦИЯ И АУТЕНТИФИКАЦИЯ =====

console.log('[Auth] 📱 Модуль авторизации загружен');

// Проверка авторизации
function isAuthenticated() {
    try {
        const userData = localStorage.getItem('userData');
        const authToken = localStorage.getItem('authToken');
        
        if (!userData || !authToken) {
            console.log('[Auth] ❌ Нет данных авторизации');
            return false;
        }
        
        const user = JSON.parse(userData);
        if (!user || !user.fio || !user.code) {
            console.log('[Auth] ❌ Некорректные данные пользователя');
            localStorage.clear();
            return false;
        }
        
        console.log('[Auth] ✅ Пользователь авторизован:', user.fio);
        return true;
    } catch (error) {
        console.error('[Auth] ❌ Ошибка проверки авторизации:', error);
        localStorage.clear();
        return false;
    }
}

// Требование авторизации
function requireAuth() {
    console.log('[Auth] 🔍 Проверка авторизации...');
    
    try {
        // Если мы на странице login.html - не проверяем
        if (window.location.pathname.includes('login.html')) {
            console.log('[Auth] ℹ️ Страница авторизации - пропускаем проверку');
            return true;
        }
        
        if (!isAuthenticated()) {
            console.log('[Auth] 🚫 Не авторизован - редирект на login.html');
            window.location.href = 'login.html';
            return false;
        }
        
        console.log('[Auth] ✅ Авторизация пройдена');
        return true;
    } catch (error) {
        console.error('[Auth] ❌ Ошибка requireAuth:', error);
        window.location.href = 'login.html';
        return false;
    }
}

// Выход из системы
function logout() {
    console.log('[Auth] 🚪 Выход из системы');
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = 'login.html';
}

// Получение текущего пользователя
function getCurrentUser() {
    try {
        const userData = localStorage.getItem('userData');
        if (!userData) return null;
        return JSON.parse(userData);
    } catch (error) {
        console.error('[Auth] ❌ Ошибка получения пользователя:', error);
        return null;
    }
}

// Экспорт функций
if (typeof window !== 'undefined') {
    window.isAuthenticated = isAuthenticated;
    window.requireAuth = requireAuth;
    window.logout = logout;
    window.getCurrentUser = getCurrentUser;
    
    console.log('[Auth] ✅ Функции авторизации экспортированы');
}
