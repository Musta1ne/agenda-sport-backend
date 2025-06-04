const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Court extends Model {
  static associate(models) {
    // Mantenemos las relaciones existentes
    Court.belongsTo(models.Venue, {
      foreignKey: 'venueId',
      as: 'venue'
    });
    
    Court.belongsTo(models.Sport, {
      foreignKey: 'sportId',
      as: 'sport'
    });

    // Agregamos la nueva relación hasMany con Booking
    Court.hasMany(models.Booking, {
      foreignKey: 'courtId',
      as: 'bookings'
    });
  }
}

Court.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  venueId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Venues',
      key: 'id'
    }
  },
  sportId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Sports',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'Court',
  timestamps: true
});

module.exports = Court;