const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Booking extends Model {
  static associate(models) {
    // Definimos las relaciones belongsTo
    Booking.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    
    Booking.belongsTo(models.Court, {
      foreignKey: 'courtId',
      as: 'court'
    });
  }
}

Booking.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  courtId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Courts',
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  hour: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Booking',
  timestamps: true
});

module.exports = Booking;