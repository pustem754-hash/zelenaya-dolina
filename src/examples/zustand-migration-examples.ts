/**
 * Примеры миграции с localStorage/StorageService на Zustand Store
 * 
 * Используйте эти примеры как референс при миграции index.html
 * 
 * @project УК «Зелёная долина» v7.2.4
 */

import { useAppStore, useAuth, useMeters, useRequests, useMedia } from '../store';

// ============================================
// ПРИМЕР 1: АВТОРИЗАЦИЯ
// ============================================

// ❌ БЫЛО (localStorage):
function loginOld(code: string) {
  const user = getUserByCode(code);
  localStorage.setItem('zd_login_code', code);
  localStorage.setItem('userData', JSON.stringify(user));
}

// ✅ СТАЛО (Zustand):
function loginNew(code: string) {
  const { login } = useAppStore.getState();
  const user = getUserByCode(code);
  login(code, user);
}

// ❌ БЫЛО: Проверка авторизации
function isAuthenticatedOld(): boolean {
  const code = localStorage.getItem('zd_login_code');
  return !!code;
}

// ✅ СТАЛО:
function isAuthenticatedNew(): boolean {
  return useAppStore.getState().auth.isAuthenticated;
}

// ❌ БЫЛО: Выход
function logoutOld() {
  localStorage.removeItem('zd_login_code');
  localStorage.removeItem('userData');
  window.location.href = 'login.html';
}

// ✅ СТАЛО:
function logoutNew() {
  const { logout } = useAppStore.getState();
  logout();
  window.location.href = 'login.html';
}

// ============================================
// ПРИМЕР 2: ПОКАЗАНИЯ СЧЁТЧИКОВ
// ============================================

// ❌ БЫЛО:
function submitMetersOld(coldWater: number, hotWater: number, electricity: number, gas: number) {
  // История
  let history = JSON.parse(localStorage.getItem('metersHistory') || '[]');
  history.unshift({
    coldWater,
    hotWater,
    electricity,
    gas,
    date: new Date().toISOString(),
    timestamp: Date.now(),
  });
  if (history.length > 50) history = history.slice(0, 50);
  localStorage.setItem('metersHistory', JSON.stringify(history));
  
  // Последние показания
  localStorage.setItem('lastColdWater', String(coldWater));
  localStorage.setItem('lastHotWater', String(hotWater));
  localStorage.setItem('lastElectricity', String(electricity));
  localStorage.setItem('lastGas', String(gas));
}

// ✅ СТАЛО:
function submitMetersNew(coldWater: number, hotWater: number, electricity: number, gas: number) {
  const { addMeterReading, updateLastReading } = useAppStore.getState();
  
  // Добавляем по одному показанию для каждого типа
  ['coldWater', 'hotWater', 'electricity', 'gas'].forEach((type, index) => {
    const values = [coldWater, hotWater, electricity, gas];
    addMeterReading({
      type: type as any,
      value: values[index],
      date: new Date().toISOString(),
    });
  });
}

// ❌ БЫЛО: Чтение истории
function getMetersHistoryOld() {
  return JSON.parse(localStorage.getItem('metersHistory') || '[]');
}

// ✅ СТАЛО:
function getMetersHistoryNew() {
  return useAppStore.getState().meters.history;
}

// ❌ БЫЛО: Последние показания
function getLastReadingsOld() {
  return {
    coldWater: localStorage.getItem('lastColdWater'),
    hotWater: localStorage.getItem('lastHotWater'),
    electricity: localStorage.getItem('lastElectricity'),
    gas: localStorage.getItem('lastGas'),
  };
}

// ✅ СТАЛО:
function getLastReadingsNew() {
  return useAppStore.getState().meters.lastReadings;
}

// ============================================
// ПРИМЕР 3: ЗАЯВКИ
// ============================================

// ❌ БЫЛО:
function createRequestOld(category: string, description: string, photos: any[], videos: any[], audio: any[]) {
  const requests = JSON.parse(localStorage.getItem('requests') || '[]');
  
  const newRequest = {
    id: Date.now(),
    category,
    categoryName: getCategoryName(category),
    description,
    photos,
    videos,
    audio,
    status: 'created',
    statusName: 'Создана',
    date: new Date().toISOString(),
    dateFormatted: new Date().toLocaleString('ru-RU'),
    dispatcherPhotos: [],
  };
  
  requests.unshift(newRequest);
  localStorage.setItem('requests', JSON.stringify(requests));
  
  // Очистить медиа
  localStorage.removeItem('photos');
  localStorage.removeItem('videos');
  localStorage.removeItem('audio');
}

