// auth.js - Модуль авторизации

function isAuthenticated() {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    return authStatus;
}

function getAuthCode() {
    return localStorage.getItem('authCode');
}

function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function logout() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authCode');
    window.location.href = 'login.html';
}

// Экспорт функций в глобальную область
window.isAuthenticated = isAuthenticated;
window.getAuthCode = getAuthCode;
window.requireAuth = requireAuth;
window.logout = logout;

