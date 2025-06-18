import mongoose from 'mongoose';

const canchaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  tipo: { type: String, required: true }, // Fútbol 5, Fútbol 7, Pádel
  tipo_superficie: { type: String, required: true },
  estado: { type: String, required: true },
  precio: { type: Number, required: true },
  imagen: { type: String, required: true }, // URL de la imagen
  id_deporte: { type: mongoose.Schema.Types.ObjectId, ref: 'Deporte', required: true }
});

export default mongoose.model('Cancha', canchaSchema); 