// ✅ СТАЛО:
function createRequestNew(category: string, description: string, photos: any[], videos: any[], audio: any[]) {
  const { addRequest } = useAppStore.getState();
  const { media } = useAppStore.getState();
  
  const newRequest = {
    id: Date.now(),
    category,
    categoryName: getCategoryName(category),
    description,
    photos: media.photos,
    videos: media.videos,
    audio: media.audio,
    status: 'created' as const,
    statusName: 'Создана',
    date: new Date().toISOString(),
    dateFormatted: new Date().toLocaleString('ru-RU'),
    dispatcherPhotos: [],
  };
  
  addRequest(newRequest);
  
  // Очистить медиа через actions (если нужно)
  // Или оставить - решение архитектурное
}

// ❌ БЫЛО: Список заявок
function getRequestsOld(filterStatus?: string) {
  const requests = JSON.parse(localStorage.getItem('requests') || '[]');
  if (!filterStatus || filterStatus === 'all') {
    return requests;
  }
  return requests.filter((r: any) => r.status === filterStatus);
}

// ✅ СТАЛО:
function getRequestsNew(filterStatus?: string) {
  const { requests } = useAppStore.getState();
  if (!filterStatus || filterStatus === 'all') {
    return requests;
  }
  return requests.filter(r => r.status === filterStatus);
}

// ============================================
// ПРИМЕР 4: ФОТО/ВИДЕО/АУДИО
// ============================================

// ❌ БЫЛО: Добавление фото
function addPhotoOld(photoData: any, type: 'request' | 'counter') {
  const storageKey = type === 'counter' ? 'counterPhotos' : 'requestPhotos';
  const photos = JSON.parse(localStorage.getItem(storageKey) || '[]');
  photos.push(photoData);
  localStorage.setItem(storageKey, JSON.stringify(photos));
}

// ✅ СТАЛО:
function addPhotoNew(photoData: any, type: 'request' | 'counter') {
  const { addPhoto } = useAppStore.getState();
  addPhoto({
    id: photoData.id || crypto.randomUUID(),
    url: photoData.data || photoData.url,
    timestamp: photoData.timestamp || Date.now(),
  }, type);
}

// ❌ БЫЛО: Удаление фото
function deletePhotoOld(id: string, type: 'request' | 'counter') {
  const storageKey = type === 'counter' ? 'counterPhotos' : 'requestPhotos';
  let photos = JSON.parse(localStorage.getItem(storageKey) || '[]');
  photos = photos.filter((p: any) => p.id !== id);
  localStorage.setItem(storageKey, JSON.stringify(photos));
}

// ✅ СТАЛО:
function deletePhotoNew(id: string, type: 'request' | 'counter') {
  const { deletePhoto } = useAppStore.getState();
  deletePhoto(id, type);
}

// ❌ БЫЛО: Рендеринг фото
function renderPhotosOld() {
  const photos = JSON.parse(localStorage.getItem('requestPhotos') || '[]');
  const container = document.getElementById('photosContainer');
  
  if (!container) return;
  
  if (photos.length === 0) {
    container.innerHTML = '<p>Нет фото</p>';
    return;
  }
  
  container.innerHTML = photos.map((photo: any) => `
    <div class="photo-item">
      <img src="${photo.data}" />
      <button onclick="deletePhoto('${photo.id}')">Удалить</button>
    </div>
  `).join('');
}

// ✅ СТАЛО:
function renderPhotosNew() {
  const { requestPhotos } = useAppStore.getState().media;
  const container = document.getElementById('photosContainer');
  
  if (!container) return;
  
  if (requestPhotos.length === 0) {
    container.innerHTML = '<p>Нет фото</p>';
    return;
  }
  
  container.innerHTML = requestPhotos.map((photo) => `
    <div class="photo-item">
      <img src="${photo.url}" />
      <button onclick="deletePhotoFromStore('${photo.id}')">Удалить</button>
    </div>
  `).join('');
}

