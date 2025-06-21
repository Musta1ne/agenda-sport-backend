import { db } from '../models/index.js';
import { Op } from 'sequelize';

const { Court, Sport, Booking, Schedule } = db;

// @desc    Obtener todas las canchas (con su deporte)
// @route   GET /api/courts
export const getCourts = async (req, res) => {
  try {
    const courts = await Court.findAll({
      include: { model: Sport, attributes: ['id', 'nombre'] },
      order: [['nombre', 'ASC']],
    });
    res.json(courts);
  } catch (error) {
    console.error('Error al obtener canchas:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// @desc    Obtener una cancha por ID (con su deporte)
// @route   GET /api/courts/:id
export const getCourtById = async (req, res) => {
  try {
    const { id } = req.params;
    const court = await Court.findByPk(id, {
      include: { model: Sport, attributes: ['id', 'nombre'] },
    });
    if (!court) {
      return res.status(404).json({ message: 'Cancha no encontrada.' });
    }
    res.json(court);
  } catch (error) {
    console.error(`Error al obtener la cancha ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// @desc    Crear una nueva cancha
// @route   POST /api/courts
export const createCourt = async (req, res) => {
  try {
    const { nombre, tipo, tipo_superficie, estado, precio, imagen, id_deporte } = req.body;
    const newCourt = await Court.create({ nombre, tipo, tipo_superficie, estado, precio, imagen, id_deporte });
    res.status(201).json(newCourt);
  } catch (error) {
    console.error('Error al crear cancha:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// @desc    Actualizar una cancha
// @route   PUT /api/courts/:id
export const updateCourt = async (req, res) => {
  try {
    const { id } = req.params;
    const court = await Court.findByPk(id);
    if (!court) {
      return res.status(404).json({ message: 'Cancha no encontrada.' });
    }
    await court.update(req.body);
    const updatedCourt = await Court.findByPk(id, { include: [{ model: Sport, attributes: ['id', 'nombre'] }] });
    res.json(updatedCourt);
  } catch (error) {
    console.error(`Error al actualizar la cancha ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// @desc    Eliminar una cancha
// @route   DELETE /api/courts/:id
export const deleteCourt = async (req, res) => {
  try {
    const { id } = req.params;
    const court = await Court.findByPk(id);
    if (!court) {
      return res.status(404).json({ message: 'Cancha no encontrada.' });
    }
    await court.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(`Error al eliminar la cancha ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// @desc    Obtener disponibilidad de una cancha para una fecha
// @route   GET /api/courts/:id/availability
export const getCourtAvailability = async (req, res) => {
  const { id } = req.params;
  const { fecha } = req.query;

  if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return res.status(400).json({ message: "La fecha es un parámetro requerido y debe tener el formato YYYY-MM-DD." });
  }

  try {
    const court = await Court.findByPk(id);
    if (!court) {
      return res.status(404).json({ message: 'Cancha no encontrada.' });
    }

    const date = new Date(`${fecha}T00:00:00Z`);
    const dayOfWeek = date.getUTCDay();
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const dia_semana = dayNames[dayOfWeek];

    console.log(`Buscando horarios para cancha ${id} en fecha ${fecha} (Día: ${dia_semana})`);

    const schedules = await Schedule.findAll({ 
      where: { 
        id_cancha: id, 
        [Op.or]: [
          { dia_semana: dia_semana },
          { dia_semana: 'todos' }
        ],
        activo: true 
      }, 
      order: [['hora_inicio', 'ASC']] 
    });

    console.log(`Horarios encontrados: ${schedules.length}`);

    const bookings = await Booking.findAll({ where: { id_cancha: id, fecha } });

    const availability = schedules.map(schedule => {
      const isBooked = bookings.some(b => b.hora_inicio === schedule.hora_inicio);
      return {
        hora_inicio: schedule.hora_inicio,
        hora_fin: schedule.hora_fin,
        estado: isBooked ? 'reservado' : 'disponible',
      };
    });

    res.json({ court, availability });
  } catch (error) {
    console.error(`Error al obtener disponibilidad de la cancha ${id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// @desc    Obtener todas las reservas de una cancha
// @route   GET /api/courts/:id/bookings
export const getCourtBookings = async (req, res) => {
    try {
        const { id } = req.params;
        const bookings = await Booking.findAll({
            where: { id_cancha: id },
            order: [['fecha', 'DESC'], ['hora_inicio', 'ASC']],
        });
        res.json(bookings);
    } catch (error) {
        console.error(`Error al obtener las reservas de la cancha ${req.params.id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
}; 