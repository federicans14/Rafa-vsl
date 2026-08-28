const jwt = require('jsonwebtoken');

const COOKIE_NAME = 'rafa_session';
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('Falta JWT_SECRET. No se puede firmar ni verificar la sesión.');
  }
  return secret;
}

/**
 * Opciones de la cookie de sesión.
 *
 * En producción el frontend (Render Static) y el backend (Render Web Service)
 * viven en dominios distintos, así que la cookie es cross-site: obliga a
 * `sameSite: 'none'` + `secure: true`. En local, sobre http, esa combinación
 * la rechaza el navegador, de ahí el cambio según el entorno.
 */
function cookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: MAX_AGE_MS,
    path: '/',
  };
}

function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email, name: user.name }, getSecret(), {
    expiresIn: '7d',
  });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, getSecret());
  } catch {
    return null;
  }
}

module.exports = { COOKIE_NAME, cookieOptions, signToken, verifyToken };
