import { useState, useEffect } from 'react';
import API from '../services/api';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewData, setReviewData] = useState({});

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
    } catch {
      setError('Something went wrong fetching orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleReviewChange = (orderId, field, value) => {
    setReviewData({
      ...reviewData,
      [orderId]: { ...reviewData[orderId], [field]: value }
    });
  };

  const submitReview = async (order) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const data = reviewData[order._id];
    if (!data || !data.rating) {
      alert('Please select a rating');
      return;
    }

    try {
      await API.post('/reviews', {
        consumer: user.id,
        product: order.product._id,
        farmer: order.farmer._id,
        rating: data.rating,
        comment: data.comment || ''
      });
      alert('Review submitted!');
      setReviewData({ ...reviewData, [order._id]: { submitted: true } });
    } catch {
      alert('Failed to submit review');
    }
  };

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
            <p><strong>Delivery Slot:</strong> {order.deliverySlot}</p>
            <p><strong>Status:</strong> {order.status}</p>

            {order.status === 'delivered' && !reviewData[order._id]?.submitted && (
              <div style={{ marginTop: '10px', borderTop: '1px solid #444', paddingTop: '10px' }}>
                <p><strong>Rate this order:</strong></p>
                <select
                  value={reviewData[order._id]?.rating || ''}
                  onChange={(e) => handleReviewChange(order._id, 'rating', Number(e.target.value))}
                  style={{ padding: '6px', marginBottom: '8px' }}
                >
                  <option value="">Select Rating</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
                <textarea
                  placeholder="Write a comment (optional)"
                  value={reviewData[order._id]?.comment || ''}
                  onChange={(e) => handleReviewChange(order._id, 'comment', e.target.value)}
                  style={{ display: 'block', width: '100%', padding: '6px', marginBottom: '8px' }}
                />
                <button onClick={() => submitReview(order)} style={{ padding: '6px 12px' }}>
                  Submit Review
                </button>
              </div>
            )}
            {reviewData[order._id]?.submitted && (
              <p style={{ color: 'green', marginTop: '10px' }}>✅ Review submitted</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default MyOrders;