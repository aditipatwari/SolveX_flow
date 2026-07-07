import express from 'express';
import { getFollowups, createFollowup } from '../controllers/followupController.js';

const router = express.Router();

router.get('/', getFollowups);
router.post('/', createFollowup);

export default router;
