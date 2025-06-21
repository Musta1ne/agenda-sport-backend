import { db } from '../models/index.js';

const { Sport } = db;

// @desc    Obtener todos los deportes
// @route   GET /api/sports
export const getAllSports = async (req, res) => {
  try {
    const sports = await Sport.findAll();
    res.json(sports);
  } catch (error) {
    console.error('Error al obtener deportes:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// @desc    Obtener un deporte por ID
// @route   GET /api/sports/:id
export const getSportById = async (req, res) => {
  try {
    const { id } = req.params;
    const sport = await Sport.findByPk(id);
    if (!sport) {
      return res.status(404).json({ message: 'Deporte no encontrado.' });
    }
    res.json(sport);
  } catch (error) {
    console.error(`Error al obtener el deporte ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// @desc    Crear un nuevo deporte
// @route   POST /api/sports
export const createSport = async (req, res) => {
  try {
    const { nombre } = req.body;
    const newSport = await Sport.create({ nombre });
    res.status(201).json(newSport);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Ya existe un deporte con ese nombre.' });
    }
    console.error('Error al crear deporte:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// @desc    Actualizar un deporte
// @route   PUT /api/sports/:id
export const updateSport = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    const sport = await Sport.findByPk(id);
    if (!sport) {
      return res.status(404).json({ message: 'Deporte no encontrado.' });
    }

    sport.nombre = nombre;
    await sport.save();

    res.json(sport);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Ya existe un deporte con ese nombre.' });
    }
    console.error(`Error al actualizar el deporte ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// @desc    Eliminar un deporte
// @route   DELETE /api/sports/:id
export const deleteSport = async (req, res) => {
  try {
    const { id } = req.params;
    const sport = await Sport.findByPk(id);

    if (!sport) {
      return res.status(404).json({ message: 'Deporte no encontrado.' });
    }

    await sport.destroy();
    res.status(204).send(); // No content
  } catch (error) {
    console.error(`Error al eliminar el deporte ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};