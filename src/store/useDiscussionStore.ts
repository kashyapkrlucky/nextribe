import { create } from "zustand";
import axios, { AxiosError } from "@/lib/axios";
import { IDiscussion } from "@/core/types/index.types";

interface DiscussionState {
  discussion: IDiscussion | null;
  discussionList: IDiscussion[];
  isLoading: boolean;
  error: string | null;
  userDiscussions: IDiscussion[];
  fetchDiscussion: (id: string) => Promise<void>;
  fetchDiscussionBySlug: (slug: string) => Promise<void>;
  fetchDiscussionList: () => Promise<void>;
  fetchDiscussionsByCommunity: (communityId: string) => Promise<void>;
  fetchDiscussionByUser: (username: string) => Promise<void>;
  addDiscussion: (
    discussion: Omit<IDiscussion, "_id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateDiscussion: (
    id: string,
    updates: Partial<IDiscussion>
  ) => Promise<void>;
  deleteDiscussion: (id: string) => Promise<void>;
  voteDiscussion: (id: string, vote: "up" | "down") => Promise<void>;
}

export const useDiscussionStore = create<DiscussionState>((set) => ({
  discussion: null,
  discussionList: [],
  isLoading: false,
  error: null,
  userDiscussions: [],
  fetchDiscussionList: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.get("/discussions");
      set({ discussionList: data.data || [], isLoading: false });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      set({
        error: err.response?.data?.message || "Failed to fetch discussions",
        isLoading: false,
      });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchDiscussion: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.get(`/discussions/${id}`);
      set({ discussion: data.data || [], isLoading: false });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      set({
        error: err.response?.data?.message || "Failed to fetch discussions",
        isLoading: false,
      });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchDiscussionBySlug: async (slug: string) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.get(`/discussions/slug/${slug}`);
      set({ discussion: data || [], isLoading: false });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      set({
        error: err.response?.data?.message || "Failed to fetch discussions",
        isLoading: false,
      });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchDiscussionsByCommunity: async (communityId: string) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.get(
        `/communities/${communityId}/discussions`
      );

      set({
        discussionList: data.discussions,
      });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      throw new Error(
        err.response?.data?.message || "Failed to get discussions"
      );
    } finally {
      set({ isLoading: false });
    }
  },
  fetchDiscussionByUser: async (username: string) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.get(`/discussions/user/${username}`);
      set({ userDiscussions: data.data || [], isLoading: false });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      set({
        error: err.response?.data?.message || "Failed to fetch discussions",
        isLoading: false,
      });
    } finally {
      set({ isLoading: false });
    }
  },
  addDiscussion: async (discussion) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.post("/discussions", discussion);
      set((state) => ({
        discussionList: [data.data, ...state.discussionList],
      }));
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      throw new Error(
        err.response?.data?.message || "Failed to add discussion"
      );
    } finally {
      set({ isLoading: false });
    }
  },

  updateDiscussion: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.patch(`/discussions/${id}`, updates);
      set((state) => ({
        discussionList: state.discussionList.map((discussion) =>
          discussion._id.toString() === id
            ? { ...discussion, ...data.data }
            : discussion
        ),
      }));
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      throw new Error(
        err.response?.data?.message || "Failed to update discussion"
      );
    } finally {
      set({ isLoading: false });
    }
  },

  deleteDiscussion: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await axios.delete(`/discussions/${id}`);
      set((state) => ({
        discussionList: state.discussionList.filter(
          (discussion) => discussion._id.toString() !== id
        ),
      }));
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      throw new Error(
        err.response?.data?.message || "Failed to delete discussion"
      );
    } finally {
      set({ isLoading: false });
    }
  },
  voteDiscussion: async (id, vote) => {
    try {
      await axios.post(`/discussions/${id}/vote`, { vote });
      set((state) => ({
        discussionList: state.discussionList.map((discussion) =>
          discussion._id.toString() === id
            ? {
                ...discussion,
                upVoteCount:
                  vote === "up"
                    ? (discussion.upVoteCount || 0) + 1
                    : discussion.upVoteCount,
                downVoteCount:
                  vote === "down"
                    ? (discussion.downVoteCount || 0) + 1
                    : discussion.downVoteCount,
              }
            : discussion
        ),
      }));
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      throw new Error(
        err.response?.data?.message || "Failed to vote discussion"
      );
    }
  },
}));
