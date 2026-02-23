import React, { useState, useEffect } from 'react';
import { accountAPI, transactionAPI } from '../services/api';
import { ArrowLeftRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

export default function Transfer() {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({ fromAccountId: '', toAccountNumber: '', amount: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    accountAPI.getAll().then(res => setAccounts(res.data.accounts.filter(a => a.isActive)));
  }, []);

  const selectedAccount = accounts.find(a => a._id === form.fromAccountId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fromAccountId) return toast.error('Select source account');
    if (!form.toAccountNumber) return toast.error('Enter destination account number');
    if (!form.amount || form.amount <= 0) return toast.error('Enter valid amount');
    if (selectedAccount && form.amount > selectedAccount.balance) return toast.error('Insufficient balance');

    setLoading(true);
    try {
      const res = await transactionAPI.transfer(form);
      setSuccess(res.data);
      toast.success('Transfer successful!');
      setForm({ fromAccountId: '', toAccountNumber: '', amount: '', description: '' });
      // Refresh accounts
      accountAPI.getAll().then(r => setAccounts(r.data.accounts.filter(a => a.isActive)));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Transfer Funds</h1>
        <p className="text-gray-400 mt-1">Send money between accounts instantly</p>
      </div>

      {success && (
        <div className="card border-emerald-500/30 bg-emerald-500/5">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={28} className="text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-emerald-400 font-semibold">Transfer Successful!</p>
              <p className="text-gray-400 text-sm mt-0.5">
                {formatCurrency(success.transaction.amount)} transferred · Ref: {success.transaction.reference}
              </p>
              <p className="text-gray-400 text-sm">New balance: {formatCurrency(success.newBalance)}</p>
            </div>
          </div>
          <button onClick={() => setSuccess(null)} className="mt-4 text-sm text-emerald-400 hover:text-emerald-300">Make another transfer →</button>
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* From account */}
          <div>
            <label className="label">From Account</label>
            <select className="input-field" value={form.fromAccountId}
              onChange={e => setForm({ ...form, fromAccountId: e.target.value })} required>
              <option value="">Select account</option>
              {accounts.map(acc => (
                <option key={acc._id} value={acc._id}>
                  {acc.accountNumber} ({acc.accountType}) — {formatCurrency(acc.balance)}
                </option>
              ))}
            </select>
          </div>

          {selectedAccount && (
            <div className="p-3 bg-gray-800 rounded-xl text-sm text-gray-400">
              Available balance: <span className="text-white font-semibold">{formatCurrency(selectedAccount.balance)}</span>
            </div>
          )}

          {/* To account */}
          <div>
            <label className="label">To Account Number</label>
            <input type="text" className="input-field font-mono" placeholder="ACC00000001" value={form.toAccountNumber}
              onChange={e => setForm({ ...form, toAccountNumber: e.target.value })} required />
          </div>

          {/* Amount */}
          <div>
            <label className="label">Amount (USD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
              <input type="number" min="0.01" step="0.01" className="input-field pl-8" placeholder="0.00"
                value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="label">Description (optional)</label>
            <input type="text" className="input-field" placeholder="Payment for..." value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>

          {/* Summary */}
          {form.fromAccountId && form.amount > 0 && (
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <p className="text-blue-400 text-sm font-medium mb-2">Transfer Summary</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Amount</span>
                <span className="text-white font-semibold">{formatCurrency(form.amount)}</span>
              </div>
              {selectedAccount && (
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-400">Balance after</span>
                  <span className="text-white">{formatCurrency(selectedAccount.balance - form.amount)}</span>
                </div>
              )}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            <ArrowLeftRight size={16} />
            {loading ? 'Processing...' : 'Transfer Now'}
          </button>
        </form>
      </div>
    </div>
  );
}
