import { create } from 'zustand';
import axios, { AxiosError } from '@/lib/axios';
import { IDiscussion } from '@/core/types/index.types';

interface DiscussionState {
  discussions: IDiscussion[];
  isLoading: boolean;
  error: string | null;
  fetchDiscussions: () => Promise<void>;
  addDiscussion: (discussion: Omit<IDiscussion, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateDiscussion: (id: string, updates: Partial<IDiscussion>) => Promise<void>;
  deleteDiscussion: (id: string) => Promise<void>;
}

export const useDiscussionStore = create<DiscussionState>((set) => ({
  discussions: [],
  isLoading: false,
  error: null,

  fetchDiscussions: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.get('/discussions');
      set({ discussions: data.data || [], isLoading: false });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      set({ 
        error: err.response?.data?.message || 'Failed to fetch discussions',
        isLoading: false 
      });
    }
  },

  addDiscussion: async (discussion) => {
    try {
      const { data } = await axios.post('/discussions', discussion);
      set((state) => ({
        discussions: [data.data, ...state.discussions],
      }));
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      throw new Error(err.response?.data?.message || 'Failed to add discussion');
    }
  },

  updateDiscussion: async (id, updates) => {
    try {
      const { data } = await axios.patch(`/discussions/${id}`, updates);
      set((state) => ({
        discussions: state.discussions.map((discussion) =>
          discussion._id.toString() === id ? { ...discussion, ...data.data } : discussion
        ),
      }));
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      throw new Error(err.response?.data?.message || 'Failed to update discussion');
    }
  },

  deleteDiscussion: async (id) => {
    try {
      await axios.delete(`/discussions/${id}`);
      set((state) => ({
        discussions: state.discussions.filter((discussion) => discussion._id.toString() !== id),
      }));
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      throw new Error(err.response?.data?.message || 'Failed to delete discussion');
    }
  },
}));
