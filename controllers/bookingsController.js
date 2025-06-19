import { emitCourtUpdate, emitBookingUpdate } from '../app.js';
import fs from 'fs';
import path from 'path';

export async function getAllBookings(req, res) {
  const db = req.app.locals.db;
  try {
    // Trae todas las reservas y el nombre de la cancha asociada
    const reservas = await db.all(`
      SELECT r.*, c.nombre as cancha_nombre, c.tipo as cancha_tipo
      FROM reservas r
      LEFT JOIN canchas c ON r.id_cancha = c.id
      ORDER BY r.fecha DESC, r.hora_inicio DESC
    `);
    res.json(reservas);
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function createBooking(req, res) {
  const db = req.app.locals.db;
  const { id_cancha, fecha, hora_inicio, hora_fin, comentario, nombre_usuario, telefono } = req.body;

  let reserva = null;
  let dbError = null;
  let jsonError = null;

  try {
    // Validaciones básicas
    if (!id_cancha || !fecha || !hora_inicio || !hora_fin || !nombre_usuario || !telefono) {
      return res.status(400).json({ 
        error: 'Todos los campos son requeridos: id_cancha, fecha, hora_inicio, hora_fin, nombre_usuario, telefono' 
      });
    }

    // Validar que la cancha existe
    const cancha = await db.get('SELECT * FROM canchas WHERE id = ?', [id_cancha]);
    if (!cancha) {
      return res.status(404).json({ error: 'Cancha no encontrada' });
    }

    // Validar que la fecha no sea en el pasado
    const fechaReserva = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fechaReserva < hoy) {
      return res.status(400).json({ error: 'No se pueden hacer reservas para fechas pasadas' });
    }

    // Validar formato de hora
    const horaRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!horaRegex.test(hora_inicio) || !horaRegex.test(hora_fin)) {
      return res.status(400).json({ error: 'Formato de hora inválido. Use HH:MM' });
    }

    // Validar que hora_fin sea posterior a hora_inicio
    const inicio = new Date(`2000-01-01T${hora_inicio}`);
    const fin = new Date(`2000-01-01T${hora_fin}`);
    if (fin <= inicio) {
      return res.status(400).json({ error: 'La hora de fin debe ser posterior a la hora de inicio' });
    }

    // Validar solapamiento con reservas activas
    const solapada = await db.get(
      `SELECT * FROM reservas WHERE id_cancha = ? AND fecha = ? AND estado = 'activa'
        AND ((hora_inicio < ? AND hora_fin > ?) OR (hora_inicio < ? AND hora_fin > ?) OR (hora_inicio >= ? AND hora_fin <= ?))`,
      [id_cancha, fecha, hora_fin, hora_inicio, hora_inicio, hora_inicio, hora_inicio, hora_fin]
    );

    if (solapada) {
      return res.status(409).json({ 
        error: 'La cancha no está disponible en ese horario. Ya existe una reserva activa.' 
      });
    }

    // Validar bloqueos
    const bloqueada = await db.get(
      `SELECT * FROM bloqueos WHERE id_cancha = ? AND fecha = ?
        AND ((hora_inicio < ? AND hora_fin > ?) OR (hora_inicio < ? AND hora_fin > ?) OR (hora_inicio >= ? AND hora_fin <= ?))`,
      [id_cancha, fecha, hora_fin, hora_inicio, hora_inicio, hora_inicio, hora_inicio, hora_fin]
    );

    if (bloqueada) {
      return res.status(409).json({ 
        error: 'La cancha está bloqueada en ese horario.' 
      });
    }

    // Crear la reserva en la base de datos
    try {
      const result = await db.run(
        `INSERT INTO reservas (id_cancha, fecha, hora_inicio, hora_fin, estado, nombre_usuario, telefono)
         VALUES (?, ?, ?, ?, 'activa', ?, ?)`,
        [id_cancha, fecha, hora_inicio, hora_fin, nombre_usuario, telefono]
      );
      // Obtener la reserva creada con información de la cancha
      reserva = await db.get(`
        SELECT r.*, c.nombre as cancha_nombre, c.tipo as cancha_tipo
        FROM reservas r
        LEFT JOIN canchas c ON r.id_cancha = c.id
        WHERE r.id = ?
      `, [result.lastID]);
    } catch (err) {
      dbError = err;
      console.error('Error al guardar la reserva en la base de datos:', err);
    }

    // Guardar la reserva en el archivo JSON
    try {
      const exportDir = path.resolve('backend/db');
      const exportPath = path.join(exportDir, 'exported_data.json');
      if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true });
      }
      let reservas = [];
      if (fs.existsSync(exportPath)) {
        reservas = JSON.parse(fs.readFileSync(exportPath, 'utf-8'));
        if (!Array.isArray(reservas)) reservas = [];
      }
      const nuevaReserva = reserva ? {
        id: reserva.id,
        id_cancha: reserva.id_cancha,
        fecha: reserva.fecha,
        hora_inicio: reserva.hora_inicio,
        hora_fin: reserva.hora_fin,
        estado: reserva.estado,
        nombre_usuario: reserva.nombre_usuario,
        telefono: reserva.telefono
      } : {
        id_cancha, fecha, hora_inicio, hora_fin, estado: 'activa', nombre_usuario, telefono
      };
      reservas.push(nuevaReserva);
      fs.writeFileSync(exportPath, JSON.stringify(reservas, null, 2));
    } catch (err) {
      jsonError = err;
      console.error('Error al guardar la reserva en el archivo JSON:', err);
    }

    if (dbError && jsonError) {
      return res.status(500).json({ error: 'No se pudo guardar la reserva ni en la base de datos ni en el archivo JSON', dbError, jsonError });
    } else if (dbError) {
      return res.status(201).json({
        mensaje: 'Reserva guardada solo en el archivo JSON (error en la base de datos)',
        reserva: null,
        dbError
      });
    } else if (jsonError) {
      return res.status(201).json({
        mensaje: 'Reserva guardada solo en la base de datos (error en el archivo JSON)',
        reserva: reserva,
        jsonError
      });
    }

    // Emitir notificaciones en tiempo real
    try {
      emitCourtUpdate(id_cancha, {
        type: 'booking_created',
        courtId: id_cancha,
        booking: reserva,
        message: `Nueva reserva creada en ${cancha.nombre}`
      });
      emitBookingUpdate({
        type: 'booking_created',
        booking: reserva,
        message: `Nueva reserva: ${nombre_usuario} en ${cancha.nombre}`
      });
    } catch (socketError) {
      console.error('Error al emitir notificación:', socketError);
    }

    res.status(201).json({
      mensaje: 'Reserva creada exitosamente',
      reserva: reserva
    });

  } catch (error) {
    console.error('Error al crear reserva:', error);
    res.status(500).json({ error: 'Error interno del servidor al crear la reserva' });
  }
}

