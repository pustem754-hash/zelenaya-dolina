import { create } from 'zustand';
import { MainScreenData } from '../types/api';

interface MainScreenState {
  data: MainScreenData | null;
  isLoading: boolean;
  error: Error | null;
  setData: (data: MainScreenData) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
  refresh: () => Promise<void>;
}

export const useMainScreenStore = create<MainScreenState>((set) => ({
  data: null,
  isLoading: false,
  error: null,
  setData: (data) => set({ data, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  refresh: async () => {
    set({ isLoading: true, error: null });
    try {
      const { fetchMainScreenData } = await import('../api/mainScreen');
      const data = await fetchMainScreenData();
      set({ data, isLoading: false, error: null });
    } catch (error) {
      set({
        error: error instanceof Error ? error : new Error('Unknown error'),
        isLoading: false,
      });
    }
  },
}));

