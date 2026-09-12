import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

export default function ThemeSwitcher() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  const isDark = theme === 'dark' || theme === 'premium';
  
  const toggleTheme = () => {
    setTheme(theme === 'outdoor' ? 'dark' : 'outdoor');
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative flex items-center rounded-full bg-card/60 w-14 h-8 transition-colors"
      style={{ boxShadow: 'inset 0 0 0 1px rgb(var(--brd) / 0.15)' }}
      aria-label="Toggle theme"
    >
      <div 
        className="absolute left-[2px] flex h-[28px] w-[28px] items-center justify-center rounded-full bg-acc text-white shadow-sm transition-transform duration-300 ease-in-out z-10"
        style={{ transform: `translateX(${isDark ? '24px' : '0px'})` }}
      >
        {isDark ? <Moon size={14} /> : <Sun size={14} />}
      </div>
      <div className="relative flex w-full justify-between px-[6px] text-sub z-0 pointer-events-none">
        <Sun size={14} className={isDark ? 'opacity-100' : 'opacity-0'} />
        <Moon size={14} className={isDark ? 'opacity-0' : 'opacity-100'} />
      </div>
    </button>
  );
}
