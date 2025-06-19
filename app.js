import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectSQLite } from './db/sqlite.js';
import courtRoutes from './routes/courts.js';
import bookingsRouter from './routes/bookings.js';
import sportRoutes from './routes/sports.js';
import schedulesRoutes from './routes/schedules.js';
import path from 'path';
import fs from 'fs';

const app = express();
const server = createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL || "https://reservas-frontend-tawny.vercel.app";
const LOCALHOSTS = ["http://localhost:5175", "http://localhost:5173", "http://localhost:5174"];
const allowedOrigins = process.env.NODE_ENV === 'production' ? [FRONTEND_URL] : [...LOCALHOSTS, FRONTEND_URL];

// Configurar Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

// Función para emitir notificaciones
export const emitNotification = (event, data) => {
  io.emit(event, data);
};

// Función para emitir actualizaciones de cancha específica
export const emitCourtUpdate = (courtId, data) => {
  io.to(`court-${courtId}`).emit('court-updated', data);
};

// Función para emitir actualizaciones de reservas
export const emitBookingUpdate = (data) => {
  io.to('notifications').emit('booking-updated', data);
};

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// Endpoint para descargar el JSON de reservas (debe estar fuera de connectSQLite)
app.get('/admin/export-json', (req, res) => {
  const exportPath = path.resolve('backend/db', 'exported_data.json');
  if (fs.existsSync(exportPath)) {
    res.download(exportPath, 'exported_data.json');
  } else {
    res.status(404).json({ error: 'No existe el archivo exported_data.json' });
  }
});

// Ruta temporal para descargar la base de datos (¡SOLO PARA PRUEBAS!)
app.get('/admin/download-db', (req, res) => {
  const isRender = process.env.RENDER === '1';
  const dbDir = isRender ? '/opt/render/project/data' : path.resolve('backend/db');
  const dbPath = path.join(dbDir, 'database.sqlite');
  
  if (fs.existsSync(dbPath)) {
    res.download(dbPath, 'database.sqlite');
  } else {
    res.status(404).json({ 
      error: 'No existe el archivo de base de datos',
      path: dbPath
    });
  }
});

// Conectar a SQLite y exponer la instancia en app.locals
connectSQLite().then(async db => {
  app.locals.db = db;
  app.locals.io = io; // Hacer io disponible en los controladores
  console.log('Conectado a SQLite local');

  // Rutas principales
  app.use('/api/courts', courtRoutes);
  app.use('/api/bookings', bookingsRouter);
  app.use('/api/sports', sportRoutes);
  app.use('/api/schedules', schedulesRoutes);

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

  // Manejo de WebSockets
  io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    // Unirse a una sala específica de cancha
    socket.on('join-court', (courtId) => {
      socket.join(`court-${courtId}`);
      console.log(`Cliente ${socket.id} se unió a la cancha ${courtId}`);
    });

    // Salir de una sala específica de cancha
    socket.on('leave-court', (courtId) => {
      socket.leave(`court-${courtId}`);
      console.log(`Cliente ${socket.id} salió de la cancha ${courtId}`);
    });

    // Unirse a la sala de notificaciones generales
    socket.on('join-notifications', () => {
      socket.join('notifications');
      console.log(`Cliente ${socket.id} se unió a las notificaciones`);
    });

    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
    });
  });

  const PORT = process.env.PORT || 3001;

  server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
    console.log('WebSockets habilitados para notificaciones en tiempo real');
  });

  // Manejo de errores no capturados
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
  });
});

export default app;