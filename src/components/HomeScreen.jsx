import React, { useState } from 'react';

/**
 * Главный экран приложения УК "Зелёная долина"
 * 
 * Компонент отображает:
 * - Приветствие пользователя
 * - Ключевые метрики (сумма к оплате, заявки, уведомления)
 * - Быстрые действия
 * - Последние уведомления
 * - Контакты диспетчерской службы
 */
const HomeScreen = () => {
  // Данные пользователя (в реальном приложении будут приходить из контекста/props)
  const [userData] = useState({
    firstName: "Иван",
    lastName: "Иванов",
  });

  // Ключевые метрики
  const [mainStats] = useState({
    amountDue: 5234, // Сумма к оплате в рублях
    dueDate: "10 мая", // Срок оплаты
    activeRequests: 3, // Активные заявки
    newNotifications: 2, // Новые уведомления
  });

  // Быстрые действия
  const [quickActions] = useState([
    { id: 1, icon: "💧", label: "Передать показания", route: "/counters" },
    { id: 2, icon: "🔋", label: "Оплатить сейчас", route: "/payments" },
    { id: 3, icon: "📢", label: "Создать заявку", route: "/request" },
    { id: 4, icon: "📄", label: "Скачать квитанцию", route: "/receipts" },
  ]);

  // Последние уведомления (состояние, т.к. можно отмечать как прочитанные)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "warning",
      icon: "⚡",
      title: "Плановая проверка электрощитовой",
      date: "25 апреля",
      isNew: true,
      details: "Дома: 1, 2, 3. Время: 9:00-18:00",
    },
    {
      id: 2,
      type: "info",
      icon: "🚿",
      title: "Отключение горячей воды",
      date: "28 апреля",
      isNew: true,
      details: "Причина: Профилактические работы. Время: 10:00-16:00",
    },
  ]);

  // Обработчик клика по уведомлению - отмечает как прочитанное
  const handleNotificationClick = (notificationId) => {
    setNotifications(notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isNew: false }
        : notification
    ));
  };

  // Обработчик быстрых действий
  const handleQuickAction = (route) => {
    console.log('Переход к:', route);
    // В реальном приложении здесь будет навигация (react-router)
    // navigate(route);
  };

  // Обработчик клика по карточке статистики
  const handleStatClick = (statType) => {
    console.log('Клик по статистике:', statType);
    // Навигация к соответствующему разделу
    switch(statType) {
      case 'payment':
        // navigate('/payments');
        break;
      case 'requests':
        // navigate('/requests');
        break;
      case 'notifications':
        // navigate('/notifications');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Шапка с приветствием */}
      <header className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-6 py-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">
            Добро пожаловать, {userData.firstName}!
          </h1>
          <p className="text-emerald-100 text-lg">
            УК "Зелёная долина"
          </p>
        </div>
      </header>

      {/* Основной контент */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        
        {/* Блок: Ключевая информация */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Ключевая информация
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Карточка: Сумма к оплате */}
            <div 
              onClick={() => handleStatClick('payment')}
              className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-xl transition-shadow duration-300 border-l-4 border-emerald-500"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm font-medium">К оплате</span>
                <span className="text-2xl">💰</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {mainStats.amountDue.toLocaleString('ru-RU')} ₽
              </p>
              <p className="text-sm text-gray-500">
                Срок: <span className="font-semibold text-emerald-700">{mainStats.dueDate}</span>
              </p>
            </div>

            {/* Карточка: Активные заявки */}
            <div 
              onClick={() => handleStatClick('requests')}
              className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-500"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm font-medium">Активные заявки</span>
                <span className="text-2xl">🔧</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {mainStats.activeRequests}
              </p>
              <p className="text-sm text-gray-500">
                В обработке
              </p>
            </div>

            {/* Карточка: Новые уведомления */}
            <div 
              onClick={() => handleStatClick('notifications')}
              className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-xl transition-shadow duration-300 border-l-4 border-orange-500"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm font-medium">Уведомления</span>
                <span className="text-2xl">🔔</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {mainStats.newNotifications}
              </p>
              <p className="text-sm text-gray-500">
                Новых сообщений
              </p>
            </div>
          </div>
        </section>

        {/* Блок: Быстрые действия */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Быстрые действия
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map(action => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action.route)}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center space-y-3 group"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                  {action.icon}
                </span>
                <span className="text-sm font-semibold text-gray-700 text-center group-hover:text-emerald-600 transition-colors">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Блок: Последние уведомления */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Последние уведомления
          </h2>
          <div className="space-y-4">
            {notifications.slice(0, 2).map(notification => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification.id)}
                className={`
                  bg-white rounded-xl shadow-md p-5 cursor-pointer hover:shadow-xl transition-all duration-300
                  ${notification.type === 'warning' ? 'border-l-4 border-orange-500' : 'border-l-4 border-blue-500'}
                  ${notification.isNew ? 'ring-2 ring-emerald-500 ring-opacity-50' : ''}
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <span className="text-3xl flex-shrink-0">
                      {notification.icon}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {notification.title}
                        </h3>
                        {notification.isNew && (
                          <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            Новое
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.details}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        📅 {notification.date}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Кнопка "Показать все" */}
          <div className="mt-4 text-center">
            <button 
              onClick={() => console.log('Показать все уведомления')}
              className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline transition-colors"
            >
              Показать все уведомления →
            </button>
          </div>
        </section>
      </main>

      {/* Футер: Контакты диспетчерской службы */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-bold text-gray-800">
              Диспетчерская служба
            </h3>
            <div className="space-y-2">
              <p className="text-gray-600">
                Круглосуточная поддержка жильцов
              </p>
              <a 
                href="tel:+79600720321"
                className="inline-flex items-center space-x-2 text-2xl font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                <span>📞</span>
                <span>8 (960) 072-03-21</span>
              </a>
              <p className="text-sm text-gray-500 mt-2">
                Режим работы: 24/7
              </p>
            </div>
          </div>
        </div>
        
        {/* Копирайт */}
        <div className="bg-gray-50 py-4">
          <p className="text-center text-sm text-gray-500">
            © 2024 УК "Зелёная долина". Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomeScreen;
