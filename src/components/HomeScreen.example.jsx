/**
 * Пример использования компонента HomeScreen
 * 
 * Этот файл демонстрирует, как использовать компонент HomeScreen
 * в вашем React приложении.
 */

import React from 'react';
import HomeScreen from './HomeScreen';
import { useNavigate } from 'react-router-dom'; // Если используете React Router

/**
 * Пример компонента-обёртки для HomeScreen
 */
const HomeScreenWrapper = () => {
  // Если используете React Router для навигации
  const navigate = useNavigate();

  // Данные пользователя (обычно из контекста или API)
  const userData = {
    firstName: "Иван",
    lastName: "Иванов",
  };

  // Ключевые метрики (обычно загружаются с API)
  const mainStats = {
    amountDue: 5234,
    dueDate: "10 мая",
    activeRequests: 3,
    newNotifications: 2,
  };

  // Быстрые действия
  const quickActions = [
    { id: 1, icon: "💧", label: "Передать показания", route: "/counters" },
    { id: 2, icon: "🔋", label: "Оплатить сейчас", route: "/payments" },
    { id: 3, icon: "📢", label: "Создать заявку", route: "/request" },
    { id: 4, icon: "📄", label: "Скачать квитанцию", route: "/receipts" },
  ];

  // Последние уведомления
  const lastNotifications = [
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
  ];

  // Обработчик навигации
  const handleNavigate = (route) => {
    navigate(route);
  };

  return (
    <HomeScreen
      userData={userData}
      mainStats={mainStats}
      quickActions={quickActions}
      lastNotifications={lastNotifications}
      onNavigate={handleNavigate}
    />
  );
};

/**
 * Пример использования с хуками для загрузки данных
 */
const HomeScreenWithDataFetching = () => {
  const [userData, setUserData] = React.useState(null);
  const [mainStats, setMainStats] = React.useState(null);
  const [notifications, setNotifications] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Загрузка данных с API
    const fetchData = async () => {
      try {
        // Пример загрузки данных
        // const userResponse = await fetch('/api/user');
        // const statsResponse = await fetch('/api/stats');
        // const notificationsResponse = await fetch('/api/notifications');
        
        // setUserData(await userResponse.json());
        // setMainStats(await statsResponse.json());
        // setNotifications(await notificationsResponse.json());
        
        setLoading(false);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <HomeScreen
      userData={userData}
      mainStats={mainStats}
      lastNotifications={notifications}
      onNavigate={(route) => {
        // Логика навигации
        console.log('Переход на:', route);
      }}
    />
  );
};

export default HomeScreenWrapper;
