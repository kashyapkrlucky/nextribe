import { create } from "zustand";
import axios, { AxiosError } from "@/lib/axios";
import { IUser, IProfile } from "@/core/types/index.types";

interface UserState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  passwordLinkSent: boolean;
  profile: IProfile | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ status: number; data?: { user: IUser; token: string } }>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
  }) => Promise<{ status: number; data?: { user: IUser; token: string } }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  forgotPassword: (email: string) => Promise<void>;
  validateToken: (token: string) => Promise<boolean>;
  resetPassword: (token: string, password: string) => Promise<void>;
  getProfile: (username: string) => Promise<void>;
  updateProfile: (profileData: Partial<IProfile>) => Promise<void>;
  updateAvatar: (avatar: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  passwordLinkSent: false,
  profile: null,
  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.post("/auth/sign-in", { email, password });
      set({
        user: data.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      set({
        error: err.response?.data?.message || "Login failed",
        isLoading: false,
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (userData) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.post("/auth/sign-up", userData);
      set({
        user: data.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      set({
        error: err.response?.data?.message || "Registration failed",
        isLoading: false,
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({
        user: null,
        isAuthenticated: false,
        error: null,
      });
    } catch (error) {
      console.error("Logout error:", error);
      set({
        error: "Failed to logout",
        user: null,
        isAuthenticated: false,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const { data } = await axios.get("/auth/me");
      set({
        user: data.data,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error("auth error:", error);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
  forgotPassword: async (email: string) => {
    try {
      set({ isLoading: true, passwordLinkSent: false });
      await axios.post("/auth/forgot-password", { email });
      set({ passwordLinkSent: true });
    } catch (error) {
      console.error(error);
      set({ error: "Failed to send reset email" });
    } finally {
      set({ isLoading: false });
    }
  },
  validateToken: async (token: string) => {
    try {
      await axios.post("/auth/validate-token", { token });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  resetPassword: async (token: string, password: string) => {
    try {
      await axios.post("/auth/reset-password", { token, password });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  getProfile: async (username: string) => {
    try {
      set({ isLoading: true, error: null });
      const {
        data: { data },
      } = await axios.get(`/auth/profile/${username}`);
      set({ profile: data });
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      set({
        error: err.response?.data?.error,
        isLoading: false,
      });
    } finally {
      set({ isLoading: false });
    }
  },
  updateProfile: async (profile: Partial<IProfile>) => {
    try {
      set({ isLoading: true });
      await axios.patch("/auth/profile/update", profile);
      set((state) => ({
        profile: state.profile ? { ...state.profile, ...profile } : null,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },
  updateAvatar: async (avatar: string) => {
    try {
      set({ isLoading: true });
      await axios.patch("/auth/user/update", { avatar });
      set((state) => ({
        profile: state.profile ? { ...state.profile, user: { ...state.profile.user, avatar } } : null,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
