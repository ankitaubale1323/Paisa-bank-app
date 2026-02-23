import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  register,
  login,
  getProfile,
  updateProfile,
  deleteProfile,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register',  register);
router.post('/login',     login);
router.get('/profile',    protect, getProfile);
router.put('/profile',    protect, updateProfile);
router.delete('/profile', protect, deleteProfile);

export default router;