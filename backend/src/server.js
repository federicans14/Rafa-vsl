require('dotenv').config();

const { createApp, parseOrigins } = require('./app');
const { initSchema } = require('./db/schema');

// 3002 y no 3001: el backend de plan.entrenaconrafa.com usa el 3001, y en local
// se levantan los dos a la vez.
const PORT = Number(process.env.PORT) || 3002;

/** Variables sin las que el servidor no debe arrancar a medias. */
const REQUIRED_ENV = ['TURSO_DATABASE_URL', 'JWT_SECRET'];

async function start() {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`[server] Faltan variables de entorno obligatorias: ${missing.join(', ')}`);
    console.error('[server] Copia .env.example a .env y rellénalas.');
    process.exit(1);
  }

  await initSchema();

  const app = createApp();

  app.listen(PORT, () => {
    console.log(`[server] Escuchando en http://localhost:${PORT}`);
    console.log(`[server] Orígenes CORS permitidos: ${parseOrigins().join(', ') || '(ninguno)'}`);
  });
}

start().catch((error) => {
  console.error('[server] No se pudo arrancar:', error.message);
  process.exit(1);
});
