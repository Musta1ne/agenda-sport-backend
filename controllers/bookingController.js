const { Booking, Court, User } = require('../models');
const { Op } = require('sequelize');

const bookingController = {
  // Crear una nueva reserva
  create: async (req, res) => {
    try {
      const { courtId, date, hour } = req.body;
      const userId = req.user.id; // ID del usuario autenticado

      // Validación de datos de entrada
      if (!courtId || !date || !hour) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
      }

      // Validar formato de fecha y hora
      const bookingDate = new Date(`${date}T${hour}`);
      if (isNaN(bookingDate.getTime())) {
        return res.status(400).json({ error: 'Formato de fecha u hora inválido' });
      }

      // Verificar que la cancha existe
      const court = await Court.findByPk(courtId);
      if (!court) {
        return res.status(404).json({ error: 'Cancha no encontrada' });
      }

      // Verificar si ya existe una reserva para esa cancha en esa fecha y hora
      const existingBooking = await Booking.findOne({
        where: {
          courtId,
          date,
          hour
        }
      });

      if (existingBooking) {
        return res.status(409).json({ error: 'Ya existe una reserva para ese horario' });
      }

      const booking = await Booking.create({
        userId,
        courtId,
        date,
        hour
      });

      res.status(201).json(booking);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener una reserva específica
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const booking = await Booking.findOne({
        where: { id },
        include: [{ model: Court }, { model: User, attributes: ['id', 'name', 'email'] }]
      });

      if (!booking) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
      }

      // Verificar que el usuario sea el dueño de la reserva
      if (booking.userId !== userId) {
        return res.status(403).json({ error: 'No tienes permiso para ver esta reserva' });
      }

      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar una reserva
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { date, hour } = req.body;
      const userId = req.user.id;

      const booking = await Booking.findByPk(id);
      if (!booking) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
      }

      // Verificar que el usuario sea el dueño de la reserva
      if (booking.userId !== userId) {
        return res.status(403).json({ error: 'No tienes permiso para modificar esta reserva' });
      }

      // Validar formato de fecha y hora si se proporcionan
      if (date && hour) {
        const bookingDate = new Date(`${date}T${hour}`);
        if (isNaN(bookingDate.getTime())) {
          return res.status(400).json({ error: 'Formato de fecha u hora inválido' });
        }

        // Verificar superposición de reservas
        const existingBooking = await Booking.findOne({
          where: {
            id: { [Op.ne]: id }, // Excluir la reserva actual
            courtId: booking.courtId,
            date,
            hour
          }
        });

        if (existingBooking) {
          return res.status(409).json({ error: 'Ya existe una reserva para ese horario' });
        }
      }

      await booking.update({
        date: date || booking.date,
        hour: hour || booking.hour
      });

      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Cancelar una reserva
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const booking = await Booking.findByPk(id);
      if (!booking) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
      }

      // Verificar que el usuario sea el dueño de la reserva
      if (booking.userId !== userId) {
        return res.status(403).json({ error: 'No tienes permiso para cancelar esta reserva' });
      }

      await booking.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Listar reservas de un usuario específico
  getUserBookings: async (req, res) => {
    try {
      const { id } = req.params;
      const authUserId = req.user.id;

      // Solo permitir ver las reservas propias
      if (parseInt(id) !== authUserId) {
        return res.status(403).json({ error: 'No tienes permiso para ver las reservas de otro usuario' });
      }

      const bookings = await Booking.findAll({
        where: { userId: id },
        include: [{ model: Court }],
        order: [['date', 'ASC'], ['hour', 'ASC']]
      });

      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = bookingController;