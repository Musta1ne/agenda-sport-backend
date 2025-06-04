require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importar routers
const authRoutes = require('./routes/auth');
const venueRoutes = require('./routes/venues');
const courtRoutes = require('./routes/courts');
const sportRoutes = require('./routes/sports');
const bookingRoutes = require('./routes/bookings');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Montar rutas
app.use('/api/auth', authRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/courts', courtRoutes);
app.use('/api/sports', sportRoutes);
app.use('/api/bookings', bookingRoutes);

// Manejo básico de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Ruta 404 para endpoints no encontrados
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

module.exports = app;