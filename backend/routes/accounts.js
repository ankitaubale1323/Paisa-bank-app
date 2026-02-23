import express from 'express';
// ✅ CORRECT
import { protect } from '../middleware/auth.js';
import {
  createAccount,
  getAllAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
} from '../controllers/accountController.js';

const router = express.Router();

router.post  ('/',    protect, createAccount);
router.get   ('/',    protect, getAllAccounts);
router.get   ('/:id', protect, getAccountById);
router.put   ('/:id', protect, updateAccount);
router.delete('/:id', protect, deleteAccount);

export default router;