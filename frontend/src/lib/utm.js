/**
 * Parámetros de campaña. Aquí importan más que en el otro funnel: los leads del
 * VSL y los del quiz caen en el MISMO grupo de WhatsApp, y `utm_campaign` con el
 * nombre del anuncio es lo que permite saber de dónde viene cada uno.
 */
export function getUtmParams() {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);

  return {
    utm_source: params.get('utm_source') || '',
    utm_campaign: params.get('utm_campaign') || '',
    fuente: params.get('fuente') || params.get('utm_medium') || 'vsl',
  };
}
