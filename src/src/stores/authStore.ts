import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IUser } from "@/types/authen.type";

interface AuthState {
  access_token: string | null;
  user: IUser | null;
  isAuthenticated: boolean;
  setAccessToken: (token: string | null) => void;
  setUser: (user: IUser | null) => void;
  loginAction: (token: string, user: IUser) => void;
  logoutAction: () => void;
  setRefreshTokenAction: (show: boolean, message?: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      access_token: null,
      user: null,
      isAuthenticated: false,

      setAccessToken: (token) =>
        set({ access_token: token, isAuthenticated: !!token }),

      setUser: (user) => set({ user }),

      loginAction: (token, user) =>
        set({ access_token: token, user, isAuthenticated: true }),

      logoutAction: () =>
        set({ access_token: null, user: null, isAuthenticated: false }),

      setRefreshTokenAction: (show, message) => {
        console.warn(`Token expired notify [${show}]: ${message || ""}`);
        if (show) {
          set({ access_token: null, user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: "admin-auth-storage", // key trong localStorage (khác với client)
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        access_token: state.access_token,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
