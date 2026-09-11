import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
export default function ThemeSwitcher() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  return (
    <div className="flex items-center gap-1 rounded-full bg-card/60 p-1"
      style={{ boxShadow: 'inset 0 0 0 1px rgb(var(--brd) / 0.15)' }}>
      <button type="button" aria-label="આઉટડોર"
        onClick={() => setTheme('outdoor')}
        className={`rounded-full p-2 ${theme === 'outdoor' ? 'bg-acc text-white' : 'text-sub'}`}>
        <Sun size={18} />
      </button>
      <button type="button" aria-label="ગ્રેફાઇટ"
        onClick={() => setTheme('dark')}
        className={`rounded-full p-2 ${theme === 'dark' ? 'bg-acc text-white' : 'text-sub'}`}>
        <Moon size={18} />
      </button>
    </div>
  );
}
