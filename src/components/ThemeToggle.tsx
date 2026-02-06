'use client';

import { useTheme } from '@/hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
      className="w-8 h-8 flex items-center justify-center rounded-lg bg-bg-surface/60 hover:bg-bg-surface transition-colors text-base"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