export async function deleteBooking(req, res) {
  const db = req.app.locals.db;
  const { id } = req.params;

  try {
    // Verificar que la reserva existe
    const reserva = await db.get('SELECT * FROM reservas WHERE id = ?', [id]);
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    // Verificar que la reserva no esté ya cancelada
    if (reserva.estado === 'cancelada') {
      return res.status(400).json({ error: 'La reserva ya está cancelada' });
    }

    // Verificar que no sea muy tarde para cancelar (2 horas antes)
    const fechaHoraReserva = new Date(`${reserva.fecha}T${reserva.hora_inicio}`);
    const ahora = new Date();
    const diffMs = fechaHoraReserva - ahora;
    const diffHoras = diffMs / (1000 * 60 * 60);

    if (diffHoras < 2) {
      return res.status(400).json({ 
        error: 'No se puede cancelar la reserva. Debe cancelar con al menos 2 horas de anticipación.' 
      });
    }

    // Cancelar la reserva
    await db.run('UPDATE reservas SET estado = ? WHERE id = ?', ['cancelada', id]);

    console.log(`Reserva cancelada: ID ${id}, Cancha ${reserva.id_cancha}, Fecha ${reserva.fecha}, Horario ${reserva.hora_inicio}-${reserva.hora_fin}`);

    // Emitir notificaciones en tiempo real
    try {
      // Notificar actualización de la cancha específica
      emitCourtUpdate(reserva.id_cancha, {
        type: 'booking_cancelled',
        courtId: reserva.id_cancha,
        bookingId: id,
        message: `Reserva cancelada en cancha ${reserva.id_cancha}`
      });

      // Notificar actualización general de reservas
      emitBookingUpdate({
        type: 'booking_cancelled',
        bookingId: id,
        message: `Reserva cancelada: ${reserva.nombre_usuario}`
      });
    } catch (socketError) {
      console.error('Error al emitir notificación:', socketError);
    }

    res.json({ 
      mensaje: 'Reserva cancelada exitosamente',
      reserva: { ...reserva, estado: 'cancelada' }
    });

  } catch (error) {
    console.error('Error al cancelar reserva:', error);
    res.status(500).json({ error: 'Error interno del servidor al cancelar la reserva' });
  }
}

