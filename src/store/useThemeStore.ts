import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      isDark: false,
      setTheme: (theme) => {
        set({ theme });
        get().initializeTheme();
      },
      toggleTheme: () => {
        const { isDark } = get();
        const newTheme = isDark ? 'light' : 'dark';
        set({ isDark: !isDark, theme: newTheme });
        if (typeof window !== 'undefined') {
          document.documentElement.classList.toggle('dark', !isDark);
        }
      },
      initializeTheme: () => {
        const { theme } = get();
        if (typeof window === 'undefined') return;
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = theme === 'dark' || (theme === 'system' && systemDark);
        set({ isDark });
        document.documentElement.classList.toggle('dark', isDark);
      },
    }),
    {
      name: 'bhemed-theme',
    }
  )
);

export default useThemeStore;