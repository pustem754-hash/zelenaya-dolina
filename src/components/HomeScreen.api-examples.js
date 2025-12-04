/**
 * Примеры API интеграции для компонента HomeScreen
 * УК "Зелёная долина"
 * 
 * Этот файл содержит примеры того, как интегрировать компонент
 * с бэкендом API для получения реальных данных
 */

import { useState, useEffect } from 'react';

// ============================================================================
// ПРИМЕР 1: Простой fetch с useEffect
// ============================================================================

export function HomeScreenWithFetch() {
  const [userData, setUserData] = useState(null);
  const [mainStats, setMainStats] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        
        // Запрос к API
        const response = await fetch('/api/dashboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Ошибка загрузки данных');
        }

        const data = await response.json();
        
        // Обновление состояния
        setUserData(data.user);
        setMainStats(data.stats);
        setNotifications(data.notifications);
        
      } catch (err) {
        setError(err.message);
        console.error('Ошибка:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []); // Загрузка при монтировании

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <HomeScreen 
      userData={userData}
      mainStats={mainStats}
      notifications={notifications}
    />
  );
}

// ============================================================================
// ПРИМЕР 2: Использование кастомного хука
// ============================================================================

// Кастомный хук для загрузки данных дашборда
function useDashboardData() {
  const [data, setData] = useState({
    userData: null,
    mainStats: null,
    quickActions: [],
    notifications: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}

// Использование
export function HomeScreenWithCustomHook() {
  const { data, loading, error } = useDashboardData();

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error.message}</div>;

  return <HomeScreen {...data} />;
}

// ============================================================================
// ПРИМЕР 3: Параллельная загрузка данных
// ============================================================================

export function HomeScreenWithParallelFetch() {
  const [userData, setUserData] = useState(null);
  const [mainStats, setMainStats] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllData() {
      try {
        // Параллельная загрузка всех данных
        const [userRes, statsRes, notifRes] = await Promise.all([
          fetch('/api/user/profile'),
          fetch('/api/stats/main'),
          fetch('/api/notifications/latest')
        ]);

        const [user, stats, notif] = await Promise.all([
          userRes.json(),
          statsRes.json(),
          notifRes.json()
        ]);

        setUserData(user);
        setMainStats(stats);
        setNotifications(notif);
        
      } catch (error) {
        console.error('Ошибка загрузки:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, []);

  if (loading) return <div>Загрузка...</div>;

  return (
    <HomeScreen 
      userData={userData}
      mainStats={mainStats}
      notifications={notifications}
    />
  );
}

// ============================================================================
// ПРИМЕР 4: С React Query (рекомендуется для production)
// ============================================================================

import { useQuery } from '@tanstack/react-query';

// Функции для запросов
const fetchUserData = async () => {
  const res = await fetch('/api/user/profile');
  if (!res.ok) throw new Error('Ошибка загрузки профиля');
  return res.json();
};

const fetchMainStats = async () => {
  const res = await fetch('/api/stats/main');
  if (!res.ok) throw new Error('Ошибка загрузки статистики');
  return res.json();
};

const fetchNotifications = async () => {
  const res = await fetch('/api/notifications/latest?limit=2');
  if (!res.ok) throw new Error('Ошибка загрузки уведомлений');
  return res.json();
};

export function HomeScreenWithReactQuery() {
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUserData
  });

  const { data: mainStats, isLoading: statsLoading } = useQuery({
    queryKey: ['mainStats'],
    queryFn: fetchMainStats
  });

  const { data: notifications, isLoading: notifLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    refetchInterval: 60000 // Обновление каждую минуту
  });

  const isLoading = userLoading || statsLoading || notifLoading;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <HomeScreen 
      userData={userData}
      mainStats={mainStats}
      notifications={notifications}
    />
  );
}

// ============================================================================
// ПРИМЕР 5: С контекстом и провайдером
// ============================================================================

import { createContext, useContext } from 'react';

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [mainStats, setMainStats] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Загрузка данных
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => {
        setUserData(data.user);
        setMainStats(data.stats);
        setNotifications(data.notifications);
      });
  }, []);

  const value = {
    userData,
    mainStats,
    notifications,
    setUserData,
    setMainStats,
    setNotifications
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

// Хук для использования контекста
export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
}

