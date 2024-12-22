import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="fixed top-2 right-2 sm:top-4 sm:right-16 w-8 h-8 sm:w-10 sm:h-10 rounded-full z-50"
      title={theme === 'dark' ? t.theme.light : t.theme.dark}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">
        {theme === 'dark' ? t.theme.light : t.theme.dark}
      </span>
    </Button>
  );
}
