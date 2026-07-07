import express from 'express';
import { WorkflowEvent } from '../models/WorkflowEvent.js';

const router = express.Router();

router.get('/:jobId', async (req, res, next) => {
  try {
    const events = await WorkflowEvent.find({ job: req.params.jobId }).sort({ timestamp: -1 });
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    next(error);
  }
});

export default router;
