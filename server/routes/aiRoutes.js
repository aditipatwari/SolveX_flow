import express from 'express';
import { askCopilot } from '../controllers/aiController.js';

const router = express.Router();

router.post('/chat', askCopilot);

export default router;
