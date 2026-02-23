import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, CreditCard, ArrowLeftRight, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/admin/stats').then(r => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label:'Total Users',        value: stats.totalUsers,        icon: Users,          color:'#60a5fa' },
    { label:'Total Accounts',     value: stats.totalAccounts,     icon: CreditCard,     color:'#34d399' },
    { label:'Total Transactions', value: stats.totalTransactions, icon: ArrowLeftRight, color:'#f59e0b' },
    { label:'Total Balance',      value: `$${stats.totalBalance.toLocaleString('en-US',{minimumFractionDigits:2})}`, icon: DollarSign, color:'#c084fc' },
  ] : [];

  return (
    <div style={{ padding:'28px 32px' }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ color:'#fff', fontSize:'1.9rem', fontWeight:700, fontFamily:'Georgia,serif', margin:0 }}>Admin Overview</h1>
        <p style={{ color:'#475569', fontFamily:'sans-serif', marginTop:6, fontSize:'0.875rem' }}>System-wide statistics and health</p>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20, marginBottom:24 }}>
          {[1,2,3,4].map(i=><div key={i} style={{ height:120, borderRadius:16, backgroundColor:'rgba(255,255,255,0.04)', border:'1px solid #1a1f3a' }}/>)}
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20, marginBottom:24 }}>
          {cards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} style={{ backgroundColor:'rgba(255,255,255,0.04)', border:'1px solid #1a1f3a', borderRadius:16, padding:24, position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, right:0, width:70, height:70, borderRadius:'0 16px 0 100%', backgroundColor:`${color}10` }}/>
              <div style={{ width:42, height:42, borderRadius:12, backgroundColor:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
                <Icon size={20} color={color}/>
              </div>
              <div style={{ color:'#fff', fontSize:'1.75rem', fontWeight:700, fontFamily:'Georgia,serif', lineHeight:1 }}>{value}</div>
              <div style={{ color:'#475569', fontSize:'0.8rem', fontFamily:'sans-serif', marginTop:6 }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Links */}
      <div style={{ backgroundColor:'rgba(255,255,255,0.04)', border:'1px solid #1a1f3a', borderRadius:16, padding:24 }}>
        <h2 style={{ color:'#fff', fontFamily:'Georgia,serif', fontSize:'1.1rem', fontWeight:600, margin:'0 0 16px' }}>Quick Actions</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
          {[
            { label:'Manage Users',      desc:'View, edit roles, delete users',   path:'/admin/users'        },
            { label:'View All Accounts', desc:'Browse all customer accounts',      path:'/admin/accounts'     },
            { label:'All Transactions',  desc:'Monitor system-wide transactions',  path:'/admin/transactions' },
          ].map(({ label, desc, path }) => (
            <a key={label} href={path} style={{
              display:'block', padding:16, borderRadius:12,
              backgroundColor:'rgba(255,255,255,0.04)', border:'1px solid #1a1f3a',
              textDecoration:'none', transition:'all 0.2s',
            }}
            onMouseEnter={e=>{ e.currentTarget.style.backgroundColor='rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor='rgba(245,158,11,0.3)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.backgroundColor='rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor='#1a1f3a'; }}
            >
              <div style={{ color:'#e2e8f0', fontFamily:'sans-serif', fontWeight:600, fontSize:'0.875rem' }}>{label}</div>
              <div style={{ color:'#475569', fontFamily:'sans-serif', fontSize:'0.78rem', marginTop:4 }}>{desc}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}