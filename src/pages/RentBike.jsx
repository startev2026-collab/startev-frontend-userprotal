import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { HiOutlineLocationMarker, HiOutlineLightningBolt, HiOutlineShieldCheck } from 'react-icons/hi';

export default function RentBike() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=store, 2=bike, 3=plan, 4=payment
  const [stores, setStores] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedBike, setSelectedBike] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [depositStatus, setDepositStatus] = useState(null);
  const [checkingDeposit, setCheckingDeposit] = useState(false);
  const [hasActiveRental, setHasActiveRental] = useState(false);
  const [checkingRental, setCheckingRental] = useState(true);

  useEffect(() => {
    checkActiveRental();
  }, []);

  const checkActiveRental = async () => {
    try {
      const res = await api.get('/users/dashboard');
      if (res.data.active_rentals?.length > 0 || res.data.expired_rentals?.length > 0) {
        setHasActiveRental(true);
        toast.error('Please return your currently rented bike before renting another bike.');
      } else {
        fetchStores();
      }
    } catch (err) {
      // If we can't verify, allow them to proceed — backend will catch it
      fetchStores();
    } finally {
      setCheckingRental(false);
    }
  };

  const fetchStores = async () => {
    try {
      const res = await api.get('/stores');
      setStores(res.data.stores);
    } catch (err) {
      toast.error('Failed to load stores');
    }
  };

  const fetchBikes = async (storeId) => {
    setLoading(true);
    try {
      const res = await api.get(`/bikes?store_id=${storeId}&status=available`);
      setBikes(res.data.bikes);
    } catch (err) {
      toast.error('Failed to load bikes');
    } finally {
      setLoading(false);
    }
  };

  const handleStoreSelect = (store) => {
    setSelectedStore(store);
    setSelectedBike(null);
    setSelectedPlan(null);
    fetchBikes(store.store_id);
    setStep(2);
  };

  const handleBikeSelect = (bike) => {
    setSelectedBike(bike);
    setSelectedPlan(null);
    setStep(3);
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setStep(4);
    checkDepositStatus();
  };

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

  const getAmount = () => {
    if (!selectedBike || !selectedPlan) return 0;
    const key = `${selectedPlan}_price`;
    return parseFloat(selectedBike[key]);
  };

  const handlePayment = async () => {
    setPaying(true);
    try {
      const amount = getAmount();
      // Initiate payment
      const initRes = await api.post('/payments/create-order', {
        amount: amount,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        payment_type: 'rental'
      });

      if (!window.Cashfree) {
        toast.error('Payment gateway SDK not loaded');
        setPaying(false);
        return;
      }

      const cashfree = window.Cashfree({
        mode: import.meta.env.VITE_CASHFREE_ENV || 'sandbox'
      });

      cashfree.checkout({
        paymentSessionId: initRes.data.payment_session_id,
        redirectTarget: '_modal'
      }).then(async (result) => {
        if (result.error) {
          toast.error(result.error.message || 'Payment failed or cancelled');
          return;
        }

        try {
          // Verify payment
          const verifyRes = await api.post('/payments/verify-payment', {
            order_id: initRes.data.order_id
          });

          // Create rental
          await api.post('/rentals', {
            bike_id: selectedBike.id,
            store_id: selectedStore.store_id,
            rental_plan: selectedPlan,
            payment_method: 'online',
            transaction_id: verifyRes.data.transaction_id,
          });

          toast.success('🎉 Bike rented successfully!');
          navigate('/dashboard');
        } catch (err) {
          toast.error(err.response?.data?.error || 'Payment verification failed');
        }
      });
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.has_active_rental) {
        toast.error('Please return your currently rented bike before renting another bike.');
        navigate('/dashboard');
        return;
      }
      toast.error(errorData?.error || 'Failed to initiate payment');
    } finally {
      setPaying(false);
    }
  };

  const planLabels = { daily: '1 Day', weekly: '7 Days', monthly: '30 Days' };

  if (checkingRental) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (hasActiveRental) {
    return (
      <div className="fade-in">
        <div className="card" style={{
          maxWidth: 520,
          margin: '0 auto',
          textAlign: 'center',
          padding: 'var(--space-2xl)',
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-lg)' }}>🚫</div>
          <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-md)', color: 'var(--error)' }}>
            Active Rental Found
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)', lineHeight: 1.6 }}>
            Please return your currently rented bike before renting another bike.
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/dashboard')}>
            ← Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Progress Steps */}
      <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-2xl)', flexWrap: 'wrap' }}>
        {['Select Store', 'Choose Bike', 'Pick Plan', 'Payment'].map((label, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.875rem', fontWeight: 600,
              background: step > i + 1 ? 'var(--success)' : step === i + 1 ? 'var(--primary)' : 'var(--bg-card)',
              color: step >= i + 1 ? 'white' : 'var(--text-muted)',
            }}>{step > i + 1 ? '✓' : i + 1}</div>
            <span style={{
              fontSize: '0.875rem', fontWeight: step === i + 1 ? 600 : 400,
              color: step === i + 1 ? 'var(--text-primary)' : 'var(--text-muted)',
            }}>{label}</span>
            {i < 3 && <div style={{ width: 24, height: 2, background: step > i + 1 ? 'var(--success)' : 'var(--border)' }} />}
          </div>
        ))}
      </div>

      {/* Step 1: Store Selection */}
      {step === 1 && (
        <div>
          <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>
            Select a Store
          </h2>
          <div className="card-grid">
            {stores.map((store) => (
              <div className="card" key={store.id} onClick={() => handleStoreSelect(store)}
                style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                  <div className="stat-icon purple"><HiOutlineLocationMarker /></div>
                  <div>
                    <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 600 }}>{store.store_name}</h3>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>ID: {store.store_id}</p>
                  </div>
                </div>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>{store.address}</p>
                {store.contact_number && (
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-sm)' }}>
                    📞 {store.contact_number}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Bike Selection */}
      {step === 2 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
            <div>
              <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600 }}>Choose a Bike</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                {selectedStore?.store_name} — {bikes.length} available
              </p>
            </div>
            <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
          </div>

          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : bikes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏍️</div>
              <h3>No bikes available</h3>
              <p>All bikes at this store are currently rented. Try another store.</p>
              <button className="btn btn-primary" onClick={() => setStep(1)}>Select Another Store</button>
            </div>
          ) : (
            <div className="card-grid">
              {bikes.map((bike) => (
                <div className="bike-card" key={bike.id} onClick={() => handleBikeSelect(bike)} style={{ cursor: 'pointer' }}>
                  <div className="bike-card-image">
                    {bike.image_url ? <img src={bike.image_url} alt={bike.bike_model} /> : <HiOutlineLightningBolt />}
                  </div>
                  <div className="bike-card-body">
                    <h3>{bike.bike_model}</h3>
                    <div className="bike-meta">
                      <span>#{bike.bike_number}</span>
                      <span>•</span>
                      <span>{bike.bike_type || 'Electric'}</span>
                    </div>
                    <div className="bike-card-pricing">
                      <div className="price-option">
                        <div className="price">₹{bike.daily_price}</div>
                        <div className="duration">/ day</div>
                      </div>
                      <div className="price-option">
                        <div className="price">₹{bike.weekly_price}</div>
                        <div className="duration">/ week</div>
                      </div>
                      <div className="price-option">
                        <div className="price">₹{bike.monthly_price}</div>
                        <div className="duration">/ month</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Plan Selection */}
      {step === 3 && selectedBike && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600 }}>Select Rental Plan</h2>
            <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back</button>
          </div>

          <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
            <h3 style={{ fontWeight: 600 }}>{selectedBike.bike_model}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              #{selectedBike.bike_number} • {selectedStore?.store_name}
            </p>
          </div>

          <div className="card-grid">
            {['daily', 'weekly', 'monthly'].map((plan) => {
              const price = parseFloat(selectedBike[`${plan}_price`]);
              return (
                <div className={`card ${selectedPlan === plan ? '' : ''}`} key={plan}
                  onClick={() => handlePlanSelect(plan)}
                  style={{
                    cursor: 'pointer',
                    borderColor: selectedPlan === plan ? 'var(--primary)' : undefined,
                    background: selectedPlan === plan ? 'rgba(99, 102, 241, 0.1)' : undefined,
                  }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-md)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {planLabels[plan]}
                    </p>
                    <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, color: 'var(--primary-light)' }}>
                      ₹{price.toLocaleString('en-IN')}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-sm)' }}>
                      {plan === 'daily' ? 'per day' : plan === 'weekly' ? 'for 7 days' : 'for 30 days'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 4: Payment */}
      {step === 4 && selectedBike && selectedPlan && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600 }}>Payment Summary</h2>
            <button className="btn btn-ghost" onClick={() => setStep(3)}>← Back</button>
          </div>

          <div style={{ maxWidth: 520 }}>
            <div className="payment-summary" style={{ marginBottom: 'var(--space-xl)' }}>
              <div className="summary-row">
                <span className="label">Bike</span>
                <span>{selectedBike.bike_model}</span>
              </div>
              <div className="summary-row">
                <span className="label">Bike Number</span>
                <span>{selectedBike.bike_number}</span>
              </div>
              <div className="summary-row">
                <span className="label">Store</span>
                <span>{selectedStore?.store_name}</span>
              </div>
              <div className="summary-row">
                <span className="label">Rental Plan</span>
                <span style={{ textTransform: 'capitalize' }}>{planLabels[selectedPlan]}</span>
              </div>
              <div className="summary-row">
                <span className="label">Total Amount</span>
                <span>₹{getAmount().toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Deposit Check */}
            {checkingDeposit ? (
              <div className="loading"><div className="spinner"></div></div>
            ) : depositStatus && !depositStatus.is_verified ? (
              <div>
                <div style={{
                  padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)',
                  background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)',
                  marginBottom: 'var(--space-lg)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                    <HiOutlineShieldCheck style={{ fontSize: '1.5rem', color: 'var(--warning)' }} />
                    <h3 style={{ fontWeight: 600, color: 'var(--warning)' }}>⚠️ Security Deposit Required</h3>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-md)' }}>
                    A refundable security deposit of ₹{depositStatus.required_amount.toLocaleString('en-IN')} is required before renting a bike. 
                    Please complete the deposit payment to continue.
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
                    Current deposit: <strong>₹{depositStatus.deposit_balance.toLocaleString('en-IN')}</strong>
                  </p>
                </div>
                <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => navigate('/deposit')}>
                  <HiOutlineShieldCheck /> Pay Deposit to Continue
                </button>
              </div>
            ) : (
              <>
                <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handlePayment} disabled={paying}>
                  {paying ? (
                    <>Processing Payment...</>
                  ) : (
                    <>💳 Pay ₹{getAmount().toLocaleString('en-IN')} & Confirm</>
                  )}
                </button>

                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)', marginTop: 'var(--space-md)' }}>
                  🔒 Secure payment powered by our payment gateway
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
