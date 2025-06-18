import express from 'express';
import cors from 'cors';
import { connectMongo } from './db/mongo.js';
import courtRoutes from './routes/courts.js';
import bookingRoutes from './routes/bookings.js';
import sportRoutes from './routes/sports.js';
import blockRoutes from './routes/blocks.js';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 3001;

connectMongo(); // Conectar a MongoDB Atlas

app.use(cors());
app.use(express.json());

// Rutas principales
app.use('/api/courts', courtRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/sports', sportRoutes);
app.use('/api/blocks', blockRoutes);

app.get('/', (req, res) => {
  res.send('API de Reservas de Canchas funcionando con MongoDB - TEST CAMBIO');
});

app.get('/api/test-db', (req, res) => {
  res.json({
    db: mongoose.connection.name,
    host: mongoose.connection.host,
    user: mongoose.connection.user,
    uri: process.env.MONGODB_URI
  });
});

export default app; 