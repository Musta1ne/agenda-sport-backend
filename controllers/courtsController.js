export async function getCourts(req, res) {
  const db = req.app.locals.db;
  const courts = await db.all('SELECT * FROM canchas');
  res.json(courts);
}

export async function getCourtAvailability(req, res) {
  const db = req.app.locals.db;
  const { id } = req.params;
  const horarios = await db.all('SELECT * FROM horarios WHERE id_cancha = ? AND activo = 1', [id]);
  const reservas = await db.all('SELECT * FROM reservas WHERE id_cancha = ? AND estado = ?', [id, 'activa']);
  const bloqueos = await db.all('SELECT * FROM bloqueos WHERE id_cancha = ?', [id]);
  const cancha = await db.get('SELECT tipo FROM canchas WHERE id = ?', [id]);
  res.json({ horarios, reservas, bloqueos, tipo: cancha?.tipo || null });
}

export async function getCourtBookings(req, res) {
  res.status(501).json({ error: 'No implementado aún para SQLite' });
}

export async function getCourtBlocks(req, res) {
  res.status(501).json({ error: 'No implementado aún para SQLite' });
} 