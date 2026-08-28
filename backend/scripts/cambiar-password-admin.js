/**
 * Cambia la contraseña de un usuario del panel admin.
 *
 *   npm run cambiar-password -- rafa@entrenaconrafa.com            (genera una)
 *   npm run cambiar-password -- rafa@entrenaconrafa.com miClave123 (la que le pases)
 *
 * Con --fichero=ruta.md la contraseña generada se escribe ahí en vez de salir por
 * pantalla. Útil cuando la terminal queda grabada en algún sitio (un log, una
 * sesión compartida) y no quieres que la contraseña acabe dentro.
 *
 * Hace falta porque ADMIN_SEED_PASSWORD solo actúa UNA vez: la primera que el
 * servidor arranca contra una base sin usuarios. A partir de ahí, `seedAdmin()`
 * ve que la tabla no está vacía y no vuelve a tocar nada — a propósito, para que
 * un despliegue no pueda resetear la contraseña de Rafa sin querer.
 *
 * Así que la única forma de cambiarla es reescribir el hash aquí.
 */
require('dotenv').config();

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { getDb } = require('../src/db/client');

/** Alfanumérica y sin símbolos: se dicta por teléfono y se teclea en el móvil sin pelearse. */
function generarPassword(longitud = 24) {
  const alfabeto = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.randomBytes(longitud);
  return Array.from(bytes, (b) => alfabeto[b % alfabeto.length]).join('');
}

async function main() {
  const args = process.argv.slice(2);
  const ficheroArg = args.find((a) => a.startsWith('--fichero='));
  const fichero = ficheroArg ? ficheroArg.slice('--fichero='.length) : null;
  const sueltos = args.filter((a) => !a.startsWith('--'));

  const email = (sueltos[0] || '').trim().toLowerCase();
  const passwordDada = sueltos[1];

  if (!email) {
    console.error('\n❌ Falta el email.');
    console.error('   npm run cambiar-password -- rafa@entrenaconrafa.com\n');
    process.exit(1);
  }

  if (passwordDada && passwordDada.length < 12) {
    console.error('\n❌ La contraseña es demasiado corta (mínimo 12 caracteres).\n');
    process.exit(1);
  }

  const db = getDb();

  const { rows } = await db.execute({
    sql: 'SELECT id, email FROM users WHERE email = ?',
    args: [email],
  });

  if (rows.length === 0) {
    const { rows: todos } = await db.execute('SELECT email FROM users ORDER BY id');
    console.error(`\n❌ No hay ningún usuario con el email ${email}`);
    console.error(`   Usuarios en la base: ${todos.map((u) => u.email).join(', ') || '(ninguno)'}\n`);
    process.exit(1);
  }

  const password = passwordDada || generarPassword();
  const hash = await bcrypt.hash(password, 10);

  await db.execute({
    sql: 'UPDATE users SET password_hash = ? WHERE email = ?',
    args: [hash, email],
  });

  console.log(`\n✅ Contraseña cambiada para ${email}`);

  if (passwordDada) return;

  if (fichero) {
    const destino = path.resolve(fichero);
    const contenido = [
      '# Credenciales — Rafa Coaching',
      '',
      '**NO subir a GitHub ni pegar en un chat.**',
      '',
      '## Panel admin',
      '',
      `- URL: \`/admin\` de la landing`,
      `- Usuario: \`${email}\``,
      `- Contraseña: \`${password}\``,
      '',
      `_Generada el ${new Date().toLocaleDateString('es-ES')} con \`npm run cambiar-password\`._`,
      '_Para cambiarla otra vez, ese mismo script. No se puede recuperar, solo sustituir._',
      '',
    ].join('\n');

    fs.writeFileSync(destino, contenido, 'utf8');
    console.log(`📄 Contraseña escrita en: ${destino}`);
    console.log('   (no se imprime por pantalla a propósito)\n');
    return;
  }

  console.log('\n--- NUEVA CONTRASEÑA (guárdala, no se puede recuperar) ---');
  console.log(password);
  console.log('----------------------------------------------------------\n');
}

main().catch((error) => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});
