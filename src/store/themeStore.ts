import { create } from 'zustand';
export type Theme = 'outdoor' | 'dark' | 'premium';
type S = { theme: Theme; setTheme: (t: Theme) => void };
export const useThemeStore = create<S>((set) => ({
  theme: (localStorage.getItem('theme') as Theme) || 'dark',
  setTheme: (t) => {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
    set({ theme: t });
  },
}));
document.documentElement.setAttribute('data-theme', useThemeStore.getState().theme);
