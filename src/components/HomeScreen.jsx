import React, { useState } from 'react';

/**
 * Компонент главного экрана приложения УК "Зелёная долина"
 * Отображает приветствие, ключевые метрики, быстрые действия и уведомления
 */
const HomeScreen = ({ 
  userData = { firstName: "Иван", lastName: "Иванов" },
  mainStats = {
    amountDue: 5234,
    dueDate: "10 мая",
    activeRequests: 3,
    newNotifications: 2,
  },
  quickActions = [
    { id: 1, icon: "💧", label: "Передать показания", route: "/counters" },
    { id: 2, icon: "🔋", label: "Оплатить сейчас", route: "/payments" },
    { id: 3, icon: "📢", label: "Создать заявку", route: "/request" },
    { id: 4, icon: "📄", label: "Скачать квитанцию", route: "/receipts" },
  ],
  lastNotifications = [
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
  ],
  onNavigate = (route) => {
    console.log('Навигация на:', route);
    // Здесь должна быть логика навигации (например, React Router)
  }
}) => {
  // Состояние для уведомлений (для отслеживания прочитанных)
  const [notifications, setNotifications] = useState(lastNotifications);

  /**
   * Обработчик клика на уведомление
   * Отмечает уведомление как прочитанное
   */
  const handleNotificationClick = (notificationId) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isNew: false }
          : notification
      )
    );
  };

  /**
   * Форматирование суммы к оплате
   */
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  /**
   * Обработчик клика на карточку статистики
   */
  const handleStatCardClick = (statType) => {
    const routes = {
      amountDue: '/payments',
      dueDate: '/payments',
      activeRequests: '/requests',
      newNotifications: '/notifications',
    };
    onNavigate(routes[statType] || '/');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Приветствие */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-8 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold mb-1">
          Добро пожаловать, {userData.firstName}!
        </h1>
        <p className="text-emerald-50 text-sm">
          Управляющая компания "Зелёная долина"
        </p>
      </div>

      <div className="px-4 mt-6 space-y-6">
        {/* Блок "Ключевая информация" */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Ключевая информация
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Карточка: Сумма к оплате */}
            <div
              onClick={() => handleStatCardClick('amountDue')}
              className="bg-white rounded-xl shadow-md p-5 cursor-pointer hover:shadow-lg transition-shadow active:scale-95"
            >
              <div className="text-2xl font-bold text-emerald-700 mb-1">
                {formatAmount(mainStats.amountDue)}
              </div>
              <div className="text-xs text-gray-600">
                К оплате
              </div>
            </div>

            {/* Карточка: Срок оплаты */}
            <div
              onClick={() => handleStatCardClick('dueDate')}
              className="bg-white rounded-xl shadow-md p-5 cursor-pointer hover:shadow-lg transition-shadow active:scale-95"
            >
              <div className="text-2xl font-bold text-emerald-700 mb-1">
                {mainStats.dueDate}
              </div>
              <div className="text-xs text-gray-600">
                Срок оплаты
              </div>
            </div>

            {/* Карточка: Активные заявки */}
            <div
              onClick={() => handleStatCardClick('activeRequests')}
              className="bg-white rounded-xl shadow-md p-5 cursor-pointer hover:shadow-lg transition-shadow active:scale-95 col-span-2 md:col-span-1"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-emerald-700 mb-1">
                    {mainStats.activeRequests}
                  </div>
                  <div className="text-xs text-gray-600">
                    Активные заявки
                  </div>
                </div>
                {mainStats.newNotifications > 0 && (
                  <div className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {mainStats.newNotifications}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Блок "Быстрые действия" */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Быстрые действия
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => onNavigate(action.route)}
                className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center justify-center space-y-2 hover:shadow-lg transition-all active:scale-95 border-2 border-transparent hover:border-emerald-200"
              >
                <span className="text-3xl">{action.icon}</span>
                <span className="text-sm font-medium text-gray-700 text-center">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Блок "Последние уведомления" */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Последние уведомления
          </h2>
          <div className="space-y-3">
            {notifications.slice(0, 2).map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification.id)}
                className={`bg-white rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg transition-all active:scale-[0.98] border-l-4 ${
                  notification.type === 'warning'
                    ? 'border-yellow-500'
                    : 'border-blue-500'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start space-x-3 flex-1">
                    <span className="text-2xl">{notification.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800 text-sm">
                          {notification.title}
                        </h3>
                        {notification.isNew && (
                          <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            Новое
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-1">
                        {notification.details}
                      </p>
                      <p className="text-xs text-gray-500">
                        {notification.date}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Футер с контактами диспетчерской службы */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 shadow-lg">
        <div className="max-w-md mx-auto">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Диспетчерская служба
            </p>
            <a
              href="tel:+79600720321"
              className="text-emerald-700 font-semibold text-lg hover:text-emerald-800 active:text-emerald-900 transition-colors"
            >
              +7 (960) 072-03-21
            </a>
            <p className="text-xs text-gray-500 mt-1">
              Круглосуточно
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeScreen;
