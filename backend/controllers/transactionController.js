// ✅ CORRECT
import Transaction from '../models/Transaction.js';
import Account     from '../models/Account.js';

// POST /api/transactions/deposit
export const deposit = async (req, res) => {
  try {
    const { accountId, amount, description } = req.body;

    const account = await Account.findOne({ _id: accountId, userId: req.user._id });
    if (!account)
      return res.status(404).json({ message: 'Account not found' });

    account.balance += parseFloat(amount);
    await account.save();

    const transaction = await Transaction.create({
      toAccount:   accountId,
      amount:      parseFloat(amount),
      type:        'deposit',
      description,
    });

    res.status(201).json({ transaction, newBalance: account.balance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/transactions/withdraw
export const withdraw = async (req, res) => {
  try {
    const { accountId, amount, description } = req.body;

    const account = await Account.findOne({ _id: accountId, userId: req.user._id });
    if (!account)
      return res.status(404).json({ message: 'Account not found' });
    if (account.balance < parseFloat(amount))
      return res.status(400).json({ message: 'Insufficient funds' });

    account.balance -= parseFloat(amount);
    await account.save();

    const transaction = await Transaction.create({
      fromAccount: accountId,
      amount:      parseFloat(amount),
      type:        'withdrawal',
      description,
    });

    res.status(201).json({ transaction, newBalance: account.balance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/transactions/transfer
export const transfer = async (req, res) => {
  try {
    const { fromAccountId, toAccountNumber, amount, description } = req.body;

    const fromAcc = await Account.findOne({ _id: fromAccountId, userId: req.user._id });
    const toAcc   = await Account.findOne({ accountNumber: toAccountNumber });

    if (!fromAcc)
      return res.status(404).json({ message: 'Source account not found' });
    if (!toAcc)
      return res.status(404).json({ message: 'Destination account not found' });
    if (fromAcc.balance < parseFloat(amount))
      return res.status(400).json({ message: 'Insufficient funds' });

    fromAcc.balance -= parseFloat(amount);
    toAcc.balance   += parseFloat(amount);
    await fromAcc.save();
    await toAcc.save();

    const transaction = await Transaction.create({
      fromAccount: fromAccountId,
      toAccount:   toAcc._id,
      amount:      parseFloat(amount),
      type:        'transfer',
      description,
    });

    res.status(201).json({ transaction, newBalance: fromAcc.balance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/transactions/account/:accountId
export const getTransactionsByAccount = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [
        { fromAccount: req.params.accountId },
        { toAccount:   req.params.accountId },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};