import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { MainScreenData } from '../types/api';
import { fetchMainScreenData, openGate, subscribeToMainScreenUpdates } from '../api/mainScreen';

/**
 * Главный экран приложения УК "Зелёная Долина"
 * Интегрирует все системы:
 * - VSK Desk (заявки)
 * - PAL Gate (шлагбаумы)
 * - Телеком Летай (видеонаблюдение)
 * - ЕРЦ Форма 4.0 (счетчики)
 * - Платежи (банковские скриншоты)
 */
export default function MainScreen() {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  // Загрузка данных главного экрана
  const { data, isLoading, error, refetch } = useQuery<MainScreenData>({
    queryKey: ['mainScreen'],
    queryFn: fetchMainScreenData,
    refetchInterval: 30000, // Обновление каждые 30 секунд
  });

  // Мутация для открытия шлагбаума
  const openGateMutation = useMutation({
    mutationFn: openGate,
    onSuccess: () => {
      Alert.alert('Успех', 'Шлагбаум открыт');
      refetch();
    },
    onError: (error) => {
      Alert.alert('Ошибка', 'Не удалось открыть шлагбаум');
      console.error(error);
    },
  });

  // Подписка на обновления в реальном времени
  useEffect(() => {
    if (data) {
      const unsubscribe = subscribeToMainScreenUpdates((updatedData) => {
        // Обновление данных через React Query
        // queryClient.setQueryData(['mainScreen'], updatedData);
      });
      return unsubscribe;
    }
  }, [data]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-green-50">
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text className="mt-4 text-gray-600">Загрузка данных...</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View className="flex-1 items-center justify-center bg-green-50 p-4">
        <Text className="text-red-600 text-lg font-bold mb-4">
          Ошибка загрузки данных
        </Text>
        <TouchableOpacity
          onPress={() => refetch()}
          className="bg-green-600 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Повторить</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-green-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Заголовок с информацией о пользователе */}
      <View className="bg-green-600 px-4 pt-12 pb-6">
        <Text className="text-white text-2xl font-bold mb-1">
          {data.user.name}
        </Text>
        <Text className="text-green-100 text-base">
          Квартира {data.user.apartment}
        </Text>
        {data.user.hasStorage && (
          <Text className="text-green-100 text-sm mt-1">✓ Кладовая</Text>
        )}
      </View>

      {/* Статистика платежей */}
      <View className="mx-4 mt-4 bg-white rounded-xl p-4 shadow-sm">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-gray-700 text-lg font-semibold">
            К оплате
          </Text>
          <View
            className={`px-3 py-1 rounded-full ${
              data.payment.status === 'paid'
                ? 'bg-green-100'
                : data.payment.status === 'overdue'
                ? 'bg-red-100'
                : 'bg-yellow-100'
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                data.payment.status === 'paid'
                  ? 'text-green-700'
                  : data.payment.status === 'overdue'
                  ? 'text-red-700'
                  : 'text-yellow-700'
              }`}
            >
              {data.payment.status === 'paid'
                ? 'Оплачено'
                : data.payment.status === 'overdue'
                ? 'Просрочено'
                : 'Ожидает оплаты'}
            </Text>
          </View>
        </View>
        <Text className="text-green-600 text-3xl font-bold mb-2">
          {data.payment.amount.toLocaleString('ru-RU')} ₽
        </Text>
        <Text className="text-gray-500 text-sm">
          Срок оплаты: {new Date(data.payment.dueDate).toLocaleDateString('ru-RU')}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Payments' as never)}
          className="mt-4 bg-green-600 py-3 rounded-lg"
        >
          <Text className="text-white text-center font-semibold">
            Оплатить
          </Text>
        </TouchableOpacity>
      </View>

      {/* Быстрые действия */}
      <View className="mx-4 mt-4">
        <Text className="text-gray-700 text-lg font-semibold mb-3">
          Быстрые действия
        </Text>
        <View className="flex-row flex-wrap gap-3">
          {/* Шлагбаум PAL Gate */}
          <TouchableOpacity
            onPress={() => {
              if (data.gateStatus.canOpen) {
                Alert.alert(
                  'Открыть шлагбаум?',
                  'Шлагбаум будет открыт через SMS команду',
                  [
                    { text: 'Отмена', style: 'cancel' },
                    {
                      text: 'Открыть',
                      onPress: () => openGateMutation.mutate(),
                    },
                  ]
                );
              } else {
                Alert.alert('Нет доступа', 'У вас нет прав на открытие шлагбаума');
              }
            }}
            className={`flex-1 min-w-[45%] bg-white rounded-xl p-4 shadow-sm ${
              data.gateStatus.canOpen ? '' : 'opacity-50'
            }`}
            disabled={!data.gateStatus.canOpen || openGateMutation.isPending}
          >
            <Text className="text-3xl mb-2">
              {data.gateStatus.isOpen ? '🚪' : '🔒'}
            </Text>
            <Text className="text-gray-700 font-semibold mb-1">
              Шлагбаум
            </Text>
            <Text className="text-gray-500 text-xs">
              {data.gateStatus.isOpen
                ? 'Открыт'
                : data.gateStatus.canOpen
                ? 'Нажмите для открытия'
                : 'Нет доступа'}
            </Text>
          </TouchableOpacity>

          {/* Видеонаблюдение Телеком Летай */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Cameras' as never)}
            className="flex-1 min-w-[45%] bg-white rounded-xl p-4 shadow-sm"
          >
            <Text className="text-3xl mb-2">📹</Text>
            <Text className="text-gray-700 font-semibold mb-1">
              Камеры
            </Text>
            <Text className="text-gray-500 text-xs">
              {data.cameras.online}/{data.cameras.total} онлайн
              {data.cameras.recentActivity && ' • Активность'}
            </Text>
          </TouchableOpacity>

          {/* Счетчики ЕРЦ */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Counters' as never)}
            className={`flex-1 min-w-[45%] bg-white rounded-xl p-4 shadow-sm ${
              data.meters.needsSubmission ? 'border-2 border-yellow-400' : ''
            }`}
          >
            <Text className="text-3xl mb-2">🔢</Text>
            <Text className="text-gray-700 font-semibold mb-1">
              Счетчики
            </Text>
            <Text className="text-gray-500 text-xs">
              {data.meters.needsSubmission
                ? '⚠️ Требуется передача'
                : `Последняя передача: ${new Date(data.meters.lastSubmitted).toLocaleDateString('ru-RU')}`}
            </Text>
          </TouchableOpacity>

          {/* Заявки VSK Desk */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Requests' as never)}
            className="flex-1 min-w-[45%] bg-white rounded-xl p-4 shadow-sm"
          >
            <Text className="text-3xl mb-2">📝</Text>
            <Text className="text-gray-700 font-semibold mb-1">
              Заявки
            </Text>
            <Text className="text-gray-500 text-xs">
              {data.vskRequests.active} активных
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Активные заявки VSK Desk */}
      {data.vskRequests.recent.length > 0 && (
        <View className="mx-4 mt-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-700 text-lg font-semibold">
              Активные заявки
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Requests' as never)}
            >
              <Text className="text-green-600 text-sm font-semibold">
                Все →
              </Text>
            </TouchableOpacity>
          </View>
          {data.vskRequests.recent.slice(0, 3).map((request) => (
            <TouchableOpacity
              key={request.id}
              onPress={() =>
                navigation.navigate('RequestDetails' as never, {
                  requestId: request.id,
                } as never)
              }
              className="bg-white rounded-xl p-4 mb-2 shadow-sm"
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="text-gray-800 font-semibold mb-1">
                    {request.title}
                  </Text>
                  <Text className="text-gray-500 text-xs mb-2">
                    {new Date(request.createdAt).toLocaleDateString('ru-RU')}
                  </Text>
                  <View
                    className={`self-start px-2 py-1 rounded ${
                      request.status === 'new'
                        ? 'bg-blue-100'
                        : request.status === 'in_progress'
                        ? 'bg-yellow-100'
                        : 'bg-green-100'
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        request.status === 'new'
                          ? 'text-blue-700'
                          : request.status === 'in_progress'
                          ? 'text-yellow-700'
                          : 'text-green-700'
                      }`}
                    >
                      {request.status === 'new'
                        ? 'Новая'
                        : request.status === 'in_progress'
                        ? 'В работе'
                        : 'Завершена'}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Уведомления */}
      {data.notifications.items.length > 0 && (
        <View className="mx-4 mt-4 mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              <Text className="text-gray-700 text-lg font-semibold">
                Уведомления
              </Text>
              {data.notifications.unread > 0 && (
                <View className="ml-2 bg-red-500 rounded-full px-2 py-1">
                  <Text className="text-white text-xs font-bold">
                    {data.notifications.unread}
                  </Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Notifications' as never)}
            >
              <Text className="text-green-600 text-sm font-semibold">
                Все →
              </Text>
            </TouchableOpacity>
          </View>
          {data.notifications.items.slice(0, 5).map((notification) => (
            <TouchableOpacity
              key={notification.id}
              onPress={() => {
                if (notification.actionUrl) {
                  // Навигация по actionUrl
                }
                navigation.navigate('Notifications' as never);
              }}
              className={`bg-white rounded-xl p-4 mb-2 shadow-sm ${
                !notification.isRead ? 'border-l-4 border-green-600' : ''
              }`}
            >
              <Text className="text-gray-800 font-semibold mb-1">
                {notification.title}
              </Text>
              <Text className="text-gray-600 text-sm mb-2">
                {notification.message}
              </Text>
              <Text className="text-gray-400 text-xs">
                {new Date(notification.timestamp).toLocaleString('ru-RU')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

