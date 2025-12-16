/**
 * Централизованный Zustand Store для УК «Зелёная долина»
 * 
 * Объединяет все состояния приложения:
 * - Аутентификация (auth)
 * - Данные пользователя (user)
 * - Показания счётчиков (meters)
 * - Заявки (requests)
 * - Медиа (photos, videos, audio)
 * - UI состояние
 * 
 * Интегрирован со StorageService для персистентности
 * 
 * @version 1.0.0
 * @project УК «Зелёная долина» v7.2.4
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';

// ============================================
// ТИПЫ
// ============================================

export interface User {
  id: string;
  code: string;
  name: string;
  fullName: string;
  accountNumber: string;
  apartment: string;
  house?: string;
  building?: string;
  phone?: string;
  email?: string;
  area?: number;
  residents?: number;
  storage?: string;
  balance?: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  loginCode: string | null;
  user: User | null;
}

export interface MeterReading {
  id: string;
  type: 'coldWater' | 'hotWater' | 'electricity' | 'gas';
  value: number;
  date: string;
  timestamp: number;
}

export interface Request {
  id: string | number;
  category: string;
  categoryName: string;
  description: string;
  status: 'created' | 'in_progress' | 'completed' | 'rejected';
  statusName: string;
  date: string;
  dateFormatted: string;
  photos?: string[];
  videos?: any[];
  audio?: any[];
  dispatcherPhotos?: string[];
}

export interface MediaItem {
  id: string;
  url: string;
  timestamp: number;
  type?: string;
}

export interface UIState {
  activeSection: string;
  isLoading: boolean;
  error: string | null;
}

// ============================================
// ГЛАВНЫЙ STORE
// ============================================

interface AppState {
  // ===== AUTH =====
  auth: AuthState;
  
  // ===== METERS =====
  meters: {
    history: MeterReading[];
    lastReadings: {
      coldWater: number | null;
      hotWater: number | null;
      electricity: number | null;
      gas: number | null;
    };
  };
  
  // ===== REQUESTS =====
  requests: Request[];
  
  // ===== MEDIA =====
  media: {
    photos: MediaItem[];
    videos: MediaItem[];
    audio: MediaItem[];
    requestPhotos: MediaItem[];
    counterPhotos: MediaItem[];
    meterPhotos: MediaItem[];
  };
  
  // ===== UI =====
  ui: UIState;
  
  // ===== ACTIONS =====
  
  // Auth actions
  login: (code: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  
  // Meters actions
  addMeterReading: (reading: Omit<MeterReading, 'id' | 'timestamp'>) => void;
  updateLastReading: (type: MeterReading['type'], value: number) => void;
  
  // Requests actions
  addRequest: (request: Request) => void;
  updateRequest: (id: string | number, updates: Partial<Request>) => void;
  deleteRequest: (id: string | number) => void;
  
  // Media actions
  addPhoto: (photo: MediaItem, category?: 'request' | 'counter' | 'meter') => void;
  deletePhoto: (id: string, category?: 'request' | 'counter' | 'meter') => void;
  addVideo: (video: MediaItem) => void;
  deleteVideo: (id: string) => void;
  addAudio: (audio: MediaItem) => void;
  deleteAudio: (id: string) => void;
  
  // UI actions
  setActiveSection: (section: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Utility
  clearAll: () => void;
  syncWithStorage: () => void;
}

// ============================================
// НАЧАЛЬНЫЕ СОСТОЯНИЯ
// ============================================

const initialState = {
  auth: {
    isAuthenticated: false,
    loginCode: null,
    user: null,
  },
  meters: {
    history: [],
    lastReadings: {
      coldWater: null,
      hotWater: null,
      electricity: null,
      gas: null,
    },
  },
  requests: [],
  media: {
    photos: [],
    videos: [],
    audio: [],
    requestPhotos: [],
    counterPhotos: [],
    meterPhotos: [],
  },
  ui: {
    activeSection: 'home',
    isLoading: false,
    error: null,
  },
};

// ============================================
// CUSTOM STORAGE (интеграция со StorageService)
// ============================================

const storageServiceAdapter = {
  getItem: (name: string): string | null => {
    // Используем глобальный storage из StorageService
    if (typeof window !== 'undefined' && (window as any).storage) {
      const data = (window as any).storage.get(name.replace('zd_', ''), null);
      return data ? JSON.stringify(data) : null;
    }
    return null;
  },
  setItem: (name: string, value: string): void => {
    if (typeof window !== 'undefined' && (window as any).storage) {
      try {
        const data = JSON.parse(value);
        (window as any).storage.set(name.replace('zd_', ''), data);
      } catch (e) {
        console.error('Error saving to StorageService:', e);
      }
    }
  },
  removeItem: (name: string): void => {
    if (typeof window !== 'undefined' && (window as any).storage) {
      (window as any).storage.remove(name.replace('zd_', ''));
    }
  },
};

// ============================================
// STORE CREATION
// ============================================

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // ===== AUTH ACTIONS =====
        
        login: (code, user) => {
          console.log('🔐 Zustand: login', { code, user });
          set({ 
            auth: { 
              isAuthenticated: true, 
              loginCode: code, 
              user 
            } 
          });
        },
        
        logout: () => {
          console.log('🚪 Zustand: logout');
          set({ auth: initialState.auth });
          // Очистка других данных при выходе
          set({ 
            meters: initialState.meters,
            requests: initialState.requests,
            media: initialState.media,
          });
        },
        
        updateUser: (updates) => {
          const currentUser = get().auth.user;
          if (!currentUser) return;
          
          console.log('👤 Zustand: updateUser', updates);
          set({
            auth: {
              ...get().auth,
              user: { ...currentUser, ...updates },
            },
          });
        },
        
        // ===== METERS ACTIONS =====
        
        addMeterReading: (reading) => {
          const id = `meter_${Date.now()}`;
          const timestamp = Date.now();
          
          const fullReading: MeterReading = {
            ...reading,
            id,
            timestamp,
          };
          
          console.log('📊 Zustand: addMeterReading', fullReading);
          
          set((state) => ({
            meters: {
              ...state.meters,
              history: [fullReading, ...state.meters.history.slice(0, 49)], // Max 50
            },
          }));
          
          // Также обновляем lastReadings
          get().updateLastReading(reading.type, reading.value);
        },
        
        updateLastReading: (type, value) => {
          console.log('📈 Zustand: updateLastReading', { type, value });
          set((state) => ({
            meters: {
              ...state.meters,
              lastReadings: {
                ...state.meters.lastReadings,
                [type]: value,
              },
            },
          }));
        },
        
        // ===== REQUESTS ACTIONS =====
        
        addRequest: (request) => {
          console.log('📝 Zustand: addRequest', request);
          set((state) => ({
            requests: [request, ...state.requests],
          }));
        },
        
        updateRequest: (id, updates) => {
          console.log('✏️ Zustand: updateRequest', { id, updates });
          set((state) => ({
            requests: state.requests.map((req) =>
              req.id === id ? { ...req, ...updates } : req
            ),
          }));
        },
        
        deleteRequest: (id) => {
          console.log('🗑️ Zustand: deleteRequest', id);
          set((state) => ({
            requests: state.requests.filter((req) => req.id !== id),
          }));
        },
        
        // ===== MEDIA ACTIONS =====
        
        addPhoto: (photo, category = 'request') => {
          console.log('📷 Zustand: addPhoto', { photo, category });
          
          const categoryMap = {
            request: 'requestPhotos',
            counter: 'counterPhotos',
            meter: 'meterPhotos',
          };
          
          const key = categoryMap[category] || 'photos';
          
          set((state) => ({
            media: {
              ...state.media,
              [key]: [photo, ...state.media[key as keyof typeof state.media]],
            },
          }));
        },
        
        deletePhoto: (id, category = 'request') => {
          console.log('🗑️ Zustand: deletePhoto', { id, category });
          
          const categoryMap = {
            request: 'requestPhotos',
            counter: 'counterPhotos',
            meter: 'meterPhotos',
          };
          
          const key = categoryMap[category] || 'photos';
          
          set((state) => ({
            media: {
              ...state.media,
              [key]: state.media[key as keyof typeof state.media].filter(
                (p: any) => p.id !== id
              ),
            },
          }));
        },
        
        addVideo: (video) => {
          console.log('🎥 Zustand: addVideo', video);
          set((state) => ({
            media: {
              ...state.media,
              videos: [video, ...state.media.videos],
            },
          }));
        },
        
        deleteVideo: (id) => {
          console.log('🗑️ Zustand: deleteVideo', id);
          set((state) => ({
            media: {
              ...state.media,
              videos: state.media.videos.filter((v) => v.id !== id),
            },
          }));
        },
        
        addAudio: (audio) => {
          console.log('🎵 Zustand: addAudio', audio);
          set((state) => ({
            media: {
              ...state.media,
              audio: [audio, ...state.media.audio],
            },
          }));
        },
        
        deleteAudio: (id) => {
          console.log('🗑️ Zustand: deleteAudio', id);
          set((state) => ({
            media: {
              ...state.media,
              audio: state.media.audio.filter((a) => a.id !== id),
            },
          }));
        },
        
        // ===== UI ACTIONS =====
        
        setActiveSection: (section) => {
          console.log('🎯 Zustand: setActiveSection', section);
          set((state) => ({
            ui: { ...state.ui, activeSection: section },
          }));
        },
        
        setLoading: (isLoading) => {
          set((state) => ({
            ui: { ...state.ui, isLoading },
          }));
        },
        
        setError: (error) => {
          console.error('❌ Zustand: setError', error);
          set((state) => ({
            ui: { ...state.ui, error },
          }));
        },
        
        // ===== UTILITY =====
        
        clearAll: () => {
          console.log('🧹 Zustand: clearAll');
          set(initialState);
        },
        
        syncWithStorage: () => {
          console.log('🔄 Zustand: syncWithStorage - loading from StorageService');
          
          if (typeof window === 'undefined' || !(window as any).storage) {
            console.warn('⚠️ StorageService not available');
            return;
          }
          
          const storage = (window as any).storage;
          
          // Загрузить auth
          const loginCode = storage.get('login_code', null);
          const userData = storage.get('userData', null);
          
          if (loginCode && userData) {
            set({
              auth: {
                isAuthenticated: true,
                loginCode,
                user: userData,
              },
            });
          }
          
          // Загрузить meters
          const metersHistory = storage.get('metersHistory', []);
          const lastColdWater = storage.get('lastColdWater', null);
          const lastHotWater = storage.get('lastHotWater', null);
          const lastElectricity = storage.get('lastElectricity', null);
          const lastGas = storage.get('lastGas', null);
          
          set({
            meters: {
              history: metersHistory,
              lastReadings: {
                coldWater: lastColdWater,
                hotWater: lastHotWater,
                electricity: lastElectricity,
                gas: lastGas,
              },
            },
          });
          
          // Загрузить requests
          const requests = storage.get('requests', []);
          set({ requests });
          
          // Загрузить media
          const photos = storage.get('photos', []);
          const videos = storage.get('videos', []);
          const audio = storage.get('audio', []);
          const requestPhotos = storage.get('requestPhotos', []);
          const counterPhotos = storage.get('counterPhotos', []);
          const meterPhotos = storage.get('meterPhotos', []);
          
          set({
            media: {
              photos,
              videos,
              audio,
              requestPhotos,
              counterPhotos,
              meterPhotos,
            },
          });
          
          console.log('✅ Zustand: syncWithStorage complete');
        },
      }),
      {
        name: 'app-storage', // Ключ для persist
        storage: createJSONStorage(() => storageServiceAdapter),
        partialize: (state) => ({
          // Сохраняем только важные данные
          auth: state.auth,
          meters: {
            history: state.meters.history.slice(0, 50), // Ограничиваем
            lastReadings: state.meters.lastReadings,
          },
          requests: state.requests.slice(0, 50),
          // UI не сохраняем - он эфемерный
        }),
      }
    ),
    {
      name: 'App Store', // Имя для DevTools
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

// ============================================
// СЕЛЕКТОРЫ (для оптимизации re-renders)
// ============================================

export const selectAuth = (state: AppState) => state.auth;
export const selectUser = (state: AppState) => state.auth.user;
export const selectIsAuthenticated = (state: AppState) => state.auth.isAuthenticated;

export const selectMeters = (state: AppState) => state.meters;
export const selectMetersHistory = (state: AppState) => state.meters.history;
export const selectLastReadings = (state: AppState) => state.meters.lastReadings;

export const selectRequests = (state: AppState) => state.requests;
export const selectActiveRequests = (state: AppState) =>
  state.requests.filter((r) => r.status !== 'completed' && r.status !== 'rejected');

export const selectMedia = (state: AppState) => state.media;
export const selectPhotos = (state: AppState) => state.media.photos;
export const selectVideos = (state: AppState) => state.media.videos;

export const selectUI = (state: AppState) => state.ui;
export const selectIsLoading = (state: AppState) => state.ui.isLoading;
export const selectError = (state: AppState) => state.ui.error;

// ============================================
// ХУКИ (удобные обёртки)
// ============================================

export const useAuth = () => useAppStore(selectAuth);
export const useUser = () => useAppStore(selectUser);
export const useIsAuthenticated = () => useAppStore(selectIsAuthenticated);

export const useMeters = () => useAppStore(selectMeters);
export const useRequests = () => useAppStore(selectRequests);
export const useMedia = () => useAppStore(selectMedia);

export const useUI = () => useAppStore(selectUI);

console.log('🏪 Zustand Store initialized');



