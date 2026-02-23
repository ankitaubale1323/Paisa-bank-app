import express from 'express';
// ✅ CORRECT
import { protect } from '../middleware/auth.js';
import { chat } from '../controllers/aiController.js';

const router = express.Router();

router.post('/chat', protect, chat);

export default router;