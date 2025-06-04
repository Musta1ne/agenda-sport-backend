const { Venue, Court } = require('../models');

// Validación de datos de entrada
const validateVenue = (data) => {
  const errors = [];
  if (!data.name) errors.push('El nombre es requerido');
  if (!data.location) errors.push('La ubicación es requerida');
  return errors;
};

const venueController = {
  // Listar todos los venues
  getAllVenues: async (req, res) => {
    try {
      const venues = await Venue.findAll();
      res.json(venues);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los venues' });
    }
  },

  // Obtener un venue por ID
  getVenueById: async (req, res) => {
    try {
      const venue = await Venue.findByPk(req.params.id);
      if (!venue) {
        return res.status(404).json({ error: 'Venue no encontrado' });
      }
      res.json(venue);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el venue' });
    }
  },

  // Listar canchas de un venue
  getVenueCourts: async (req, res) => {
    try {
      const venue = await Venue.findByPk(req.params.id, {
        include: [{
          model: Court,
          as: 'courts'
        }]
      });
      if (!venue) {
        return res.status(404).json({ error: 'Venue no encontrado' });
      }
      res.json(venue.courts);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las canchas del venue' });
    }
  },

  // Crear un nuevo venue
  createVenue: async (req, res) => {
    try {
      const errors = validateVenue(req.body);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const venue = await Venue.create(req.body);
      res.status(201).json(venue);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el venue' });
    }
  },

  // Actualizar un venue
  updateVenue: async (req, res) => {
    try {
      const errors = validateVenue(req.body);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const venue = await Venue.findByPk(req.params.id);
      if (!venue) {
        return res.status(404).json({ error: 'Venue no encontrado' });
      }

      await venue.update(req.body);
      res.json(venue);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el venue' });
    }
  },

  // Eliminar un venue
  deleteVenue: async (req, res) => {
    try {
      const venue = await Venue.findByPk(req.params.id);
      if (!venue) {
        return res.status(404).json({ error: 'Venue no encontrado' });
      }

      await venue.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el venue' });
    }
  }
};

module.exports = venueController;