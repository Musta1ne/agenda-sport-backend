import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectSQLite } from './db/sqlite.js';
import courtRoutes from './routes/courts.js';
import bookingRoutes from './routes/bookings.js';
import sportRoutes from './routes/sports.js';
import blockRoutes from './routes/blocks.js';
import path from 'path';
import fs from 'fs';

const app = express();
const server = createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL || "https://reservas-frontend-phi.vercel.app";
const LOCALHOSTS = ["http://localhost:5175", "http://localhost:5173", "http://localhost:5174"];
const allowedOrigins = process.env.NODE_ENV === 'production' ? [FRONTEND_URL] : [...LOCALHOSTS, FRONTEND_URL];

// Configurar Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

// Función para poblar la base de datos
async function seedDatabase(db) {
  try {
    // Insertar deportes
    await db.run("DELETE FROM deportes");
    await db.run("DELETE FROM canchas");
    await db.run("DELETE FROM reservas");
    await db.run("DELETE FROM bloqueos");
    await db.run("DELETE FROM horarios");
    await db.run("DELETE FROM pagos");

    const deportes = [
      { nombre: 'Fútbol 5' },
      { nombre: 'Fútbol 7' },
      { nombre: 'Pádel' }
    ];

    for (const dep of deportes) {
      await db.run("INSERT INTO deportes (nombre) VALUES (?)", [dep.nombre]);
    }

    // Obtener los IDs de deportes
    const futbol5 = await db.get("SELECT id FROM deportes WHERE nombre = 'Fútbol 5'");
    const futbol7 = await db.get("SELECT id FROM deportes WHERE nombre = 'Fútbol 7'");
    const padel = await db.get("SELECT id FROM deportes WHERE nombre = 'Pádel'");

    // Insertar canchas de ejemplo
    const canchas = [
      {
        nombre: 'Fútbol 5 - Cancha 1',
        tipo: 'Fútbol 5',
        tipo_superficie: 'sintética',
        estado: 'disponible',
        precio: 30000,
        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTWyHaf8n4fbpp9KJJRxriCbnVNH436V_soQ&s',
        id_deporte: futbol5.id
      },
      {
        nombre: 'Fútbol 7 - Cancha 1',
        tipo: 'Fútbol 7',
        tipo_superficie: 'sintética',
        estado: 'disponible',
        precio: 40000,
        imagen: 'https://www.record.com.mx/sites/default/files/articulos/2023/10/15/pexels-pixabay-274506_1-20.jpg',
        id_deporte: futbol7.id
      },
      {
        nombre: 'Pádel - Cancha 1',
        tipo: 'Pádel',
        tipo_superficie: 'sintética',
        estado: 'disponible',
        precio: 20000,
        imagen: 'https://cdn.pixabay.com/photo/2021/06/04/06/54/racket-6308994_1280.jpg',
        id_deporte: padel.id
      }
    ];

    for (const c of canchas) {
      const result = await db.run(
        "INSERT INTO canchas (nombre, tipo, tipo_superficie, estado, precio, imagen, id_deporte) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [c.nombre, c.tipo, c.tipo_superficie, c.estado, c.precio, c.imagen, c.id_deporte]
      );
      const canchaId = result.lastID;
      let horariosCount = 0;
      
      // Agregar horarios según el tipo de cancha
      if (c.tipo === 'Pádel') {
        // Turnos de 1:30h, de 8:00 a 23:00
        let hora = 8 * 60; // minutos
        while (hora + 90 <= 23 * 60) {
          const hInicio = Math.floor(hora / 60).toString().padStart(2, '0') + ':' + (hora % 60).toString().padStart(2, '0');
          const hFin = Math.floor((hora + 90) / 60).toString().padStart(2, '0') + ':' + ((hora + 90) % 60).toString().padStart(2, '0');
          await db.run(
            "INSERT INTO horarios (id_cancha, dia_semana, hora_inicio, hora_fin, activo) VALUES (?, ?, ?, ?, 1)",
            [canchaId, 'todos', hInicio, hFin]
          );
          hora += 90;
          horariosCount++;
        }
      } else {
        // Fútbol 5 y 7: turnos de 1h, de 8:00 a 23:00
        for (let h = 8; h < 23; h++) {
          const hInicio = h.toString().padStart(2, '0') + ':00';
          const hFin = (h + 1).toString().padStart(2, '0') + ':00';
          await db.run(
            "INSERT INTO horarios (id_cancha, dia_semana, hora_inicio, hora_fin, activo) VALUES (?, ?, ?, ?, 1)",
            [canchaId, 'todos', hInicio, hFin]
          );
          horariosCount++;
        }
      }
      console.log(`Horarios insertados para ${c.nombre}: ${horariosCount}`);
    }

    console.log('Base de datos poblada con datos de ejemplo.');
  } catch (error) {
    console.log('Error al poblar la base de datos:', error.message);
  }
}

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

// Conectar a SQLite y exponer la instancia en app.locals
connectSQLite().then(async db => {
  app.locals.db = db;
  app.locals.io = io; // Hacer io disponible en los controladores
  console.log('Conectado a SQLite local');

  // Poblar la base de datos en producción
  if (process.env.NODE_ENV === 'production') {
    await seedDatabase(db);
  }

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