const express = require('express');
const bcrypt = require('bcryptjs');
const { getDb } = require('../db/client');
const { COOKIE_NAME, cookieOptions, signToken } = require('../lib/session');
const { requireAuth } = require('../middleware/requireAuth');

const router = express.Router();

/** POST /api/auth/login */
router.post('/login', async (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }

  const db = getDb();
  const { rows } = await db.execute({
    sql: 'SELECT id, email, name, password_hash FROM users WHERE email = ?',
    args: [email],
  });

  const user = rows[0];

  // Mismo mensaje tanto si el email no existe como si la contraseña falla:
  // así no se puede averiguar qué emails están dados de alta.
  const passwordOk = user ? await bcrypt.compare(password, user.password_hash) : false;

  if (!user || !passwordOk) {
    return res.status(401).json({ error: 'Email o contraseña incorrectos' });
  }

  const safeUser = { id: Number(user.id), email: user.email, name: user.name };

  res.cookie(COOKIE_NAME, signToken(safeUser), cookieOptions());
  res.json({ user: safeUser });
});

/** POST /api/auth/logout */
router.post('/logout', (req, res) => {
  // maxAge fuera: para borrar, las opciones deben coincidir salvo la caducidad.
  const { maxAge, ...options } = cookieOptions();
  res.clearCookie(COOKIE_NAME, options);
  res.json({ ok: true });
});

/** GET /api/auth/me */
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
