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
  currentDiscussionId: string | null;
  fetchReplies: (
    discussionId: string,
    page: number,
    limit: number,
  ) => Promise<void>;
  submitReply: (
    discussionId: string,
    body: string,
    tag: string,
  ) => Promise<void>;
  updateVoteOnReply: (replyId: string, vote: "up" | "down") => Promise<void>;
  deleteReply: (replyId: string) => Promise<void>;
  resetReplies: () => void;
}
export const useReplyStore = create<ReplyStore>((set) => ({
  loading: false,
  error: null,
  replies: [],
  page: 1,
  totalPages: 1,
  currentDiscussionId: null,
  resetReplies: () => {
    set({
      replies: [],
      page: 1,
      totalPages: 1,
      currentDiscussionId: null,
      loading: false,
      error: null,
    });
  },
  fetchReplies: async (discussionId, page, limit) => {
    try {
      set({ loading: true, error: null });
      const {
        data: { data, totalPages },
      } = await axios.get(
        `/v2/discussions/${discussionId}/replies?limit=${limit}&page=${page}`,
      );
      set((state) => {
        const isNewDiscussion = state.currentDiscussionId !== discussionId;
        const shouldReplace = isNewDiscussion || page === 1;

        const newState = {
          replies: shouldReplace ? data : [...state.replies, ...data],
          page: isNewDiscussion ? 1 : page,
          totalPages,
          currentDiscussionId: discussionId,
          loading: false,
          error: null,
        };

        return newState;
      });
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
      await axios.post(`/v2/discussions/${discussionId}/replies`, {
        body,
        tag,
      });
    } catch (error) {
      logger.error("Failed to submit reply", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  updateVoteOnReply: async (replyId: string, vote: "up" | "down") => {
    try {
      const {
        data: { data },
      } = await axios.patch(`/v2/replies/${replyId}/vote`, { vote });
      set((state) => ({
        replies: state.replies.map((reply) =>
          reply._id.toString() === replyId ? data : reply,
        ),
      }));
    } catch (error) {
      logger.error("Failed to update vote on reply", error);
      throw error;
    }
  },
  deleteReply: async (replyId: string) => {
    try {
      await axios.delete(`/v2/replies/${replyId}`);
      set((state) => ({
        replies: state.replies.filter((reply) => reply._id.toString() !== replyId),
      }));
    } catch (error) {
      logger.error("Failed to delete reply", error);
      throw error;
    }
  },
}));
