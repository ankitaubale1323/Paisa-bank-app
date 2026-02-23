import { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle } from 'lucide-react';

const typeColor = { savings:'#34d399', checking:'#60a5fa', business:'#f59e0b' };

export default function AdminAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    axios.get('/admin/accounts').then(r => setAccounts(r.data)).finally(() => setLoading(false));
  }, []);

  const total = accounts.reduce((s, a) => s + a.balance, 0);

  return (
    <div style={{ padding:'28px 32px' }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ color:'#fff', fontSize:'1.9rem', fontWeight:700, fontFamily:'Georgia,serif', margin:0 }}>All Accounts</h1>
        <p style={{ color:'#475569', fontFamily:'sans-serif', marginTop:6, fontSize:'0.875rem' }}>
          {accounts.length} accounts — Total: <span style={{ color:'#f59e0b', fontWeight:600 }}>${total.toLocaleString('en-US',{minimumFractionDigits:2})}</span>
        </p>
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
                {['Account Number','Owner','Type','Balance','Status','Created'].map(h=>(
                  <th key={h} style={{ textAlign:'left', padding:'12px 16px', color:'#475569', fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', borderBottom:'1px solid #1a1f3a', fontFamily:'sans-serif', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {accounts.map(a=>(
                <tr key={a._id}
                  onMouseEnter={e=>Array.from(e.currentTarget.cells).forEach(c=>c.style.backgroundColor='rgba(255,255,255,0.03)')}
                  onMouseLeave={e=>Array.from(e.currentTarget.cells).forEach(c=>c.style.backgroundColor='transparent')}
                >
                  <td style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)', color:'#64748b', fontFamily:'monospace', fontSize:'0.78rem' }}>{a.accountNumber}</td>
                  <td style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ color:'#e2e8f0', fontWeight:600, fontFamily:'sans-serif', fontSize:'0.875rem' }}>{a.userId?.name||'Unknown'}</div>
                    <div style={{ color:'#334155', fontFamily:'sans-serif', fontSize:'0.72rem', marginTop:2 }}>{a.userId?.email}</div>
                  </td>
                  <td style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{
                      display:'inline-block', padding:'3px 10px', borderRadius:20,
                      fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.05em', textTransform:'uppercase',
                      backgroundColor:`${typeColor[a.accountType]}15`,
                      color: typeColor[a.accountType],
                      border:`1px solid ${typeColor[a.accountType]}30`,
                    }}>{a.accountType}</span>
                  </td>
                  <td style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)', color:'#f59e0b', fontFamily:'monospace', fontWeight:700 }}>
                    ${a.balance.toLocaleString('en-US',{minimumFractionDigits:2})}
                  </td>
                  <td style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                      {a.isActive
                        ? <><CheckCircle size={13} color="#34d399"/><span style={{ color:'#34d399', fontSize:'0.78rem', fontFamily:'sans-serif' }}>Active</span></>
                        : <><XCircle    size={13} color="#f87171"/><span style={{ color:'#f87171', fontSize:'0.78rem', fontFamily:'sans-serif' }}>Inactive</span></>
                      }
                    </div>
                  </td>
                  <td style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)', color:'#475569', fontFamily:'sans-serif', fontSize:'0.8rem' }}>
                    {new Date(a.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                  </td>
                </tr>
              ))}
              {accounts.length===0 && (
                <tr><td colSpan={6} style={{ textAlign:'center', padding:'3rem', color:'#334155', fontFamily:'sans-serif' }}>No accounts found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );
}