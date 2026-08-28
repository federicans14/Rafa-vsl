const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
const MIN_PHONE_DIGITS = 8;

// Topes de longitud: nada de esto debería llegar largo, y evita que alguien meta
// un texto enorme en la tabla desde el endpoint público.
const MAX_LENGTHS = {
  name: 120,
  email: 200,
  phone: 32,
  utm_source: 120,
  utm_campaign: 120,
  fuente: 120,
};

function clean(value, max) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

/**
 * Misma validación que el formulario del vídeo, repetida aquí a propósito: la del
 * cliente se puede saltar, la del servidor no. Es la única que cuenta.
 *
 * Los tres campos son obligatorios, al revés que en `plan.entrenaconrafa.com`,
 * donde el email se retiró para bajar fricción. Aquí hay un VSL de nueve minutos
 * y un seguimiento comercial detrás: el correo se usa de verdad.
 *
 * CRÍTICO con el teléfono: el selector de país precarga el prefijo ("+34"), así
 * que un campo "no vacío" puede no tener ni un dígito real. Se cuentan los dígitos
 * después de quitar todo lo que no sea número.
 *
 * @returns {{ valid: boolean, errors: Object, data: Object }}
 */
function validateLead(body = {}) {
  const data = {
    name: clean(body.name, MAX_LENGTHS.name),
    email: clean(body.email, MAX_LENGTHS.email),
    phone: clean(body.phone, MAX_LENGTHS.phone),
    utm_source: clean(body.utm_source, MAX_LENGTHS.utm_source),
    utm_campaign: clean(body.utm_campaign, MAX_LENGTHS.utm_campaign),
    fuente: clean(body.fuente, MAX_LENGTHS.fuente) || 'vsl',
  };

  const errors = {};

  if (!data.name) {
    errors.name = 'El nombre es obligatorio';
  }

  if (!data.email) {
    errors.email = 'El email es obligatorio';
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.email = 'El email no es válido';
  }

  const digits = data.phone.replace(/\D/g, '');
  if (!digits) {
    errors.phone = 'El teléfono es obligatorio';
  } else if (digits.length < MIN_PHONE_DIGITS) {
    errors.phone = 'El teléfono no parece completo';
  }

  return { valid: Object.keys(errors).length === 0, errors, data };
}

module.exports = { validateLead, MIN_PHONE_DIGITS, EMAIL_REGEX };
