import express from 'express';
import { getJobs, getJobById, updateJobStatus } from '../controllers/jobController.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/:id', getJobById);
router.patch('/:id/status', updateJobStatus);

export default router;