export async function getBooking(req, res) {
  const db = req.app.locals.db;
  const { id } = req.params;

  try {
    const reserva = await db.get(`
      SELECT r.*, c.nombre as cancha_nombre, c.tipo as cancha_tipo
      FROM reservas r
      LEFT JOIN canchas c ON r.id_cancha = c.id
      WHERE r.id = ?
    `, [id]);

    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    res.json(reserva);

  } catch (error) {
    console.error('Error al obtener reserva:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function updateBooking(req, res) {
  const db = req.app.locals.db;
  const { id } = req.params;
  const { nombre_usuario, telefono, comentario } = req.body;

  try {
    // Verificar que la reserva existe
    const reserva = await db.get('SELECT * FROM reservas WHERE id = ?', [id]);
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    // Verificar que la reserva esté activa
    if (reserva.estado !== 'activa') {
      return res.status(400).json({ error: 'Solo se pueden modificar reservas activas' });
    }

    // Actualizar solo los campos permitidos
    const updates = [];
    const values = [];

    if (nombre_usuario !== undefined) {
      updates.push('nombre_usuario = ?');
      values.push(nombre_usuario);
    }

    if (telefono !== undefined) {
      updates.push('telefono = ?');
      values.push(telefono);
    }

    if (comentario !== undefined) {
      updates.push('comentario = ?');
      values.push(comentario);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
    }

    values.push(id);
    await db.run(`UPDATE reservas SET ${updates.join(', ')} WHERE id = ?`, values);

    // Obtener la reserva actualizada
    const reservaActualizada = await db.get(`
      SELECT r.*, c.nombre as cancha_nombre, c.tipo as cancha_tipo
      FROM reservas r
      LEFT JOIN canchas c ON r.id_cancha = c.id
      WHERE r.id = ?
    `, [id]);

    console.log(`Reserva actualizada: ID ${id}`);

    res.json({
      mensaje: 'Reserva actualizada exitosamente',
      reserva: reservaActualizada
    });

  } catch (error) {
    console.error('Error al actualizar reserva:', error);
    res.status(500).json({ error: 'Error interno del servidor al actualizar la reserva' });
  }
}

// Función adicional para obtener estadísticas de reservas
export async function getBookingStats(req, res) {
  const db = req.app.locals.db;
  
  try {
    const stats = await db.get(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN estado = 'activa' THEN 1 ELSE 0 END) as activas,
        SUM(CASE WHEN estado = 'cancelada' THEN 1 ELSE 0 END) as canceladas,
        SUM(CASE WHEN fecha >= date('now') THEN 1 ELSE 0 END) as futuras
      FROM reservas
    `);

    res.json(stats);

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}