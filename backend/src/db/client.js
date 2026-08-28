const { createClient } = require('@libsql/client');

let client = null;

/**
 * Cliente de Turso, creado la primera vez que se pide.
 *
 * Nunca hay fallback a SQLite en disco: en Render el sistema de archivos es
 * efímero y los leads se perderían en cada reinicio. Si faltan las credenciales,
 * el servidor debe caerse en el arranque, no arrancar a medias.
 */
function getDb() {
  if (client) return client;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error(
      'Falta TURSO_DATABASE_URL. Configura las variables de entorno antes de arrancar.'
    );
  }

  client = createClient({ url, authToken });
  return client;
}

module.exports = { getDb };
