const bcrypt = require('bcryptjs');
const { getDb } = require('./client');

const CREATE_USERS = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`;

/**
 * Esquema mínimo a propósito: esta landing no tiene quiz, así que no hay columnas
 * de respuestas. El proyecto hermano (`plan.entrenaconrafa.com`) sí las tiene, y
 * son bases de datos distintas — mezclarlas haría que un `SELECT * FROM leads`
 * devolviera los dos funnels revueltos.
 *
 * `status` es lo que convierte el panel en un mini-CRM: Rafa llama a estos leads
 * uno a uno, y necesita saber por dónde va.
 */
const CREATE_LEADS = `
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    utm_source TEXT,
    utm_campaign TEXT,
    fuente TEXT,
    status TEXT NOT NULL DEFAULT 'to_call',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`;

/** Estados válidos. El backend los valida; el panel no puede inventarse otros. */
const ESTADOS = ['to_call', 'called', 'discarded'];

async function initSchema() {
  const db = getDb();

  await db.execute(CREATE_USERS);
  await db.execute(CREATE_LEADS);

  await runMigrations();
  await seedAdmin();
}

/**
 * Columnas añadidas después de que la tabla ya existiera en algún entorno.
 * `CREATE TABLE IF NOT EXISTS` no toca una tabla ya creada, así que sin esto una
 * base anterior se quedaría sin la columna nueva y los INSERT fallarían.
 */
async function runMigrations() {
  await addColumnIfMissing('leads', 'status', "TEXT NOT NULL DEFAULT 'to_call'");
}

async function addColumnIfMissing(table, column, definition) {
  const db = getDb();
  const { rows } = await db.execute(`PRAGMA table_info(${table})`);

  if (rows.some((row) => row.name === column)) return;

  await db.execute(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  console.log(`[schema] Columna añadida: ${table}.${column}`);
}

/**
 * Crea el usuario admin solo si la tabla `users` está vacía.
 * Nunca sobrescribe un admin existente ni toca su contraseña.
 */
async function seedAdmin() {
  const db = getDb();
  const { rows } = await db.execute('SELECT COUNT(*) AS total FROM users');

  if (Number(rows[0].total) > 0) return;

  const email = process.env.ADMIN_SEED_EMAIL;
  const password = process.env.ADMIN_SEED_PASSWORD;
  const name = process.env.ADMIN_SEED_NAME || 'Admin';

  if (!email || !password) {
    console.warn(
      '[schema] No hay usuarios y faltan ADMIN_SEED_EMAIL / ADMIN_SEED_PASSWORD: ' +
        'no se ha creado ningún admin. El panel no tendrá con quién entrar.'
    );
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await db.execute({
    sql: 'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)',
    args: [email.trim().toLowerCase(), passwordHash, name],
  });

  console.log(`[schema] Admin creado: ${email}`);
}

module.exports = { initSchema, ESTADOS };
