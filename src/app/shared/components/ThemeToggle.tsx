import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/app/shared/stores/themeStore';

export function ThemeToggle() {
  const { resolved, toggle } = useTheme();
  const isDark = resolved === 'dark';
  return (
    <button
      onClick={toggle}
      title={isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
      className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-600 transition"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
