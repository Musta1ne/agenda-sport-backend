import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Importar sincronización de la base de datos y modelos
import { syncDatabase } from './models/index.js';

// Importar rutas
import sportsRouter from './routes/sports.js';
import courtsRouter from './routes/courts.js';
import bookingsRouter from './routes/bookings.js';
import schedulesRouter from './routes/schedules.js';
import adminRouter from './routes/admin.js';
// Futuras rutas se añadirán aquí

const app = express();

// --- Middlewares ---
const FRONTEND_URL = process.env.FRONTEND_URL || "https://reservas-frontend-tawny.vercel.app";
const LOCALHOSTS = ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"];
const allowedOrigins = process.env.NODE_ENV === 'production' ? [FRONTEND_URL] : [...LOCALHOSTS, FRONTEND_URL];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// --- Rutas de la API ---
app.use('/api/sports', sportsRouter);
app.use('/api/courts', courtsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/schedules', schedulesRouter);
app.use('/api/admin', adminRouter);

app.get('/', (req, res) => {
  res.send('API de Reservas de Canchas funcionando con Sequelize.');
});

// --- Rutas de Utilidad / Admin ---
app.get('/admin/download-db', (req, res) => {
  const isRender = process.env.RENDER === '1';
  const dbDir = isRender ? '/opt/render/project/data' : path.resolve('backend/db');
  const dbPath = path.join(dbDir, 'database.sqlite');
  
  if (fs.existsSync(dbPath)) {
    res.download(dbPath, 'database.sqlite');
  } else {
    res.status(404).send('Database file not found.');
  }
});

// Middleware para manejo de errores (debe ir al final)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// --- Arranque del Servidor ---
const PORT = process.env.PORT || 5000;

// Sincronizar la base de datos y luego iniciar el servidor
syncDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
    console.log('La base de datos se ha sincronizado correctamente.');
  });
}).catch(error => {
  console.error('Error al iniciar el servidor:', error);
});

export default app;