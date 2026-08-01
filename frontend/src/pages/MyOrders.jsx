import { useState, useEffect } from 'react';
import API from '../services/api';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        setError('Please login to see your orders.');
        setLoading(false);
        return;
      }

      try {
        const res = await API.get(`/orders/consumer/${user.id}`);
        setOrders(res.data);
      } catch{
        setError('Something went wrong fetching orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p style={{ textAlign: 'center' }}>Loading orders...</p>;
  if (error) return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '700px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
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
            <p><strong>Farmer:</strong> {order.farmer?.name}</p>
            <p><strong>Quantity:</strong> {order.quantity} {order.product?.unit}</p>
            <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>
            <p><strong>Status:</strong> {order.status}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default MyOrders;