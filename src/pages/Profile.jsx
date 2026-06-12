import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', current_address: '', permanent_address: '',
    alt_phone: '', dob: '', father_name: '', purpose: '', platform_id: '', deposit_balance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/profile');
      const u = res.data.user;
      setForm({
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

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/users/profile', form);
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>
        Profile
      </h2>

      {/* Deposit Balance */}
      <div className="card" style={{ maxWidth: 720, marginBottom: 'var(--space-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
        <div>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>Security Deposit Balance</p>
          <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>
            ₹{parseFloat(form.deposit_balance || 0).toLocaleString('en-IN')}
          </p>
        </div>
        <span className={`badge ${parseFloat(form.deposit_balance || 0) >= 2000 ? 'badge-success' : 'badge-warning'}`}>
          {parseFloat(form.deposit_balance || 0) >= 2000 ? '✅ Deposit Verified' : '⚠️ Deposit Pending'}
        </span>
      </div>

      <div className="card" style={{ maxWidth: 720 }}>
        {user?.selfie_url && (
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
            <img src={user.selfie_url} alt="Profile" style={{
              width: 96, height: 96, borderRadius: '50%', objectFit: 'cover',
              border: '3px solid var(--primary)',
            }} />
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Alternative Phone</label>
              <input className="form-input" value={form.alt_phone}
                onChange={(e) => setForm({ ...form, alt_phone: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input className="form-input" type="date" value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Father's Name</label>
              <input className="form-input" value={form.father_name}
                onChange={(e) => setForm({ ...form, father_name: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Purpose</label>
              <select className="form-select" value={form.purpose}
                onChange={(e) => setForm({ ...form, purpose: e.target.value })}>
                <option value="">Select purpose</option>
                <option value="blinkit">Blinkit</option>
                <option value="zepto">Zepto</option>
                <option value="instamart">Instamart</option>
                <option value="personal">Personal Use</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Platform ID</label>
              <input className="form-input" value={form.platform_id} placeholder="If delivery platform"
                onChange={(e) => setForm({ ...form, platform_id: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Current Address</label>
            <textarea className="form-textarea" value={form.current_address}
              onChange={(e) => setForm({ ...form, current_address: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Permanent Address</label>
            <textarea className="form-textarea" value={form.permanent_address}
              onChange={(e) => setForm({ ...form, permanent_address: e.target.value })} />
          </div>

          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
