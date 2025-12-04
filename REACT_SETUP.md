# 🚀 Установка и запуск React-компонента HomeScreen

Полная инструкция по интеграции компонента главного экрана в проект React + Tailwind CSS

---

## 📋 Содержание

1. [Быстрый старт](#быстрый-старт)
2. [Структура проекта](#структура-проекта)
3. [Установка зависимостей](#установка-зависимостей)
4. [Настройка Tailwind CSS](#настройка-tailwind-css)
5. [Запуск приложения](#запуск-приложения)
6. [Интеграция с существующим проектом](#интеграция-с-существующим-проектом)
7. [Примеры использования](#примеры-использования)
8. [Решение проблем](#решение-проблем)

---

## 🎯 Быстрый старт

### Вариант 1: Новый React-проект с Create React App

```bash
# 1. Создайте новый React-проект
npx create-react-app uk-zelenaya-dolina
cd uk-zelenaya-dolina

# 2. Установите Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 3. Скопируйте файлы компонента
cp /workspace/src/components/HomeScreen.jsx ./src/components/
cp /workspace/src/index.css ./src/
cp /workspace/src/tailwind.config.js ./

# 4. Обновите src/index.js
# (используйте код из /workspace/src/index.jsx)

# 5. Запустите приложение
npm start
```

### Вариант 2: Использование готовой структуры

```bash
# 1. Перейдите в директорию src
cd /workspace/src

# 2. Установите зависимости
npm install

# 3. Запустите dev-сервер
npm start
```

---

## 📁 Структура проекта

После установки ваш проект должен иметь следующую структуру:

```
uk-zelenaya-dolina/
├── node_modules/
├── public/
│   ├── index.html              # HTML шаблон
│   ├── manifest.json           # PWA манифест
│   └── icons/                  # Иконки приложения
│       ├── icon-192x192.png
│       ├── icon-512x512.png
│       └── ...
├── src/
│   ├── components/
│   │   ├── HomeScreen.jsx      # 🎯 Главный компонент
│   │   ├── HomeScreen.example.jsx
│   │   └── README.md           # Документация компонента
│   ├── index.css               # Tailwind CSS импорты
│   ├── index.jsx               # Точка входа
│   ├── App.jsx                 # (опционально)
│   └── tailwind.config.js      # Конфигурация Tailwind
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## 📦 Установка зависимостей

### Основные зависимости

```bash
npm install react react-dom react-scripts
```

### Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
```

### React Router (опционально, для навигации)

```bash
npm install react-router-dom
```

### package.json

Ваш `package.json` должен содержать:

```json
{
  "name": "uk-zelenaya-dolina-react",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "react-scripts": "5.0.1"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

---

## 🎨 Настройка Tailwind CSS

### 1. Создайте tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'uk-primary': '#10b981',     // emerald-500
        'uk-primary-dark': '#059669', // emerald-600
      },
    },
  },
  plugins: [],
}
```

### 2. Обновите src/index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Дополнительные стили */
body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### 3. Импортируйте в src/index.jsx

```javascript
import './index.css';
```

---

## ▶️ Запуск приложения

### Development режим

```bash
npm start
```

Приложение откроется в браузере по адресу: `http://localhost:3000`

### Production сборка

```bash
npm run build
```

Оптимизированная сборка будет создана в папке `build/`

### Запуск production сборки локально

```bash
# Установите serve
npm install -g serve

# Запустите сборку
serve -s build -p 3000
```

---

## 🔗 Интеграция с существующим проектом

### Шаг 1: Скопируйте компонент

```bash
cp /workspace/src/components/HomeScreen.jsx ./src/components/
```

### Шаг 2: Импортируйте в ваше приложение

```jsx
import HomeScreen from './components/HomeScreen';

function App() {
  return (
    <div className="App">
      <HomeScreen />
    </div>
  );
}

export default App;
```

### Шаг 3: Настройте маршрутизацию (если используете React Router)

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        {/* Другие маршруты */}
      </Routes>
    </Router>
  );
}
```

---

## 💡 Примеры использования

### Базовое использование

```jsx
import HomeScreen from './components/HomeScreen';

function App() {
  return <HomeScreen />;
}
```

### С кастомными данными (через пропсы)

Если вы хотите передавать данные через пропсы, модифицируйте компонент:

```jsx
// Было:
const [userData] = useState({ firstName: "Иван", lastName: "Иванов" });

// Стало:
const HomeScreen = ({ userData, mainStats, quickActions, notifications }) => {
  // ... используйте переданные данные
};
```

Использование:

```jsx
const customData = {
  userData: { firstName: "Мария", lastName: "Петрова" },
  mainStats: { amountDue: 3500, dueDate: "15 июня", activeRequests: 1, newNotifications: 5 }
};

<HomeScreen {...customData} />
```

### С Context API

```jsx
import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

function AppProvider({ children }) {
  const [userData, setUserData] = useState({
    firstName: "Иван",
    lastName: "Иванов"
  });

  return (
    <AppContext.Provider value={{ userData, setUserData }}>
      {children}
    </AppContext.Provider>
  );
}

// В HomeScreen используйте:
const { userData } = useContext(AppContext);
```

---

## 🐛 Решение проблем

### ❌ Tailwind стили не применяются

**Причина**: Неправильная конфигурация Tailwind CSS

**Решение**:

1. Проверьте `tailwind.config.js`:
   ```javascript
   content: ["./src/**/*.{js,jsx,ts,tsx}"]
   ```

2. Убедитесь, что импортировали CSS:
   ```javascript
   import './index.css';
   ```

3. Перезапустите dev-сервер:
   ```bash
   npm start
   ```

### ❌ Module not found: Can't resolve 'react'

**Причина**: React не установлен

**Решение**:

```bash
npm install react react-dom
```

### ❌ Компонент не рендерится

**Причина**: Ошибки в коде или неправильный импорт

**Решение**:

1. Откройте консоль браузера (F12)
2. Проверьте ошибки
3. Убедитесь в правильности импорта:
   ```javascript
   import HomeScreen from './components/HomeScreen';
   ```

### ❌ npm start не работает

**Причина**: Отсутствует react-scripts

**Решение**:

```bash
npm install react-scripts --save
```

### ❌ Порт 3000 уже занят

**Решение**:

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [номер_процесса] /F

# Linux/Mac
lsof -i :3000
kill -9 [PID]

# Или используйте другой порт
PORT=3001 npm start
```

---

## 🎨 Кастомизация

### Изменение цветовой схемы

В `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      'uk-primary': '#3b82f6',      // Синий вместо зеленого
      'uk-primary-dark': '#2563eb',
    },
  },
}
```

В `HomeScreen.jsx` замените:
- `emerald-500` → `blue-500`
- `emerald-600` → `blue-600`
- `emerald-700` → `blue-700`

### Добавление новых секций

```jsx
{/* Новая секция */}
<section>
  <h2 className="text-2xl font-bold text-gray-800 mb-4">
    Мои квартиры
  </h2>
  <div className="bg-white rounded-xl shadow-md p-6">
    {/* Контент секции */}
  </div>
</section>
```

---

## 📱 Тестирование на мобильных устройствах

### 1. Найдите IP-адрес компьютера

**Windows:**
```bash
ipconfig
```

**Linux/Mac:**
```bash
ifconfig
```

### 2. Запустите dev-сервер

```bash
npm start
```

### 3. Откройте на телефоне

```
http://[IP-адрес]:3000
```

Пример: `http://192.168.1.100:3000`

---

## 📊 Производительность

### Оптимизация сборки

```bash
# Анализ размера бандла
npm install -g source-map-explorer
npm run build
source-map-explorer build/static/js/*.js
```

### Code Splitting

```jsx
import { lazy, Suspense } from 'react';

const HomeScreen = lazy(() => import('./components/HomeScreen'));

function App() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <HomeScreen />
    </Suspense>
  );
}
```

---

## 📞 Поддержка

При возникновении проблем:

1. Проверьте [документацию React](https://react.dev/)
2. Проверьте [документацию Tailwind CSS](https://tailwindcss.com/)
3. Посмотрите `src/components/README.md`

---

## ✅ Чеклист готовности

- [ ] Node.js установлен (версия 14+)
- [ ] npm install выполнен успешно
- [ ] Tailwind CSS настроен
- [ ] Компонент HomeScreen.jsx скопирован
- [ ] index.css содержит Tailwind директивы
- [ ] npm start запускается без ошибок
- [ ] Компонент отображается в браузере
- [ ] Все стили применяются корректно
- [ ] Интерактивность работает (клики, hover)

---

## 📄 Лицензия

© 2024 УК "Зелёная Долина". Все права защищены.

---

**Версия**: 1.0.0  
**Дата обновления**: Декабрь 2024  
**Автор**: Frontend Team  
**Технологии**: React 18+, Tailwind CSS 3+, Create React App
