# Руководство по использованию кнопок
**УК «Зелёная долина» v7.2.4**

## Обзор

Новая система кнопок разработана по принципам Material Design 3 и включает все необходимые компоненты для создания современного и доступного интерфейса.

## Типы кнопок

### 1. Primary Button (Главные действия)

Используйте для основных действий пользователя.

```html
<button class="btn btn-primary">Отправить показания</button>
<button class="btn btn-primary btn-block">Войти</button>
```

**Когда использовать:**
- Отправка форм
- Подтверждение действий
- Главные CTA (Call-to-Action)

### 2. Secondary Button (Дополнительные действия)

Используйте для второстепенных действий.

```html
<button class="btn btn-secondary">Отмена</button>
<button class="btn btn-secondary">Назад</button>
```

**Когда использовать:**
- Отмена операций
- Альтернативные действия
- Навигация назад

### 3. Icon Button (Иконочные кнопки)

Используйте для быстрых действий с иконками.

```html
<button class="btn btn-icon" aria-label="Настройки">
    <svg>...</svg>
</button>
```

**Когда использовать:**
- Навигация
- Быстрые действия
- Компактный интерфейс

### 4. Text Button (Текстовые кнопки)

Используйте для малозначимых действий.

```html
<button class="btn btn-text">Подробнее</button>
```

**Когда использовать:**
- Дополнительная информация
- Несущественные действия
- В карточках и списках

### 5. FAB (Floating Action Button)

Используйте для главного действия на странице.

```html
<button class="btn btn-fab" onclick="createRequest()">
    <svg>...</svg>
</button>
```

**Когда использовать:**
- Создание новой заявки
- Главное действие экрана
- Всегда доступное действие

## Варианты цветов

```html
<!-- Успех -->
<button class="btn btn-success">Сохранить</button>

<!-- Предупреждение -->
<button class="btn btn-warning">Внимание</button>

<!-- Опасность -->
<button class="btn btn-danger">Удалить</button>

<!-- Нейтральный -->
<button class="btn btn-neutral">Отмена</button>
```

## Размеры

```html
<!-- Маленькая -->
<button class="btn btn-primary btn-small">Маленькая</button>

<!-- Обычная (по умолчанию) -->
<button class="btn btn-primary">Обычная</button>

<!-- Большая -->
<button class="btn btn-primary btn-large">Большая</button>

<!-- На всю ширину -->
<button class="btn btn-primary btn-block">Полная ширина</button>
```

## Состояния

### Loading (Загрузка)

```html
<button class="btn btn-primary btn-loading">Загрузка...</button>
```

Или программно:

```javascript
const button = document.querySelector('#myButton');
ButtonSystem.setLoading(button, true); // Включить загрузку
ButtonSystem.setLoading(button, false); // Выключить загрузку
```

### Success (Успех)

```javascript
ButtonSystem.showSuccess(button, '✓ Сохранено');
```

### Disabled (Отключена)

```html
<button class="btn btn-primary" disabled>Недоступна</button>
```

## Группы кнопок

```html
<div class="btn-group">
    <button class="btn btn-primary">Кнопка 1</button>
    <button class="btn btn-secondary">Кнопка 2</button>
</div>

<!-- Вертикальная группа -->
<div class="btn-group btn-group-vertical">
    <button class="btn btn-primary">Кнопка 1</button>
    <button class="btn btn-secondary">Кнопка 2</button>
</div>

<!-- Слипшиеся кнопки -->
<div class="btn-group btn-group-attached">
    <button class="btn btn-secondary">Влево</button>
    <button class="btn btn-secondary">По центру</button>
    <button class="btn btn-secondary">Вправо</button>
</div>
```

## Адаптивность

Кнопки автоматически адаптируются под размер экрана:

- **Mobile (< 640px)**: увеличенные размеры для touch (52px высота)
- **Tablet (640-1024px)**: стандартные размеры (48px высота)
- **Desktop (> 1024px)**: компактные размеры (40px высота для icon buttons)

Для принудительной полной ширины на мобильных:

```html
<button class="btn btn-primary btn-block-mobile">Кнопка</button>
```

## Accessibility (Доступность)

### ARIA метки

Всегда добавляйте `aria-label` для иконочных кнопок:

```html
<button class="btn btn-icon" aria-label="Удалить заявку">
    <svg>...</svg>
</button>
```

### Keyboard navigation

Все кнопки поддерживают навигацию с клавиатуры:
- `Tab` - переход между кнопками
- `Enter` / `Space` - активация кнопки

### Focus states

Focus-состояния автоматически применяются при навигации с клавиатуры.

## Примеры использования

### Форма входа

```html
<form>
    <input type="text" placeholder="Код доступа">
    <button type="submit" class="btn btn-primary btn-block">
        Войти
    </button>
</form>
```

### Карточка с действиями

```html
<div class="card">
    <h3>Показания счётчиков</h3>
    <p>Не забудьте передать показания до 25 числа</p>
    <div class="btn-group">
        <button class="btn btn-primary" onclick="submitReadings()">
            Передать показания
        </button>
        <button class="btn btn-text" onclick="showHistory()">
            История
        </button>
    </div>
</div>
```

### Модальное окно

```html
<div class="modal">
    <h2>Подтверждение</h2>
    <p>Вы уверены что хотите удалить заявку?</p>
    <div class="btn-group">
        <button class="btn btn-danger" onclick="confirmDelete()">
            Удалить
        </button>
        <button class="btn btn-secondary" onclick="closeModal()">
            Отмена
        </button>
    </div>
</div>
```

## JavaScript API

### ButtonSystem

Глобальный объект `ButtonSystem` предоставляет утилиты для работы с кнопками:

```javascript
// Установить состояние загрузки
ButtonSystem.setLoading(button, true);

// Показать успех
ButtonSystem.showSuccess(button, '✓ Готово');

// Реинициализация (после динамического добавления кнопок)
ButtonSystem.init();
```

## Цветовая палитра

### Primary (Основной зелёный)
- Base: `#4CAF50`
- Hover: `#45a049`
- Active: `#388E3C`

### Secondary (Яркий зелёный)
- Base: `#00AA00`
- Hover: `#009900`
- Active: `#008800`

### Success (Успех)
- Base: `#2E7D32`

### Warning (Предупреждение)
- Base: `#FFA726`

### Danger (Опасность)
- Base: `#EF5350`

### Neutral (Нейтральный)
- Base: `#616161`
- Hover: `#757575`

## Best Practices

### Визуальная иерархия

1. **Одна Primary кнопка** на экран для главного действия
2. **Secondary кнопки** для альтернативных действий
3. **Text кнопки** для малозначимых действий
4. **Icon кнопки** для компактных интерфейсов

### Текст кнопок

- Используйте короткие глаголы действия: "Сохранить", "Отправить", "Удалить"
- Избегайте длинных фраз
- Используйте эмодзи для визуального акцента (опционально)

### Расположение

- Primary кнопка справа в диалогах
- Cancel/Back кнопка слева
- FAB в правом нижнем углу

### Touch targets

Минимальный размер touch target - 44x44px (автоматически на мобильных)

## Поддержка браузеров

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ iOS Safari 14+
- ✅ Chrome Android 90+

## Версия

Текущая версия: **v7.2.4**

Файлы:
- `public/css/buttons.css`
- `public/js/buttons.js`

---

**Разработано для УК «Зелёная долина»**



