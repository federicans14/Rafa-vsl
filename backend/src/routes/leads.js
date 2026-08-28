const express = require('express');
const { getDb } = require('../db/client');
const { validateLead } = require('../lib/validateLead');
const { notifyWhatsapp } = require('../lib/notifyWhatsapp');
const { ESTADOS } = require('../db/schema');
const { requireAuth } = require('../middleware/requireAuth');
const { createRateLimit } = require('../middleware/rateLimit');

const router = express.Router();

/**
 * 10 altas por IP y hora. Holgado a propósito: con CGNAT móvil varias personas
 * comparten IP, y perder un lead real sale mucho más caro que tragarse alguno
 * falso. Corta el script que dispara en bucle, que es de lo que se trata.
 */
const limitarAltas = createRateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'Demasiados envíos desde esta conexión. Inténtalo de nuevo en un rato.',
});

const INSERT_LEAD = `
  INSERT INTO leads (name, email, phone, utm_source, utm_campaign, fuente)
  VALUES (?, ?, ?, ?, ?, ?)
  RETURNING id, created_at
`;

/**
 * POST /api/leads — pública.
 *
 * Guardar el lead es lo único que no puede fallar en silencio. El aviso de
 * WhatsApp se lanza después de responder, sin `await`: si Green API está caído o
 * tarda, el visitante no se queda esperando delante de un vídeo bloqueado.
 *
 * Aquí importa más que en el quiz: el frontend **desbloquea el vídeo cuando esta
 * respuesta llega**. Cada milisegundo de más es alguien mirando una pantalla
 * quieta después de haber dado sus datos.
 */
router.post('/', limitarAltas, async (req, res) => {
  const { valid, errors, data } = validateLead(req.body);

  if (!valid) {
    return res.status(400).json({ error: 'Datos no válidos', errors });
  }

  const db = getDb();
  const result = await db.execute({
    sql: INSERT_LEAD,
    args: [
      data.name,
      data.email,
      data.phone,
      data.utm_source || null,
      data.utm_campaign || null,
      data.fuente || null,
    ],
  });

  const created = result.rows[0];

  res.status(201).json({ ok: true, id: Number(created.id) });

  // Ya se ha respondido: a partir de aquí nada puede afectar al lead.
  notifyWhatsapp({ ...data, id: Number(created.id) }).catch((error) => {
    console.warn('[leads] El aviso de WhatsApp falló:', error.message);
  });
});

/** GET /api/leads — protegida. Los más recientes primero. */
router.get('/', requireAuth, async (req, res) => {
  const db = getDb();
  const { rows } = await db.execute(
    'SELECT * FROM leads ORDER BY datetime(created_at) DESC, id DESC'
  );

  res.json({ leads: rows });
});

/**
 * PATCH /api/leads/:id — protegida. Cambia el estado desde el panel.
 *
 * Solo se aceptan los tres estados del esquema: si el panel manda cualquier otra
 * cosa, se rechaza en vez de guardarla. Un estado inventado rompería el filtrado
 * de las columnas sin dar ningún error visible.
 */
router.patch('/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body || {};

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Identificador no válido' });
  }

  if (!ESTADOS.includes(status)) {
    return res.status(400).json({ error: `Estado no válido. Admitidos: ${ESTADOS.join(', ')}` });
  }

  const db = getDb();
  const result = await db.execute({
    sql: 'UPDATE leads SET status = ? WHERE id = ?',
    args: [status, id],
  });

  if (result.rowsAffected === 0) {
    return res.status(404).json({ error: 'Ese lead no existe' });
  }

  res.json({ ok: true, id, status });
});

module.exports = router;
