'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store/useThemeStore';

export function useInitTheme() {
  const { initializeTheme } = useThemeStore();

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);
}