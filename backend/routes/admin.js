import express from 'express';
// ✅ CORRECT
import { adminOnly } from '../middleware/adminAuth.js';
import {
  getStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllAccounts,
  getAllTransactions,
} from '../controllers/adminController.js';

const router = express.Router();

router.get   ('/stats',            adminOnly, getStats);
router.get   ('/users',            adminOnly, getAllUsers);
router.put   ('/users/:id/role',   adminOnly, updateUserRole);
router.delete('/users/:id',        adminOnly, deleteUser);
router.get   ('/accounts',         adminOnly, getAllAccounts);
router.get   ('/transactions',     adminOnly, getAllTransactions);

export default router;