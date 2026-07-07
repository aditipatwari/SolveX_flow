import { FollowUp } from '../models/FollowUp.js';
import { Customer } from '../models/Customer.js';
import { Job } from '../models/Job.js';

export const getFollowups = async (req, res, next) => {
  try {
    const followups = await FollowUp.find()
      .populate('customer')
      .populate('job')
      .sort({ scheduledDate: 1 });
      
    res.status(200).json({
      success: true,
      count: followups.length,
      data: followups
    });
  } catch (error) {
    next(error);
  }
};

export const createFollowup = async (req, res, next) => {
  try {
    const { customerId, jobId, type, scheduledDate } = req.body;

    // Validate existence of customer & job
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    const followup = await FollowUp.create({
      customer: customerId,
      job: jobId,
      type,
      scheduledDate: new Date(scheduledDate),
      status: 'pending'
    });

    const populatedFollowup = await FollowUp.findById(followup._id)
      .populate('customer')
      .populate('job');

    res.status(201).json({
      success: true,
      data: populatedFollowup
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getFollowups,
  createFollowup
};
