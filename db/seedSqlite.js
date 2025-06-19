// Script para limpiar todas las tablas principales de la base de datos
import { connectSQLite } from './sqlite.js';

async function limpiarBaseDeDatos() {
  const db = await connectSQLite();
  await db.exec(`
    DELETE FROM pagos;
    DELETE FROM reservas;
    DELETE FROM bloqueos;
    DELETE FROM horarios;
    DELETE FROM canchas;
    DELETE FROM deportes;
    VACUUM;
  `);
  console.log('¡Base de datos limpiada! Todas las tablas principales están vacías.');
  await db.close();
}

limpiarBaseDeDatos();