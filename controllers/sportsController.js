export async function getSports(req, res) {
  const db = req.app.locals.db;
  const deportes = await db.all('SELECT * FROM deportes');
  res.json(deportes);
}