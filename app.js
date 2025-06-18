import express from 'express';
import cors from 'cors';
import { connectSQLite } from './db/sqlite.js';
import courtRoutes from './routes/courts.js';
import bookingRoutes from './routes/bookings.js';
import sportRoutes from './routes/sports.js';
import blockRoutes from './routes/blocks.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Conectar a SQLite y exponer la instancia en app.locals
connectSQLite().then(db => {
  app.locals.db = db;
  console.log('Conectado a SQLite local');

  app.use(cors());
  app.use(express.json());

  // Rutas principales
  app.use('/api/courts', courtRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/sports', sportRoutes);
  app.use('/api/blocks', blockRoutes);

  app.get('/', (req, res) => {
    res.send('API de Reservas de Canchas funcionando con SQLite local');
  });

  app.get('/api/test-db', (req, res) => {
    res.json({
      db: 'sqlite',
      file: 'db/database.sqlite',
      status: 'ok'
    });
  });

  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
});

export default app; 