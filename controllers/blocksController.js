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