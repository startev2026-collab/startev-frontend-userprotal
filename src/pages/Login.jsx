import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineLightningBolt, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ login: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.login, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card slide-up">
        <div className="login-brand">
          <img src="/logo.jpeg" alt="StartEv" style={{ height: '120px', objectFit: 'contain', margin: '0 auto var(--space-md)', display: 'block' }} />
          <p>Sign in to your account</p>
        </div>

        <div style={{
          marginTop: '1.25rem',
          padding: '12px 16px',
          background: 'rgba(56, 142, 60, 0.08)',
          border: '1px solid rgba(56, 142, 60, 0.2)',
          borderRadius: '10px',
          textAlign: 'center',
          fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          wordBreak: 'break-word'
        }}>
          <span style={{ fontWeight: 600, color: 'var(--primary)' }}>Demo Credentials</span><br />
          Gmail: <strong>karthik@gmail.com</strong><br />
          Password: <strong>123456</strong>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email or Phone Number</label>
            <input className="form-input" type="text" placeholder="Enter email or phone"
              value={form.login} onChange={(e) => setForm({ ...form, login: e.target.value })} required />
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input className="form-input" type={showPassword ? "text" : "password"} placeholder="Enter password"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required
                style={{ paddingRight: '40px', width: '100%' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '10px', background: 'none', border: 'none',
                  color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center'
                }}
              >
                {showPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
              </button>
            </div>
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="terms" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              I agree to the <a href="#" style={{ color: 'var(--primary)' }}>Terms & Conditions</a>
            </label>
          </div>

          <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }} disabled={loading || !termsAccepted} type="submit">
            {loading ? 'Please wait...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
