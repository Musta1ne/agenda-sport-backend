import { db } from '../models/index.js';

const { Schedule, Court } = db;

// @desc    Obtener todos los horarios
// @route   GET /api/schedules
export const getSchedules = async (req, res) => {
  try {
    const { courtId } = req.query;
    const whereClause = courtId ? { id_cancha: courtId } : {};
    
    const schedules = await Schedule.findAll({
      where: whereClause,
      include: { model: Court, attributes: ['nombre'] },
      order: [['id_cancha', 'ASC'], ['dia_semana', 'ASC'], ['hora_inicio', 'ASC']],
    });
    res.json(schedules);
  } catch (error) {
    console.error('Error al obtener horarios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// @desc    Obtener un horario por ID
// @route   GET /api/schedules/:id
export const getScheduleById = async (req, res) => {
    try {
        const { id } = req.params;
        const schedule = await Schedule.findByPk(id, {
            include: { model: Court, attributes: ['nombre'] }
        });
        if (!schedule) {
            return res.status(404).json({ message: 'Horario no encontrado' });
        }
        res.json(schedule);
    } catch (error) {
        console.error('Error al obtener horario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// @desc    Crear un nuevo horario
// @route   POST /api/schedules
export const createSchedule = async (req, res) => {
  try {
    const { id_cancha, dia_semana, hora_inicio, hora_fin, activo = true } = req.body;
    
    const newScheduleData = {
      id_cancha,
      dia_semana,
      hora_inicio,
      hora_fin,
      activo
    };
    
    const newSchedule = await Schedule.create(newScheduleData);
    const scheduleWithCourt = await Schedule.findByPk(newSchedule.id, {
        include: { model: Court, attributes: ['nombre'] }
    });

    res.status(201).json(scheduleWithCourt);
  } catch (error) {
    console.error('Error al crear horario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// @desc    Actualizar un horario
// @route   PUT /api/schedules/:id
export const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await Schedule.findByPk(id);
    if (!schedule) {
      return res.status(404).json({ message: 'Horario no encontrado' });
    }
    await schedule.update(req.body);
    res.json(schedule);
  } catch (error) {
    console.error('Error al actualizar horario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// @desc    Eliminar un horario
// @route   DELETE /api/schedules/:id
export const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await Schedule.findByPk(id);
    if (!schedule) {
      return res.status(404).json({ message: 'Horario no encontrado' });
    }
    await schedule.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar horario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}; 