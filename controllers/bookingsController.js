import Reserva from '../models/Reserva.js';
import Cancha from '../models/Cancha.js';
import Bloqueo from '../models/Bloqueo.js';

export async function getAllBookings(req, res) {
  // Listar todas las reservas, incluyendo datos de la cancha
  const reservas = await Reserva.find().populate('id_cancha');
  res.json(reservas);
}

export async function createBooking(req, res) {
  const { id_cancha, fecha, hora_inicio, hora_fin, comentario, monto, metodo_pago, nombre, apellido } = req.body;
  // Validar solapamiento con reservas activas
  const solapada = await Reserva.findOne({
    id_cancha,
    fecha,
    estado: 'activa',
    $or: [
      { hora_inicio: { $lt: hora_fin }, hora_fin: { $gt: hora_inicio } },
      { hora_inicio: { $lt: hora_inicio }, hora_fin: { $gt: hora_inicio } },
      { hora_inicio: { $gte: hora_inicio }, hora_fin: { $lte: hora_fin } }
    ]
  });
  // Validar bloqueos
  const bloqueada = await Bloqueo.findOne({
    id_cancha,
    fecha,
    $or: [
      { hora_inicio: { $lt: hora_fin }, hora_fin: { $gt: hora_inicio } },
      { hora_inicio: { $lt: hora_inicio }, hora_fin: { $gt: hora_inicio } },
      { hora_inicio: { $gte: hora_inicio }, hora_fin: { $lte: hora_fin } }
    ]
  });
  if (solapada || bloqueada) {
    return res.status(409).json({ error: 'La cancha no está disponible en ese horario.' });
  }
  const now = new Date().toISOString();
  const reserva = await Reserva.create({
    id_cancha,
    fecha,
    hora_inicio,
    hora_fin,
    estado: 'activa',
    fecha_creacion: now,
    comentario: comentario || '',
    nombre,
    apellido
  });
  res.status(201).json(reserva);
}

export async function deleteBooking(req, res) {
  const { id } = req.params;
  await Reserva.findByIdAndUpdate(id, { estado: 'cancelada' });
  res.json({ mensaje: 'Reserva cancelada' });
}

export async function getBooking(req, res) {
  const { id } = req.params;
  const reserva = await Reserva.findById(id).populate('id_cancha');
  if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada' });
  res.json(reserva);
}

export async function updateBooking(req, res) {
  res.status(501).json({ error: 'No implementado aún para MongoDB' });
} 