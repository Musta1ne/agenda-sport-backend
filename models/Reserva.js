import mongoose from 'mongoose';

const reservaSchema = new mongoose.Schema({
  id_cancha: { type: mongoose.Schema.Types.ObjectId, ref: 'Cancha', required: true },
  fecha: { type: String, required: true },
  hora_inicio: { type: String, required: true },
  hora_fin: { type: String, required: true },
  estado: { type: String, required: true },
  fecha_creacion: { type: String, required: true },
  comentario: String,
  nombre: String,
  apellido: String
});

export default mongoose.model('Reserva', reservaSchema); 