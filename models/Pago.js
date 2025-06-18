import mongoose from 'mongoose';

const pagoSchema = new mongoose.Schema({
  id_reserva: { type: mongoose.Schema.Types.ObjectId, ref: 'Reserva', required: true },
  monto: { type: Number, required: true },
  metodo_pago: { type: String, required: true },
  fecha_pago: { type: String, required: true }
});

export default mongoose.model('Pago', pagoSchema); 