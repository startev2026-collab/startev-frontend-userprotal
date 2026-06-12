import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import RenewalModal from '../components/RenewalModal';
import { HiOutlineLightningBolt, HiOutlineClock, HiOutlineCreditCard, HiOutlineCollection, HiOutlineShieldCheck, HiOutlineRefresh, HiOutlineExclamationCircle } from 'react-icons/hi';

function useCountdown(expiryDate) {
  const [remaining, setRemaining] = useState('');
  const [hoursLeft, setHoursLeft] = useState(null);

  useEffect(() => {
    if (!expiryDate) return;

    const calc = () => {
      const now = new Date();
      const expiry = new Date(expiryDate);
      const diff = expiry - now;

      if (diff <= 0) {
        setRemaining('Expired');
        setHoursLeft(-1);
        return;
      }

      const totalHours = diff / (1000 * 60 * 60);
      setHoursLeft(totalHours);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      if (days > 0) {
        setRemaining(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setRemaining(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setRemaining(`${minutes}m ${seconds}s`);
      }
    };

    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [expiryDate]);

  return { remaining, hoursLeft };
}

function RentalCard({ rental, onReactivate }) {
  const { remaining, hoursLeft } = useCountdown(rental.expiry_date);
  const isExpired = rental.rental_status === 'expired' || hoursLeft === -1;
  const showReactivate = isExpired || (hoursLeft !== null && hoursLeft <= 4);
  const fineAmount = parseFloat(rental.fine_amount || 0);

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  // Dynamic card style based on state
  const cardStyle = isExpired ? {
    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(239, 68, 68, 0.03))',
    border: '1px solid rgba(239, 68, 68, 0.3)',
  } : (hoursLeft !== null && hoursLeft <= 4) ? {
    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(245, 158, 11, 0.03))',
    border: '1px solid rgba(245, 158, 11, 0.3)',
  } : {};

  return (
    <div className="rental-active-card slide-up" style={cardStyle}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>
            {rental.bikes?.bike_model || 'N/A'}
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            {rental.bikes?.bike_number} • {rental.stores?.store_name}
          </p>
        </div>
        {isExpired ? (
          <span className="badge badge-error">Expired</span>
        ) : (hoursLeft !== null && hoursLeft <= 4) ? (
          <span className="badge badge-warning">Expiring Soon</span>
        ) : (
          <span className="badge badge-success">Active</span>
        )}
      </div>

      {/* Info Grid */}
      <div className="rental-info-grid">
        <div className="rental-info-item">
          <label>Plan</label>
          <p style={{ textTransform: 'capitalize' }}>{rental.rental_plan}</p>
        </div>
        <div className="rental-info-item">
          <label>Start Date & Time</label>
          <p>{formatDateTime(rental.start_date)}</p>
        </div>
        <div className="rental-info-item">
          <label>Expiry Date & Time</label>
          <p>{formatDateTime(rental.expiry_date)}</p>
        </div>
        <div className="rental-info-item">
          <label>Amount Paid</label>
          <p>₹{parseFloat(rental.amount).toLocaleString('en-IN')}</p>
        </div>

        {/* Countdown */}
        {!isExpired && (
          <div className="rental-info-item">
            <label>Remaining Time</label>
            <p style={{
              color: hoursLeft <= 4 ? 'var(--error)' : hoursLeft <= 24 ? 'var(--warning)' : 'var(--success)',
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
            }}>
              ⏱ {remaining}
            </p>
          </div>
        )}

        <div className="rental-info-item">
          <label>Payment</label>
          <p><span className="badge badge-success">{rental.payment_status}</span></p>
        </div>

        {rental.battery_number && (
          <div className="rental-info-item">
            <label>Battery No.</label>
            <p>{rental.battery_number}</p>
          </div>
        )}

        {rental.charger_number && (
          <div className="rental-info-item">
            <label>Charger No.</label>
            <p>{rental.charger_number}</p>
          </div>
        )}
      </div>

      {/* Fine Display */}
      {isExpired && fineAmount > 0 && (
        <div style={{
          marginTop: 'var(--space-lg)',
          padding: 'var(--space-md) var(--space-lg)',
          background: 'var(--error-bg)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1px solid rgba(239, 68, 68, 0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <HiOutlineExclamationCircle style={{ color: 'var(--error)', fontSize: '1.25rem' }} />
            <span style={{ fontWeight: 600, color: 'var(--error)', fontSize: 'var(--font-size-sm)' }}>
              Overdue Fine
            </span>
          </div>
          <span style={{ fontWeight: 700, color: 'var(--error)', fontSize: 'var(--font-size-lg)' }}>
            ₹{fineAmount.toLocaleString('en-IN')}
          </span>
        </div>
      )}

      {/* Reactivate Button */}
      {showReactivate && (
        <button
          className="btn btn-danger"
          style={{
            marginTop: 'var(--space-lg)',
            width: '100%',
            padding: 'var(--space-md) var(--space-xl)',
            fontSize: 'var(--font-size-base)',
            fontWeight: 700,
            animation: isExpired ? 'pulse 2s ease-in-out infinite' : 'none',
          }}
          onClick={() => onReactivate(rental)}
        >
          <HiOutlineRefresh /> Reactivate
        </button>
      )}
    </div>
  );
}


export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [renewalRental, setRenewalRental] = useState(null);

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await api.get('/users/dashboard');
      setDashboard(res.data);
    } catch (err) {
      console.error('Failed to load dashboard', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Trigger fine calculation on load
  useEffect(() => {
    api.post('/rentals/check-expired').catch(() => {});
  }, []);

  const handleRenewalSuccess = () => {
    setRenewalRental(null);
    setLoading(true);
    fetchDashboard();
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  const hasActiveRental = dashboard?.active_rentals?.length > 0;
  const hasExpiredRental = dashboard?.expired_rentals?.length > 0;
  const hasCancelledRental = dashboard?.cancelled_rentals?.length > 0;
  const isFirstLogin = dashboard?.is_first_login && !hasActiveRental && !hasExpiredRental;

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>
          Welcome back, {dashboard?.name || user?.name || 'User'} 👋
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-sm)' }}>
          Here's your rental overview
        </p>
      </div>

      {/* Cancelled Rental Banner */}
      {hasCancelledRental && !hasActiveRental && !hasExpiredRental && (
        <div className="card" style={{ marginBottom: 'var(--space-xl)', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error)' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, color: 'var(--error)' }}>
            ⚠️ Start EV cancelled your bike
          </h3>
          <p style={{ marginTop: 'var(--space-sm)' }}>
            Your recent bike rental was cancelled by our admins.
          </p>
          <button className="btn btn-primary" style={{ marginTop: 'var(--space-md)' }} onClick={() => navigate('/rent')}>
            <HiOutlineLightningBolt /> Rent a Bike
          </button>
        </div>
      )}

      {/* First Login CTA */}
      {isFirstLogin && !hasCancelledRental && (
        <div className="cta-rent slide-up" style={{ marginBottom: 'var(--space-xl)' }}>
          <h2>🏍️ Ready to Ride?</h2>
          <p>Get your first electric bike rental today. Choose from our fleet of premium EVs across multiple locations.</p>
          <button className="btn" onClick={() => navigate('/rent')}>
            <HiOutlineLightningBolt /> Rent a Bike
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="card-grid" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="stat-card">
          <div className="stat-icon purple"><HiOutlineCollection /></div>
          <div className="stat-info">
            <h3>{dashboard?.total_rentals || 0}</h3>
            <p>Total Rentals</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><HiOutlineLightningBolt /></div>
          <div className="stat-info">
            <h3>{dashboard?.active_rentals?.length || 0}</h3>
            <p>Active Rentals</p>
          </div>
        </div>
        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/deposit')}>
          <div className={`stat-icon ${dashboard?.deposit_verified ? 'green' : 'amber'}`}><HiOutlineShieldCheck /></div>
          <div className="stat-info">
            <h3>₹{(dashboard?.deposit_balance || 0).toLocaleString('en-IN')}</h3>
            <p>Deposit {dashboard?.deposit_verified ? '✅ Verified' : '⚠️ Pending'}</p>
          </div>
        </div>
      </div>

      {/* Deposit Warning Banner */}
      {!dashboard?.deposit_verified && (
        <div className="card" style={{ marginBottom: 'var(--space-xl)', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
            <div className="stat-icon amber"><HiOutlineShieldCheck /></div>
            <div>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, color: 'var(--warning)' }}>
                ⚠️ Security Deposit Required
              </h3>
              <p style={{ marginTop: 'var(--space-xs)', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                A refundable security deposit of ₹{(dashboard?.required_deposit || 2000).toLocaleString('en-IN')} is required before renting a bike.
              </p>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/deposit')}>
            <HiOutlineShieldCheck /> Pay Deposit
          </button>
        </div>
      )}

      {/* Expired Rental Cards */}
      {hasExpiredRental && (
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--space-lg)', color: 'var(--error)' }}>
            ⚠️ Expired Rental — Action Required
          </h3>
          {dashboard.expired_rentals.map((rental) => (
            <RentalCard
              key={rental.id}
              rental={rental}
              onReactivate={(r) => setRenewalRental(r)}
            />
          ))}
        </div>
      )}

      {/* Active Rental Cards */}
      {hasActiveRental && (
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>
            Active Rental
          </h3>
          {dashboard.active_rentals.map((rental) => (
            <RentalCard
              key={rental.id}
              rental={rental}
              onReactivate={(r) => setRenewalRental(r)}
            />
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {!isFirstLogin && (
        <div className="card">
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>
            Quick Actions
          </h3>
          <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
            {!hasActiveRental && !hasExpiredRental && (
              <button className="btn btn-primary" onClick={() => navigate('/rent')}>
                <HiOutlineLightningBolt /> Rent a Bike
              </button>
            )}
            <button className="btn btn-secondary" onClick={() => navigate('/rentals')}>
              <HiOutlineClock /> Rental History
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/payments')}>
              <HiOutlineCreditCard /> Payment History
            </button>
          </div>
        </div>
      )}

      {/* Renewal Modal */}
      {renewalRental && (
        <RenewalModal
          rental={renewalRental}
          onClose={() => setRenewalRental(null)}
          onSuccess={handleRenewalSuccess}
        />
      )}
    </div>
  );
}
