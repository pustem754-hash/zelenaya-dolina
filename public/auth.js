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
    
    // Сохранить userPhone для обратной совместимости (используем код как телефон)
    localStorage.setItem('userPhone', code);
    
    // Сохранить userData для совместимости с loadUserData() в index.html
    localStorage.setItem('userData', JSON.stringify(userData));
    
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
    localStorage.removeItem('userPhone'); // Очистить старый ключ
    localStorage.removeItem('userData'); // Очистить старый ключ
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

// 7. Мок-данные пользователей (реальные жители из Excel)
function getMockUserByCode(code) {
    const users = {
        // Реальные жители из 25.xlsx
        '2364': {
            fio: 'Фахрутдинов Артур Дмитриевич',
            fullName: 'Фахрутдинов Артур Дмитриевич',
            accountNumber: '2017502364',
            licSchet: '2017502364',
            code: '2364',
            phone: '+72017502364',
            apartment: '4',
            storage: '0',
            address: 'Рогачева ул, д. 25, корп. 1',
            fullAddress: 'г. Зеленодольск, Рогачева ул, д. 25, корп. 1, кв. 4',
            balance: 0,
            area: 65.0,
            complex_name: 'ЖК Маяк',
            building_number: '25'
        },
        '2355': {
            fio: 'Обрядин Алексей Анатольевич',
            fullName: 'Обрядин Алексей Анатольевич',
            accountNumber: '2017502355',
            licSchet: '2017502355',
            code: '2355',
            phone: '+72017502355',
            apartment: '18',
            storage: '1',
            address: 'Рогачева ул, д. 25, корп. 1',
            fullAddress: 'г. Зеленодольск, Рогачева ул, д. 25, корп. 1, кв. 18',
            balance: -850.00,
            area: 55.3,
            complex_name: 'ЖК Маяк',
            building_number: '25'
        },
        '0985': {
            fio: 'Першина Ильсияр Зиннатовна',
            fullName: 'Першина Ильсияр Зиннатовна',
            accountNumber: '2017440985',
            licSchet: '2017440985',
            code: '0985',
            phone: '+72017440985',
            apartment: '1',
            storage: '0',
            address: 'Рогачева ул, д. 25, корп. 1',
            fullAddress: 'г. Зеленодольск, Рогачева ул, д. 25, корп. 1, кв. 1',
            balance: -1200.50,
            area: 52.0,
            complex_name: 'ЖК Маяк',
            building_number: '25'
        },
        '9948': {
            fio: 'Шакиров Марат Миннахметович',
            fullName: 'Шакиров Марат Миннахметович',
            accountNumber: '2017359948',
            licSchet: '2017359948',
            code: '9948',
            phone: '+72017359948',
            apartment: '1',
            storage: '0',
            address: 'Рогачева ул, д. 25, корп. 1',
            fullAddress: 'г. Зеленодольск, Рогачева ул, д. 25, корп. 1, кв. 1',
            balance: 0,
            area: 52.0,
            complex_name: 'ЖК Маяк',
            building_number: '25'
        },
        '0994': {
            fio: 'Шакирова Миляуша Халимовна',
            fullName: 'Шакирова Миляуша Халимовна',
            accountNumber: '2017440994',
            licSchet: '2017440994',
            code: '0994',
            phone: '+72017440994',
            apartment: '2',
            storage: '0',
            address: 'Рогачева ул, д. 25, корп. 1',
            fullAddress: 'г. Зеленодольск, Рогачева ул, д. 25, корп. 1, кв. 2',
            balance: -456.00,
            area: 58.5,
            complex_name: 'ЖК Маяк',
            building_number: '25'
        },
        // Тестовые коды (для разработки)
        '1977': {
            fio: 'Иванов Иван Иванович',
            fullName: 'Иванов Иван Иванович',
            accountNumber: '25-0-1977',
            licSchet: '25-0-1977',
            code: '1977',
            phone: '+7 (960) 000-1977',
            apartment: '45',
            storage: '—',
            address: 'ЖК Маяк, д. 25, кв. 45',
            fullAddress: 'г. Зеленодольск, ЖК Маяк, д. 25, кв. 45',
            balance: -1540.00,
            area: 65.5,
            complex_name: 'ЖК Маяк',
            building_number: '25'
        },
        '0123': {
            fio: 'Петрова Анна Сергеевна',
            fullName: 'Петрова Анна Сергеевна',
            accountNumber: '1-7-0-0123',
            licSchet: '1-7-0-0123',
            code: '0123',
            phone: '+7 (960) 000-0123',
            apartment: '12',
            storage: '—',
            address: 'ЖК Зелёная долина, д. 3, кв. 12',
            fullAddress: 'г. Зеленодольск, ЖК Зелёная долина, д. 3, кв. 12',
            balance: -890.00,
            area: 52.3,
            complex_name: 'ЖК Зелёная долина',
            building_number: '3'
        },
        '1234': {
            fio: 'Сидоров Петр Васильевич',
            fullName: 'Сидоров Петр Васильевич',
            accountNumber: '25-0-1234',
            licSchet: '25-0-1234',
            code: '1234',
            phone: '+7 (960) 000-1234',
            apartment: '78',
            storage: '15',
            address: 'ЖК Маяк, д. 25, кв. 78',
            fullAddress: 'г. Зеленодольск, ЖК Маяк, д. 25, кв. 78',
            balance: 250.00,
            area: 75.2,
            complex_name: 'ЖК Маяк',
            building_number: '25'
        }
    };
    
    return users[code] || {
        fio: 'Демо Пользователь',
        fullName: 'Демо Пользователь',
        accountNumber: `DEMO-${code}`,
        licSchet: `DEMO-${code}`,
        code: code,
        phone: `+7 (960) 000-${code}`,
        apartment: '1',
        storage: '—',
        address: 'ЖК Демо, д. 1, кв. 1',
        fullAddress: 'г. Зеленодольск, ЖК Демо, д. 1, кв. 1',
        balance: 0,
        area: 50.0,
        complex_name: 'ЖК Демо',
        building_number: '1'
    };
}

console.log('[Auth] 📦 Модуль авторизации v2.0 загружен');
