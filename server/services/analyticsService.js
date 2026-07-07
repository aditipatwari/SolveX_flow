import { Job } from '../models/Job.js';
import { Customer } from '../models/Customer.js';
import { FollowUp } from '../models/FollowUp.js';

export const getTechnicianWorkload = async () => {
  const activeJobs = await Job.find({ status: 'in-progress' });
  const workload = {};
  
  activeJobs.forEach(job => {
    workload[job.technician] = (workload[job.technician] || 0) + 1;
  });

  return workload;
};

export const getDelayedJobsCount = async () => {
  // A job is considered "delayed" if it has been in-progress for more than 4 hours, or if it is failed
  const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
  const delayedJobs = await Job.find({
    $or: [
      { status: 'failed' },
      { status: 'in-progress', updatedAt: { $lt: fourHoursAgo } }
    ]
  });

  return delayedJobs;
};

export const getCompletionRate = async () => {
  const totalJobs = await Job.countDocuments();
  if (totalJobs === 0) return 100;
  
  const completedJobs = await Job.countDocuments({ status: 'completed' });
  return Math.round((completedJobs / totalJobs) * 100);
};

export const updateCustomerHealthScores = async () => {
  const customers = await Customer.find();
  
  for (const customer of customers) {
    const totalJobs = await Job.countDocuments({ customer: customer._id });
    if (totalJobs === 0) {
      customer.healthScore = 100;
      await customer.save();
      continue;
    }
    
    const failedJobs = await Job.countDocuments({ customer: customer._id, status: 'failed' });
    const cancelledJobs = await Job.countDocuments({ customer: customer._id, status: 'cancelled' });
    
    // Calculate health score: subtract 15 points per failed job and 5 points per cancelled job
    const penalty = (failedJobs * 15) + (cancelledJobs * 5);
    customer.healthScore = Math.max(0, 100 - penalty);
    await customer.save();
  }
};

export const getAnalyticsSummary = async () => {
  await updateCustomerHealthScores();
  
  const totalJobs = await Job.countDocuments();
  const completedJobs = await Job.countDocuments({ status: 'completed' });
  const activeJobsCount = await Job.countDocuments({ status: 'in-progress' });
  const pendingJobsCount = await Job.countDocuments({ status: 'pending' });
  
  const workload = await getTechnicianWorkload();
  const delayedJobs = await getDelayedJobsCount();
  const completionRate = await getCompletionRate();
  const pendingFollowupsCount = await FollowUp.countDocuments({ status: 'pending' });

  // Calculate simulated revenue ($150 per completed job, plus extra charges)
  const jobsData = await Job.find({ status: 'completed' });
  let totalRevenue = 0;
  jobsData.forEach(job => {
    // Parse simulated price or default to 150
    const priceStr = job.serviceType.toLowerCase().includes('compressor') ? '420' : '150';
    totalRevenue += parseFloat(priceStr);
  });

  return {
    totalJobs,
    completedJobs,
    activeJobsCount,
    pendingJobsCount,
    technicianWorkload: workload,
    delayedJobsCount: delayedJobs.length,
    delayedJobsList: delayedJobs,
    completionRate,
    pendingFollowupsCount,
    totalRevenue
  };
};

export default {
  getTechnicianWorkload,
  getDelayedJobsCount,
  getCompletionRate,
  updateCustomerHealthScores,
  getAnalyticsSummary
};
