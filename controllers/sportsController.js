export async function getSports(req, res) {
  try {
    const db = req.app.locals.db;
    
    // Verificar que la tabla existe
    const tableExists = await db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='deportes'");
    
    if (!tableExists) {
      return res.status(500).json({ error: 'Tabla deportes no encontrada' });
    }
    
    const deportes = await db.all('SELECT * FROM deportes');
    res.json(deportes);
  } catch (error) {
    console.error('Error en getSports:', error);
    res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
}