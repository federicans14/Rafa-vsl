/**
 * Límite de peticiones por IP, en memoria.
 *
 * Existe porque `POST /api/leads` es público y sin autenticar: cualquiera con
 * `curl` podría llenar la tabla de leads y, de paso, reventar el grupo de
 * WhatsApp de Rafa a avisos falsos.
 *
 * Se hace a mano y no con `express-rate-limit` para no meter una dependencia
 * nueva en un stack que el CLAUDE.md declara cerrado. Son cuatro líneas de
 * contador y no necesitamos nada de lo demás que trae esa librería.
 *
 * Dos limitaciones asumidas, ambas aceptables aquí:
 *
 *   1. El contador vive en memoria, así que se reinicia cuando Render duerme o
 *      redespliega el servicio. Un atacante paciente podría esperar. Da igual:
 *      el objetivo es cortar el script que dispara mil veces seguidas, no
 *      resistir un asedio.
 *   2. No vale para varias instancias a la vez, porque cada una tendría su
 *      propio contador. El plan gratuito de Render corre una sola.
 *
 * Sobre el margen: en España mucha gente navega desde móvil con CGNAT, o sea
 * compartiendo IP pública con cientos de personas. Por eso el tope es holgado.
 * Bloquear a un lead real cuesta mucho más que dejar pasar unos cuantos falsos.
 */

/** Cota de memoria: si se supera, se limpia lo caducado antes de aceptar más IPs. */
const MAX_TRACKED_IPS = 10000;

function createRateLimit({ windowMs, max, message }) {
  /** @type {Map<string, { count: number, resetAt: number }>} */
  const hits = new Map();

  function purgeExpired(now) {
    for (const [key, entry] of hits) {
      if (entry.resetAt <= now) hits.delete(key);
    }
  }

  return function rateLimit(req, res, next) {
    const now = Date.now();
    // `trust proxy` ya está activado en app.js, así que req.ip es la IP real
    // del visitante y no la del proxy de Render.
    const key = req.ip || 'desconocida';

    if (hits.size > MAX_TRACKED_IPS) purgeExpired(now);

    const entry = hits.get(key);

    if (!entry || entry.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    entry.count += 1;

    if (entry.count > max) {
      const segundos = Math.ceil((entry.resetAt - now) / 1000);
      res.set('Retry-After', String(segundos));
      console.warn(`[rateLimit] ${key} bloqueada: ${entry.count} intentos en la ventana`);
      return res.status(429).json({ error: message });
    }

    return next();
  };
}

module.exports = { createRateLimit };
