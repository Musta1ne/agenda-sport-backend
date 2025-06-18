import mongoose from 'mongoose';

const deporteSchema = new mongoose.Schema({
  nombre: { type: String, required: true }
});

export default mongoose.model('Deporte', deporteSchema); 