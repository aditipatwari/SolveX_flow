import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  address: {
    type: String,
    required: true
  },
  healthScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  lastService: {
    type: Date
  },
  nextService: {
    type: Date
  }
}, {
  timestamps: true
});

export const Customer = mongoose.model('Customer', CustomerSchema);
export default Customer;
