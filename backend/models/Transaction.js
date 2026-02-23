import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    fromAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    toAccount:   { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    amount:      { type: Number, required: true, min: 0.01 },
    type:        { type: String, enum: ['deposit', 'withdrawal', 'transfer'], required: true },
    description: { type: String, default: '' },
    status:      { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  },
  { timestamps: true }
);

export default mongoose.model('Transaction', transactionSchema);