// Глобальная функция для кнопки
(window as any).deletePhotoFromStore = (id: string) => {
  const { deletePhoto } = useAppStore.getState();
  deletePhoto(id, 'request');
  renderPhotosNew(); // Перерисовать
};

// ============================================
// ПРИМЕР 5: РЕАКТИВНЫЕ КОМПОНЕНТЫ (Subscribe)
// ============================================

// ❌ БЫЛО: Ручное обновление UI
function updateUI() {
  const user = JSON.parse(localStorage.getItem('userData') || 'null');
  if (user) {
    document.getElementById('userName')!.textContent = user.name;
  }
}

// ✅ СТАЛО: Автоматическое обновление через subscribe
function setupReactiveUI() {
  // Подписаться на изменения user
  useAppStore.subscribe(
    (state) => state.auth.user,
    (user) => {
      // Этот callback вызывается автоматически при изменении user
      if (user) {
        document.getElementById('userName')!.textContent = user.name;
      }
    }
  );
  
  // Подписаться на изменения requests
  useAppStore.subscribe(
    (state) => state.requests,
    (requests) => {
      renderRequestsList(requests);
    }
  );
  
  // Подписаться на изменения meters
  useAppStore.subscribe(
    (state) => state.meters.history,
    (history) => {
      renderMetersHistory(history);
    }
  );
}

// Вызвать при загрузке
document.addEventListener('DOMContentLoaded', () => {
  setupReactiveUI();
});

// ============================================
// ПРИМЕР 6: ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
// ============================================

// ❌ БЫЛО:
function initAppOld() {
  // Проверить авторизацию
  const code = localStorage.getItem('zd_login_code');
  if (!code) {
    window.location.href = 'login.html';
    return;
  }
  
  // Загрузить данные
  const user = JSON.parse(localStorage.getItem('userData') || 'null');
  const requests = JSON.parse(localStorage.getItem('requests') || '[]');
  const meters = JSON.parse(localStorage.getItem('metersHistory') || '[]');
  
  // Отрисовать UI
  updateUI();
  renderRequests(requests);
  renderMeters(meters);
}

// ✅ СТАЛО:
function initAppNew() {
  // Синхронизировать store с StorageService
  const { syncWithStorage, auth } = useAppStore.getState();
  syncWithStorage();
  
  // Проверить авторизацию
  if (!auth.isAuthenticated) {
    window.location.href = 'login.html';
    return;
  }
  
  // Настроить реактивность
  setupReactiveUI();
  
  // UI обновится автоматически через subscribe!
}

// ============================================
// ПРИМЕР 7: ТИПОБЕЗОПАСНЫЕ СЕЛЕКТОРЫ
// ============================================

import { selectUser, selectMetersHistory, selectActiveRequests } from '../store';

// Использование селекторов
function useTypeSafeData() {
  // Автоматическая типизация!
  const user = useAppStore(selectUser); // user: User | null
  const history = useAppStore(selectMetersHistory); // history: MeterReading[]
  const activeRequests = useAppStore(selectActiveRequests); // activeRequests: Request[]
  
  // TypeScript проверит типы
  if (user) {
    console.log(user.name.toUpperCase()); // ✅ OK
    // console.log(user.invalidField); // ❌ TypeScript error!
  }
  
  return { user, history, activeRequests };
}

// ============================================
// ХЕЛПЕР: Получение пользователя по коду
// ============================================

function getUserByCode(code: string): any {
  // Mock данные (заменить на реальный API)
  const residents: Record<string, any> = {
    '1977': {
      id: '1977',
      code: '1977',
      name: 'Иванов Иван Иванович',
      fullName: 'Иванов Иван Иванович',
      accountNumber: '25-0-1977',
      apartment: '45',
      house: '25',
    },
  };
  
  return residents[code] || null;
}

function getCategoryName(category: string): string {
  const names: Record<string, string> = {
    plumbing: 'Сантехника',
    electric: 'Электрика',
    cleaning: 'Уборка',
    other: 'Другое',
  };
  return names[category] || category;
}

// Заглушки для примера
function renderRequestsList(requests: any[]) {}
function renderMetersHistory(history: any[]) {}

console.log('📚 Zustand Migration Examples loaded');



