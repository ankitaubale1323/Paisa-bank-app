import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, CreditCard, ArrowLeftRight,
  Bot, User, LogOut, Landmark, ShieldCheck,
} from 'lucide-react';

const navItems = [
  { to: '/',             icon: LayoutDashboard, label: 'Dashboard',  end: true },
  { to: '/accounts',     icon: CreditCard,      label: 'Accounts'           },
  { to: '/transactions', icon: ArrowLeftRight,  label: 'Transactions'       },
  { to: '/ai',           icon: Bot,             label: 'AI Assistant'       },
  { to: '/profile',      icon: User,            label: 'Profile'            },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{ display:'flex', minHeight:'100vh', width:'100vw', backgroundColor:'#020714' }}>

      {/* SIDEBAR - fixed */}
      <aside style={{
        width: '240px', minWidth: '240px',
        height: '100vh', position: 'fixed', top: 0, left: 0,
        display: 'flex', flexDirection: 'column',
        backgroundColor: '#080d28',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        zIndex: 100,
      }}>

        {/* Logo */}
        <div style={{ padding:'1.5rem 1.25rem', borderBottom:'1px solid rgba(255,255,255,0.07)', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
            <div style={{
              width:40, height:40, borderRadius:12, flexShrink:0,
              background:'linear-gradient(135deg,#f59e0b,#fbbf24)',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <Landmark size={20} color="#0f1f4a" />
            </div>
            <div>
              <div style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:'1.1rem', color:'#fff' }}>PaisaBank</div>
              <div style={{ fontSize:'0.68rem', color:'#475569', fontFamily:'sans-serif' }}>Smart Banking</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'0.75rem', display:'flex', flexDirection:'column', gap:'2px', overflowY:'auto' }}>
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end} style={{ textDecoration:'none' }}>
              {({ isActive }) => (
                <div style={{
                  display:'flex', alignItems:'center', gap:'0.65rem',
                  padding:'0.7rem 0.9rem', borderRadius:'10px',
                  fontFamily:'sans-serif', fontSize:'0.875rem', fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#fbbf24' : '#64748b',
                  backgroundColor: isActive ? 'rgba(245,158,11,0.1)' : 'transparent',
                  border: isActive ? '1px solid rgba(245,158,11,0.25)' : '1px solid transparent',
                  cursor:'pointer', transition:'all 0.15s',
                }}
                onMouseEnter={e => { if(!isActive){ e.currentTarget.style.backgroundColor='rgba(255,255,255,0.05)'; e.currentTarget.style.color='#e2e8f0'; }}}
                onMouseLeave={e => { if(!isActive){ e.currentTarget.style.backgroundColor='transparent'; e.currentTarget.style.color='#64748b'; }}}
                >
                  <Icon size={17} />{label}
                </div>
              )}
            </NavLink>
          ))}

          {user?.role === 'admin' && (
            <NavLink to="/admin" style={{ textDecoration:'none', marginTop:'8px' }}>
              {({ isActive }) => (
                <div style={{
                  display:'flex', alignItems:'center', gap:'0.65rem',
                  padding:'0.7rem 0.9rem', borderRadius:'10px',
                  fontFamily:'sans-serif', fontSize:'0.875rem', fontWeight:600,
                  color:'#f59e0b', backgroundColor:'rgba(245,158,11,0.07)',
                  border:'1px solid rgba(245,158,11,0.2)', cursor:'pointer',
                }}>
                  <ShieldCheck size={17} />Admin Panel
                </div>
              )}
            </NavLink>
          )}
        </nav>

        {/* User footer */}
        <div style={{ padding:'0.75rem', borderTop:'1px solid rgba(255,255,255,0.07)', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.65rem', padding:'0.5rem 0.75rem', marginBottom:'4px' }}>
            <div style={{
              width:34, height:34, borderRadius:10, flexShrink:0,
              background:'linear-gradient(135deg,#f59e0b,#fbbf24)',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <span style={{ fontFamily:'Georgia,serif', fontWeight:700, color:'#0f1f4a', fontSize:'0.9rem' }}>
                {user?.name?.[0]?.toUpperCase()}
              </span>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:'sans-serif', fontWeight:600, color:'#e2e8f0', fontSize:'0.82rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {user?.name}
              </div>
              <div style={{ fontFamily:'sans-serif', color:'#475569', fontSize:'0.7rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {user?.email}
              </div>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            width:'100%', display:'flex', alignItems:'center', gap:'0.5rem',
            padding:'0.55rem 0.9rem', borderRadius:'10px',
            fontFamily:'sans-serif', fontSize:'0.8rem', fontWeight:500,
            color:'#64748b', backgroundColor:'transparent', border:'none', cursor:'pointer',
          }}
          onMouseEnter={e=>{ e.currentTarget.style.color='#f87171'; e.currentTarget.style.backgroundColor='rgba(248,113,113,0.1)'; }}
          onMouseLeave={e=>{ e.currentTarget.style.color='#64748b'; e.currentTarget.style.backgroundColor='transparent'; }}
          >
            <LogOut size={15} />Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN — offset by sidebar */}
      <main style={{ marginLeft:'240px', flex:1, minHeight:'100vh', overflowY:'auto', backgroundColor:'#020714' }}>
        <Outlet />
      </main>
    </div>
  );
}