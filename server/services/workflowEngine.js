import { Job } from '../models/Job.js';
import { WorkflowEvent } from '../models/WorkflowEvent.js';
import { Notification } from '../models/Notification.js';
import { handleJobStatusChange } from './automationEngine.js';

let ioInstance = null;

export const setIO = (io) => {
  ioInstance = io;
  console.log('[Workflow Engine] Socket.IO instance successfully configured.');
};

export const advanceJobWorkflow = async (jobId, newStage, performedBy = 'System Workflow Engine') => {
  const job = await Job.findById(jobId).populate('customer');
  if (!job) throw new Error('Job not found');

  const stages = ['Dispatch Prep', 'En Route', 'On-Site Diagnostics', 'Completed'];
  if (newStage < 0 || newStage > 3) throw new Error('Invalid stage index');

  let status = 'pending';
  if (newStage === 1 || newStage === 2) {
    status = 'in-progress';
  } else if (newStage === 3) {
    status = 'completed';
  }

  job.currentStage = newStage;
  job.status = status;
  await job.save();

  // Create Workflow Event
  const event = await WorkflowEvent.create({
    job: job._id,
    stage: newStage,
    notes: `Advanced to stage: ${stages[newStage]}`,
    performedBy
  });

  // Create Notification
  const notification = await Notification.create({
    title: 'Job Stage Updated',
    message: `${job.technician} advanced job #${jobId} for ${job.customer.name} to '${stages[newStage]}'.`
  });

  // Trigger Automation Rules
  await handleJobStatusChange(job);

  // Emit Socket.IO broadcasts
  if (ioInstance) {
    console.log(`[Workflow Engine] Emitting real-time updates for job #${jobId}`);
    ioInstance.emit('dashboard_update', { jobId, stage: newStage, status });
    ioInstance.emit('timeline_update', { jobId, event });
    ioInstance.emit('notification_new', { notification });
  }

  return job;
};

export const updateJobStatusDirectly = async (jobId, status, performedBy = 'System Workflow Engine') => {
  const job = await Job.findById(jobId).populate('customer');
  if (!job) throw new Error('Job not found');

  job.status = status;
  await job.save();

  // Create Workflow Event
  const event = await WorkflowEvent.create({
    job: job._id,
    stage: job.currentStage,
    notes: `Job status modified to: ${status}`,
    performedBy
  });

  // Create Notification
  const notification = await Notification.create({
    title: 'Job Status Changed',
    message: `Job #${jobId} status updated to '${status}'.`
  });

  // Trigger Automation Rules
  await handleJobStatusChange(job);

  // Emit Socket.IO broadcasts
  if (ioInstance) {
    console.log(`[Workflow Engine] Emitting status change updates for job #${jobId}`);
    ioInstance.emit('dashboard_update', { jobId, stage: job.currentStage, status });
    ioInstance.emit('timeline_update', { jobId, event });
    ioInstance.emit('notification_new', { notification });
  }

  return job;
};

export default {
  setIO,
  advanceJobWorkflow,
  updateJobStatusDirectly
};
