import mongoose from 'mongoose';

const horarioSchema = new mongoose.Schema({
  id_cancha: { type: mongoose.Schema.Types.ObjectId, ref: 'Cancha', required: true },
  dia_semana: { type: Number, required: true },
  hora_inicio: { type: String, required: true },
  hora_fin: { type: String, required: true },
  activo: { type: Boolean, required: true }
});

export default mongoose.model('Horario', horarioSchema); 