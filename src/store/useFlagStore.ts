
import { create } from "zustand";
interface IFlag {
  code: string;
  name: string;
  status: string;
}
interface FlagState {
  flags: IFlag[];
  isLoading: boolean;
  error: string | null;
  fetchFlags: () => Promise<void>;
  clearError: () => void;
}
const FEATURE_FLAG_APP_URL = process.env.NEXT_PUBLIC_FEATURE_FLAG_APP_URL as string;
if (!FEATURE_FLAG_APP_URL) {
  throw new Error("FEATURE_FLAG_APP_URL is not set in environment variables");
}

const FEATURE_FLAG_APP_URL_TOKEN = process.env.NEXT_PUBLIC_FEATURE_FLAG_APP_URL_TOKEN as string;
if (!FEATURE_FLAG_APP_URL_TOKEN) {
  throw new Error("FEATURE_FLAG_APP_URL_TOKEN is not set in environment variables");
}

export const useFlagStore = create<FlagState>((set) => ({
  flags: [],
  isLoading: false,
  error: null,

  fetchFlags: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${FEATURE_FLAG_APP_URL}/api/access/flags`, {
        headers: {
          Authorization: `Bearer ${FEATURE_FLAG_APP_URL_TOKEN}`,
        },
      });
      const data = await response.json();
      set({
        flags: data || [],
        isLoading: false,
      });
    } catch (error) {
      console.log(error);

      set({
        error: "Failed to fetch flags",
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
