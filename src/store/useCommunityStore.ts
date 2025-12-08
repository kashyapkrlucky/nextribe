import { ICommunity } from "@/core/types/index.types";
import axios from "axios";
import { create } from "zustand";

interface CommunityState {
  communities: ICommunity[];
  community: ICommunity | null;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  fetchCommunities: (params?: string) => Promise<void>;
  fetchCommunityByID: (id: string) => Promise<void>;
  fetchCommunityBySlug: (name: string) => Promise<void>;
  onCommunityJoin: (communityId: string) => void;
}

export const useCommunityStore = create<CommunityState>((set) => ({
  communities: [],
  community: null,
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  fetchCommunities: async (params = "") => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.get(`/api/communities?${params}`);
      set({
        communities: data.communities || [],
        totalPages: data.totalPages || 1,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch communities";
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },
  onCommunityJoin: async (communityId: string) => {
    try {
      set({ isLoading: true, error: null });
      const res = await axios.post(`/api/communities/${communityId}/join`);
      if (res.status === 401) {
        window.location.href = "/sign-in";
        return;
      }
    } catch (e) {
      console.error(e);
      alert("Failed to join community");
    }
  },
  fetchCommunityByID: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.get(`/api/communities/${id}`);
      set({ community: data.community || null });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch community";
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchCommunityBySlug: async (name: string) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.get(
        `/api/communities/slug/${encodeURIComponent(name)}`
      );
      set({ community: data.community || null });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch community";
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },
}));
