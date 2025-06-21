import { DataTypes } from 'sequelize';
import sequelize from '../db/database.js';

const Court = sequelize.define('Court', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo_superficie: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  precio: {
    type: DataTypes.REAL,
    allowNull: false,
  },
  imagen: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // La clave foránea se añadirá a través de las asociaciones
}, {
  tableName: 'canchas',
  timestamps: false,
});

export default Court; 