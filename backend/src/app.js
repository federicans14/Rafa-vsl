const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const leadsRouter = require('./routes/leads');
const authRouter = require('./routes/auth');
const healthRouter = require('./routes/health');

/** CORS_ORIGIN admite una lista separada por comas. */
function parseOrigins() {
  return (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);
}

function createApp() {
  const app = express();
  const allowedOrigins = parseOrigins();

  // Render va detrás de proxy: sin esto la cookie `secure` no se llega a enviar.
  app.set('trust proxy', 1);

  app.use(
    cors({
      origin(origin, callback) {
        // Sin cabecera Origin: curl, health checks de Render, apps nativas.
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin.replace(/\/$/, ''))) return callback(null, true);
        return callback(new Error(`Origen no permitido por CORS: ${origin}`));
      },
      credentials: true,
    })
  );

  app.use(express.json({ limit: '32kb' }));
  app.use(cookieParser());

  app.use('/api/health', healthRouter);
  app.use('/api/leads', leadsRouter);
  app.use('/api/auth', authRouter);

  app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
  });

  // Express 5 reenvía aquí también los rechazos de handlers async.
  app.use((error, req, res, next) => {
    console.error('[error]', error.message);

    if (error.message?.startsWith('Origen no permitido')) {
      return res.status(403).json({ error: 'Origen no permitido' });
    }

    res.status(500).json({ error: 'Error interno del servidor' });
  });

  return app;
}

module.exports = { createApp, parseOrigins };
