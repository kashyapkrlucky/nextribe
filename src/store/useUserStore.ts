import { create } from 'zustand';
import axios, { AxiosError } from '@/lib/axios';
import { IUser } from '@/core/types/index.types';

interface UserState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { 
    name: string; 
    email: string; 
    password: string; 
    username: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.post('/auth/sign-in', { email, password });
      set({ 
        user: data.data.user,
        isAuthenticated: true,
        isLoading: false 
      });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      set({ 
        error: err.response?.data?.message || 'Login failed',
        isLoading: false 
      });
      throw error;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.post('/auth/sign-up', userData);
      set({ 
        user: data.data.user,
        isAuthenticated: true,
        isLoading: false 
      });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      set({ 
        error: err.response?.data?.message || 'Registration failed',
        isLoading: false 
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await axios.post('/auth/logout');
      set({ 
        user: null, 
        isAuthenticated: false,
        error: null 
      });
    } catch (error) {
      console.error('Logout error:', error);
      set({ 
        error: 'Failed to logout',
        user: null,
        isAuthenticated: false
      });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const { data } = await axios.get('/auth/me');
      set({ 
        user: data.data,
        isAuthenticated: true,
        isLoading: false 
      });
    } catch (error) {
      console.log(error);
      set({ 
        user: null,
        isAuthenticated: false,
        isLoading: false 
      });
    }
  },

  clearError: () => set({ error: null }),
}));
