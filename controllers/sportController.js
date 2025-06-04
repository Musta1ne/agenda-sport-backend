const { Sport, Court } = require('../models');

const sportController = {
  // Listar todos los deportes
  getAll: async (req, res) => {
    try {
      const sports = await Sport.findAll();
      res.json(sports);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear un nuevo deporte
  create: async (req, res) => {
    try {
      const { name } = req.body;

      // Validación de datos de entrada
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ error: 'El nombre del deporte es requerido y debe ser un texto válido' });
      }

      // Verificar si ya existe un deporte con el mismo nombre
      const existingSport = await Sport.findOne({ where: { name: name.trim() } });
      if (existingSport) {
        return res.status(409).json({ error: 'Ya existe un deporte con ese nombre' });
      }

      const sport = await Sport.create({ name: name.trim() });
      res.status(201).json(sport);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar un deporte existente
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      // Validación de datos de entrada
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ error: 'El nombre del deporte es requerido y debe ser un texto válido' });
      }

      const sport = await Sport.findByPk(id);
      if (!sport) {
        return res.status(404).json({ error: 'Deporte no encontrado' });
      }

      // Verificar si ya existe otro deporte con el mismo nombre
      const existingSport = await Sport.findOne({
        where: { 
          name: name.trim(),
          id: { [Op.ne]: id } // Excluir el deporte actual de la búsqueda
        }
      });
      if (existingSport) {
        return res.status(409).json({ error: 'Ya existe otro deporte con ese nombre' });
      }

      await sport.update({ name: name.trim() });
      res.json(sport);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar un deporte
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const sport = await Sport.findByPk(id);
      if (!sport) {
        return res.status(404).json({ error: 'Deporte no encontrado' });
      }

      // Verificar si hay canchas asociadas a este deporte
      const associatedCourts = await Court.count({ where: { sportId: id } });
      if (associatedCourts > 0) {
        return res.status(409).json({ 
          error: 'No se puede eliminar el deporte porque tiene canchas asociadas',
          associatedCourts
        });
      }

      await sport.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = sportController;