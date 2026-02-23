import { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, TrendingDown, ArrowLeftRight } from 'lucide-react';

const TYPE = {
  deposit:    { icon: TrendingUp,    color:'#34d399', label:'Deposit'    },
  withdrawal: { icon: TrendingDown,  color:'#f87171', label:'Withdrawal' },
  transfer:   { icon: ArrowLeftRight,color:'#60a5fa', label:'Transfer'   },
};

export default function AdminTransactions() {
  const [txs,     setTxs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('all');

  useEffect(() => {
    axios.get('/admin/transactions').then(r => setTxs(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? txs : txs.filter(t => t.type === filter);

  return (
    <div style={{ padding:'28px 32px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
        <div>
          <h1 style={{ color:'#fff', fontSize:'1.9rem', fontWeight:700, fontFamily:'Georgia,serif', margin:0 }}>All Transactions</h1>
          <p style={{ color:'#475569', fontFamily:'sans-serif', marginTop:6, fontSize:'0.875rem' }}>Last 100 system transactions</p>
        </div>
        <div style={{ display:'flex', gap:4, backgroundColor:'rgba(255,255,255,0.05)', borderRadius:10, padding:4 }}>
          {['all','deposit','withdrawal','transfer'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{
              padding:'7px 14px', borderRadius:7, border:'none',
              fontFamily:'sans-serif', fontSize:'0.78rem', fontWeight:600,
              cursor:'pointer', transition:'all 0.15s', textTransform:'capitalize',
              backgroundColor: filter===f ? '#f59e0b' : 'transparent',
              color:           filter===f ? '#0f1f4a' : '#64748b',
            }}>{f}</button>
          ))}
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
                {['Type','Amount','From','To','Description','Status','Date'].map(h=>(
                  <th key={h} style={{ textAlign:'left', padding:'12px 16px', color:'#475569', fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', borderBottom:'1px solid #1a1f3a', fontFamily:'sans-serif', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(tx=>{
                const cfg=TYPE[tx.type]; const Icon=cfg.icon;
                return (
                  <tr key={tx._id}
                    onMouseEnter={e=>Array.from(e.currentTarget.cells).forEach(c=>c.style.backgroundColor='rgba(255,255,255,0.03)')}
                    onMouseLeave={e=>Array.from(e.currentTarget.cells).forEach(c=>c.style.backgroundColor='transparent')}
                  >
                    <td style={{ padding:'13px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ width:28,height:28,borderRadius:8,backgroundColor:`${cfg.color}15`,display:'flex',alignItems:'center',justifyContent:'center' }}>
                          <Icon size={13} color={cfg.color}/>
                        </div>
                        <span style={{ color:cfg.color, fontFamily:'sans-serif', fontWeight:600, fontSize:'0.8rem' }}>{cfg.label}</span>
                      </div>
                    </td>
                    <td style={{ padding:'13px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)', color:cfg.color, fontFamily:'monospace', fontWeight:700 }}>
                      ${tx.amount.toFixed(2)}
                    </td>
                    <td style={{ padding:'13px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)', color:'#64748b', fontFamily:'monospace', fontSize:'0.72rem' }}>
                      {tx.fromAccount?.accountNumber||'—'}
                    </td>
                    <td style={{ padding:'13px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)', color:'#64748b', fontFamily:'monospace', fontSize:'0.72rem' }}>
                      {tx.toAccount?.accountNumber||'—'}
                    </td>
                    <td style={{ padding:'13px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)', color:'#475569', fontFamily:'sans-serif', fontSize:'0.8rem', maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {tx.description||'—'}
                    </td>
                    <td style={{ padding:'13px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{
                        display:'inline-block', padding:'3px 10px', borderRadius:20,
                        fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.05em', textTransform:'uppercase',
                        backgroundColor: tx.status==='completed' ? 'rgba(52,211,153,0.12)' : tx.status==='failed' ? 'rgba(248,113,113,0.12)' : 'rgba(245,158,11,0.12)',
                        color:           tx.status==='completed' ? '#34d399'              : tx.status==='failed' ? '#f87171'              : '#f59e0b',
                        border:          tx.status==='completed' ? '1px solid rgba(52,211,153,0.25)' : tx.status==='failed' ? '1px solid rgba(248,113,113,0.25)' : '1px solid rgba(245,158,11,0.25)',
                      }}>{tx.status}</span>
                    </td>
                    <td style={{ padding:'13px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)', color:'#475569', fontFamily:'sans-serif', fontSize:'0.78rem', whiteSpace:'nowrap' }}>
                      {new Date(tx.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                    </td>
                  </tr>
                );
              })}
              {filtered.length===0 && (
                <tr><td colSpan={7} style={{ textAlign:'center', padding:'3rem', color:'#334155', fontFamily:'sans-serif' }}>No transactions found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );
}