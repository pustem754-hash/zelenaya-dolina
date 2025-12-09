// auth.js - Модуль авторизации
console.log('[Auth] 📱 Модуль авторизации загружен');

function isAuthenticated() {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    console.log('[Auth] Проверка авторизации:', authStatus);
    return authStatus;
}

function getAuthCode() {
    return localStorage.getItem('authCode');
}

function requireAuth() {
    console.log('[Auth] requireAuth вызван');
    if (!isAuthenticated()) {
        console.log('[Auth] ❌ Не авторизован, редирект на login.html');
        window.location.href = 'login.html';
        return false;
    }
    console.log('[Auth] ✅ Авторизован');
    return true;
}

function logout() {
    console.log('[Auth] 🚪 Выход из системы');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authCode');
    window.location.href = 'login.html';
}

// Экспорт функций в глобальную область
window.isAuthenticated = isAuthenticated;
window.getAuthCode = getAuthCode;
window.requireAuth = requireAuth;
window.logout = logout;

console.log('[Auth] ✅ Функции авторизации экспортированы');
