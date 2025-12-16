# 🏪 Zustand Store - Руководство по использованию

**Проект:** УК «Зелёная долина» v7.2.4  
**Версия Store:** 1.0.0  
**Дата:** 15 декабря 2024

---

## 📋 Содержание

1. [Что такое Zustand Store](#что-такое-zustand-store)
2. [Установка и настройка](#установка-и-настройка)
3. [Структура Store](#структура-store)
4. [Примеры использования](#примеры-использования)
5. [Интеграция со StorageService](#интеграция-со-storageservice)
6. [Best Practices](#best-practices)
7. [Миграция с localStorage](#миграция-с-localstorage)

---

## Что такое Zustand Store?

**Zustand** - это минималистичная библиотека для управления состоянием в React/TypeScript приложениях.

### Преимущества перед localStorage:

| Feature | localStorage | Zustand Store |
|---------|--------------|---------------|
| **Реактивность** | ❌ Ручная | ✅ Автоматическая |
| **TypeScript** | ❌ Нет типов | ✅ Полная типизация |
| **DevTools** | ❌ Нет | ✅ Redux DevTools |
| **Performance** | 🟡 Медленно | ✅ Быстро (селекторы) |
| **Тестируемость** | ❌ Сложно | ✅ Легко |
| **Централизация** | ❌ Разбросано | ✅ Единая точка |

---

## Установка и настройка

### 1. Zustand уже установлен!

```json
// package.json
{
  "dependencies": {
    "zustand": "^4.4.7"
  }
}
```

### 2. Файлы Store:

```
src/store/
├── index.ts              # Главный store (AUTH, METERS, REQUESTS, MEDIA)
└── mainScreenStore.ts    # Store для главного экрана (опционально)
```

---

## Структура Store

### Состояния (State):

```typescript
interface AppState {
  // AUTH
  auth: {
    isAuthenticated: boolean
    loginCode: string | null
    user: User | null
  }
  
  // METERS
  meters: {
    history: MeterReading[]
    lastReadings: { coldWater, hotWater, electricity, gas }
  }
  
  // REQUESTS
  requests: Request[]
  
  // MEDIA
  media: {
    photos, videos, audio
    requestPhotos, counterPhotos, meterPhotos
  }
  
  // UI
  ui: {
    activeSection: string
    isLoading: boolean
    error: string | null
  }
}
```

### Actions (Методы):

- **Auth:** `login()`, `logout()`, `updateUser()`
- **Meters:** `addMeterReading()`, `updateLastReading()`
- **Requests:** `addRequest()`, `updateRequest()`, `deleteRequest()`
- **Media:** `addPhoto()`, `deletePhoto()`, `addVideo()`, `deleteVideo()`, `addAudio()`, `deleteAudio()`
- **UI:** `setActiveSection()`, `setLoading()`, `setError()`
- **Utility:** `clearAll()`, `syncWithStorage()`

---

## Примеры использования

### Пример 1: Авторизация

**Было (localStorage):**
```javascript
// Вход
localStorage.setItem('zd_login_code', code);
localStorage.setItem('userData', JSON.stringify(user));

// Проверка
const code = localStorage.getItem('zd_login_code');
if (code) {
  // пользователь авторизован
}

// Выход
localStorage.removeItem('zd_login_code');
localStorage.removeItem('userData');
```

**Стало (Zustand):**
```typescript
import { useAppStore, useAuth, useIsAuthenticated } from './src/store';

// Вход
const login = useAppStore((state) => state.login);
login('1977', userData);

// Проверка (реактивно!)
const isAuthenticated = useIsAuthenticated(); // auto-updates!

// Выход
const logout = useAppStore((state) => state.logout);
logout();
```

---

### Пример 2: Показания счётчиков

**Было:**
```javascript
// Добавление показания
const history = JSON.parse(localStorage.getItem('metersHistory') || '[]');
history.unshift(newReading);
localStorage.setItem('metersHistory', JSON.stringify(history));

// Чтение
const history = JSON.parse(localStorage.getItem('metersHistory') || '[]');
```

**Стало:**
```typescript
import { useMeters } from './src/store';

// Добавление (одна строка!)
const { addMeterReading } = useAppStore();
addMeterReading({
  type: 'coldWater',
  value: 125.5,
  date: new Date().toISOString(),
});

// Чтение (реактивно!)
const meters = useMeters(); // auto-updates on change!
console.log(meters.history); // Массив всех показаний
console.log(meters.lastReadings.coldWater); // Последнее показание ХВС
```

---

### Пример 3: Заявки

**Было:**
```javascript
const requests = JSON.parse(localStorage.getItem('requests') || '[]');
requests.unshift(newRequest);
localStorage.setItem('requests', JSON.stringify(requests));
```

**Стало:**
```typescript
import { useRequests } from './src/store';

// Добавление
const { addRequest } = useAppStore();
addRequest({
  id: Date.now(),
  category: 'plumbing',
  description: 'Течёт кран',
  status: 'created',
  // ...
});

// Чтение (реактивно!)
const requests = useRequests(); // Автообновление компонента!

// Фильтрация
const activeRequests = requests.filter(r => r.status !== 'completed');
```

---

### Пример 4: Фото/Видео

**Было:**
```javascript
const photos = JSON.parse(localStorage.getItem('requestPhotos') || '[]');
photos.push(photoData);
localStorage.setItem('requestPhotos', JSON.stringify(photos));
```

**Стало:**
```typescript
import { useMedia } from './src/store';

const { addPhoto, deletePhoto } = useAppStore();

// Добавление
addPhoto({
  id: crypto.randomUUID(),
  url: base64Data,
  timestamp: Date.now(),
}, 'request'); // Категория: request | counter | meter

// Удаление
deletePhoto(photoId, 'request');

// Чтение
const media = useMedia();
console.log(media.requestPhotos); // Фото для заявок
console.log(media.counterPhotos); // Фото счётчиков
```

---

### Пример 5: UI состояние

```typescript
import { useUI } from './src/store';

const { setLoading, setError, setActiveSection } = useAppStore();

// Загрузка
setLoading(true);
try {
  await fetchData();
  setLoading(false);
} catch (err) {
  setError(err.message);
  setLoading(false);
}

// Навигация
setActiveSection('meters'); // home | meters | requests | payments

// Чтение (реактивно!)
const ui = useUI();
if (ui.isLoading) {
  return <Spinner />;
}
if (ui.error) {
  return <Error message={ui.error} />;
}
```

---

## Интеграция со StorageService

**Store автоматически синхронизируется со StorageService!**

### Как это работает:

1. **Persist middleware** сохраняет состояние в StorageService
2. **Custom storage adapter** использует `window.storage` (StorageService)
3. **syncWithStorage()** загружает данные из StorageService при старте

### Инициализация:

```typescript
// В index.html или main.ts
import { useAppStore } from './src/store';

// При загрузке приложения
document.addEventListener('DOMContentLoaded', () => {
  const store = useAppStore.getState();
  
  // Загрузить данные из StorageService
  store.syncWithStorage();
  
  console.log('✅ Store синхронизирован с StorageService');
});
```

### Двусторонняя синхронизация:

```
┌─────────────┐        ┌──────────────────┐        ┌──────────────┐
│   Zustand   │ ←────→ │ StorageService   │ ←────→ │ localStorage │
│    Store    │  Auto  │  (with cache)    │  Auto  │              │
└─────────────┘        └──────────────────┘        └──────────────┘
     ↑                                                      
     │ React Components                                    
     │ (auto re-render)                                    
     ↓                                                      
```

---

## Best Practices

### ✅ DO (Делай так):

```typescript
// 1. Используй селекторы для оптимизации
import { useUser } from './src/store';

const MyComponent = () => {
  const user = useUser(); // Подписка только на user, не на весь store
  return <div>{user?.name}</div>;
};

// 2. Используй actions для изменения состояния
const { updateUser } = useAppStore();
updateUser({ name: 'Новое имя' });

// 3. Типизируй всё
const user: User | null = useUser();

// 4. Логируй изменения
console.log('Updated user:', user);
```

### ❌ DON'T (Не делай так):

```typescript
// 1. НЕ мутируй состояние напрямую
const store = useAppStore();
store.auth.user.name = 'Новое имя'; // ❌ ПЛОХО!

// 2. НЕ используй весь store если нужна только часть
const store = useAppStore(); // ❌ Плохо - подписка на всё
const user = store.auth.user;

// Правильно:
const user = useUser(); // ✅ Подписка только на user

// 3. НЕ смешивай localStorage и Zustand
localStorage.setItem('user', JSON.stringify(user)); // ❌
useAppStore().updateUser(user); // ✅

// 4. НЕ дублируй состояние
const [localUser, setLocalUser] = useState(null); // ❌ Дублирование!
const user = useUser(); // ✅ Единый источник истины
```

---

## Миграция с localStorage

### Шаг 1: Найти все localStorage вызовы

```bash
grep -r "localStorage\." public/index.html
```

### Шаг 2: Заменить на Zustand

**localStorage → Zustand:**

| localStorage | Zustand Store |
|-------------|---------------|
| `localStorage.getItem('userData')` | `useUser()` |
| `localStorage.setItem('userData', ...)` | `updateUser(...)` |
| `localStorage.getItem('metersHistory')` | `useMeters().history` |
| `localStorage.setItem('metersHistory', ...)` | `addMeterReading(...)` |
| `localStorage.getItem('requests')` | `useRequests()` |
| `localStorage.setItem('requests', ...)` | `addRequest(...)` |

### Шаг 3: Тестирование

```typescript
// Проверить что данные сохраняются
const { login } = useAppStore();
login('1977', userData);

// Обновить страницу
location.reload();

// Проверить что данные загрузились
const user = useUser();
console.log(user); // Должны быть данные!
```

---

## DevTools

### React DevTools:

1. Установи [Redux DevTools Extension](https://chrome.google.com/webstore/detail/redux-devtools)
2. Открой приложение
3. Открой DevTools → Redux tab
4. Увидишь все action и изменения состояния!

### Console API:

```javascript
// В консоли браузера:

// Получить весь store
useAppStore.getState()

// Получить пользователя
useAppStore.getState().auth.user

// Залогиниться
useAppStore.getState().login('1977', userData)

// Выйти
useAppStore.getState().logout()

// Синхронизировать с StorageService
useAppStore.getState().syncWithStorage()

// Статистика StorageService
storageStats()
```

---

## Примеры компонентов

### React Component:

```typescript
import React from 'react';
import { useAuth, useAppStore } from './src/store';

export const LoginForm: React.FC = () => {
  const [code, setCode] = React.useState('');
  const { isAuthenticated } = useAuth();
  const { login, logout } = useAppStore();
  
  if (isAuthenticated) {
    return (
      <div>
        <p>Вы авторизованы!</p>
        <button onClick={logout}>Выйти</button>
      </div>
    );
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Получить данные пользователя по коду
    const userData = getUserByCode(code);
    if (userData) {
      login(code, userData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={code} 
        onChange={(e) => setCode(e.target.value)}
        placeholder="Введите код"
      />
      <button type="submit">Войти</button>
    </form>
  );
};
```

### Vanilla JS (для index.html):

```javascript
// В index.html
<script type="module">
  import { useAppStore } from './src/store/index.ts';
  
  // Получить store
  const store = useAppStore.getState();
  
  // Подписаться на изменения
  useAppStore.subscribe((state) => {
    console.log('Store updated:', state);
    // Обновить UI вручную
    updateUI(state);
  });
  
  // Использовать actions
  function handleLogin(code) {
    const userData = getUserByCode(code);
    store.login(code, userData);
  }
  
  function handleLogout() {
    store.logout();
  }
  
  // Инициализация
  store.syncWithStorage();
</script>
```

---

## Roadmap

### ✅ Completed:

- [x] Установка Zustand
- [x] Создание централизованного store
- [x] Интеграция со StorageService
- [x] Типизация TypeScript
- [x] DevTools integration
- [x] Persist middleware

### 🔄 In Progress:

- [ ] Миграция index.html на Zustand
- [ ] Замена всех localStorage вызовов
- [ ] Создание React компонентов

### 📅 Planned:

- [ ] Оптимизация селекторов
- [ ] Middleware для логирования
- [ ] API integration (вместо mock данных)
- [ ] Real-time updates (WebSocket)

---

## Поддержка

**Вопросы?** Открой issue или спроси в чате!

**Документация Zustand:** https://docs.pmnd.rs/zustand

**Наш Store:** `src/store/index.ts`

---

**Happy coding! 🚀**




