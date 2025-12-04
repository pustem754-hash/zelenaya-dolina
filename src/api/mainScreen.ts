import { MainScreenData } from '../types/api';

// Базовый URL API (заменить на реальный)
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.zelenayadolina.ru';

/**
 * Получение данных для главного экрана
 * Интегрирует данные из всех систем:
 * - VSK Desk (заявки)
 * - PAL Gate (шлагбаумы)
 * - Телеком Летай (камеры)
 * - ЕРЦ Форма 4.0 (счетчики)
 * - Платежи (банковские скриншоты)
 */
export async function fetchMainScreenData(): Promise<MainScreenData> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/main-screen`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data: MainScreenData = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка загрузки данных главного экрана:', error);
    throw error;
  }
}

/**
 * Открытие шлагбаума через PAL Gate (SMS команда)
 */
export async function openGate(gateId?: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/gate/open`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`,
      },
      body: JSON.stringify({ gateId }),
    });

    if (!response.ok) {
      throw new Error(`Gate API Error: ${response.status}`);
    }

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error('Ошибка открытия шлагбаума:', error);
    throw error;
  }
}

/**
 * Получение ссылки на камеру Телеком Летай
 */
export function getCameraUrl(cameraId: string): string {
  return `${API_BASE_URL}/api/cameras/${cameraId}/stream`;
}

/**
 * Получение токена авторизации (из AsyncStorage или другого хранилища)
 */
async function getAuthToken(): Promise<string> {
  // TODO: Реализовать получение токена из хранилища
  // const token = await AsyncStorage.getItem('authToken');
  // return token || '';
  return '';
}

/**
 * Обновление данных в реальном времени (WebSocket или polling)
 */
export function subscribeToMainScreenUpdates(
  callback: (data: MainScreenData) => void
): () => void {
  // TODO: Реализовать WebSocket подключение
  // Пока используем polling каждые 30 секунд
  const interval = setInterval(async () => {
    try {
      const data = await fetchMainScreenData();
      callback(data);
    } catch (error) {
      console.error('Ошибка обновления данных:', error);
    }
  }, 30000);

  return () => clearInterval(interval);
}

