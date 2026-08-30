import { useState, useEffect } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [category, setCategory] = useState('');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [slots, setSlots] = useState({});

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category) params.category = category;
      if (organicOnly) params.organic = true;
      if (search) params.search = search;

      const res = await API.get('/products', { params });
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, organicOnly, search]);

  const handleQuantityChange = (productId, value) => {
    setQuantities({ ...quantities, [productId]: value });
  };

  const handleSlotChange = (productId, value) => {
  setSlots({ ...slots, [productId]: value });
};

  const handleOrder = async (productId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('Please login first to place an order.');
      return;
    }

    const quantity = quantities[productId] || 1;

    try {
      const res = await API.post('/orders', {
  consumer: user.id,
  product: productId,
  quantity: Number(quantity),
  deliverySlot: slots[productId] || 'Morning (8AM-11AM)'
});
      alert(res.data.message);
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>Browse Products</h2>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px', flex: '1' }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: '8px' }}
        >
          <option value="">All Categories</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Fruits">Fruits</option>
          <option value="Dairy">Dairy</option>
          <option value="Grains">Grains</option>
        </select>
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <input
            type="checkbox"
            checked={organicOnly}
            onChange={(e) => setOrganicOnly(e.target.checked)}
          />
          Organic Only
        </label>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '15px' }}>
          {products.map((product) => (
            <div
              key={product._id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '15px'
              }}
            >
              <h3>{product.name}</h3>
              <p><strong>Category:</strong> {product.category}</p>
              <p><strong>Price:</strong> ₹{product.price} / {product.unit}</p>
              <p><strong>Available:</strong> {product.quantity} {product.unit}</p>
              {product.organic && <p style={{ color: 'green' }}>🌱 Organic</p>}
              <p><strong>Farmer:</strong> <Link to={`/farmer/${product.farmer?._id}`}>{product.farmer?.name}</Link></p>
              {product.farmer?.farmLocation && (
                <p><strong>Location:</strong> {product.farmer.farmLocation}</p>
              )}

              <input
                type="number"
                min="1"
                max={product.quantity}
                placeholder="Qty"
                value={quantities[product._id] || ''}
                onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                style={{ width: '100%', padding: '6px', marginBottom: '8px' }}
              />
              <select
  value={slots[product._id] || 'Morning (8AM-11AM)'}
  onChange={(e) => handleSlotChange(product._id, e.target.value)}
  style={{ width: '100%', padding: '6px', marginBottom: '8px' }}
>
  <option value="Morning (8AM-11AM)">Morning (8AM-11AM)</option>
  <option value="Afternoon (12PM-3PM)">Afternoon (12PM-3PM)</option>
  <option value="Evening (4PM-7PM)">Evening (4PM-7PM)</option>
</select>
              <button
                onClick={() => handleOrder(product._id)}
                disabled={product.quantity === 0}
                style={{ width: '100%', padding: '8px' }}
              >
                {product.quantity === 0 ? 'Out of Stock' : 'Order Now'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;