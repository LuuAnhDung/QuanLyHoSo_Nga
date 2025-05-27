import mongoose from 'mongoose';

const unitSchema = new mongoose.Schema({
  unitId: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50
  },
  name: {
    type: String,
    required: true,
    maxlength: 150
  },
  address: {
    type: String,
    required: true,
    maxlength: 255
  },
  phone: {
    type: String,
    required: true,
    maxlength: 20
  }
}, {
  timestamps: true
});

export default mongoose.model('Unit', unitSchema);
