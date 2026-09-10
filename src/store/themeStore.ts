import { create } from 'zustand';
export type Theme = 'outdoor' | 'dark' | 'premium';
type S = { theme: Theme; setTheme: (t: Theme) => void };
export const useThemeStore = create<S>((set) => ({
  theme: (localStorage.getItem('theme') as Theme) || 'dark',
  setTheme: (t) => {
    const root = document.documentElement;
    root.classList.add('theme-switching');
    root.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
    set({ theme: t });
    
    requestAnimationFrame(() => {
      setTimeout(() => {
        root.classList.remove('theme-switching');
      }, 120);
    });
  },
}));
document.documentElement.setAttribute('data-theme', useThemeStore.getState().theme);
