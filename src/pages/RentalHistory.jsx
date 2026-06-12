import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function RentalHistory() {
  const [rentals, setRentals] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRentals();
  }, [filter]);

  const fetchRentals = async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? `?status=${filter}` : '';
      const res = await api.get(`/users/rentals${params}`);
      setRentals(res.data.rentals);
    } catch (err) {
      toast.error('Failed to load rentals');
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (status) => {
    const map = { active: 'badge-success', expired: 'badge-error', returned: 'badge-info' };
    return <span className={`badge ${map[status] || 'badge-info'}`}>{status}</span>;
  };

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>
        Rental History
      </h2>

      <div className="tabs">
        {['all', 'active', 'returned', 'expired'].map((f) => (
          <button key={f} className={`tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)} style={{ textTransform: 'capitalize' }}>{f}</button>
        ))}
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : rentals.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No rentals found</h3>
          <p>You haven't rented any bikes yet.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Bike</th>
                <th>Store</th>
                <th>Plan</th>
                <th>Start</th>
                <th>Expiry</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map((rental) => (
                <tr key={rental.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{rental.bikes?.bike_model}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                      #{rental.bikes?.bike_number}
                    </div>
                  </td>
                  <td>{rental.stores?.store_name || rental.store_id}</td>
                  <td style={{ textTransform: 'capitalize' }}>{rental.rental_plan}</td>
                  <td>{new Date(rental.start_date).toLocaleDateString('en-IN')}</td>
                  <td>{new Date(rental.expiry_date).toLocaleDateString('en-IN')}</td>
                  <td style={{ fontWeight: 600 }}>₹{parseFloat(rental.amount).toLocaleString('en-IN')}</td>
                  <td>{statusBadge(rental.rental_status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
