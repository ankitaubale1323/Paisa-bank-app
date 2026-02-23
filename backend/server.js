import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes        from './routes/auth.js';
import accountRoutes     from './routes/accounts.js';
import transactionRoutes from './routes/transactions.js';
import aiRoutes          from './routes/ai.js';
import adminRoutes       from './routes/admin.js';

dotenv.config();

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bankapp')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Error:', err));

app.use('/api/auth',         authRoutes);
app.use('/api/accounts',     accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/ai',           aiRoutes);
app.use('/api/admin',        adminRoutes);

app.get('/api/health', (req, res) =>
  res.json({ status: 'OK', message: 'PaisaBank API running 🚀' })
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);