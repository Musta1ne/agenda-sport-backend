import { db } from '../models/index.js';

const { Booking, Court, Sport } = db;

// @desc    Obtener todas las reservas
// @route   GET /api/bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: {
        model: Court,
        attributes: ['nombre'],
        include: { model: Sport, attributes: ['nombre'] }
      },
      order: [['fecha', 'DESC'], ['hora_inicio', 'DESC']],
    });
    res.json(bookings);
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// @desc    Obtener una reserva por ID
// @route   GET /api/bookings/:id
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id, {
      include: {
        model: Court,
        attributes: ['nombre']
      },
    });
    if (!booking) {
      return res.status(404).json({ message: 'Reserva no encontrada.' });
    }
    res.json(booking);
  } catch (error) {
    console.error(`Error al obtener la reserva ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// @desc    Crear una nueva reserva
// @route   POST /api/bookings
export const createBooking = async (req, res) => {
  try {
    const { id_cancha, fecha, hora_inicio, hora_fin, nombre_usuario, telefono } = req.body;
    const newBooking = await Booking.create({
      id_cancha,
      fecha,
      hora_inicio,
      hora_fin,
      nombre_usuario,
      telefono,
      estado: 'activa',
    });
    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Error al crear reserva:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// @desc    Actualizar una reserva (ej. cambiar datos del usuario o estado)
// @route   PUT /api/bookings/:id
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_usuario, telefono, estado } = req.body;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: 'Reserva no encontrada.' });
    }

    // Solo actualiza los campos que se envían
    const updatedData = {};
    if (nombre_usuario) updatedData.nombre_usuario = nombre_usuario;
    if (telefono) updatedData.telefono = telefono;
    if (estado) updatedData.estado = estado;

    await booking.update(updatedData);
    res.json(booking);
  } catch (error) {
    console.error(`Error al actualizar la reserva ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// @desc    Eliminar una reserva (borrado físico)
// @route   DELETE /api/bookings/:id
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(404).json({ message: 'Reserva no encontrada.' });
    }

    await booking.destroy();
    res.status(204).send();
  } catch (error)
    {
    console.error(`Error al eliminar la reserva ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};