import { apiFetch } from './api.js';
import { getUtmParams } from './utm.js';
import { API_BASE_URL } from '../config.js';

/**
 * Manda el lead al backend.
 *
 * Diferencia importante con el funnel del quiz: allí el POST no decide nada, el
 * visitante pasa igual a WhatsApp. Aquí **el resultado sí importa**, porque es lo
 * que desbloquea el vídeo. Aun así nunca se le deja atrapado: si el backend
 * falla, se le desbloquea igualmente y se registra el aviso. Perder un registro
 * es malo; perder a alguien que ya había dado sus datos es peor.
 *
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function submitLead(formData) {
  const payload = {
    name: formData.name.trim(),
    email: formData.email.trim(),
    phone: formData.phone.trim(),
    ...getUtmParams(),
  };

  if (!API_BASE_URL) {
    console.warn('[submitLead] VITE_API_URL sin configurar — lead no enviado:', payload);
    return { ok: false, error: 'API sin configurar' };
  }

  try {
    await apiFetch('/api/leads', { method: 'POST', body: payload });
    return { ok: true };
  } catch (error) {
    console.warn('[submitLead] No se pudo guardar el lead:', error.message);
    return { ok: false, error: error.message };
  }
}
