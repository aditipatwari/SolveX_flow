import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  technician: {
    type: String,
    required: true,
    default: 'Unassigned'
  },
  serviceType: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'critical'],
    default: 'medium'
  },
  currentStage: {
    type: Number,
    min: 0,
    max: 3,
    default: 0 // 0 = Dispatch, 1 = En Route, 2 = Working, 3 = Complete
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

export const Job = mongoose.model('Job', JobSchema);
export default Job;
