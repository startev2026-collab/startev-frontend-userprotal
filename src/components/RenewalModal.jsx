import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { HiOutlineRefresh, HiX, HiOutlineExclamationCircle, HiOutlineShieldCheck } from 'react-icons/hi';

const planLabels = { daily: '1 Day', weekly: '7 Days', monthly: '30 Days' };
const planKeys = ['daily', 'weekly', 'monthly'];

export default function RenewalModal({ rental, onClose, onSuccess }) {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paying, setPaying] = useState(false);
  const [depositStatus, setDepositStatus] = useState(null);
  const [checkingDeposit, setCheckingDeposit] = useState(true);

  const bike = rental.bikes || {};
  const isExpired = rental.rental_status === 'expired';
  const fineAmount = isExpired ? parseFloat(rental.fine_amount || 0) : 0;

  useEffect(() => {
    checkDepositStatus();
  }, []);

  const checkDepositStatus = async () => {
    setCheckingDeposit(true);
    try {
      const res = await api.get('/deposits/status');
      setDepositStatus(res.data);
    } catch (err) {
      console.error('Failed to check deposit', err);
    } finally {
      setCheckingDeposit(false);
    }
  };

  const getPlanPrice = (plan) => {
    const key = `${plan}_price`;
    return parseFloat(bike[key] || 0);
  };

  const totalAmount = selectedPlan
    ? getPlanPrice(selectedPlan) + fineAmount
    : fineAmount;

  const handlePayAndRenew = async () => {
    if (!selectedPlan) {
      toast.error('Please select a rental plan');
      return;
    }

    setPaying(true);
    try {
      const amount = totalAmount;

      const initRes = await api.post('/payments/create-order', {
        amount: amount,
        currency: 'INR',
        receipt: `receipt_renew_${rental.id}_${Date.now()}`,
        payment_type: 'renewal'
      });

      const payu = initRes.data;

      sessionStorage.setItem(`payu_intent_${payu.txnid}`, JSON.stringify({
        type: 'renewal',
        rental_id: rental.id,
        rental_plan: selectedPlan,
        amount: amount,
      }));

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = payu.action;
      form.style.display = 'none';

      const fields = { key: payu.key, txnid: payu.txnid, amount: payu.amount, productinfo: payu.productinfo, firstname: payu.firstname, email: payu.email, phone: payu.phone, hash: payu.hash, surl: payu.surl, furl: payu.furl, udf1: payu.udf1 };
      Object.entries(fields).forEach(([k, v]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = k;
        input.value = v;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to initiate payment');
      setPaying(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <HiOutlineRefresh /> Reactivate Rental
          </h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <HiX />
          </button>
        </div>

        <div className="modal-body">
          {/* Bike Info */}
          <div style={{
            padding: 'var(--space-lg)',
            background: 'var(--bg-primary)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-lg)',
            border: '1px solid var(--border)'
          }}>
            <h3 style={{ fontWeight: 600, marginBottom: 'var(--space-xs)' }}>
              {bike.bike_model || 'N/A'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              #{bike.bike_number} • {rental.stores?.store_name}
            </p>
          </div>

          {/* Fine Warning */}
          {isExpired && fineAmount > 0 && (
            <div style={{
              padding: 'var(--space-lg)',
              background: 'var(--error-bg)',
              border: '1px solid var(--error)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--space-lg)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--space-md)'
            }}>
              <HiOutlineExclamationCircle style={{ fontSize: '1.5rem', color: 'var(--error)', flexShrink: 0, marginTop: 2 }} />
              <div>
                <h4 style={{ fontWeight: 600, color: 'var(--error)', marginBottom: 'var(--space-xs)' }}>
                  Overdue Fine
                </h4>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                  Your rental expired on {new Date(rental.expiry_date).toLocaleString('en-IN')}. An overdue fine of <strong style={{ color: 'var(--error)' }}>₹{fineAmount.toLocaleString('en-IN')}</strong> has been applied.
                </p>
              </div>
            </div>
          )}

          {/* Plan Selection */}
          <h4 style={{ fontWeight: 600, marginBottom: 'var(--space-md)' }}>
            Select a Renewal Plan
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
            {planKeys.map((plan) => {
              const price = getPlanPrice(plan);
              const isSelected = selectedPlan === plan;
              return (
                <div key={plan}
                  onClick={() => setSelectedPlan(plan)}
                  className={`price-option ${isSelected ? 'selected' : ''}`}
                  style={{
                    padding: 'var(--space-md)',
                    cursor: 'pointer',
                    borderColor: isSelected ? 'var(--primary)' : undefined,
                    background: isSelected ? 'var(--primary-glow)' : undefined,
                  }}
                >
                  <div className="duration" style={{ marginBottom: 'var(--space-xs)' }}>{planLabels[plan]}</div>
                  <div className="price">₹{price.toLocaleString('en-IN')}</div>
                </div>
              );
            })}
          </div>

          {/* Payment Summary */}
          {selectedPlan && (
            <div className="payment-summary" style={{ marginBottom: 'var(--space-lg)' }}>
              <div className="summary-row">
                <span className="label">Plan ({planLabels[selectedPlan]})</span>
                <span>₹{getPlanPrice(selectedPlan).toLocaleString('en-IN')}</span>
              </div>
              {fineAmount > 0 && (
                <div className="summary-row" style={{ color: 'var(--error)' }}>
                  <span className="label" style={{ color: 'var(--error)' }}>Overdue Fine</span>
                  <span>₹{fineAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="summary-row">
                <span className="label">Total Payable</span>
                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ flexDirection: 'column', gap: 'var(--space-md)' }}>
          {checkingDeposit ? (
            <div className="loading" style={{ margin: '0 auto' }}><div className="spinner"></div></div>
          ) : depositStatus && !depositStatus.is_verified ? (
            <div style={{ width: '100%' }}>
              <div style={{
                padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)',
                background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)',
                marginBottom: 'var(--space-md)',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
                  <HiOutlineShieldCheck style={{ fontSize: '1.5rem', color: 'var(--warning)' }} />
                  <h3 style={{ fontWeight: 600, color: 'var(--warning)' }}>Security Deposit Required</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-sm)' }}>
                  Your deposit balance is ₹{depositStatus.deposit_balance.toLocaleString('en-IN')}, but ₹{depositStatus.required_amount.toLocaleString('en-IN')} is required to reactivate.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-sm)', width: '100%' }}>
                <button className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
                <button className="btn btn-primary" style={{ flex: 2 }} onClick={() => navigate('/deposit')}>
                  <HiOutlineShieldCheck /> Pay Deposit to Continue
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 'var(--space-sm)', width: '100%', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={handlePayAndRenew}
                disabled={!selectedPlan || paying}
              >
                {paying ? 'Processing...' : `💳 Pay ₹${totalAmount.toLocaleString('en-IN')} & Renew`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
