'use client';

import { type ReactNode } from 'react';
import { ThemeContext, useThemeProvider } from '@/hooks/useTheme';

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme, toggleTheme } = useThemeProvider();

  // SSRフラッシュ防止: テーマ確定まで非表示
  if (!theme) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
