import { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, TrendingDown, ArrowLeftRight } from 'lucide-react';

const TABS = ['deposit', 'withdrawal', 'transfer'];

const TYPE = {
  deposit:    { icon: TrendingUp,    color: '#34d399', bg: 'rgba(52,211,153,0.12)',  sign: '+' },
  withdrawal: { icon: TrendingDown,  color: '#f87171', bg: 'rgba(248,113,113,0.12)', sign: '-' },
  transfer:   { icon: ArrowLeftRight,color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  sign: '~' },
};

const S = {
  card: { backgroundColor:'rgba(255,255,255,0.04)', border:'1px solid #1a1f3a', borderRadius:16 },
  inp:  { width:'100%', backgroundColor:'rgba(255,255,255,0.06)', border:'1px solid #1e2a4a', borderRadius:10, padding:'10px 14px', color:'#fff', fontFamily:'sans-serif', fontSize:'0.875rem', outline:'none', boxSizing:'border-box', display:'block' },
  label:{ display:'block', color:'#64748b', fontSize:'0.78rem', marginBottom:6, fontFamily:'sans-serif' },
};

export default function Transactions() {
  const [accounts,  setAccounts]  = useState([]);
  const [txs,       setTxs]       = useState([]);
  const [selAcc,    setSelAcc]    = useState('');
  const [tab,       setTab]       = useState('deposit');
  const [form,      setForm]      = useState({ amount:'', description:'', toAccountNumber:'' });
  const [busy,      setBusy]      = useState(false);
  const [txBusy,    setTxBusy]    = useState(false);
  const [msg,       setMsg]       = useState(null);

  useEffect(()=>{
    axios.get('/accounts').then(r=>{ setAccounts(r.data); if(r.data[0]) setSelAcc(r.data[0]._id); });
  },[]);

  useEffect(()=>{
    if(!selAcc) return;
    setTxBusy(true);
    axios.get(`/transactions/account/${selAcc}`).then(r=>setTxs(r.data)).finally(()=>setTxBusy(false));
  },[selAcc]);

  const submit = async e => {
    e.preventDefault();
    if(!selAcc) return setMsg({ ok:false, text:'Select an account' });
    setBusy(true); setMsg(null);
    try {
      const url = { deposit:'/transactions/deposit', withdrawal:'/transactions/withdraw', transfer:'/transactions/transfer' }[tab];
      const body = tab === 'transfer'
        ? { fromAccountId:selAcc, toAccountNumber:form.toAccountNumber, amount:+form.amount, description:form.description }
        : { accountId:selAcc, amount:+form.amount, description:form.description };
      const { data } = await axios.post(url, body);
      setMsg({ ok:true, text:`${tab.charAt(0).toUpperCase()+tab.slice(1)} successful! New balance: $${data.newBalance.toFixed(2)}` });
      setForm({ amount:'', description:'', toAccountNumber:'' });
      const [t,a] = await Promise.all([axios.get(`/transactions/account/${selAcc}`), axios.get('/accounts')]);
      setTxs(t.data); setAccounts(a.data);
    } catch(err) {
      setMsg({ ok:false, text: err.response?.data?.message || 'Transaction failed' });
    } finally { setBusy(false); }
  };

  return (
    <div style={{ padding:'28px 32px', minHeight:'100vh', boxSizing:'border-box' }}>

      {/* Header */}
      <div style={{ marginBottom:28 }}>
        <h1 style={{ color:'#fff', fontSize:'1.9rem', fontWeight:700, fontFamily:'Georgia,serif', margin:0 }}>Transactions</h1>
        <p style={{ color:'#475569', fontFamily:'sans-serif', marginTop:6, fontSize:'0.875rem' }}>Deposit, withdraw, and transfer funds</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'320px 1fr', gap:24 }}>

        {/* ── FORM CARD ── */}
        <div style={{ ...S.card, padding:24, alignSelf:'start' }}>

          {/* Tabs */}
          <div style={{ display:'flex', backgroundColor:'rgba(255,255,255,0.05)', borderRadius:10, padding:4, marginBottom:20 }}>
            {TABS.map(t=>(
              <button key={t} onClick={()=>{ setTab(t); setMsg(null); }} style={{
                flex:1, padding:'8px 4px', borderRadius:7, border:'none',
                fontFamily:'sans-serif', fontSize:'0.78rem', fontWeight:600,
                cursor:'pointer', transition:'all 0.15s', textTransform:'capitalize',
                backgroundColor: tab===t ? '#f59e0b' : 'transparent',
                color:           tab===t ? '#0f1f4a' : '#64748b',
              }}>{t}</button>
            ))}
          </div>

          {/* Alert */}
          {msg && (
            <div style={{
              borderRadius:10, padding:'10px 14px', marginBottom:16,
              fontSize:'0.82rem', fontFamily:'sans-serif',
              backgroundColor: msg.ok ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
              border:          msg.ok ? '1px solid rgba(52,211,153,0.25)' : '1px solid rgba(248,113,113,0.25)',
              color:           msg.ok ? '#34d399' : '#f87171',
            }}>{msg.text}</div>
          )}

          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:14 }}>

            {/* Account */}
            <div>
              <label style={S.label}>Account</label>
              <select value={selAcc} onChange={e=>setSelAcc(e.target.value)}
                style={{ ...S.inp, appearance:'none', cursor:'pointer' }}>
                {accounts.length === 0
                  ? <option>No accounts — create one first</option>
                  : accounts.map(a=>(
                      <option key={a._id} value={a._id} style={{ backgroundColor:'#0a0f2e' }}>
                        {a.accountType.charAt(0).toUpperCase()+a.accountType.slice(1)} — ${a.balance.toFixed(2)}
                      </option>
                    ))
                }
              </select>
            </div>

            {/* To account (transfer) */}
            {tab==='transfer' && (
              <div>
                <label style={S.label}>Destination Account Number</label>
                <input required placeholder="ACC123…" value={form.toAccountNumber}
                  onChange={e=>setForm(p=>({...p,toAccountNumber:e.target.value}))}
                  style={{ ...S.inp, fontFamily:'monospace' }}
                  onFocus={e=>e.target.style.borderColor='rgba(245,158,11,0.5)'}
                  onBlur={e=>e.target.style.borderColor='#1e2a4a'}
                />
              </div>
            )}

            {/* Amount */}
            <div>
              <label style={S.label}>Amount ($)</label>
              <input type="number" min="0.01" step="0.01" required placeholder="0.00"
                value={form.amount} onChange={e=>setForm(p=>({...p,amount:e.target.value}))}
                style={{ ...S.inp, fontFamily:'monospace', fontSize:'1.25rem', fontWeight:700, padding:'12px 14px' }}
                onFocus={e=>e.target.style.borderColor='rgba(245,158,11,0.5)'}
                onBlur={e=>e.target.style.borderColor='#1e2a4a'}
              />
            </div>

            {/* Description */}
            <div>
              <label style={S.label}>Description (optional)</label>
              <input placeholder="What is this for?" value={form.description}
                onChange={e=>setForm(p=>({...p,description:e.target.value}))}
                style={S.inp}
                onFocus={e=>e.target.style.borderColor='rgba(245,158,11,0.5)'}
                onBlur={e=>e.target.style.borderColor='#1e2a4a'}
              />
            </div>

            {/* Submit */}
            <button type="submit" disabled={busy||accounts.length===0} style={{
              width:'100%', padding:'12px', borderRadius:10, border:'none',
              background:'linear-gradient(135deg,#f59e0b,#fbbf24)',
              color:'#0f1f4a', fontWeight:700, fontFamily:'sans-serif', fontSize:'0.9rem',
              cursor: (busy||accounts.length===0) ? 'not-allowed':'pointer',
              opacity: (busy||accounts.length===0) ? 0.6 : 1,
              textTransform:'capitalize',
              display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              marginTop:4,
            }}>
              {busy
                ? <><div style={{ width:15,height:15,border:'2px solid rgba(15,31,74,0.3)',borderTopColor:'#0f1f4a',borderRadius:'50%',animation:'spin 0.7s linear infinite' }}/>Processing…</>
                : `${tab} Now`
              }
            </button>
          </form>
        </div>

        {/* ── HISTORY CARD ── */}
        <div style={{ ...S.card, padding:24 }}>
          <h2 style={{ color:'#fff', fontFamily:'Georgia,serif', fontSize:'1.1rem', fontWeight:600, margin:'0 0 20px' }}>
            Transaction History
          </h2>

          {txBusy ? (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {[1,2,3,4,5].map(i=><div key={i} style={{ height:58, borderRadius:10, backgroundColor:'rgba(255,255,255,0.04)' }}/>)}
            </div>
          ) : txs.length === 0 ? (
            <div style={{ textAlign:'center', padding:'3rem 1rem', color:'#334155' }}>
              <ArrowLeftRight size={40} style={{ margin:'0 auto 12px', opacity:0.3, display:'block' }}/>
              <p style={{ fontFamily:'sans-serif', fontSize:'0.875rem' }}>No transactions yet for this account</p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:6, maxHeight:500, overflowY:'auto' }}>
              {txs.map(tx=>{
                const cfg=TYPE[tx.type]; const Icon=cfg.icon;
                return (
                  <div key={tx._id} style={{
                    display:'flex', alignItems:'center', gap:14,
                    padding:'12px 14px', borderRadius:12,
                    backgroundColor:'rgba(255,255,255,0.04)',
                    border:'1px solid rgba(255,255,255,0.05)',
                    transition:'background 0.15s',
                  }}
                  onMouseEnter={e=>e.currentTarget.style.backgroundColor='rgba(255,255,255,0.07)'}
                  onMouseLeave={e=>e.currentTarget.style.backgroundColor='rgba(255,255,255,0.04)'}
                  >
                    <div style={{ width:38,height:38,borderRadius:11,backgroundColor:cfg.bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                      <Icon size={18} color={cfg.color}/>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ color:'#e2e8f0',fontWeight:600,fontSize:'0.875rem',fontFamily:'sans-serif',textTransform:'capitalize' }}>{tx.type}</div>
                      <div style={{ color:'#475569',fontSize:'0.75rem',fontFamily:'sans-serif',marginTop:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>
                        {tx.description || 'No description'}
                      </div>
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0 }}>
                      <div style={{ color:cfg.color,fontWeight:700,fontFamily:'monospace',fontSize:'0.95rem' }}>{cfg.sign}${tx.amount.toFixed(2)}</div>
                      <div style={{ color:'#334155',fontSize:'0.7rem',fontFamily:'sans-serif',marginTop:2 }}>
                        {new Date(tx.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );
}