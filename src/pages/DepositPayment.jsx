import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { HiOutlineShieldCheck, HiOutlineCurrencyRupee } from 'react-icons/hi';

export default function DepositPayment() {
  const navigate = useNavigate();
  const [depositInfo, setDepositInfo] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    fetchDepositData();
  }, []);

  const fetchDepositData = async () => {
    try {
      const [statusRes, txRes] = await Promise.all([
        api.get('/deposits/status'),
        api.get('/deposits/transactions'),
      ]);
      setDepositInfo(statusRes.data);
      setTransactions(txRes.data.transactions);
    } catch (err) {
      toast.error('Failed to load deposit info');
    } finally {
      setLoading(false);
    }
  };

  const handlePayDeposit = async () => {
    if (!depositInfo) return;
    setPaying(true);

    const amountToPay = depositInfo.required_amount - depositInfo.deposit_balance;
    if (amountToPay <= 0) {
      toast.success('Your deposit is already verified!');
      setPaying(false);
      return;
    }

    try {
      const initRes = await api.post('/payments/create-order', {
        amount: amountToPay,
        currency: 'INR',
        receipt: `deposit_${Date.now()}`,
        payment_type: 'deposit'
      });

      const payu = initRes.data;

      sessionStorage.setItem(`payu_intent_${payu.txnid}`, JSON.stringify({
        type: 'deposit',
        amount: amountToPay,
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

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  const balance = depositInfo?.deposit_balance || 0;
  const required = depositInfo?.required_amount || 2000;
  const isVerified = balance >= required;
  const progress = Math.min((balance / required) * 100, 100);

  const statusBadge = () => {
    if (isVerified) return <span className="badge badge-success">✅ Deposit Verified</span>;
    if (balance > 0) return <span className="badge badge-warning">⚠️ Partial Deposit</span>;
    return <span className="badge badge-warning">⚠️ Deposit Pending</span>;
  };

  const txTypeBadge = (type) => {
    const map = {
      deposit: { cls: 'badge-success', label: '💰 Deposit' },
      deduction: { cls: 'badge-error', label: '📉 Deduction' },
      refund: { cls: 'badge-info', label: '↩️ Refund' },
    };
    const badge = map[type] || { cls: 'badge-info', label: type };
    return <span className={`badge ${badge.cls}`}>{badge.label}</span>;
  };

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>
        Security Deposit
      </h2>

      {/* Deposit Status Card */}
      <div className="card" style={{ maxWidth: 560, marginBottom: 'var(--space-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <div className={`stat-icon ${isVerified ? 'green' : 'amber'}`}>
              <HiOutlineShieldCheck />
            </div>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)' }}>Deposit Status</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>Required: ₹{required.toLocaleString('en-IN')}</p>
            </div>
          </div>
          {statusBadge()}
        </div>

        {/* Balance + Progress */}
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Current Balance</span>
            <span style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)', color: isVerified ? 'var(--success)' : 'var(--warning)' }}>
              ₹{balance.toLocaleString('en-IN')}
            </span>
          </div>
          <div style={{
            width: '100%', height: 8, borderRadius: 4,
            background: 'rgba(255,255,255,0.08)', overflow: 'hidden',
          }}>
            <div style={{
              width: `${progress}%`, height: '100%', borderRadius: 4,
              background: isVerified ? 'var(--success)' : 'linear-gradient(90deg, var(--warning), var(--primary))',
              transition: 'width 0.5s ease',
            }} />
          </div>
        </div>

        {/* Pay Button */}
        {!isVerified && (
          <div>
            <div style={{
              padding: 'var(--space-md)', borderRadius: 'var(--radius-md)',
              background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)',
              marginBottom: 'var(--space-lg)', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)',
            }}>
              ⚠️ A refundable security deposit of ₹{required.toLocaleString('en-IN')} is required before renting a bike.
              Please complete the deposit payment to continue.
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handlePayDeposit} disabled={paying}>
              {paying ? 'Processing...' : (
                <>
                  <HiOutlineCurrencyRupee /> Pay ₹{(required - balance).toLocaleString('en-IN')} Deposit
                </>
              )}
            </button>
          </div>
        )}

        {isVerified && (
          <div style={{
            padding: 'var(--space-md)', borderRadius: 'var(--radius-md)',
            background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)',
            fontSize: 'var(--font-size-sm)', color: 'var(--success)', textAlign: 'center',
          }}>
            ✅ Your deposit is verified. You can rent bikes anytime!
          </div>
        )}
      </div>

      {/* Transaction History */}
      <div className="card">
        <h3 style={{ fontWeight: 600, marginBottom: 'var(--space-lg)' }}>Deposit Transactions</h3>

        {transactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No transactions yet</h3>
            <p>Your deposit transaction history will appear here.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{new Date(tx.created_at).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}</td>
                    <td>{txTypeBadge(tx.transaction_type)}</td>
                    <td style={{
                      fontWeight: 600,
                      color: tx.amount > 0 ? 'var(--success)' : 'var(--error)',
                    }}>
                      {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString('en-IN')}
                    </td>
                    <td><span className="badge badge-success">{tx.payment_status}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
                      {tx.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
