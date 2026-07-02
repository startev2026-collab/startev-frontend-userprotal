import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const statusParam = searchParams.get('status');
    const txnid = searchParams.get('txnid');

    if (!statusParam || !txnid) {
      setStatus('error');
      setMessage('Invalid payment response');
      return;
    }

    if (statusParam !== 'success') {
      setStatus('failed');
      setMessage('Payment was not completed. Please try again.');
      return;
    }

    handleSuccess();
  }, []);

  const handleSuccess = async () => {
    const txnid = searchParams.get('txnid');
    const amount = searchParams.get('amount');
    const hash = searchParams.get('hash');
    const paymentType = searchParams.get('payment_type');
    const productinfo = searchParams.get('productinfo');
    const firstname = searchParams.get('firstname');
    const email = searchParams.get('email');
    const udf1 = searchParams.get('udf1');
    const udf2 = searchParams.get('udf2');
    const udf3 = searchParams.get('udf3');
    const udf4 = searchParams.get('udf4');
    const udf5 = searchParams.get('udf5');

    try {
      const verifyRes = await api.post('/payments/verify-payment', {
        txnid, status: 'success', hash, amount,
        productinfo, firstname, email,
        udf1, udf2, udf3, udf4, udf5,
      });

      if (!verifyRes.data.verified) {
        setStatus('failed');
        setMessage('Payment verification failed');
        return;
      }

      const intentKey = `payu_intent_${txnid}`;
      const stored = sessionStorage.getItem(intentKey);
      const intent = stored ? JSON.parse(stored) : null;

      if (!intent) {
        setStatus('success');
        setMessage('Payment successful! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 2000);
        return;
      }

      sessionStorage.removeItem(intentKey);

      const transactionId = txnid;

      if (intent.type === 'rental') {
        await api.post('/rentals', {
          bike_id: intent.bike_id,
          store_id: intent.store_id,
          rental_plan: intent.rental_plan,
          payment_method: 'online',
          transaction_id: transactionId,
        });
        toast.success('Bike rented successfully!');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else if (intent.type === 'deposit') {
        await api.post('/deposits/pay', {
          amount: intent.amount,
          transaction_id: transactionId,
        });
        toast.success('Deposit paid successfully!');
        setTimeout(() => navigate('/deposit'), 1000);
      } else if (intent.type === 'renewal') {
        await api.post(`/rentals/${intent.rental_id}/renew`, {
          rental_plan: intent.rental_plan,
          payment_method: 'online',
          transaction_id: transactionId,
          start_date: new Date().toISOString(),
        });
        toast.success('Rental renewed successfully!');
        setTimeout(() => navigate('/dashboard'), 1000);
      }

      setStatus('success');
      setMessage('Payment completed successfully!');
    } catch (err) {
      setStatus('failed');
      setMessage(err.response?.data?.error || 'Payment processing failed');
    }
  };

  const getStatusDisplay = () => {
    switch (status) {
      case 'processing':
        return {
          icon: '⏳',
          title: 'Processing Payment...',
          desc: 'Please wait while we verify your payment.',
        };
      case 'success':
        return {
          icon: '✅',
          title: 'Payment Successful!',
          desc: message,
        };
      case 'failed':
        return {
          icon: '❌',
          title: 'Payment Failed',
          desc: message,
        };
      default:
        return {
          icon: '⚠️',
          title: 'Something went wrong',
          desc: message,
        };
    }
  };

  const display = getStatusDisplay();

  return (
    <div className="fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="card" style={{ maxWidth: 480, width: '100%', textAlign: 'center', padding: 'var(--space-2xl)' }}>
        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-lg)' }}>{display.icon}</div>
        <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
          {display.title}
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
          {display.desc}
        </p>
        {status === 'processing' && <div className="spinner" />}
        {status !== 'processing' && (
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </button>
        )}
      </div>
    </div>
  );
}
