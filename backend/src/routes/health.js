const express = require('express');

const router = express.Router();

/**
 * GET /api/health — el ping que dispara `prewarmBackend.js` desde la landing
 * para despertar el servicio gratuito de Render mientras el usuario hace el quiz.
 * Tiene que ser barato: nada de tocar la base de datos aquí.
 */
router.get('/', (req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

module.exports = router;
