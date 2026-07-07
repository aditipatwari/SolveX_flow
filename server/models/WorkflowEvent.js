import mongoose from 'mongoose';

const WorkflowEventSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  stage: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    default: ''
  },
  performedBy: {
    type: String,
    required: true,
    default: 'System Workflow Engine'
  }
});

export const WorkflowEvent = mongoose.model('WorkflowEvent', WorkflowEventSchema);
export default WorkflowEvent;
