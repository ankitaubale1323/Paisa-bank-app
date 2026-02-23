// ✅ CORRECT
import Account from '../models/Account.js';

// POST /api/accounts
export const createAccount = async (req, res) => {
  try {
    const { accountType, initialDeposit } = req.body;

    const account = await Account.create({
      userId:      req.user._id,
      accountType,
      balance:     parseFloat(initialDeposit) || 0,
    });

    res.status(201).json(account);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/accounts
export const getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/accounts/:id
export const getAccountById = async (req, res) => {
  try {
    const account = await Account.findOne({
      _id:    req.params.id,
      userId: req.user._id,
    });

    if (!account)
      return res.status(404).json({ message: 'Account not found' });

    res.json(account);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/accounts/:id
export const updateAccount = async (req, res) => {
  try {
    const { accountType, isActive } = req.body;

    const account = await Account.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { accountType, isActive },
      { new: true }
    );

    if (!account)
      return res.status(404).json({ message: 'Account not found' });

    res.json(account);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/accounts/:id
export const deleteAccount = async (req, res) => {
  try {
    const account = await Account.findOneAndDelete({
      _id:    req.params.id,
      userId: req.user._id,
    });

    if (!account)
      return res.status(404).json({ message: 'Account not found' });

    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};