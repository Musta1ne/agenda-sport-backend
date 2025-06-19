import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';

// Usar /tmp/database.sqlite en producción, backend/db/database.sqlite en local
export async function connectSQLite() {
  // En Render, usar /opt/render/project/data que es persistente
  const isRender = process.env.RENDER === '1';
  const dbDir = isRender ? '/opt/render/project/data' : path.resolve('backend/db');
  const dbPath = path.join(dbDir, 'database.sqlite');

  // Crear la carpeta si no existe
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Si no existe la base de datos, crearla
  const isNewDb = !fs.existsSync(dbPath);
  if (isNewDb) {
    fs.writeFileSync(dbPath, '');
  }

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Si es una base de datos nueva, crear las tablas
  if (isNewDb) {
    await initializeDatabase(db);
  }

  return db;
}

async function initializeDatabase(db) {
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

  console.log('Base de datos inicializada correctamente');
} 