import { db } from '../models/index.js';

// Clave secreta para proteger el endpoint. ¡Cámbiala por algo más seguro!
const SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'tu-clave-secreta-123';

export const dumpDatabase = async (req, res) => {
  // Comprobar la clave secreta desde los query params
  const { secret } = req.query;
  if (secret !== SECRET_KEY) {
    return res.status(403).json({ message: 'Acceso no autorizado.' });
  }

  try {
    const [sports, courts, schedules, bookings] = await Promise.all([
      db.Sport.findAll({ order: [['nombre', 'ASC']] }),
      db.Court.findAll({ 
        include: [{ model: db.Sport, attributes: ['nombre'] }],
        order: [['id', 'ASC']] 
      }),
      db.Schedule.findAll({ order: [['id', 'ASC']] }),
      db.Booking.findAll({ order: [['fecha', 'DESC'], ['hora_inicio', 'ASC']] }),
    ]);

    res.json({
      sports,
      courts,
      schedules,
      bookings,
    });

  } catch (error) {
    console.error('Error al hacer dump de la base de datos:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}; 