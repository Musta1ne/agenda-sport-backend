import mongoose from 'mongoose';

const bloqueoSchema = new mongoose.Schema({
  id_cancha: { type: mongoose.Schema.Types.ObjectId, ref: 'Cancha', required: true },
  fecha: { type: String, required: true },
  hora_inicio: { type: String, required: true },
  hora_fin: { type: String, required: true },
  motivo: String
});

export default mongoose.model('Bloqueo', bloqueoSchema); 