// Использование в HomeScreen
export function HomeScreenWithContext() {
  const { userData, mainStats, notifications } = useDashboard();

  return (
    <HomeScreen 
      userData={userData}
      mainStats={mainStats}
      notifications={notifications}
    />
  );
}

// ============================================================================
// ПРИМЕР 6: С обработкой ошибок и повторными попытками
// ============================================================================

export function HomeScreenWithRetry() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchWithRetry = async (attempt = 0) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/dashboard', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);
        setRetryCount(0); // Сброс счетчика при успехе
        
      } catch (err) {
        console.error(`Попытка ${attempt + 1} не удалась:`, err);
        
        // Повторная попытка (максимум 3 раза)
        if (attempt < 2) {
          setTimeout(() => {
            setRetryCount(attempt + 1);
            fetchWithRetry(attempt + 1);
          }, 2000 * (attempt + 1)); // Экспоненциальная задержка
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWithRetry();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        {retryCount > 0 && (
          <p className="mt-4 text-gray-600">
            Повторная попытка {retryCount}/3...
          </p>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">Ошибка: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return <HomeScreen {...data} />;
}

// ============================================================================
// ПРИМЕР 7: Оптимистичные обновления (для отметки уведомлений)
// ============================================================================

export function HomeScreenWithOptimisticUpdate() {
  const [notifications, setNotifications] = useState([]);

  const handleNotificationClick = async (notificationId) => {
    // Оптимистичное обновление (сразу в UI)
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, isNew: false } : n
      )
    );

    try {
      // Отправка на сервер
      await fetch(`/api/notifications/${notificationId}/mark-read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('✅ Уведомление отмечено на сервере');
      
    } catch (error) {
      console.error('❌ Ошибка отметки уведомления:', error);
      
      // Откат изменений при ошибке
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, isNew: true } : n
        )
      );
      
      alert('Не удалось отметить уведомление. Попробуйте снова.');
    }
  };

  return (
    <HomeScreen 
      notifications={notifications}
      onNotificationClick={handleNotificationClick}
    />
  );
}

// ============================================================================
// ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ
// ============================================================================

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 mx-auto"></div>
        <p className="mt-4 text-gray-600 text-lg">Загрузка...</p>
      </div>
    </div>
  );
}

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Ошибка загрузки
        </h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <button 
          onClick={onRetry || (() => window.location.reload())}
          className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// ПРИМЕР API ENDPOINT СТРУКТУРЫ (для бэкенда)
// ============================================================================

/**
 * GET /api/dashboard
 * 
 * Response:
 * {
 *   "user": {
 *     "firstName": "Иван",
 *     "lastName": "Иванов"
 *   },
 *   "stats": {
 *     "amountDue": 5234,
 *     "dueDate": "10 мая",
 *     "activeRequests": 3,
 *     "newNotifications": 2
 *   },
 *   "quickActions": [
 *     { "id": 1, "icon": "💧", "label": "Передать показания", "route": "/counters" },
 *     { "id": 2, "icon": "🔋", "label": "Оплатить сейчас", "route": "/payments" },
 *     { "id": 3, "icon": "📢", "label": "Создать заявку", "route": "/request" },
 *     { "id": 4, "icon": "📄", "label": "Скачать квитанцию", "route": "/receipts" }
 *   ],
 *   "notifications": [
 *     {
 *       "id": 1,
 *       "type": "warning",
 *       "icon": "⚡",
 *       "title": "Плановая проверка электрощитовой",
 *       "date": "25 апреля",
 *       "isNew": true,
 *       "details": "Дома: 1, 2, 3. Время: 9:00-18:00"
 *     }
 *   ]
 * }
 */

// ============================================================================
// УСТАНОВКА REACT QUERY (для примера 4)
// ============================================================================

/**
 * npm install @tanstack/react-query
 * 
 * В index.js:
 * 
 * import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
 * 
 * const queryClient = new QueryClient();
 * 
 * root.render(
 *   <QueryClientProvider client={queryClient}>
 *     <App />
 *   </QueryClientProvider>
 * );
 */

export default {
  HomeScreenWithFetch,
  HomeScreenWithCustomHook,
  HomeScreenWithParallelFetch,
  HomeScreenWithReactQuery,
  HomeScreenWithContext,
  HomeScreenWithRetry,
  HomeScreenWithOptimisticUpdate
};
