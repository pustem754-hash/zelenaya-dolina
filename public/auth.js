// auth.js - Система авторизации УК "Зелёная долина" v2.0

// Ключи для localStorage  
const AUTH_STORAGE_KEY = 'zd_isAuthenticated';
const AUTH_CODE_KEY = 'zd_login_code';
const USER_DATA_KEY = 'zd_user_data';

// Сохранить успешный вход
function saveAuth(code) {
    localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    localStorage.setItem(AUTH_CODE_KEY, code);
    
    // Получить и сохранить данные пользователя
    const userData = getMockUserByCode(code);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
}

// Проверить авторизацию
function isAuthenticated() {
    return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
}

// Получить сохраненный код
function getLoginCode() {
    return localStorage.getItem(AUTH_CODE_KEY);
}

// Получить данные пользователя
function getUserData() {
    const data = localStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
}

// Выйти из системы
function logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_CODE_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    window.location.href = 'login.html';
}

// Защита страниц
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Мок-данные пользователей
function getMockUserByCode(code) {
    const users = {
        '1977': {
            account_number: '25-0-1977',
            full_name: 'Иванов Иван Иванович',
            apartment: {
                complex_name: 'ЖК Маяк',
                building_number: '25',
                apartment_number: '45',
                balance: -1540.00,
                area: 65.5
            }
        },
        '0123': {
            account_number: '1-7-0-0123',
            full_name: 'Петрова Анна Сергеевна',
            apartment: {
                complex_name: 'ЖК Зелёная долина',
                building_number: '3',
                apartment_number: '12',
                balance: -890.00,
                area: 52.3
            }
        },
        '1234': {
            account_number: '25-0-1234',
            full_name: 'Сидоров Петр Васильевич',
            apartment: {
                complex_name: 'ЖК Маяк',
                building_number: '25',
                apartment_number: '78',
                balance: 0,
                area: 75.2
            }
        }
    };
    
    return users[code] || {
        account_number: `DEMO-${code}`,
        full_name: 'Демо Пользователь',
        apartment: {
            complex_name: 'ЖК Демо',
            building_number: '1',
            apartment_number: '1',
            balance: 0,
            area: 50.0
        }
    };
}

// Экспорт функций в глобальную область
if (typeof window !== 'undefined') {
    window.saveAuth = saveAuth;
    window.isAuthenticated = isAuthenticated;
    window.getLoginCode = getLoginCode;
    window.getUserData = getUserData;
    window.logout = logout;
    window.requireAuth = requireAuth;
}

