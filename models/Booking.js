import { DataTypes } from 'sequelize';
import sequelize from '../db/database.js';

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fecha: {
    type: DataTypes.TEXT, // Usamos TEXT para mantener el formato 'YYYY-MM-DD'
    allowNull: false,
  },
  hora_inicio: {
    type: DataTypes.TEXT, // Usamos TEXT para mantener el formato 'HH:MM'
    allowNull: false,
  },
  hora_fin: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nombre_usuario: {
    type: DataTypes.STRING,
    allowNull: true, // Puede ser nulo si es un bloqueo u otra cosa
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true,
  }
  // La clave foránea id_cancha se añadirá a través de las asociaciones
}, {
  tableName: 'reservas',
  timestamps: false,
});

export default Booking; 