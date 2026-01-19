import { SearchResultResponse } from "@/core/types/index.types";
import { logger } from "@/core/utils/logger";
import axios from "@/lib/axios";
import { create } from "zustand";

interface SearchStore {
  loading: boolean;
  error: string | null;
  results: SearchResultResponse | null;
  getSearchResults: (query: string) => Promise<void>;
}

export const useSearchStore = create<SearchStore>((set) => ({
  loading: false,
  error: "",
  results: null,
  getSearchResults: async (query: string) => {
    try {
      set({ loading: true, error: null });
      const { data:{data} } = await axios.get(
        `/v2/search?q=${encodeURIComponent(query)}`
      );
      set({ results: data });
    } catch (error: unknown) {
      logger.error("Search error:", error);
    } finally {
      set({ loading: false });
    }
  },
}));
