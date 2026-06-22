import { Moon, Sun } from 'lucide-react';
import { IconButton } from './IconButton';
import { useTheme } from '../../contexts/ThemeContext';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <IconButton
      type="button"
      title={isDark ? '切換淺色模式' : '切換深色模式'}
      aria-label={isDark ? '切換淺色模式' : '切換深色模式'}
      onClick={toggleTheme}
    >
      {isDark ? <Sun size={20} strokeWidth={2.5} /> : <Moon size={20} strokeWidth={2.5} />}
    </IconButton>
  );
}

ThemeToggle.toolLabel = '主題';

export default ThemeToggle;
