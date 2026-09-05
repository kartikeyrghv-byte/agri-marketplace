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
      fetchOrders();
    } catch {
      alert('Failed to update status');
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
      <h2 className="font-serif text-4xl font-semibold text-brown mb-8">Orders for My Products</h2>

      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <p className="text-2xl font-serif font-semibold text-brown">{summary.totalOrders}</p>
            <p className="text-brown/60 text-sm">Total Orders</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <p className="text-2xl font-serif font-semibold text-brown">₹{summary.totalRevenue}</p>
            <p className="text-brown/60 text-sm">Total Revenue</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <p className="text-2xl font-serif font-semibold text-brown">{summary.deliveredOrders}</p>
            <p className="text-brown/60 text-sm">Delivered</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <p className="text-2xl font-serif font-semibold text-brown">{summary.pendingOrders}</p>
            <p className="text-brown/60 text-sm">Pending</p>
          </div>
        </div>
      )}

      {orders.length === 0 ? (
        <p className="text-brown/60">No orders yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-card border border-border rounded-lg p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-brown">{order.product?.name}</h3>
                  <p className="text-brown/60 text-sm">{order.consumer?.name} · {order.consumer?.email}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${statusColors[order.status] || 'bg-brown/10 text-brown/60'}`}>
                  {order.status}
                </span>
              </div>
              <div className="text-sm text-brown/70 space-y-1 mb-4">
                <p>Quantity: {order.quantity} {order.product?.unit}</p>
                <p>Total: <span className="font-semibold text-brown">₹{order.totalPrice}</span></p>
                <p>Delivery Slot: {order.deliverySlot}</p>
              </div>

              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                className="px-3 py-2 rounded-md border border-border bg-cream text-brown text-sm"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FarmerOrders;