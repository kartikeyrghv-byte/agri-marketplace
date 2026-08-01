import { useState, useEffect } from 'react';
import API from '../services/api';

function AdminDashboard() {
  const [farmers, setFarmers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('farmers');

  const fetchData = async () => {
    try {
      const [farmersRes, productsRes, ordersRes] = await Promise.all([
        API.get('/admin/farmers'),
        API.get('/admin/products'),
        API.get('/admin/orders')
      ]);
      setFarmers(farmersRes.data);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (farmerId) => {
    try {
      await API.put(`/admin/farmers/${farmerId}/approve`);
      fetchData();
    } catch {
      alert('Failed to approve farmer');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/admin/products/${productId}`);
      fetchData();
    } catch {
      alert('Failed to delete product');
    }
  };

  if (loading) return <p style={{ textAlign: 'center' }}>Loading admin data...</p>;

  return (
    <div style={{ maxWidth: '900px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>Admin Dashboard</h2>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('farmers')}>Farmers ({farmers.length})</button>
        <button onClick={() => setActiveTab('products')}>Products ({products.length})</button>
        <button onClick={() => setActiveTab('orders')}>Orders ({orders.length})</button>
      </div>

      {activeTab === 'farmers' && (
        <div>
          <h3>Farmer Registrations</h3>
          {farmers.length === 0 ? (
            <p>No farmers registered yet.</p>
          ) : (
            farmers.map((farmer) => (
              <div key={farmer._id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '12px', marginBottom: '10px' }}>
                <p><strong>Name:</strong> {farmer.name}</p>
                <p><strong>Email:</strong> {farmer.email}</p>
                <p><strong>Status:</strong> {farmer.isVerified ? '✅ Verified' : '⏳ Pending Approval'}</p>
                {!farmer.isVerified && (
                  <button onClick={() => handleApprove(farmer._id)}>Approve</button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'products' && (
        <div>
          <h3>All Products</h3>
          {products.length === 0 ? (
            <p>No products listed yet.</p>
          ) : (
            products.map((product) => (
              <div key={product._id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '12px', marginBottom: '10px' }}>
                <p><strong>Name:</strong> {product.name}</p>
                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>Price:</strong> ₹{product.price} / {product.unit}</p>
                <p><strong>Farmer:</strong> {product.farmer?.name}</p>
                <button onClick={() => handleDeleteProduct(product._id)} style={{ color: 'red' }}>
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          <h3>All Orders</h3>
          {orders.length === 0 ? (
            <p>No orders placed yet.</p>
          ) : (
            orders.map((order) => (
              <div key={order._id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '12px', marginBottom: '10px' }}>
                <p><strong>Product:</strong> {order.product?.name}</p>
                <p><strong>Consumer:</strong> {order.consumer?.name}</p>
                <p><strong>Farmer:</strong> {order.farmer?.name}</p>
                <p><strong>Total:</strong> ₹{order.totalPrice}</p>
                <p><strong>Status:</strong> {order.status}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;