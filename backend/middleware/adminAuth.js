// ✅ CORRECT
import { protect } from './auth.js';

export const adminOnly = [
  protect,
  (req, res, next) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access only' });
    }
    next();
  },
];
