import express from 'express';
// ✅ CORRECT
import { protect } from '../middleware/auth.js';
import {
  deposit,
  withdraw,
  transfer,
  getTransactionsByAccount,
} from '../controllers/transactionController.js';

const router = express.Router();

router.post('/deposit',          protect, deposit);
router.post('/withdraw',         protect, withdraw);
router.post('/transfer',         protect, transfer);
router.get ('/account/:accountId', protect, getTransactionsByAccount);

export default router;