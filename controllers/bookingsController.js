export async function getAllBookings(req, res) {
  const db = req.app.locals.db;
  // Trae todas las reservas y el nombre de la cancha asociada
  const reservas = await db.all(`
    SELECT r.*, c.nombre as cancha_nombre
    FROM reservas r
    LEFT JOIN canchas c ON r.id_cancha = c.id
  `);
  res.json(reservas);
}

export async function createBooking(req, res) {
  const db = req.app.locals.db;
  const { id_cancha, fecha, hora_inicio, hora_fin, comentario, nombre_usuario, telefono } = req.body;

  // Validar solapamiento con reservas activas
  const solapada = await db.get(
    `SELECT * FROM reservas WHERE id_cancha = ? AND fecha = ? AND estado = 'activa'
      AND ((hora_inicio < ? AND hora_fin > ?) OR (hora_inicio < ? AND hora_fin > ?) OR (hora_inicio >= ? AND hora_fin <= ?))`,
    [id_cancha, fecha, hora_fin, hora_inicio, hora_inicio, hora_inicio, hora_inicio, hora_fin]
  );

  // Validar bloqueos
  const bloqueada = await db.get(
    `SELECT * FROM bloqueos WHERE id_cancha = ? AND fecha = ?
      AND ((hora_inicio < ? AND hora_fin > ?) OR (hora_inicio < ? AND hora_fin > ?) OR (hora_inicio >= ? AND hora_fin <= ?))`,
    [id_cancha, fecha, hora_fin, hora_inicio, hora_inicio, hora_inicio, hora_inicio, hora_fin]
  );

  if (solapada || bloqueada) {
    return res.status(409).json({ error: 'La cancha no está disponible en ese horario.' });
  }

  const now = new Date().toISOString();
  const result = await db.run(
    `INSERT INTO reservas (id_cancha, fecha, hora_inicio, hora_fin, estado, nombre_usuario, telefono)
     VALUES (?, ?, ?, ?, 'activa', ?, ?)`,
    [id_cancha, fecha, hora_inicio, hora_fin, nombre_usuario, telefono]
  );
  const reserva = await db.get('SELECT * FROM reservas WHERE id = ?', [result.lastID]);
  res.status(201).json(reserva);
}

export async function deleteBooking(req, res) {
  const db = req.app.locals.db;
  const { id } = req.params;
  await db.run('UPDATE reservas SET estado = ? WHERE id = ?', ['cancelada', id]);
  res.json({ mensaje: 'Reserva cancelada' });
}

export async function getBooking(req, res) {
  const db = req.app.locals.db;
  const { id } = req.params;
  const reserva = await db.get('SELECT * FROM reservas WHERE id = ?', [id]);
  if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada' });
  res.json(reserva);
}

export async function updateBooking(req, res) {
  res.status(501).json({ error: 'No implementado aún para SQLite' });
}