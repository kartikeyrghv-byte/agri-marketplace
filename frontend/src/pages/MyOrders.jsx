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

  const statusColors = {
    pending: 'bg-terracotta/10 text-terracotta-dark',
    confirmed: 'bg-olive/10 text-olive-dark',
    shipped: 'bg-olive/10 text-olive-dark',
    delivered: 'bg-olive text-cream',
    cancelled: 'bg-brown/10 text-brown/60'
  };

  if (loading) return <p className="text-brown/60 text-center py-16">Loading orders...</p>;
  if (error) return <p className="text-terracotta text-center py-16">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h2 className="font-serif text-4xl font-semibold text-brown mb-8">My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-brown/60">You haven't placed any orders yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-card border border-border rounded-lg p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-brown">{order.product?.name}</h3>
                  <p className="text-brown/60 text-sm">from {order.farmer?.name}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${statusColors[order.status] || 'bg-brown/10 text-brown/60'}`}>
                  {order.status}
                </span>
              </div>
              <div className="text-sm text-brown/70 space-y-1">
                <p>Quantity: {order.quantity} {order.product?.unit}</p>
                <p>Total: <span className="font-semibold text-brown">₹{order.totalPrice}</span></p>
                <p>Delivery Slot: {order.deliverySlot}</p>
              </div>

              {order.status === 'delivered' && !reviewData[order._id]?.submitted && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm font-medium text-brown mb-2">Rate this order</p>
                  <select
                    value={reviewData[order._id]?.rating || ''}
                    onChange={(e) => handleReviewChange(order._id, 'rating', Number(e.target.value))}
                    className="px-3 py-2 rounded-md border border-border bg-cream text-brown text-sm mb-2 w-full"
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
                    rows="2"
                    className="w-full px-3 py-2 rounded-md border border-border bg-cream text-brown text-sm mb-2"
                  />
                  <button
                    onClick={() => submitReview(order)}
                    className="bg-olive hover:bg-olive-dark text-cream px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Submit Review
                  </button>
                </div>
              )}
              {reviewData[order._id]?.submitted && (
                <p className="text-olive-dark text-sm mt-4 pt-4 border-t border-border font-medium">✓ Review submitted</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;