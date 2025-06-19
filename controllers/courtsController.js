export async function getCourts(req, res) {
  const db = req.app.locals.db;
  const courts = await db.all('SELECT * FROM canchas');
  res.json(courts);
}

export async function getCourtAvailability(req, res) {
  const db = req.app.locals.db;
  const { id } = req.params;
  
  try {
    // Obtener todos los horarios fijos de la cancha
    const horarios = await db.all('SELECT * FROM horarios WHERE id_cancha = ? AND activo = 1 ORDER BY hora_inicio', [id]);
    
    // Obtener reservas activas para esta cancha
    const reservas = await db.all('SELECT * FROM reservas WHERE id_cancha = ? AND estado = ?', [id, 'activa']);
    
    // Obtener bloqueos para esta cancha
    const bloqueos = await db.all('SELECT * FROM bloqueos WHERE id_cancha = ?', [id]);
    
    // Obtener información de la cancha
    const cancha = await db.get('SELECT * FROM canchas WHERE id = ?', [id]);
    
    if (!cancha) {
      return res.status(404).json({ error: 'Cancha no encontrada' });
    }

    // Crear un mapa de horarios con su estado
    const horariosConEstado = horarios.map(horario => {
      const horarioObj = {
        id: horario.id,
        id_cancha: horario.id_cancha,
        dia_semana: horario.dia_semana,
        hora_inicio: horario.hora_inicio,
        hora_fin: horario.hora_fin,
        activo: horario.activo,
        estado: 'disponible',
        reserva: null,
        bloqueo: null
      };

      // Verificar si está reservado
      const reserva = reservas.find(r => 
        r.hora_inicio === horario.hora_inicio && 
        r.hora_fin === horario.hora_fin
      );
      
      if (reserva) {
        horarioObj.estado = 'reservado';
        horarioObj.reserva = reserva;
      }

      // Verificar si está bloqueado
      const bloqueo = bloqueos.find(b => 
        b.hora_inicio === horario.hora_inicio && 
        b.hora_fin === horario.hora_fin
      );
      
      if (bloqueo) {
        horarioObj.estado = 'bloqueado';
        horarioObj.bloqueo = bloqueo;
      }

      return horarioObj;
    });

    res.json({
      cancha: {
        id: cancha.id,
        nombre: cancha.nombre,
        tipo: cancha.tipo,
        tipo_superficie: cancha.tipo_superficie,
        estado: cancha.estado,
        precio: cancha.precio,
        imagen: cancha.imagen
      },
      horarios: horariosConEstado,
      total_horarios: horariosConEstado.length,
      disponibles: horariosConEstado.filter(h => h.estado === 'disponible').length,
      reservados: horariosConEstado.filter(h => h.estado === 'reservado').length,
      bloqueados: horariosConEstado.filter(h => h.estado === 'bloqueado').length
    });
    
  } catch (error) {
    console.error('Error al obtener disponibilidad:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function getCourtBookings(req, res) {
  const db = req.app.locals.db;
  const { id } = req.params;
  
  try {
    const reservas = await db.all('SELECT * FROM reservas WHERE id_cancha = ? ORDER BY fecha DESC, hora_inicio', [id]);
    res.json(reservas);
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function getCourtBlocks(req, res) {
  const db = req.app.locals.db;
  const { id } = req.params;
  
  try {
    const bloqueos = await db.all('SELECT * FROM bloqueos WHERE id_cancha = ? ORDER BY fecha DESC, hora_inicio', [id]);
    res.json(bloqueos);
  } catch (error) {
    console.error('Error al obtener bloqueos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function createCourt(req, res) {
  const db = req.app.locals.db;
  const { nombre, tipo, tipo_superficie, estado, precio, imagen } = req.body;
  try {
    if (!nombre || !tipo) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: nombre y tipo' });
    }
    const result = await db.run(
      'INSERT INTO canchas (nombre, tipo, tipo_superficie, estado, precio, imagen) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, tipo, tipo_superficie || '', estado || 'disponible', precio || 0, imagen || '']
    );
    const nuevaCancha = await db.get('SELECT * FROM canchas WHERE id = ?', [result.lastID]);
    res.status(201).json(nuevaCancha);
  } catch (error) {
    console.error('Error al crear cancha:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function updateCourt(req, res) {
  const db = req.app.locals.db;
  const { id } = req.params;
  const { nombre, tipo, tipo_superficie, estado, precio, imagen } = req.body;
  try {
    const cancha = await db.get('SELECT * FROM canchas WHERE id = ?', [id]);
    if (!cancha) {
      return res.status(404).json({ error: 'Cancha no encontrada' });
    }
    await db.run(
      'UPDATE canchas SET nombre = ?, tipo = ?, tipo_superficie = ?, estado = ?, precio = ?, imagen = ? WHERE id = ?',
      [nombre || cancha.nombre, tipo || cancha.tipo, tipo_superficie || cancha.tipo_superficie, estado || cancha.estado, precio || cancha.precio, imagen || cancha.imagen, id]
    );
    const canchaActualizada = await db.get('SELECT * FROM canchas WHERE id = ?', [id]);
    res.json(canchaActualizada);
  } catch (error) {
    console.error('Error al actualizar cancha:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function deleteCourt(req, res) {
  const db = req.app.locals.db;
  const { id } = req.params;
  try {
    const cancha = await db.get('SELECT * FROM canchas WHERE id = ?', [id]);
    if (!cancha) {
      return res.status(404).json({ error: 'Cancha no encontrada' });
    }
    await db.run('DELETE FROM canchas WHERE id = ?', [id]);
    res.json({ mensaje: 'Cancha eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar cancha:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
} 