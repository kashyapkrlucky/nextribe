import { IReply } from "@/core/types/index.types";
import { logger } from "@/core/utils/logger";
import axios from "@/lib/axios";
import { create } from "zustand";

interface ReplyStore {
  loading: boolean;
  error: string | null;
  replies: IReply[];
  page: number;
  totalPages: number;
  fetchReplies: (
    discussionId: string,
    page: number,
    limit: number
  ) => Promise<void>;
  submitReply: (
    discussionId: string,
    body: string,
    tag: string
  ) => Promise<void>;
}
export const useReplyStore = create<ReplyStore>((set) => ({
  loading: false,
  error: null,
  replies: [],
  page: 1,
  totalPages: 1,
  fetchReplies: async (discussionId, page, limit) => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.get(
        `/v2/discussions/${discussionId}/replies?limit=${limit}&page=${page}`
      );
      set((state) => ({
        replies: page === 1 ? data.data : [...state.replies, ...data.data],
        page,
        totalPages: data.totalPages,
        loading: false,
        error: null,
      }));
    } catch (error) {
      logger.error("Failed to fetch replies", error);
      set({ loading: false, error: "Failed to fetch replies" });
    } finally {
      set({ loading: false });
    }
  },
  submitReply: async (discussionId: string, body: string, tag: string) => {
    try {
      set({ loading: true, error: null });
      await axios.post(`/v2/discussions/${discussionId}/replies`, { body, tag });
    } catch (error) {
      logger.error("Failed to submit reply", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
