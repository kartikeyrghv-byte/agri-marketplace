import { useState, useEffect } from 'react';
import API from '../services/api';

function FarmerOrders() {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    setError('Please login as a farmer to see your orders.');
    setLoading(false);
    return;
  }

  try {
    const [ordersRes, summaryRes] = await Promise.all([
      API.get(`/orders/farmer/${user.id}`),
      API.get(`/orders/farmer/${user.id}/summary`)
    ]);
    setOrders(ordersRes.data);
    setSummary(summaryRes.data);
  } catch {
    setError('Something went wrong fetching orders.');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders(); // refresh list after update
    } catch {
      alert('Failed to update status');
    }
  };

  if (loading) return <p style={{ textAlign: 'center' }}>Loading orders...</p>;
  if (error) return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '700px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>Orders for My Products</h2>
      {summary && (
  <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '12px', flex: '1', minWidth: '120px', textAlign: 'center' }}>
      <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{summary.totalOrders}</p>
      <p>Total Orders</p>
    </div>
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '12px', flex: '1', minWidth: '120px', textAlign: 'center' }}>
      <p style={{ fontSize: '20px', fontWeight: 'bold' }}>₹{summary.totalRevenue}</p>
      <p>Total Revenue</p>
    </div>
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '12px', flex: '1', minWidth: '120px', textAlign: 'center' }}>
      <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{summary.deliveredOrders}</p>
      <p>Delivered</p>
    </div>
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '12px', flex: '1', minWidth: '120px', textAlign: 'center' }}>
      <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{summary.pendingOrders}</p>
      <p>Pending</p>
    </div>
  </div>
)}
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '10px'
            }}
          >
            <p><strong>Product:</strong> {order.product?.name}</p>
            <p><strong>Consumer:</strong> {order.consumer?.name} ({order.consumer?.email})</p>
            <p><strong>Quantity:</strong> {order.quantity} {order.product?.unit}</p>
            <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>
            <p><strong>Delivery Slot:</strong> {order.deliverySlot}</p>
            <p><strong>Status:</strong> {order.status}</p>

            <select
              value={order.status}
              onChange={(e) => handleStatusChange(order._id, e.target.value)}
              style={{ padding: '6px', marginTop: '5px' }}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        ))
      )}
    </div>
  );
}

export default FarmerOrders;