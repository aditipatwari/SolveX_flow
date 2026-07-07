import { Job } from '../models/Job.js';
import { advanceJobWorkflow, updateJobStatusDirectly } from '../services/workflowEngine.js';

export const getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find().populate('customer').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    next(error);
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('customer');
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }
    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    next(error);
  }
};

export const updateJobStatus = async (req, res, next) => {
  try {
    const { stage, status, performedBy } = req.body;
    const jobId = req.params.id;

    let updatedJob;

    if (stage !== undefined) {
      // Advance workflow stage
      updatedJob = await advanceJobWorkflow(jobId, parseInt(stage), performedBy);
    } else if (status !== undefined) {
      // Direct status updates (like cancel or fail)
      updatedJob = await updateJobStatusDirectly(jobId, status, performedBy);
    } else {
      return res.status(400).json({
        success: false,
        error: 'Must provide either stage index or status value'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Workflow advanced successfully',
      data: updatedJob
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getJobs,
  getJobById,
  updateJobStatus
};
