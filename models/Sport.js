const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Sport extends Model {
  static associate(models) {
    // Definimos la relación hasMany con Court
    Sport.hasMany(models.Court, {
      foreignKey: 'sportId',
      as: 'courts'
    });
  }
}

Sport.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Sport',
  timestamps: true
});

module.exports = Sport;