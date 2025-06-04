const Sequelize = require('sequelize');
const sequelize = require('../config/database');

// Importar modelos
const User = require('./User');
const Venue = require('./Venue');
const Court = require('./Court');
const Sport = require('./Sport');
const Booking = require('./Booking');

// Configurar relaciones

// Venue - Court
Venue.hasMany(Court, { foreignKey: 'venueId' });
Court.belongsTo(Venue, { foreignKey: 'venueId' });

// Sport - Court
Sport.hasMany(Court, { foreignKey: 'sportId' });
Court.belongsTo(Sport, { foreignKey: 'sportId' });

// User - Booking
User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

// Court - Booking
Court.hasMany(Booking, { foreignKey: 'courtId' });
Booking.belongsTo(Court, { foreignKey: 'courtId' });

// Exportar modelos y sequelize
module.exports = {
  sequelize,
  Sequelize,
  User,
  Venue,
  Court,
  Sport,
  Booking
};
