import { API_BASE_URL } from '../config.js';

let alreadyCalled = false;

/**
 * El backend vive en un Render gratuito que duerme a los 15 min sin tráfico, y
 * tarda ~22 segundos en despertar (medido). Se le hace ping al abrir la página.
 *
 * Aquí importa más que en el funnel del quiz: allí el visitante tarda 30 s en
 * completar los pasos, tiempo de sobra. Aquí puede rellenar el formulario en 15
 * y quedarse mirando una pantalla quieta esperando a que arranque el vídeo.
 *
 * Silencioso a propósito: si falla no debe afectar a nada.
 */
export function prewarmBackend() {
  if (alreadyCalled || !API_BASE_URL) return;
  alreadyCalled = true;

  fetch(`${API_BASE_URL}/api/health`, { method: 'GET', mode: 'cors' }).catch(() => {});
}
