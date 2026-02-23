// ✅ CORRECT
import User        from '../models/User.js';
import Account     from '../models/Account.js';
import Transaction from '../models/Transaction.js';

// GET /api/admin/stats
export const getStats = async (req, res) => {
  try {
    const [totalUsers, totalAccounts, totalTransactions, accounts] = await Promise.all([
      User.countDocuments(),
      Account.countDocuments(),
      Transaction.countDocuments(),
      Account.find(),
    ]);

    const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

    res.json({ totalUsers, totalAccounts, totalTransactions, totalBalance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/admin/users/:id/role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Account.deleteMany({ userId: req.params.id });
    res.json({ message: 'User and their accounts deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/accounts
export const getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/transactions
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('fromAccount', 'accountNumber accountType')
      .populate('toAccount',   'accountNumber accountType')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};