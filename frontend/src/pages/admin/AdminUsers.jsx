import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, ShieldCheck, ShieldOff, Search } from 'lucide-react';

export default function AdminUsers() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');

  const load = () => {
    setLoading(true);
    axios.get('/admin/users').then(r => setUsers(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const toggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (!confirm(`Change ${user.name}'s role to ${newRole}?`)) return;
    try { await axios.put(`/admin/users/${user._id}/role`, { role: newRole }); load(); }
    catch { alert('Failed to update role'); }
  };

  const deleteUser = async (user) => {
    if (!confirm(`Delete ${user.name}? This will also delete all their accounts.`)) return;
    try { await axios.delete(`/admin/users/${user._id}`); load(); }
    catch { alert('Failed to delete user'); }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding:'28px 32px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
        <div>
          <h1 style={{ color:'#fff', fontSize:'1.9rem', fontWeight:700, fontFamily:'Georgia,serif', margin:0 }}>Users</h1>
          <p style={{ color:'#475569', fontFamily:'sans-serif', marginTop:6, fontSize:'0.875rem' }}>{users.length} registered users</p>
        </div>
        <div style={{ position:'relative' }}>
          <Search size={14} color="#475569" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
          <input
            placeholder="Search users…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ backgroundColor:'rgba(255,255,255,0.05)', border:'1px solid #1a1f3a', borderRadius:10, padding:'9px 14px 9px 34px', color:'#fff', fontFamily:'sans-serif', fontSize:'0.85rem', outline:'none', width:220 }}
            onFocus={e=>e.target.style.borderColor='rgba(245,158,11,0.4)'}
            onBlur={e=>e.target.style.borderColor='#1a1f3a'}
          />
        </div>
      </div>

      <div style={{ backgroundColor:'rgba(255,255,255,0.04)', border:'1px solid #1a1f3a', borderRadius:16, overflow:'hidden' }}>
        {loading ? (
          <div style={{ padding:'3rem', textAlign:'center' }}>
            <div style={{ width:36,height:36,border:'3px solid rgba(245,158,11,0.2)',borderTopColor:'#f59e0b',borderRadius:'50%',animation:'spin 0.7s linear infinite',margin:'0 auto' }}/>
          </div>
        ) : (
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                {['Name','Email','Phone','Role','Joined','Actions'].map(h=>(
                  <th key={h} style={{ textAlign:'left', padding:'12px 16px', color:'#475569', fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', borderBottom:'1px solid #1a1f3a', fontFamily:'sans-serif', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u=>(
                <tr key={u._id}
                  onMouseEnter={e=>{ Array.from(e.currentTarget.cells).forEach(c=>c.style.backgroundColor='rgba(255,255,255,0.03)'); }}
                  onMouseLeave={e=>{ Array.from(e.currentTarget.cells).forEach(c=>c.style.backgroundColor='transparent'); }}
                >
                  <td style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:30,height:30,borderRadius:8,background:'linear-gradient(135deg,#f59e0b,#fbbf24)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                        <span style={{ color:'#0f1f4a', fontWeight:700, fontSize:'0.8rem', fontFamily:'Georgia,serif' }}>{u.name[0].toUpperCase()}</span>
                      </div>
                      <span style={{ color:'#e2e8f0', fontWeight:600, fontFamily:'sans-serif', fontSize:'0.875rem' }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)', color:'#64748b', fontFamily:'monospace', fontSize:'0.78rem' }}>{u.email}</td>
                  <td style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)', color: u.phone ? '#94a3b8':'#334155', fontFamily:'sans-serif', fontSize:'0.85rem' }}>{u.phone||'—'}</td>
                  <td style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{
                      display:'inline-block', padding:'3px 10px', borderRadius:20,
                      fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.05em', textTransform:'uppercase',
                      backgroundColor: u.role==='admin' ? 'rgba(248,113,113,0.12)':'rgba(96,165,250,0.12)',
                      color:           u.role==='admin' ? '#f87171':'#60a5fa',
                      border:          u.role==='admin' ? '1px solid rgba(248,113,113,0.25)':'1px solid rgba(96,165,250,0.25)',
                    }}>{u.role}</span>
                  </td>
                  <td style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)', color:'#475569', fontFamily:'sans-serif', fontSize:'0.8rem' }}>
                    {new Date(u.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                  </td>
                  <td style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display:'flex', gap:6 }}>
                      <button onClick={()=>toggleRole(u)} title={u.role==='admin'?'Remove Admin':'Make Admin'} style={{ width:30,height:30,borderRadius:8,backgroundColor:'rgba(255,255,255,0.06)',border:'1px solid #1a1f3a',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}
                        onMouseEnter={e=>e.currentTarget.style.backgroundColor='rgba(245,158,11,0.15)'}
                        onMouseLeave={e=>e.currentTarget.style.backgroundColor='rgba(255,255,255,0.06)'}
                      >
                        {u.role==='admin' ? <ShieldOff size={13} color="#f59e0b"/> : <ShieldCheck size={13} color="#94a3b8"/>}
                      </button>
                      <button onClick={()=>deleteUser(u)} title="Delete user" style={{ width:30,height:30,borderRadius:8,backgroundColor:'rgba(248,113,113,0.1)',border:'1px solid rgba(248,113,113,0.2)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}
                        onMouseEnter={e=>e.currentTarget.style.backgroundColor='rgba(248,113,113,0.2)'}
                        onMouseLeave={e=>e.currentTarget.style.backgroundColor='rgba(248,113,113,0.1)'}
                      >
                        <Trash2 size={13} color="#f87171"/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign:'center', padding:'3rem', color:'#334155', fontFamily:'sans-serif' }}>No users found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );
}