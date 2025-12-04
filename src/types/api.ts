// Типы данных для API интеграции всех систем

export interface MainScreenData {
  // Статистика платежей
  payment: {
    amount: number; // 5234
    dueDate: string; // "2024-05-10"
    status: 'paid' | 'pending' | 'overdue';
  };

  // Заявки из VSK Desk
  vskRequests: {
    active: number; // 3
    recent: Array<{
      id: string;
      type: 'plumbing' | 'electric' | 'cleaning' | 'other';
      title: string;
      status: 'new' | 'in_progress' | 'completed';
      createdAt: string;
    }>;
  };

  // Уведомления из всех систем
  notifications: {
    unread: number; // 3
    items: Array<{
      id: string;
      type: 'payment' | 'request' | 'gate' | 'camera' | 'general';
      title: string;
      message: string;
      timestamp: string;
      isRead: boolean;
    }>;
  };

  // Статус шлагбаума PAL Gate
  gateStatus: {
    isOpen: boolean;
    lastOpened: string;
    canOpen: boolean; // Есть ли доступ у пользователя
  };

  // Камеры Телеком Летай
  cameras: {
    online: number;
    total: number;
    recentActivity: boolean; // Было ли движение за последний час
  };

  // Показания счетчиков (для ЕРЦ выгрузки)
  meters: {
    lastSubmitted: string;
    nextDeadline: string;
    needsSubmission: boolean;
  };

  // Пользователь
  user: {
    name: string;
    apartment: string;
    phone: string; // Для SMS-команд
    hasStorage: boolean; // Есть ли кладовая
  };
}

export interface VSKRequest {
  id: string;
  type: 'plumbing' | 'electric' | 'cleaning' | 'other';
  title: string;
  description?: string;
  status: 'new' | 'in_progress' | 'completed';
  createdAt: string;
  completedAt?: string;
  photos?: string[];
}

export interface Notification {
  id: string;
  type: 'payment' | 'request' | 'gate' | 'camera' | 'general';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface GateStatus {
  isOpen: boolean;
  lastOpened: string;
  canOpen: boolean;
  gateId?: string;
}

export interface CameraStatus {
  online: number;
  total: number;
  recentActivity: boolean;
  cameras?: Array<{
    id: string;
    name: string;
    isOnline: boolean;
    lastActivity?: string;
  }>;
}

