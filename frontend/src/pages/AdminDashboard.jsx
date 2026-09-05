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

  const tabs = [
    { key: 'farmers', label: `Farmers (${farmers.length})` },
    { key: 'products', label: `Products (${products.length})` },
    { key: 'orders', label: `Orders (${orders.length})` },
    { key: 'categories', label: `Categories (${categories.length})` },
    { key: 'commission', label: 'Commission' },
    { key: 'analytics', label: 'Analytics' }
  ];

  const statCard = (value, label) => (
    <div className="bg-card border border-border rounded-lg p-4 text-center flex-1 min-w-[140px]">
      <p className="text-xl font-serif font-semibold text-brown">{value}</p>
      <p className="text-brown/60 text-sm">{label}</p>
    </div>
  );

  if (loading) return <p className="text-brown/60 text-center py-16">Loading admin data...</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h2 className="font-serif text-4xl font-semibold text-brown mb-8">Admin Dashboard</h2>

      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-olive text-cream'
                : 'bg-card border border-border text-brown hover:border-olive/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'farmers' && (
        <div>
          <h3 className="font-serif text-2xl font-semibold text-brown mb-4">Farmer Registrations</h3>
          {farmers.length === 0 ? (
            <p className="text-brown/60">No farmers registered yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {farmers.map((farmer) => (
                <div key={farmer._id} className="bg-card border border-border rounded-lg p-4 flex justify-between items-center flex-wrap gap-3">
                  <div>
                    <p className="font-medium text-brown">{farmer.name}</p>
                    <p className="text-brown/60 text-sm">{farmer.email}</p>
                    <span className={`inline-block mt-1 text-xs px-2 py-1 rounded-full font-medium ${farmer.isVerified ? 'bg-olive/10 text-olive-dark' : 'bg-terracotta/10 text-terracotta-dark'}`}>
                      {farmer.isVerified ? 'Verified' : 'Pending Approval'}
                    </span>
                  </div>
                  {!farmer.isVerified && (
                    <button
                      onClick={() => handleApprove(farmer._id)}
                      className="bg-olive hover:bg-olive-dark text-cream px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Approve
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'products' && (
        <div>
          <h3 className="font-serif text-2xl font-semibold text-brown mb-4">All Products</h3>
          {products.length === 0 ? (
            <p className="text-brown/60">No products listed yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {products.map((product) => (
                <div key={product._id} className="bg-card border border-border rounded-lg p-4 flex justify-between items-center flex-wrap gap-3">
                  <div>
                    <p className="font-medium text-brown">{product.name}</p>
                    <p className="text-brown/60 text-sm">{product.category} · ₹{product.price} / {product.unit} · by {product.farmer?.name}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="text-terracotta hover:text-terracotta-dark text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          <h3 className="font-serif text-2xl font-semibold text-brown mb-4">All Orders</h3>
          {orders.length === 0 ? (
            <p className="text-brown/60">No orders placed yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {orders.map((order) => (
                <div key={order._id} className="bg-card border border-border rounded-lg p-4">
                  <p className="font-medium text-brown">{order.product?.name}</p>
                  <p className="text-brown/60 text-sm">{order.consumer?.name} → {order.farmer?.name} · ₹{order.totalPrice} · {order.status}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'categories' && (
        <div>
          <h3 className="font-serif text-2xl font-semibold text-brown mb-4">Manage Categories</h3>
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="New category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-md border border-border bg-card text-brown placeholder:text-brown/40 focus:outline-none focus:border-olive"
            />
            <button
              onClick={handleAddCategory}
              className="bg-olive hover:bg-olive-dark text-cream px-5 py-2.5 rounded-md text-sm font-medium transition-colors"
            >
              Add
            </button>
          </div>
          {categories.length === 0 ? (
            <p className="text-brown/60">No categories yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <div key={cat._id} className="bg-card border border-border rounded-lg p-3 flex justify-between items-center">
                  <span className="text-brown">{cat.name}</span>
                  <button
                    onClick={() => handleDeleteCategory(cat._id)}
                    className="text-terracotta hover:text-terracotta-dark text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'commission' && commission && (
        <div>
          <h3 className="font-serif text-2xl font-semibold text-brown mb-4">Platform Commission Summary</h3>
          <div className="flex flex-wrap gap-3">
            {statCard(commission.totalOrders, 'Total Orders')}
            {statCard(`₹${commission.totalSales}`, 'Total Sales')}
            {statCard(`₹${commission.totalCommission}`, `Platform Commission (${commission.commissionRate}%)`)}
            {statCard(`₹${commission.farmerEarnings}`, 'Farmer Earnings')}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && analytics && (
        <div>
          <h3 className="font-serif text-2xl font-semibold text-brown mb-4">Platform Analytics</h3>
          <div className="flex flex-wrap gap-3 mb-8">
            {statCard(analytics.totalFarmers, 'Total Farmers')}
            {statCard(analytics.verifiedFarmers, 'Verified Farmers')}
            {statCard(analytics.totalConsumers, 'Total Consumers')}
            {statCard(analytics.totalProducts, 'Total Products')}
            {statCard(analytics.organicProducts, 'Organic Products')}
            {statCard(analytics.totalOrders, 'Total Orders')}
          </div>

          <h4 className="font-serif text-lg font-semibold text-brown mb-2">Order Status Breakdown</h4>
          <div className="flex flex-col gap-1 mb-8">
            {analytics.statusCounts.map((s) => (
              <p key={s._id} className="text-brown/70 text-sm capitalize">{s._id}: <span className="font-medium text-brown">{s.count}</span></p>
            ))}
          </div>

          <h4 className="font-serif text-lg font-semibold text-brown mb-2">Top Ordered Products</h4>
          {analytics.topProducts.length === 0 ? (
            <p className="text-brown/60">No orders yet.</p>
          ) : (
            <div className="flex flex-col gap-1">
              {analytics.topProducts.map((p, index) => (
                <p key={index} className="text-brown/70 text-sm">{p.name}: <span className="font-medium text-brown">{p.totalOrdered} units ordered</span></p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;