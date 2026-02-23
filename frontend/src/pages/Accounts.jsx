import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, CreditCard, CheckCircle, XCircle } from 'lucide-react';

const card = { backgroundColor:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'16px' };
const inp  = { width:'100%', backgroundColor:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'10px', padding:'0.75rem 1rem', color:'#fff', fontFamily:'sans-serif', fontSize:'0.875rem', outline:'none', boxSizing:'border-box' };
const TYPES = ['savings','checking','business'];
const typeColor = { savings:'#34d399', checking:'#60a5fa', business:'#f59e0b' };

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div style={{ position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.7)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, padding:'1rem' }} onClick={onClose}>
      <div style={{ ...card, padding:'1.75rem', width:'100%', maxWidth:'420px', borderRadius:'20px' }} onClick={e=>e.stopPropagation()}>
        <h2 style={{ color:'#fff', fontFamily:'Georgia,serif', fontSize:'1.2rem', fontWeight:700, marginBottom:'1.5rem' }}>{title}</h2>
        {children}
      </div>
    </div>
  );
}

export default function Accounts() {
  const [accounts,   setAccounts]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editAcc,    setEditAcc]    = useState(null);
  const [form,       setForm]       = useState({ accountType:'savings', initialDeposit:'' });
  const [error,      setError]      = useState('');
  const [saving,     setSaving]     = useState(false);

  const load = () => { setLoading(true); axios.get('/accounts').then(r=>setAccounts(r.data)).finally(()=>setLoading(false)); };
  useEffect(load, []);

  const handleCreate = async e => {
    e.preventDefault(); setSaving(true); setError('');
    try { await axios.post('/accounts', form); setShowCreate(false); setForm({accountType:'savings',initialDeposit:''}); load(); }
    catch(err) { setError(err.response?.data?.message||'Failed'); } finally { setSaving(false); }
  };

  const handleUpdate = async e => {
    e.preventDefault(); setSaving(true); setError('');
    try { await axios.put(`/accounts/${editAcc._id}`,{accountType:editAcc.accountType,isActive:editAcc.isActive}); setEditAcc(null); load(); }
    catch(err) { setError(err.response?.data?.message||'Failed'); } finally { setSaving(false); }
  };

  const handleDelete = async id => {
    if(!confirm('Delete this account permanently?')) return;
    try { await axios.delete(`/accounts/${id}`); load(); } catch(err) { alert(err.response?.data?.message||'Delete failed'); }
  };

  return (
    <div style={{ padding:'2rem', maxWidth:'1100px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'2rem' }}>
        <div>
          <h1 style={{ color:'#fff', fontSize:'2rem', fontWeight:700, fontFamily:'Georgia,serif' }}>Accounts</h1>
          <p style={{ color:'#475569', fontFamily:'sans-serif', marginTop:4, fontSize:'0.875rem' }}>Manage your bank accounts</p>
        </div>
        <button onClick={()=>{setError('');setShowCreate(true);}} style={{ display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.7rem 1.25rem', borderRadius:'10px', background:'linear-gradient(135deg,#f59e0b,#fbbf24)', color:'#0f1f4a', fontWeight:700, border:'none', cursor:'pointer', fontSize:'0.875rem', fontFamily:'sans-serif' }}>
          <Plus size={16}/> New Account
        </button>
      </div>

      {loading ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.25rem' }}>
          {[1,2,3].map(i=><div key={i} style={{ ...card, height:180, opacity:0.4 }}/>)}
        </div>
      ) : accounts.length === 0 ? (
        <div style={{ ...card, padding:'4rem', textAlign:'center', borderRadius:'20px' }}>
          <CreditCard size={48} color="#334155" style={{ margin:'0 auto 1rem' }}/>
          <p style={{ color:'#475569', fontFamily:'sans-serif', marginBottom:'1.25rem' }}>No accounts yet. Create your first!</p>
          <button onClick={()=>setShowCreate(true)} style={{ padding:'0.75rem 1.5rem', borderRadius:'10px', background:'linear-gradient(135deg,#f59e0b,#fbbf24)', color:'#0f1f4a', fontWeight:700, border:'none', cursor:'pointer', fontFamily:'sans-serif' }}>
            Open Account
          </button>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'1.25rem' }}>
          {accounts.map(acc=>(
            <div key={acc._id} style={{ ...card, padding:'1.5rem', position:'relative', overflow:'hidden', transition:'all 0.2s', borderRadius:'18px' }}
              onMouseEnter={e=>e.currentTarget.style.backgroundColor='rgba(255,255,255,0.07)'}
              onMouseLeave={e=>e.currentTarget.style.backgroundColor='rgba(255,255,255,0.04)'}
            >
              <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:`linear-gradient(90deg,${typeColor[acc.accountType]},transparent)` }}/>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.25rem' }}>
                <div style={{ width:44, height:44, borderRadius:14, backgroundColor:`${typeColor[acc.accountType]}18`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <CreditCard size={22} color={typeColor[acc.accountType]}/>
                </div>
                <div style={{ display:'flex', gap:6, opacity:0 }} className="actions"
                  onMouseEnter={e=>e.currentTarget.style.opacity=1}
                >
                  <button onClick={()=>{setEditAcc({...acc});setError('');}} style={{ width:30, height:30, borderRadius:8, backgroundColor:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Edit2 size={13} color="#94a3b8"/>
                  </button>
                  <button onClick={()=>handleDelete(acc._id)} style={{ width:30, height:30, borderRadius:8, backgroundColor:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.2)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Trash2 size={13} color="#f87171"/>
                  </button>
                </div>
              </div>
              <div style={{ marginBottom:'1rem' }}>
                <div style={{ color:'#fff', fontSize:'1.65rem', fontWeight:700, fontFamily:'monospace', lineHeight:1.1 }}>
                  ${acc.balance.toLocaleString('en-US',{minimumFractionDigits:2})}
                </div>
                <div style={{ color:'#475569', fontSize:'0.8rem', textTransform:'capitalize', fontFamily:'sans-serif', marginTop:4 }}>{acc.accountType} Account</div>
              </div>
              <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:'1rem' }}>
                <div style={{ color:'#334155', fontSize:'0.7rem', fontFamily:'monospace', marginBottom:8 }}>{acc.accountNumber}</div>
                <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                  {acc.isActive
                    ? <><CheckCircle size={13} color="#34d399"/><span style={{ color:'#34d399', fontSize:'0.75rem', fontFamily:'sans-serif' }}>Active</span></>
                    : <><XCircle    size={13} color="#f87171"/><span style={{ color:'#f87171', fontSize:'0.75rem', fontFamily:'sans-serif' }}>Inactive</span></>
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal open={showCreate} onClose={()=>setShowCreate(false)} title="Open New Account">
        {error && <div style={{ backgroundColor:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.3)', color:'#f87171', borderRadius:10, padding:'0.75rem 1rem', marginBottom:'1rem', fontSize:'0.875rem' }}>{error}</div>}
        <form onSubmit={handleCreate} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          <div>
            <label style={{ display:'block', color:'#94a3b8', fontSize:'0.8rem', marginBottom:'0.4rem', fontFamily:'sans-serif' }}>Account Type</label>
            <select value={form.accountType} onChange={e=>setForm(p=>({...p,accountType:e.target.value}))} style={{ ...inp, cursor:'pointer' }}>
              {TYPES.map(t=><option key={t} value={t} style={{ backgroundColor:'#0f1f4a' }}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display:'block', color:'#94a3b8', fontSize:'0.8rem', marginBottom:'0.4rem', fontFamily:'sans-serif' }}>Initial Deposit ($)</label>
            <input type="number" min="0" step="0.01" value={form.initialDeposit} onChange={e=>setForm(p=>({...p,initialDeposit:e.target.value}))} placeholder="0.00" style={inp}/>
          </div>
          <div style={{ display:'flex', gap:'0.75rem', marginTop:'0.5rem' }}>
            <button type="button" onClick={()=>setShowCreate(false)} style={{ flex:1, padding:'0.75rem', borderRadius:10, backgroundColor:'rgba(255,255,255,0.06)', color:'#94a3b8', border:'1px solid rgba(255,255,255,0.1)', cursor:'pointer', fontFamily:'sans-serif' }}>Cancel</button>
            <button type="submit" disabled={saving} style={{ flex:1, padding:'0.75rem', borderRadius:10, background:'linear-gradient(135deg,#f59e0b,#fbbf24)', color:'#0f1f4a', fontWeight:700, border:'none', cursor:'pointer', fontFamily:'sans-serif' }}>
              {saving ? 'Creating…' : 'Create Account'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editAcc} onClose={()=>setEditAcc(null)} title="Edit Account">
        {error && <div style={{ backgroundColor:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.3)', color:'#f87171', borderRadius:10, padding:'0.75rem 1rem', marginBottom:'1rem', fontSize:'0.875rem' }}>{error}</div>}
        {editAcc && (
          <form onSubmit={handleUpdate} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div>
              <label style={{ display:'block', color:'#94a3b8', fontSize:'0.8rem', marginBottom:'0.4rem', fontFamily:'sans-serif' }}>Account Type</label>
              <select value={editAcc.accountType} onChange={e=>setEditAcc(p=>({...p,accountType:e.target.value}))} style={{ ...inp, cursor:'pointer' }}>
                {TYPES.map(t=><option key={t} value={t} style={{ backgroundColor:'#0f1f4a' }}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
              </select>
            </div>
            <label style={{ display:'flex', alignItems:'center', gap:'0.65rem', cursor:'pointer' }}>
              <input type="checkbox" checked={editAcc.isActive} onChange={e=>setEditAcc(p=>({...p,isActive:e.target.checked}))} style={{ width:16, height:16, accentColor:'#f59e0b', cursor:'pointer' }}/>
              <span style={{ color:'#94a3b8', fontSize:'0.875rem', fontFamily:'sans-serif' }}>Account is Active</span>
            </label>
            <div style={{ display:'flex', gap:'0.75rem', marginTop:'0.5rem' }}>
              <button type="button" onClick={()=>setEditAcc(null)} style={{ flex:1, padding:'0.75rem', borderRadius:10, backgroundColor:'rgba(255,255,255,0.06)', color:'#94a3b8', border:'1px solid rgba(255,255,255,0.1)', cursor:'pointer', fontFamily:'sans-serif' }}>Cancel</button>
              <button type="submit" disabled={saving} style={{ flex:1, padding:'0.75rem', borderRadius:10, background:'linear-gradient(135deg,#f59e0b,#fbbf24)', color:'#0f1f4a', fontWeight:700, border:'none', cursor:'pointer', fontFamily:'sans-serif' }}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      <style>{`.actions { opacity: 0 !important; } div:hover > div > .actions { opacity: 1 !important; }`}</style>
    </div>
  );
}