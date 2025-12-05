// auth.js
const AUTH_CONFIG = {
  SESSION_KEY: 'userSession',
  SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 часа
  LOGIN_PAGE: 'login.html',
  HOME_PAGE: 'index.html'
};

// Проверка авторизации (НЕ редиректит автоматически)
function isAuthenticated() {
  try {
    const session = localStorage.getItem(AUTH_CONFIG.SESSION_KEY);
    if (!session) return false;
    
    const sessionData = JSON.parse(session);
    const isExpired = Date.now() > (sessionData.loginTime + AUTH_CONFIG.SESSION_DURATION);
    
    if (isExpired) {
      localStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
}

// Проверка авторизации с редиректом (только для защищённых страниц)
function requireAuth() {
  const currentPage = window.location.pathname.split('/').pop();
  
  // Если уже на странице login.html, не редиректим
  if (currentPage === AUTH_CONFIG.LOGIN_PAGE) {
    // Если авторизован, редирект на главную
    if (isAuthenticated()) {
      window.location.href = AUTH_CONFIG.HOME_PAGE;
    }
    return;
  }
  
  // Для всех остальных страниц - проверяем авторизацию
  if (!isAuthenticated()) {
    window.location.href = AUTH_CONFIG.LOGIN_PAGE;
  }
}

// Получить данные сессии
function getSession() {
  try {
    const session = localStorage.getItem(AUTH_CONFIG.SESSION_KEY);
    return session ? JSON.parse(session) : null;
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
}

// Создать сессию
function createSession(phone) {
  const session = {
    phone: phone,
    userId: generateUserId(phone),
    loginTime: Date.now(),
    expiresIn: AUTH_CONFIG.SESSION_DURATION
  };
  
  localStorage.setItem(AUTH_CONFIG.SESSION_KEY, JSON.stringify(session));
  return session;
}

// Выход из системы
function logout() {
  localStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
  window.location.href = AUTH_CONFIG.LOGIN_PAGE;
}

// Генерация userId из телефона
function generateUserId(phone) {
  return 'user_' + phone.replace(/\D/g, '');
}

// Показать информацию о пользователе
function showUserInfo() {
  const session = getSession();
  if (session) {
    const userInfoElement = document.getElementById('userPhone');
    if (userInfoElement) {
      userInfoElement.textContent = formatPhone(session.phone);
    }
  }
}

// Форматирование телефона
function formatPhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
  }
  return phone;
}

