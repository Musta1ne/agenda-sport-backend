import sequelize from '../db/database.js';
import Sport from './Sport.js';
import Court from './Court.js';
import Booking from './Booking.js';
import Schedule from './Schedule.js';

// --- Definir Asociaciones ---

// Sport <-> Court (Uno a Muchos)
Sport.hasMany(Court, { foreignKey: 'id_deporte' });
Court.belongsTo(Sport, { foreignKey: 'id_deporte' });

// Court <-> Booking (Uno a Muchos)
Court.hasMany(Booking, { foreignKey: 'id_cancha', onDelete: 'CASCADE' });
Booking.belongsTo(Court, { foreignKey: 'id_cancha' });

// Court <-> Schedule (Uno a Muchos)
Court.hasMany(Schedule, { foreignKey: 'id_cancha', onDelete: 'CASCADE' });
Schedule.belongsTo(Court, { foreignKey: 'id_cancha' });

const db = {
  sequelize,
  Sport,
  Court,
  Booking,
  Schedule,
};

// Sincronizar la base de datos
const syncDatabase = async () => {
  try {
    // El uso de { alter: true } intenta actualizar el esquema sin borrar datos.
    // Para desarrollo, a veces es útil { force: true } para reiniciar las tablas.
    await sequelize.sync({ alter: true });
    console.log('Base de datos y tablas sincronizadas correctamente.');
  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
  }
};

export { db, syncDatabase }; 