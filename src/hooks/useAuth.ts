'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, error, token, refreshToken } = useAuthStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Simular verificación de sesión
    const stored = localStorage.getItem('bhemed-auth');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.token && data.user) {
          useAuthStore.getState().login(data.user, data.token, data.refreshToken || '');
        }
      } catch (error) {
        console.error('Error parseando auth:', error);
      }
    }
    useAuthStore.getState().setLoading(false);
    setInitialized(true);
  }, []);

  return { user, isAuthenticated, isLoading: !initialized, error, token, refreshToken, router };
}