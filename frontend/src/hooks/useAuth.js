import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '../lib/api.js';

/**
 * Sesión del panel.
 *
 * No guarda ningún token en el navegador: la sesión va en una cookie httpOnly que
 * el JavaScript no puede leer, y por eso todas las llamadas usan
 * `credentials: 'include'`. `GET /api/auth/me` es lo que dice si sigue viva.
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [cargando, setCargando] = useState(true);

  const comprobar = useCallback(async () => {
    try {
      const data = await apiFetch('/api/auth/me');
      setUser(data?.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    comprobar();
  }, [comprobar]);

  const login = useCallback(async (email, password) => {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    setUser(data?.user ?? null);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setUser(null);
    }
  }, []);

  return { user, cargando, login, logout, comprobar };
}
