import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: '', email: '', phone: '', current_address: '', permanent_address: '',
    alt_phone: '', dob: '', father_name: '', purpose: '', platform_id: '', deposit_balance: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/profile');
      const u = res.data.user;
      setProfile({
        name: u.name || '',
        email: u.email || '',
        phone: u.phone || '',
        current_address: u.current_address || '',
        permanent_address: u.permanent_address || '',
        alt_phone: u.alt_phone || '',
        dob: u.dob || '',
        father_name: u.father_name || '',
        purpose: u.purpose || '',
        platform_id: u.platform_id || '',
        deposit_balance: u.deposit_balance || 0,
      });
    } catch (err) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>
        Profile Details
      </h2>

      {/* Deposit Balance */}
      <div className="card" style={{ maxWidth: 800, marginBottom: 'var(--space-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
        <div>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>Security Deposit Balance</p>
          <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>
            ₹{parseFloat(profile.deposit_balance || 0).toLocaleString('en-IN')}
          </p>
        </div>
        <span className={`badge ${parseFloat(profile.deposit_balance || 0) >= 2000 ? 'badge-success' : 'badge-warning'}`}>
          {parseFloat(profile.deposit_balance || 0) >= 2000 ? '✅ Deposit Verified' : '⚠️ Deposit Pending'}
        </span>
      </div>

      <div className="card" style={{ maxWidth: 800 }}>
        {user?.selfie_url && (
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
            <img src={user.selfie_url} alt="Profile" style={{
              width: 112, height: 112, borderRadius: '50%', objectFit: 'cover',
              border: '3px solid var(--primary)',
              boxShadow: 'var(--shadow-md)',
            }} />
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</span>
            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>{profile.name || '—'}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</span>
            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>{profile.email || '—'}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone Number</span>
            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>{profile.phone || '—'}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Alternative Phone</span>
            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>{profile.alt_phone || '—'}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date of Birth</span>
            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>{profile.dob || '—'}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Father's Name</span>
            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>{profile.father_name || '—'}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Purpose of Rental</span>
            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--text-primary)', textTransform: 'capitalize' }}>{profile.purpose || '—'}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform ID</span>
            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>{profile.platform_id || '—'}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)', gridColumn: '1 / -1' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Address</span>
            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>{profile.current_address || '—'}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)', gridColumn: '1 / -1' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Permanent Address</span>
            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>{profile.permanent_address || '—'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
