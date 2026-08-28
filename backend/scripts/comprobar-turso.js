/**
 * Comprueba que TURSO_DATABASE_URL y TURSO_AUTH_TOKEN del .env son correctos,
 * crea las tablas si faltan y siembra el admin. Sin levantar el servidor.
 *
 *   npm run comprobar-turso
 *
 * Existe porque el fallo típico aquí no es de código: es una URL pegada a medias,
 * un token de la base equivocada o un token caducado. El servidor, al arrancar,
 * solo diría "no se pudo arrancar" y habría que adivinar cuál de las tres era.
 */
require('dotenv').config();

const { getDb } = require('../src/db/client');
const { initSchema } = require('../src/db/schema');

function fallar(mensaje, pista) {
  console.error(`\n❌ ${mensaje}`);
  if (pista) console.error(`   ${pista}`);
  process.exit(1);
}

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    fallar(
      'Falta TURSO_DATABASE_URL en backend/.env',
      'Se copia del panel de Turso, en los datos de conexión de la base.'
    );
  }

  if (url.startsWith('file:')) {
    fallar(
      `TURSO_DATABASE_URL sigue apuntando al fichero local (${url}).`,
      'Eso vale para probar en tu ordenador, pero en Render el disco se borra en ' +
        'cada reinicio y los leads se perderían. Sustitúyela por la libsql:// de Turso.'
    );
  }

  if (!/^(libsql|https):\/\//.test(url)) {
    fallar(
      `TURSO_DATABASE_URL no tiene una forma válida: ${url}`,
      'Tiene que empezar por libsql:// (o https://). Revisa que se pegó entera.'
    );
  }

  if (!token) {
    fallar(
      'Falta TURSO_AUTH_TOKEN en backend/.env',
      'En el panel de Turso se genera aparte de la URL. Es una cadena larga que empieza por "eyJ".'
    );
  }

  console.log(`\n🔌 Conectando a ${url} ...`);

  const db = getDb();

  try {
    await db.execute('SELECT 1');
  } catch (error) {
    fallar(
      `No se pudo conectar: ${error.message}`,
      'Suele ser el token: o es de otra base de datos, o está caducado, o se pegó cortado.'
    );
  }

  console.log('✅ Conexión correcta.\n');

  console.log('🛠️  Aplicando esquema (tablas + admin)...');
  await initSchema();

  const { rows: tablas } = await db.execute(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
  );
  const { rows: leads } = await db.execute('SELECT COUNT(*) AS total FROM leads');
  const { rows: admins } = await db.execute('SELECT email FROM users ORDER BY id');

  console.log('\n📋 Estado de la base:');
  console.log(`   Tablas: ${tablas.map((t) => t.name).join(', ')}`);
  console.log(`   Leads guardados: ${leads[0].total}`);
  console.log(
    `   Admins: ${admins.length > 0 ? admins.map((a) => a.email).join(', ') : '(ninguno)'}`
  );

  console.log('\n✅ Turso listo. Ya se puede arrancar el backend con `npm start`.\n');
}

main().catch((error) => {
  console.error('\n❌ Error inesperado:', error.message);
  process.exit(1);
});
