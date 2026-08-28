/** Fecha en formato español y hora de Madrid, que es donde se leen los avisos. */
function formatDate(date) {
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'Europe/Madrid',
  }).format(date);
}

/**
 * El aviso empieza por VSL a propósito: Rafa recibe leads de dos landings y
 * necesita distinguirlos de un vistazo. Los de aquí han visto nueve minutos de
 * vídeo antes de dejar sus datos, así que llegan mucho más calientes que los del
 * quiz — y merecen que los llame antes.
 */
function buildMessage(lead) {
  const lines = [
    '🎬 *NUEVO LEAD VSL — Rafa Coaching*',
    '',
    `👤 *${lead.name}*`,
    `📱 ${lead.phone}`,
    `✉️ ${lead.email}`,
  ];

  const origen = [lead.fuente, lead.utm_source, lead.utm_campaign].filter(Boolean).join(' · ');
  if (origen) {
    lines.push('');
    lines.push(`📊 ${origen}`);
  }

  lines.push('');
  lines.push(`🕐 ${formatDate(new Date())}`);

  return lines.join('\n');
}

/**
 * Avisa por WhatsApp al grupo vía Green API.
 *
 * Regla firme: esto NUNCA bloquea ni tumba el alta de un lead. Si faltan
 * credenciales o la llamada falla, se avisa por consola y ya está — el lead ya
 * está guardado, que es lo que no se puede perder.
 *
 * OJO con el `chatId`: tiene que ser el de un grupo **propio de esta landing**.
 * Si se reutiliza el de `plan.entrenaconrafa.com`, los leads de los dos funnels
 * caen en el mismo sitio y deja de saberse cuál viene de dónde.
 *
 * @returns {Promise<boolean>} si el aviso salió o no (solo informativo)
 */
async function notifyWhatsapp(lead) {
  const baseUrl = process.env.GREEN_API_URL;
  const instanceId = process.env.GREEN_API_INSTANCE_ID;
  const token = process.env.GREEN_API_TOKEN;
  const chatId = process.env.GREEN_API_CHAT_ID;

  if (!baseUrl || !instanceId || !token || !chatId) {
    console.warn('[notifyWhatsapp] Credenciales de Green API incompletas — aviso no enviado.');
    return false;
  }

  const url = `${baseUrl.replace(/\/$/, '')}/waInstance${instanceId}/sendMessage/${token}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, message: buildMessage(lead) }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.warn(`[notifyWhatsapp] Green API respondió ${response.status}`);
      return false;
    }

    return true;
  } catch (error) {
    console.warn('[notifyWhatsapp] Fallo al enviar el aviso:', error.message);
    return false;
  }
}

module.exports = { notifyWhatsapp, buildMessage };
