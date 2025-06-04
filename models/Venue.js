const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Venue extends Model {
  static associate(models) {
    // Definimos la relación hasMany con Court
    Venue.hasMany(models.Court, {
      foreignKey: 'venueId',
      as: 'courts'
    });
  }
}

Venue.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Venue',
  timestamps: true
});

module.exports = Venue;