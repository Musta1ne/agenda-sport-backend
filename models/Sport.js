import { DataTypes } from 'sequelize';
import sequelize from '../db/database.js';

const Sport = sequelize.define('Sport', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  }
}, {
  tableName: 'deportes',
  timestamps: false,
});

export default Sport; 