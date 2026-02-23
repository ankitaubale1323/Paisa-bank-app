
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Landmark, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Login() {
  const [form,   setForm]   = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading,setLoading]= useState(false);
  const [error,  setError]  = useState('');
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', background: '#020714', overflow: 'hidden' }}>
      {/* Left decorative panel */}
      <div
        className="navy-gradient"
        style={{
          width: '45%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '3rem', position: 'relative', overflow: 'hidden',
        }}
      >
        {/* dot grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.07,
          backgroundImage: 'radial-gradient(circle, rgba(245,158,11,0.6) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 340 }}>
          <div
            className="gold-gradient pulse-gold"
            style={{ width: 72, height: 72, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}
          >
            <Landmark size={36} color="#0f1f4a" />
          </div>
          <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: '2.8rem', fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: '1rem' }}>
            PaisaBank
          </h1>
          <p style={{ fontFamily: '"DM Sans",sans-serif', color: '#475569', fontSize: '1rem', lineHeight: 1.7 }}>
            Modern AI-powered banking. Secure, instant, and always available.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginTop: '2.5rem' }}>
            {[['256-bit', 'Encryption'], ['99.9%', 'Uptime'], ['AI', 'Powered']].map(([v, l]) => (
              <div key={l} className="glass" style={{ borderRadius: 12, padding: '1rem 0.75rem', textAlign: 'center' }}>
                <div style={{ fontFamily: '"Playfair Display",serif', fontSize: '1.25rem', fontWeight: 700, color: '#f59e0b' }}>{v}</div>
                <div style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.7rem', color: '#475569', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="fade-in" style={{ width: '100%', maxWidth: 400 }}>
          <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: '2rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
            Welcome back
          </h2>
          <p style={{ fontFamily: '"DM Sans",sans-serif', color: '#475569', marginBottom: '2rem' }}>
            Sign in to your account
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label className="label">Email address</label>
              <input
                type="email" required className="inp"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'} required className="inp"
                  placeholder="••••••••"
                  style={{ paddingRight: '2.8rem' }}
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex' }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-gold btn-full btn-lg" disabled={loading} style={{ marginTop: '0.5rem' }}>
              {loading ? <><div className="spinner" /> Signing in…</> : <>Sign In <ArrowRight size={16} /></>}
            </button>
          </form>

          <p style={{ fontFamily: '"DM Sans",sans-serif', color: '#475569', textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#f59e0b', fontWeight: 600, textDecoration: 'none' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}