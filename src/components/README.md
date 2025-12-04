# Компонент HomeScreen

Главный экран приложения УК "Зелёная долина" с использованием React и Tailwind CSS.

## Описание

Компонент `HomeScreen` отображает:
- Приветствие с именем пользователя
- Ключевые метрики (сумма к оплате, срок оплаты, активные заявки)
- Быстрые действия (4 кнопки)
- Последние уведомления (максимум 2)
- Футер с контактами диспетчерской службы

## Установка зависимостей

Убедитесь, что в проекте установлены необходимые зависимости:

```bash
npm install react react-dom
```

Для использования Tailwind CSS добавьте его в проект:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Настройте `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## Использование

### Базовое использование

```jsx
import HomeScreen from './components/HomeScreen';

function App() {
  return <HomeScreen />;
}
```

### С кастомными данными

```jsx
import HomeScreen from './components/HomeScreen';

function App() {
  const userData = {
    firstName: "Иван",
    lastName: "Иванов",
  };

  const mainStats = {
    amountDue: 5234,
    dueDate: "10 мая",
    activeRequests: 3,
    newNotifications: 2,
  };

  const quickActions = [
    { id: 1, icon: "💧", label: "Передать показания", route: "/counters" },
    { id: 2, icon: "🔋", label: "Оплатить сейчас", route: "/payments" },
    { id: 3, icon: "📢", label: "Создать заявку", route: "/request" },
    { id: 4, icon: "📄", label: "Скачать квитанцию", route: "/receipts" },
  ];

  const notifications = [
    {
      id: 1,
      type: "warning",
      icon: "⚡",
      title: "Плановая проверка электрощитовой",
      date: "25 апреля",
      isNew: true,
      details: "Дома: 1, 2, 3. Время: 9:00-18:00",
    },
  ];

  return (
    <HomeScreen
      userData={userData}
      mainStats={mainStats}
      quickActions={quickActions}
      lastNotifications={notifications}
      onNavigate={(route) => {
        // Ваша логика навигации
        console.log('Переход на:', route);
      }}
    />
  );
}
```

## Props

| Prop | Тип | Обязательный | По умолчанию | Описание |
|------|-----|--------------|--------------|----------|
| `userData` | `object` | Нет | `{ firstName: "Иван", lastName: "Иванов" }` | Данные пользователя |
| `mainStats` | `object` | Нет | См. код | Ключевые метрики |
| `quickActions` | `array` | Нет | См. код | Массив быстрых действий |
| `lastNotifications` | `array` | Нет | См. код | Массив уведомлений |
| `onNavigate` | `function` | Нет | `console.log` | Обработчик навигации |

### Структура данных

#### userData
```javascript
{
  firstName: string,
  lastName: string
}
```

#### mainStats
```javascript
{
  amountDue: number,        // Сумма к оплате в рублях
  dueDate: string,         // Срок оплаты
  activeRequests: number,   // Количество активных заявок
  newNotifications: number // Количество новых уведомлений
}
```

#### quickActions
```javascript
[
  {
    id: number,
    icon: string,    // Эмодзи или иконка
    label: string,   // Текст кнопки
    route: string    // Маршрут для навигации
  }
]
```

#### lastNotifications
```javascript
[
  {
    id: number,
    type: "warning" | "info",
    icon: string,
    title: string,
    date: string,
    isNew: boolean,
    details: string
  }
]
```

## Особенности

- **Интерактивность**: При клике на уведомление оно автоматически отмечается как прочитанное (`isNew: false`)
- **Адаптивность**: Компонент адаптируется под разные размеры экрана (мобильные и десктоп)
- **Навигация**: Все кликабельные элементы вызывают функцию `onNavigate` с соответствующим маршрутом
- **Телефонная ссылка**: Номер телефона в футере обёрнут в `<a href="tel:...">` для прямого звонка

## Стилизация

Компонент использует Tailwind CSS со следующими основными цветами:
- Зелёные акценты: `emerald-500`, `emerald-600`, `emerald-700`
- Белый фон: `bg-white`
- Тени: `shadow-md`, `shadow-lg`
- Скругления: `rounded-xl`

## Интеграция с React Router

```jsx
import { useNavigate } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';

function App() {
  const navigate = useNavigate();

  return (
    <HomeScreen
      onNavigate={(route) => navigate(route)}
    />
  );
}
```
