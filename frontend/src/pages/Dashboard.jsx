import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, TrendingDown, ArrowLeftRight, Bot, CreditCard, Plus } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { month: 'Aug', balance: 12000 },
  { month: 'Sep', balance: 14500 },
  { month: 'Oct', balance: 13200 },
  { month: 'Nov', balance: 16800 },
  { month: 'Dec', balance: 15400 },
  { month: 'Jan', balance: 18900 },
];

const card = {
  backgroundColor: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '16px',
};

export default function Dashboard() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/accounts').then(r => setAccounts(r.data)).finally(() => setLoading(false));
  }, []);

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const activeAccounts = accounts.filter(a => a.isActive).length;

  const quickActions = [
    { label: 'Deposit',  icon: TrendingUp,    to: '/transactions', color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
    { label: 'Withdraw', icon: TrendingDown,   to: '/transactions', color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
    { label: 'Transfer', icon: ArrowLeftRight, to: '/transactions', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
    { label: 'AI Chat',  icon: Bot,            to: '/ai',           color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px' }}>

      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <p style={{ color: '#475569', fontSize: '0.875rem', fontFamily: 'sans-serif', marginBottom: '4px' }}>Good day,</p>
        <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 700, fontFamily: 'Georgia,serif' }}>
          {user?.name} 👋
        </h1>
      </div>

      {/* Balance Card */}
      <div style={{
        ...card,
        padding: '2rem',
        marginBottom: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(30,58,138,0.4) 0%, rgba(2,7,20,0.8) 100%)',
      }}>
        <div style={{ position:'absolute', top:-40, right:-40, width:180, height:180, borderRadius:'50%', background:'radial-gradient(circle, rgba(245,158,11,0.1), transparent)', pointerEvents:'none' }} />
        <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Total Portfolio Balance
        </p>
        <div style={{ color: '#fff', fontSize: '3rem', fontWeight: 800, fontFamily: 'Georgia,serif', lineHeight: 1, marginBottom: '0.75rem' }}>
          {loading ? '—' : `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontFamily: 'sans-serif', fontSize: '0.85rem' }}>
          <span style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={14} /> +2.4% this month
          </span>
          <span style={{ color: '#334155' }}>•</span>
          <span style={{ color: '#475569' }}>{activeAccounts} active account{activeAccounts !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {quickActions.map(({ label, icon: Icon, to, color, bg }) => (
          <Link key={label} to={to} style={{ textDecoration: 'none' }}>
            <div style={{
              ...card,
              padding: '1.25rem',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} color={color} />
              </div>
              <span style={{ fontFamily: 'sans-serif', fontWeight: 600, color: '#e2e8f0', fontSize: '0.875rem' }}>{label}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Chart + Accounts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

        {/* Chart */}
        <div style={{ ...card, padding: '1.5rem' }}>
          <h2 style={{ color: '#fff', fontFamily: 'Georgia,serif', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            Balance Overview
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11 }} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: '#0f1f4a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 13 }}
                formatter={v => [`$${v.toLocaleString()}`, 'Balance']}
              />
              <Area type="monotone" dataKey="balance" stroke="#f59e0b" strokeWidth={2} fill="url(#g)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Accounts */}
        <div style={{ ...card, padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ color: '#fff', fontFamily: 'Georgia,serif', fontSize: '1.1rem', fontWeight: 600 }}>My Accounts</h2>
            <Link to="/accounts" style={{ color: '#f59e0b', textDecoration: 'none', fontSize: '0.82rem', fontFamily: 'sans-serif' }}>View all →</Link>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[1,2,3].map(i => <div key={i} style={{ height: 56, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.04)' }} />)}
            </div>
          ) : accounts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#334155' }}>
              <CreditCard size={36} color="#334155" style={{ margin: '0 auto 0.75rem' }} />
              <p style={{ fontFamily: 'sans-serif', fontSize: '0.875rem', marginBottom: '1rem' }}>No accounts yet</p>
              <Link to="/accounts" style={{ color: '#f59e0b', textDecoration: 'none', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Plus size={14} /> Create account
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {accounts.slice(0, 4).map(acc => (
                <div key={acc._id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.875rem 1rem', borderRadius: 10,
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div>
                    <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.875rem', fontFamily: 'sans-serif', textTransform: 'capitalize' }}>{acc.accountType}</div>
                    <div style={{ color: '#334155', fontSize: '0.7rem', fontFamily: 'monospace', marginTop: 2 }}>{acc.accountNumber}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#f59e0b', fontWeight: 700, fontFamily: 'monospace', fontSize: '0.95rem' }}>
                      ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: acc.isActive ? '#34d399' : '#f87171', marginTop: 2 }}>
                      {acc.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}