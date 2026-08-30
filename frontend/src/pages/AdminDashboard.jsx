import { useState, useEffect } from 'react';
import API from '../services/api';

function AdminDashboard() {
  const [farmers, setFarmers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
const [newCategory, setNewCategory] = useState('');
const [commission, setCommission] = useState(null);
const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('farmers');

  const fetchData = async () => {
  try {
    const [farmersRes, productsRes, ordersRes, categoriesRes, commissionRes, analyticsRes] = await Promise.all([
      API.get('/admin/farmers'),
      API.get('/admin/products'),
      API.get('/admin/orders'),
      API.get('/admin/categories'),
      API.get('/admin/commission'),
      API.get('/admin/analytics')
    ]);
    setFarmers(farmersRes.data);
    setProducts(productsRes.data);
    setOrders(ordersRes.data);
    setCategories(categoriesRes.data);
    setCommission(commissionRes.data);
    setAnalytics(analyticsRes.data);
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

  const handleAddCategory = async () => {
  if (!newCategory.trim()) return;
  try {
    await API.post('/admin/categories', { name: newCategory });
    setNewCategory('');
    fetchData();
  } catch {
    alert('Failed to add category');
  }
};

const handleDeleteCategory = async (categoryId) => {
  try {
    await API.delete(`/admin/categories/${categoryId}`);
    fetchData();
  } catch {
    alert('Failed to delete category');
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
        <button onClick={() => setActiveTab('categories')}>Categories ({categories.length})</button>
        <button onClick={() => setActiveTab('commission')}>Commission</button>
        <button onClick={() => setActiveTab('analytics')}>Analytics</button>
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

      {activeTab === 'categories' && (
  <div>
    <h3>Manage Categories</h3>
    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
      <input
        type="text"
        placeholder="New category name"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        style={{ padding: '8px', flex: '1' }}
      />
      <button onClick={handleAddCategory}>Add</button>
    </div>
    {categories.length === 0 ? (
      <p>No categories yet.</p>
    ) : (
      categories.map((cat) => (
        <div key={cat._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #ccc', borderRadius: '8px', padding: '10px', marginBottom: '8px' }}>
          <span>{cat.name}</span>
          <button onClick={() => handleDeleteCategory(cat._id)} style={{ color: 'red' }}>Delete</button>
        </div>
      ))
    )}
  </div>
)}

{activeTab === 'commission' && commission && (
  <div>
    <h3>Platform Commission Summary</h3>
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '12px', flex: '1', minWidth: '150px', textAlign: 'center' }}>
        <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{commission.totalOrders}</p>
        <p>Total Orders</p>
      </div>
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '12px', flex: '1', minWidth: '150px', textAlign: 'center' }}>
        <p style={{ fontSize: '20px', fontWeight: 'bold' }}>₹{commission.totalSales}</p>
        <p>Total Sales</p>
      </div>
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '12px', flex: '1', minWidth: '150px', textAlign: 'center' }}>
        <p style={{ fontSize: '20px', fontWeight: 'bold' }}>₹{commission.totalCommission}</p>
        <p>Platform Commission ({commission.commissionRate}%)</p>
      </div>
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '12px', flex: '1', minWidth: '150px', textAlign: 'center' }}>
        <p style={{ fontSize: '20px', fontWeight: 'bold' }}>₹{commission.farmerEarnings}</p>
        <p>Farmer Earnings</p>
      </div>
    </div>
  </div>
)}

{activeTab === 'analytics' && analytics && (
  <div>
    <h3>Platform Analytics</h3>
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '12px', flex: '1', minWidth: '140px', textAlign: 'center' }}>
        <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{analytics.totalFarmers}</p>
        <p>Total Farmers</p>
      </div>
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '12px', flex: '1', minWidth: '140px', textAlign: 'center' }}>
        <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{analytics.verifiedFarmers}</p>
        <p>Verified Farmers</p>
      </div>
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '12px', flex: '1', minWidth: '140px', textAlign: 'center' }}>
        <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{analytics.totalConsumers}</p>
        <p>Total Consumers</p>
      </div>
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '12px', flex: '1', minWidth: '140px', textAlign: 'center' }}>
        <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{analytics.totalProducts}</p>
        <p>Total Products</p>
      </div>
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '12px', flex: '1', minWidth: '140px', textAlign: 'center' }}>
        <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{analytics.organicProducts}</p>
        <p>Organic Products</p>
      </div>
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '12px', flex: '1', minWidth: '140px', textAlign: 'center' }}>
        <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{analytics.totalOrders}</p>
        <p>Total Orders</p>
      </div>
    </div>

    <h4>Order Status Breakdown</h4>
    {analytics.statusCounts.map((s) => (
      <p key={s._id}>{s._id}: {s.count}</p>
    ))}

    <h4 style={{ marginTop: '20px' }}>Top Ordered Products</h4>
    {analytics.topProducts.length === 0 ? (
      <p>No orders yet.</p>
    ) : (
      analytics.topProducts.map((p, index) => (
        <p key={index}>{p.name}: {p.totalOrdered} units ordered</p>
      ))
    )}
  </div>
)}

    </div>
  );
}

export default AdminDashboard;