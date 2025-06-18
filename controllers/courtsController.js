import Cancha from '../models/Cancha.js';
import Horario from '../models/Horario.js';
import Reserva from '../models/Reserva.js';
import Bloqueo from '../models/Bloqueo.js';

export async function getCourts(req, res) {
  const courts = await Cancha.find();
  res.json(courts);
}

export async function getCourtAvailability(req, res) {
  const { id } = req.params;
  const horarios = await Horario.find({ id_cancha: id, activo: true });
  const reservas = await Reserva.find({ id_cancha: id, estado: 'activa' });
  const bloqueos = await Bloqueo.find({ id_cancha: id });
  res.json({ horarios, reservas, bloqueos });
}

export async function getCourtBookings(req, res) {
  res.status(501).json({ error: 'No implementado aún para MongoDB' });
}

export async function getCourtBlocks(req, res) {
  res.status(501).json({ error: 'No implementado aún para MongoDB' });
} 