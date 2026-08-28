const { COOKIE_NAME, verifyToken } = require('../lib/session');

/** Corta la petición si no hay una cookie de sesión válida. */
function requireAuth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Sesión caducada o inválida' });
  }

  req.user = { id: payload.sub, email: payload.email, name: payload.name };
  next();
}

module.exports = { requireAuth };
