import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Mail, Phone, MapPin, Save, Trash2, User } from 'lucide-react';

const card = { backgroundColor:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'16px' };
const inp  = { width:'100%', backgroundColor:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'10px', padding:'0.75rem 1rem 0.75rem 2.5rem', color:'#fff', fontFamily:'sans-serif', fontSize:'0.875rem', outline:'none', boxSizing:'border-box' };

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const [form,    setForm]    = useState({ name:user?.name||'', phone:user?.phone||'', address:user?.address||'' });
  const [loading, setLoading] = useState(false);
  const [msg,     setMsg]     = useState(null);
  const navigate = useNavigate();

  const handleUpdate = async e => {
    e.preventDefault(); setLoading(true); setMsg(null);
    try { await updateProfile(form); setMsg({ type:'success', text:'Profile updated!' }); }
    catch(err) { setMsg({ type:'error', text:err.response?.data?.message||'Update failed.' }); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if(!confirm('Permanently delete your account? All data will be lost.')) return;
    try { await axios.delete('/auth/profile'); logout(); navigate('/login'); }
    catch { alert('Delete failed. Try again.'); }
  };

  const fields = [
    { key:'name',    label:'Full Name',   Icon:User,   placeholder:'John Doe',        required:true  },
    { key:'phone',   label:'Phone',       Icon:Phone,  placeholder:'+1 234 567 8900', required:false },
    { key:'address', label:'Address',     Icon:MapPin, placeholder:'Your city',        required:false },
  ];

  return (
    <div style={{ padding:'2rem', maxWidth:'620px' }}>
      <div style={{ marginBottom:'2rem' }}>
        <h1 style={{ color:'#fff', fontSize:'2rem', fontWeight:700, fontFamily:'Georgia,serif' }}>Profile</h1>
        <p style={{ color:'#475569', fontFamily:'sans-serif', marginTop:4, fontSize:'0.875rem' }}>Manage your personal information</p>
      </div>

      {/* Avatar Card */}
      <div style={{ ...card, padding:'1.5rem', display:'flex', alignItems:'center', gap:'1.25rem', marginBottom:'1.25rem', borderRadius:'18px' }}>
        <div style={{ width:72, height:72, borderRadius:18, background:'linear-gradient(135deg,#f59e0b,#fbbf24)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <span style={{ fontFamily:'Georgia,serif', fontSize:'2rem', fontWeight:800, color:'#0f1f4a' }}>{user?.name?.[0]?.toUpperCase()}</span>
        </div>
        <div>
          <div style={{ color:'#fff', fontSize:'1.4rem', fontWeight:700, fontFamily:'Georgia,serif' }}>{user?.name}</div>
          <div style={{ color:'#475569', fontSize:'0.875rem', fontFamily:'sans-serif', marginTop:4, display:'flex', alignItems:'center', gap:6 }}>
            <Mail size={13}/>{user?.email}
          </div>
          <div style={{ marginTop:8 }}>
            <span style={{
              display:'inline-block', padding:'0.2rem 0.65rem', borderRadius:20,
              fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.05em', textTransform:'uppercase',
              backgroundColor: user?.role==='admin' ? 'rgba(248,113,113,0.12)' : 'rgba(96,165,250,0.12)',
              color:           user?.role==='admin' ? '#f87171' : '#60a5fa',
              border:          user?.role==='admin' ? '1px solid rgba(248,113,113,0.25)' : '1px solid rgba(96,165,250,0.25)',
            }}>{user?.role}</span>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div style={{ ...card, padding:'1.5rem', marginBottom:'1.25rem', borderRadius:'18px' }}>
        <h2 style={{ color:'#fff', fontFamily:'Georgia,serif', fontSize:'1.1rem', fontWeight:600, marginBottom:'1.25rem' }}>Edit Information</h2>

        {msg && (
          <div style={{
            backgroundColor: msg.type==='success' ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
            border:          msg.type==='success' ? '1px solid rgba(52,211,153,0.3)' : '1px solid rgba(248,113,113,0.3)',
            color:           msg.type==='success' ? '#34d399' : '#f87171',
            borderRadius:10, padding:'0.75rem 1rem', marginBottom:'1rem', fontSize:'0.875rem', fontFamily:'sans-serif',
          }}>{msg.text}</div>
        )}

        <form onSubmit={handleUpdate} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {fields.map(({ key, label, Icon, placeholder, required }) => (
            <div key={key}>
              <label style={{ display:'block', color:'#94a3b8', fontSize:'0.8rem', marginBottom:'0.4rem', fontFamily:'sans-serif' }}>{label}</label>
              <div style={{ position:'relative' }}>
                <Icon size={15} color="#475569" style={{ position:'absolute', left:'0.85rem', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
                <input type="text" required={required} placeholder={placeholder} value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))} style={inp}
                  onFocus={e=>e.target.style.borderColor='rgba(245,158,11,0.5)'}
                  onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'}
                />
              </div>
            </div>
          ))}

          {/* Email readonly */}
          <div>
            <label style={{ display:'block', color:'#94a3b8', fontSize:'0.8rem', marginBottom:'0.4rem', fontFamily:'sans-serif' }}>Email <span style={{ color:'#334155', fontWeight:400 }}>(cannot be changed)</span></label>
            <div style={{ position:'relative' }}>
              <Mail size={15} color="#334155" style={{ position:'absolute', left:'0.85rem', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
              <input disabled value={user?.email||''} style={{ ...inp, opacity:0.4, cursor:'not-allowed' }}/>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ alignSelf:'flex-start', display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.75rem 1.5rem', borderRadius:10, background:'linear-gradient(135deg,#f59e0b,#fbbf24)', color:'#0f1f4a', fontWeight:700, border:'none', cursor:'pointer', fontFamily:'sans-serif', marginTop:'0.25rem' }}>
            <Save size={15}/>{loading ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div style={{ ...card, padding:'1.5rem', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'18px' }}>
        <h2 style={{ color:'#f87171', fontFamily:'Georgia,serif', fontSize:'1.1rem', fontWeight:600, marginBottom:'0.5rem' }}>Danger Zone</h2>
        <p style={{ color:'#475569', fontSize:'0.875rem', fontFamily:'sans-serif', marginBottom:'1rem' }}>
          Deleting your account is permanent. All accounts and transactions will be removed.
        </p>
        <button onClick={handleDelete} style={{ display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.7rem 1.25rem', borderRadius:10, backgroundColor:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', color:'#f87171', fontWeight:600, cursor:'pointer', fontFamily:'sans-serif', fontSize:'0.875rem' }}>
          <Trash2 size={15}/> Delete My Account
        </button>
      </div>
    </div>
  );
}