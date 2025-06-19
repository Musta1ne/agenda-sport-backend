import sqlite3 from 'sqlite3';

export async function getSchedules(req, res) {
  const db = req.app.locals.db;
  try {
    const schedules = await db.all('SELECT * FROM horarios ORDER BY id_cancha, dia_semana, hora_inicio');
    res.json(schedules);
  } catch (error) {
    console.error('Error al obtener horarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function createSchedule(req, res) {
  const db = req.app.locals.db;
  const { id_cancha, dia_semana, hora_inicio, hora_fin, activo } = req.body;
  try {
    if (!id_cancha || !dia_semana || !hora_inicio || !hora_fin) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    const result = await db.run(
      'INSERT INTO horarios (id_cancha, dia_semana, hora_inicio, hora_fin, activo) VALUES (?, ?, ?, ?, ?)',
      [id_cancha, dia_semana, hora_inicio, hora_fin, activo !== undefined ? activo : 1]
    );
    const nuevoHorario = await db.get('SELECT * FROM horarios WHERE id = ?', [result.lastID]);
    res.status(201).json(nuevoHorario);
  } catch (error) {
    console.error('Error al crear horario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function updateSchedule(req, res) {
  const db = req.app.locals.db;
  const { id } = req.params;
  const { id_cancha, dia_semana, hora_inicio, hora_fin, activo } = req.body;
  try {
    const horario = await db.get('SELECT * FROM horarios WHERE id = ?', [id]);
    if (!horario) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }
    await db.run(
      'UPDATE horarios SET id_cancha = ?, dia_semana = ?, hora_inicio = ?, hora_fin = ?, activo = ? WHERE id = ?',
      [id_cancha || horario.id_cancha, dia_semana || horario.dia_semana, hora_inicio || horario.hora_inicio, hora_fin || horario.hora_fin, activo !== undefined ? activo : horario.activo, id]
    );
    const horarioActualizado = await db.get('SELECT * FROM horarios WHERE id = ?', [id]);
    res.json(horarioActualizado);
  } catch (error) {
    console.error('Error al actualizar horario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function deleteSchedule(req, res) {
  const db = req.app.locals.db;
  const { id } = req.params;
  try {
    const horario = await db.get('SELECT * FROM horarios WHERE id = ?', [id]);
    if (!horario) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }
    await db.run('DELETE FROM horarios WHERE id = ?', [id]);
    res.json({ mensaje: 'Horario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar horario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
} 