// auth.js - Система авторизации УК "Зелёная долина" v2.0

const AUTH_STORAGE_KEY = 'zd_isAuthenticated';
const AUTH_CODE_KEY = 'zd_login_code';
const USER_DATA_KEY = 'zd_user_data';

// 1. Сохранить успешный вход
function saveAuth(code) {
    localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    localStorage.setItem(AUTH_CODE_KEY, code);
    
    const userData = getMockUserByCode(code);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    
    console.log('[Auth] ✅ Авторизация сохранена, код:', code);
}

// 2. Проверить авторизацию
function isAuthenticated() {
    return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
}

// 3. Получить сохранённый код
function getLoginCode() {
    return localStorage.getItem(AUTH_CODE_KEY);
}

// 4. Получить данные пользователя
function getUserData() {
    const data = localStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
}

// 5. Выйти из системы
function logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_CODE_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    console.log('[Auth] 🚪 Выход из системы');
    window.location.href = 'login.html';
}

// 6. Защита страниц
function requireAuth() {
    if (!isAuthenticated()) {
        console.log('[Auth] ❌ Пользователь не авторизован → login.html');
        window.location.href = 'login.html';
        return false;
    }
    console.log('[Auth] ✅ Пользователь авторизован, код:', getLoginCode());
    return true;
}

// 7. Мок-данные пользователей
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
                balance: 250.00,
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

console.log('[Auth] 📦 Модуль авторизации v2.0 загружен');
