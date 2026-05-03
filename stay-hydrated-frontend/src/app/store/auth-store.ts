import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import {
    login as apiLogin,
    logout as apiLogout,
    register as apiRegister,
} from "../api/auth";

type AuthStore = {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  error: null,

  initialize: async () => {
    const token = await SecureStore.getItemAsync("accessToken");
    set({ isAuthenticated: !!token, isLoading: false });
  },

  login: async (email, password) => {
    set({ error: null });
    try {
      await apiLogin(email, password);
      set({ isAuthenticated: true });
    } catch (e: any) {
      console.error("[login error]", e.code, e.message, JSON.stringify(e.response?.data));
      const msg = e.response?.data?.message
        ?? (e.code === "ERR_NETWORK" ? "Cannot reach server — is the backend running?" : `Login failed (${e.code ?? e.message})`);
      set({ error: msg });
      throw e;
    }
  },

  register: async (name, email, password) => {
    set({ error: null });
    try {
      await apiRegister(name, email, password);
      set({ isAuthenticated: true });
    } catch (e: any) {
      console.error("[register error]", e.code, e.message, JSON.stringify(e.response?.data));
      const msg = e.response?.data?.message
        ?? (e.code === "ERR_NETWORK" ? "Cannot reach server — is the backend running?" : `Registration failed (${e.code ?? e.message})`);
      set({ error: msg });
      throw e;
    }
  },

  logout: async () => {
    await apiLogout();
    set({ isAuthenticated: false });
  },
}));
