import { create } from 'zustand';
import axios, { AxiosError } from '@/lib/axios';
import { ITopic } from '@/core/types/index.types';

interface TopicState {
  topics: ITopic[];
  isLoading: boolean;
  error: string | null;
  fetchTopics: () => Promise<void>;
  clearError: () => void;
}

export const useTopicStore = create<TopicState>((set) => ({
  topics: [],
  isLoading: false,
  error: null,

  fetchTopics: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.get('/topics');
      set({ 
        topics: data || [], 
        isLoading: false 
      });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      set({ 
        error: err.response?.data?.message || 'Failed to fetch topics',
        isLoading: false 
      });
    }
  },

  clearError: () => set({ error: null }),
}));
