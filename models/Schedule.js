import { DataTypes } from 'sequelize';
import sequelize from '../db/database.js';

const Schedule = sequelize.define('Schedule', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  dia_semana: {
    type: DataTypes.STRING, // e.g., 'Lunes', 'Martes'
    allowNull: false,
  },
  hora_inicio: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  hora_fin: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  }
  // La clave foránea id_cancha se añadirá a través de las asociaciones
}, {
  tableName: 'horarios',
  timestamps: false,
});

export default Schedule; 