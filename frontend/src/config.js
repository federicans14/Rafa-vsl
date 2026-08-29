// ---------------------------------------------------------------------------
// Datos de marca y contacto — Rafa Coaching · Fuerte y Estético
//
// Todo lo de aquí sale del propio VSL (ver ../../COPY-FUENTE.md). No inventar
// cifras ni promesas: la página tiene que reforzar lo que el visitante acaba de
// oír durante nueve minutos, no contarle otra cosa.
// ---------------------------------------------------------------------------

export const BRAND = {
  name: 'Rafa Coaching',

  /**
   * Lo que se ve arriba a la izquierda y en el pie. "Entrena con Rafa" y no
   * "Rafa Coaching" porque es su handle de Instagram y su dominio: el visitante
   * que venga de sus redes reconoce el nombre al instante.
   * `wordmarkAccent` va en azul, igual que en sus otras dos webs.
   */
  wordmark: 'Entrena con',
  wordmarkAccent: 'Rafa',

  coach: 'Rafa Alfaro',
  program: 'Fuerte y Estético',
  instagram: '@entrenaconrafa_',

  // El MISMO número que plan.entrenaconrafa.com. Formato internacional sin '+'.
  whatsappNumber: '34622633345',

  // Cifras dichas por él en el vídeo. Su web y la otra landing todavía dicen
  // "+700": está pendiente unificarlas (ver COPY-FUENTE.md).
  peopleHelped: '+800',
  yearsCoaching: '+6',
  ownMuscleGain: '15 kg',
};

/**
 * El VSL termina con "no tienes que comprar nada directamente, simplemente
 * escríbeme". Por eso el mensaje precargado pregunta, no compra: prometer una
 * venta directa contradiría el vídeo.
 */
export const WHATSAPP_MESSAGE =
  'Hola Rafa, acabo de ver el vídeo de Fuerte y Estético y quiero que me cuentes cómo funciona.';

export function buildWhatsappUrl() {
  const text = encodeURIComponent(WHATSAPP_MESSAGE);
  const isMobile =
    typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  return isMobile
    ? `whatsapp://send?phone=${BRAND.whatsappNumber}&text=${text}`
    : `https://wa.me/${BRAND.whatsappNumber}?text=${text}`;
}

// ---------------------------------------------------------------------------
// El VSL
// ---------------------------------------------------------------------------

export const VSL = {
  youtubeId: 'DGXR5Dj_TWI',
  // La duracion NO se enseña en ninguna parte (decision del 29/08). Anunciar
  // "8 min" hace que gente que habria visto el video entero decida antes de
  // empezar que no tiene tiempo. Se deja el dato aqui solo como referencia
  // interna: no volver a sacarlo a la pagina.
  durationLabel: '8 min',
  // youtube-nocookie: no planta cookies de seguimiento hasta que se reproduce,
  // y esta marca todavía no tiene aviso de cookies.
  embedBase: 'https://www.youtube-nocookie.com/embed/',
  posterUrl: 'https://i.ytimg.com/vi/DGXR5Dj_TWI/maxresdefault.jpg',
};

export const API_BASE_URL = (import.meta.env?.VITE_API_URL || '').replace(/\/$/, '');
