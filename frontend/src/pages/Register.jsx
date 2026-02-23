import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Landmark, ArrowRight } from 'lucide-react';

export default function Register() {
  const [form,   setForm]    = useState({ name: '', email: '', password: '', phone: '', address: '' });
  const [loading,setLoading] = useState(false);
  const [error,  setError]   = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  const field = (key, label, type = 'text', placeholder = '', required = false) => (
    <div>
      <label className="label">{label}{required && <span style={{ color: '#f59e0b' }}> *</span>}</label>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        className="inp"
        value={form[key]}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
      />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020714', padding: '2rem', overflow: 'hidden' }}>
      <div className="fade-in" style={{ width: '100%', maxWidth: 500 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <div className="gold-gradient" style={{ width: 38, height: 38, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Landmark size={20} color="#0f1f4a" />
          </div>
          <span style={{ fontFamily: '"Playfair Display",serif', fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>PaisaBank</span>
        </div>

        <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: '2rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
          Open your account
        </h1>
        <p style={{ fontFamily: '"DM Sans",sans-serif', color: '#475569', marginBottom: '2rem' }}>
          Start banking smarter today — free forever
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {field('name',  'Full Name',  'text',     'John Doe',        true)}
            {field('email', 'Email',      'email',    'you@example.com', true)}
          </div>
          {field('password', 'Password', 'password', 'Min. 6 characters', true)}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {field('phone',   'Phone (optional)',   'tel',  '+1 234 567 8900')}
            {field('address', 'Address (optional)', 'text', 'Your city')}
          </div>
          <button type="submit" className="btn btn-gold btn-full btn-lg" disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? <><div className="spinner" /> Creating…</> : <>Create Account <ArrowRight size={16} /></>}
          </button>
        </form>

        <p style={{ fontFamily: '"DM Sans",sans-serif', color: '#475569', textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#f59e0b', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}