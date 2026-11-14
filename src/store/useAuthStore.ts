import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  refreshToken: string | null;
  setUser: (user: User | null) => void;
  setAuthenticated: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
  setTokens: (token: string, refreshToken: string) => void;
  clearAuth: () => void;
  login: (user: User, token: string, refreshToken: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,
      token: null,
      refreshToken: null,
      setUser: (user) => set({ user }),
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      setLoading: (value) => set({ isLoading: value }),
      setError: (error) => set({ error }),
      setTokens: (token, refreshToken) => set({ token, refreshToken }),
      clearAuth: () => set({
        user: null,
        isAuthenticated: false,
        token: null,
        refreshToken: null,
        error: null,
        isLoading: false,
      }),
      login: (user, token, refreshToken) => set({
        user,
        isAuthenticated: true,
        token,
        refreshToken,
        error: null,
        isLoading: false,
      }),
    }),
    {
      name: 'bhemed-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        refreshToken: state.refreshToken,
      }),
      // Al terminar la rehidratación, el estado de carga inicial se resuelve
      // (isLoading nunca se persiste; sin esto, las páginas protegidas quedan en spinner)
      onRehydrateStorage: () => (state) => {
        state?.setLoading(false);
      },
    }
  )
);

export default useAuthStore;