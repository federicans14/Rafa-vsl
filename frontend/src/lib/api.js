import { API_BASE_URL } from '../config.js';

/**
 * Envoltorio mínimo sobre fetch. `credentials: 'include'` porque la sesión del
 * panel va en una cookie httpOnly.
 */
export async function apiFetch(path, options = {}) {
  const { body, headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    ...rest,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    // Respuesta sin cuerpo JSON — no es un error por sí mismo.
  }

  if (!response.ok) {
    const error = new Error(data?.error || `Error ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
