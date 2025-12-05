// auth.js
const AUTH_CONFIG = {
  SESSION_KEY: 'userSession',
  SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 часа
  LOGIN_PAGE: 'login.html',
  HOME_PAGE: 'index.html'
};

/**
 * Проверка авторизации БЕЗ редиректа
 * @returns {boolean} true если авторизован, false если нет
 */
function isAuthenticated() {
  try {
    const sessionData = localStorage.getItem(AUTH_CONFIG.SESSION_KEY);
    
    if (!sessionData) {
      console.log('[Auth] Сессия не найдена');
      return false;
    }

    const session = JSON.parse(sessionData);
    
    // Проверка обязательных полей
    if (!session.phone || !session.userId) {
      console.log('[Auth] Сессия повреждена');
      localStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
      return false;
    }

    // Проверка срока действия (используем expiresAt или вычисляем из loginTime)
    const expiresAt = session.expiresAt || (session.loginTime + (session.expiresIn || AUTH_CONFIG.SESSION_DURATION));
    
    if (Date.now() > expiresAt) {
      console.log('[Auth] Сессия истекла');
      localStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
      return false;
    }

    console.log('[Auth] Пользователь авторизован:', session.phone);
    return true;
    
  } catch (error) {
    console.error('[Auth] Ошибка проверки авторизации:', error);
    return false;
  }
}

/**
 * Проверка авторизации С редиректом на login
 * ВАЖНО: Вызывать только после загрузки DOM!
 */
function requireAuth() {
  // Проверка: мы уже на странице логина?
  const currentPage = window.location.pathname;
  const isLoginPage = currentPage.includes('login.html') || currentPage.endsWith('login') || currentPage.endsWith('/');
  
  if (isLoginPage && !currentPage.includes('index.html')) {
    // Если на странице логина и не авторизован - остаёмся здесь
    if (isAuthenticated()) {
      console.log('[Auth] Пользователь авторизован, редирект с login на главную');
      const returnUrl = sessionStorage.getItem('returnUrl') || AUTH_CONFIG.HOME_PAGE;
      sessionStorage.removeItem('returnUrl');
      window.location.href = returnUrl;
      return true;
    }
    console.log('[Auth] Уже на странице логина, пропускаем проверку');
    return true;
  }

  // Проверка авторизации
  if (!isAuthenticated()) {
    console.log('[Auth] Пользователь не авторизован, редирект на login.html');
    
    // Сохранить текущую страницу для возврата после входа
    sessionStorage.setItem('returnUrl', window.location.pathname);
    
    // Редирект на login
    window.location.href = AUTH_CONFIG.LOGIN_PAGE;
    return false;
  }

  console.log('[Auth] Доступ разрешён');
  return true;
}

/**
 * Создание новой сессии после успешного входа
 * @param {string} phone - Номер телефона пользователя
 * @param {object} userData - Дополнительные данные пользователя
 */
function createSession(phone, userData = {}) {
  const session = {
    phone: phone,
    userId: userData.userId || generateUserId(phone),
    name: userData.name || '',
    loginTime: Date.now(),
    expiresAt: Date.now() + AUTH_CONFIG.SESSION_DURATION, // 24 часа
    ...userData
  };

  try {
    localStorage.setItem(AUTH_CONFIG.SESSION_KEY, JSON.stringify(session));
    console.log('[Auth] Сессия создана для:', phone);
    console.log('[Auth] Срок действия:', new Date(session.expiresAt).toLocaleString());
    return session;
  } catch (error) {
    console.error('[Auth] Ошибка создания сессии:', error);
    throw error;
  }
}

/**
 * Получение текущей сессии
 * @returns {object|null} Данные сессии или null
 */
function getSession() {
  try {
    const sessionData = localStorage.getItem(AUTH_CONFIG.SESSION_KEY);
    if (!sessionData) return null;
    
    return JSON.parse(sessionData);
  } catch (error) {
    console.error('[Auth] Ошибка чтения сессии:', error);
    return null;
  }
}

/**
 * Выход из системы
 */
function logout() {
  try {
    localStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
    sessionStorage.removeItem('returnUrl');
    console.log('[Auth] Пользователь вышел из системы');
    
    // Редирект на страницу входа
    window.location.href = AUTH_CONFIG.LOGIN_PAGE;
  } catch (error) {
    console.error('[Auth] Ошибка выхода:', error);
  }
}

/**
 * Генерация ID пользователя на основе телефона
 * @param {string} phone - Номер телефона
 * @returns {string} Уникальный ID
 */
function generateUserId(phone) {
  const cleanPhone = phone.replace(/\D/g, '');
  return 'user_' + cleanPhone + '_' + Date.now();
}

/**
 * Обновление срока действия сессии
 */
function refreshSession() {
  const session = getSession();
  if (!session) return false;

  session.expiresAt = Date.now() + AUTH_CONFIG.SESSION_DURATION;
  localStorage.setItem(AUTH_CONFIG.SESSION_KEY, JSON.stringify(session));
  console.log('[Auth] Сессия продлена до:', new Date(session.expiresAt).toLocaleString());
  
  return true;
}

/**
 * Показать информацию о пользователе
 */
function showUserInfo() {
  const session = getSession();
  if (session) {
    const userInfoElement = document.getElementById('userPhone');
    if (userInfoElement) {
      userInfoElement.textContent = formatPhone(session.phone);
    }
    
    const userNameElement = document.getElementById('userName');
    if (userNameElement && session.name) {
      userNameElement.textContent = session.name.split(' ')[0];
    }
  }
}

/**
 * Форматирование телефона
 */
function formatPhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
  }
  return phone;
}

// Автоматическое продление сессии при активности
let activityTimer;

function resetActivityTimer() {
  clearTimeout(activityTimer);
  activityTimer = setTimeout(() => {
    if (isAuthenticated()) {
      refreshSession();
    }
  }, 30 * 60 * 1000); // Продлевать каждые 30 минут активности
}

// Слушатели активности (только если DOM доступен)
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', resetActivityTimer);
    document.addEventListener('keypress', resetActivityTimer);
    document.addEventListener('scroll', resetActivityTimer);
  });
}
