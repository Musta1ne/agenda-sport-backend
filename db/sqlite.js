import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

// Inicializa y exporta la conexión a la base de datos SQLite
export async function connectSQLite() {
  const db = await open({
    filename: path.resolve('db', 'database.sqlite'),
    driver: sqlite3.Database
  });

  // Crear tablas si no existen
  await db.exec(`
    CREATE TABLE IF NOT EXISTS deportes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS canchas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      tipo TEXT NOT NULL,
      tipo_superficie TEXT NOT NULL,
      estado TEXT NOT NULL,
      precio REAL NOT NULL,
      imagen TEXT NOT NULL,
      id_deporte INTEGER,
      FOREIGN KEY(id_deporte) REFERENCES deportes(id)
    );
    CREATE TABLE IF NOT EXISTS reservas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_cancha INTEGER,
      fecha TEXT NOT NULL,
      hora_inicio TEXT NOT NULL,
      hora_fin TEXT NOT NULL,
      estado TEXT NOT NULL,
      nombre_usuario TEXT,
      telefono TEXT,
      FOREIGN KEY(id_cancha) REFERENCES canchas(id)
    );
    CREATE TABLE IF NOT EXISTS bloqueos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_cancha INTEGER,
      fecha TEXT NOT NULL,
      hora_inicio TEXT NOT NULL,
      hora_fin TEXT NOT NULL,
      motivo TEXT,
      FOREIGN KEY(id_cancha) REFERENCES canchas(id)
    );
    CREATE TABLE IF NOT EXISTS horarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_cancha INTEGER,
      dia_semana TEXT NOT NULL,
      hora_inicio TEXT NOT NULL,
      hora_fin TEXT NOT NULL,
      activo INTEGER DEFAULT 1,
      FOREIGN KEY(id_cancha) REFERENCES canchas(id)
    );
    CREATE TABLE IF NOT EXISTS pagos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_reserva INTEGER,
      monto REAL NOT NULL,
      fecha_pago TEXT NOT NULL,
      metodo TEXT,
      FOREIGN KEY(id_reserva) REFERENCES reservas(id)
    );
  `);

  return db;
} 