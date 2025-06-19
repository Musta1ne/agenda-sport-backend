import express from 'express';
import cors from 'cors';
import { connectSQLite } from './db/sqlite.js';
import courtRoutes from './routes/courts.js';
import bookingRoutes from './routes/bookings.js';
import sportRoutes from './routes/sports.js';
import blockRoutes from './routes/blocks.js';

const app = express();
const PORT = process.env.PORT || 3001;

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
      await db.run(
        "INSERT INTO canchas (nombre, tipo, tipo_superficie, estado, precio, imagen, id_deporte) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [c.nombre, c.tipo, c.tipo_superficie, c.estado, c.precio, c.imagen, c.id_deporte]
      );
    }

    console.log('Base de datos poblada con datos de ejemplo.');
  } catch (error) {
    console.log('Error al poblar la base de datos:', error.message);
  }
}

// Conectar a SQLite y exponer la instancia en app.locals
connectSQLite().then(async db => {
  app.locals.db = db;
  console.log('Conectado a SQLite local');

  // Poblar la base de datos en producción
  if (process.env.NODE_ENV === 'production') {
    await seedDatabase(db);
  }

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