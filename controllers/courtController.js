const { Court, Venue, Sport } = require('../models');

const courtController = {
  // Obtener disponibilidad de turnos para una cancha
  getAvailability: async (req, res) => {
    try {
      const { id } = req.params;
      const court = await Court.findByPk(id);
      
      if (!court) {
        return res.status(404).json({ error: 'Cancha no encontrada' });
      }

      // Mock de disponibilidad - Implementación temporal
      const today = new Date();
      const availability = [];
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        
        availability.push({
          date: date.toISOString().split('T')[0],
          hours: ['09:00', '10:00', '11:00', '12:00', '16:00', '17:00', '18:00']
        });
      }

      res.json(availability);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear una nueva cancha
  create: async (req, res) => {
    try {
      const { name, venueId, sportId } = req.body;

      // Validación de datos de entrada
      if (!name || !venueId || !sportId) {
        return res.status(400).json({ error: 'Nombre, venue y deporte son requeridos' });
      }

      // Verificar que existan venue y sport
      const [venue, sport] = await Promise.all([
        Venue.findByPk(venueId),
        Sport.findByPk(sportId)
      ]);

      if (!venue || !sport) {
        return res.status(400).json({ error: 'Venue o deporte no encontrado' });
      }

      const court = await Court.create({
        name,
        venueId,
        sportId
      });

      res.status(201).json(court);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar una cancha existente
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, venueId, sportId } = req.body;

      const court = await Court.findByPk(id);
      if (!court) {
        return res.status(404).json({ error: 'Cancha no encontrada' });
      }

      // Si se proporcionan nuevos IDs, verificar que existan
      if (venueId || sportId) {
        const [venue, sport] = await Promise.all([
          venueId ? Venue.findByPk(venueId) : Promise.resolve(true),
          sportId ? Sport.findByPk(sportId) : Promise.resolve(true)
        ]);

        if (!venue || !sport) {
          return res.status(400).json({ error: 'Venue o deporte no encontrado' });
        }
      }

      await court.update({
        name: name || court.name,
        venueId: venueId || court.venueId,
        sportId: sportId || court.sportId
      });

      res.json(court);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar una cancha
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      
      const court = await Court.findByPk(id);
      if (!court) {
        return res.status(404).json({ error: 'Cancha no encontrada' });
      }

      await court.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = courtController;