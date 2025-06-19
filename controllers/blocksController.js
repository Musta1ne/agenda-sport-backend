export async function createBlock(req, res) {
  const db = req.app.locals.db;
  const { id_cancha, fecha, hora_inicio, hora_fin, motivo } = req.body;

  // Validar solapamiento con reservas activas
  const solapada = await db.get(
    `SELECT * FROM reservas WHERE id_cancha = ? AND fecha = ? AND estado = 'activa'
      AND ((hora_inicio < ? AND hora_fin > ?) OR (hora_inicio < ? AND hora_fin > ?) OR (hora_inicio >= ? AND hora_fin <= ?))`,
    [id_cancha, fecha, hora_fin, hora_inicio, hora_inicio, hora_inicio, hora_inicio, hora_fin]
  );

  if (solapada) {
    return res.status(409).json({ error: 'Ya existe una reserva activa en ese horario.' });
  }

  await db.run(
    `INSERT INTO bloqueos (id_cancha, fecha, hora_inicio, hora_fin, motivo)
     VALUES (?, ?, ?, ?, ?)`,
    [id_cancha, fecha, hora_inicio, hora_fin, motivo || '']
  );
  res.status(201).json({ mensaje: 'Bloqueo creado correctamente' });
}

export async function getBlocks(req, res) {
  const db = req.app.locals.db;
  try {
    const blocks = await db.all('SELECT * FROM bloqueos ORDER BY fecha DESC, hora_inicio');
    res.json(blocks);
  } catch (error) {
    console.error('Error al obtener bloques:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function updateBlock(req, res) {
  const db = req.app.locals.db;
  const { id } = req.params;
  const { id_cancha, fecha, hora_inicio, hora_fin, motivo } = req.body;
  try {
    const block = await db.get('SELECT * FROM bloqueos WHERE id = ?', [id]);
    if (!block) {
      return res.status(404).json({ error: 'Bloqueo/horario no encontrado' });
    }
    await db.run(
      'UPDATE bloqueos SET id_cancha = ?, fecha = ?, hora_inicio = ?, hora_fin = ?, motivo = ? WHERE id = ?',
      [id_cancha || block.id_cancha, fecha || block.fecha, hora_inicio || block.hora_inicio, hora_fin || block.hora_fin, motivo || block.motivo, id]
    );
    const updatedBlock = await db.get('SELECT * FROM bloqueos WHERE id = ?', [id]);
    res.json(updatedBlock);
  } catch (error) {
    console.error('Error al actualizar bloqueo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function deleteBlock(req, res) {
  const db = req.app.locals.db;
  const { id } = req.params;
  try {
    const block = await db.get('SELECT * FROM bloqueos WHERE id = ?', [id]);
    if (!block) {
      return res.status(404).json({ error: 'Bloqueo/horario no encontrado' });
    }
    await db.run('DELETE FROM bloqueos WHERE id = ?', [id]);
    res.json({ mensaje: 'Bloqueo/horario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar bloqueo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}