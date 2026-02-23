import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, CreditCard, ArrowLeftRight, LogOut, ShieldCheck, ArrowLeft } from 'lucide-react';

const NAV = [
  { to: '/admin',                   icon: LayoutDashboard, label: 'Overview',     end: true },
  { to: '/admin/users',             icon: Users,           label: 'Users'               },
  { to: '/admin/accounts',          icon: CreditCard,      label: 'Accounts'            },
  { to: '/admin/transactions',      icon: ArrowLeftRight,  label: 'Transactions'        },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ display:'flex', height:'100vh', width:'100vw', overflow:'hidden', backgroundColor:'#020714' }}>

      {/* ── ADMIN SIDEBAR ── */}
      <div style={{
        width: 220, minWidth: 220,
        height: '100vh',
        backgroundColor: '#0d0710',
        borderRight: '1px solid #2a1a2e',
        display: 'flex', flexDirection: 'column', flexShrink: 0,
      }}>

        {/* Logo */}
        <div style={{ padding:'20px 16px', borderBottom:'1px solid #2a1a2e' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, backgroundColor:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <ShieldCheck size={18} color="#f87171"/>
            </div>
            <div>
              <div style={{ color:'#fff', fontWeight:700, fontSize:'0.95rem', fontFamily:'Georgia,serif' }}>Admin Panel</div>
              <div style={{ color:'#475569', fontSize:'0.65rem', fontFamily:'sans-serif' }}>PaisaBank Control</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'12px 10px', display:'flex', flexDirection:'column', gap:2 }}>
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end} style={{ textDecoration:'none' }}>
              {({ isActive }) => (
                <div style={{
                  display:'flex', alignItems:'center', gap:10,
                  padding:'10px 12px', borderRadius:9,
                  color: isActive ? '#fca5a5' : '#64748b',
                  backgroundColor: isActive ? 'rgba(239,68,68,0.1)' : 'transparent',
                  border: isActive ? '1px solid rgba(239,68,68,0.2)' : '1px solid transparent',
                  fontFamily:'sans-serif', fontSize:'0.85rem', fontWeight: isActive ? 600 : 500,
                  cursor:'pointer', transition:'all 0.15s',
                }}
                onMouseEnter={e=>{ if(!isActive){e.currentTarget.style.backgroundColor='rgba(255,255,255,0.05)'; e.currentTarget.style.color='#cbd5e1';}}}
                onMouseLeave={e=>{ if(!isActive){e.currentTarget.style.backgroundColor='transparent'; e.currentTarget.style.color='#64748b';}}}
                >
                  <Icon size={16}/>{label}
                </div>
              )}
            </NavLink>
          ))}

          {/* Back to app */}
          <button onClick={()=>navigate('/')} style={{
            display:'flex', alignItems:'center', gap:10,
            padding:'10px 12px', borderRadius:9, marginTop:8,
            color:'#64748b', backgroundColor:'transparent',
            border:'1px solid #1a1f3a',
            fontFamily:'sans-serif', fontSize:'0.85rem', fontWeight:500,
            cursor:'pointer', transition:'all 0.15s', width:'100%',
          }}
          onMouseEnter={e=>{ e.currentTarget.style.color='#e2e8f0'; e.currentTarget.style.backgroundColor='rgba(255,255,255,0.05)'; }}
          onMouseLeave={e=>{ e.currentTarget.style.color='#64748b'; e.currentTarget.style.backgroundColor='transparent'; }}
          >
            <ArrowLeft size={16}/>Back to App
          </button>
        </nav>

        {/* User */}
        <div style={{ padding:'10px', borderTop:'1px solid #2a1a2e' }}>
          <div style={{ padding:'8px 10px', marginBottom:4 }}>
            <div style={{ color:'#e2e8f0', fontSize:'0.82rem', fontWeight:600, fontFamily:'sans-serif' }}>{user?.name}</div>
            <div style={{ color:'#475569', fontSize:'0.68rem', fontFamily:'sans-serif', marginTop:2 }}>Administrator</div>
          </div>
          <button onClick={()=>{ logout(); navigate('/login'); }} style={{
            width:'100%', display:'flex', alignItems:'center', gap:8,
            padding:'8px 12px', borderRadius:9, border:'none', cursor:'pointer',
            backgroundColor:'transparent', color:'#475569',
            fontFamily:'sans-serif', fontSize:'0.8rem', fontWeight:500,
          }}
          onMouseEnter={e=>{ e.currentTarget.style.color='#f87171'; e.currentTarget.style.backgroundColor='rgba(248,113,113,0.08)'; }}
          onMouseLeave={e=>{ e.currentTarget.style.color='#475569'; e.currentTarget.style.backgroundColor='transparent'; }}
          >
            <LogOut size={14}/>Sign Out
          </button>
        </div>
      </div>

      {/* ── ADMIN MAIN ── */}
      <div style={{ flex:1, height:'100vh', overflowY:'auto', backgroundColor:'#020714' }}>
        <Outlet />
      </div>
    </div>
  );
}