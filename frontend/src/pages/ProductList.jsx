import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [slots, setSlots] = useState({});
  const [category, setCategory] = useState('');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [search, setSearch] = useState('');

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

  const inputClass = "px-4 py-2.5 rounded-md border border-border bg-card text-brown placeholder:text-brown/40 focus:outline-none focus:border-olive transition-colors";

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h2 className="font-serif text-4xl font-semibold text-brown mb-8">Browse Products</h2>

      <div className="flex flex-wrap gap-3 mb-10">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClass} flex-1 min-w-[200px]`}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputClass}
        >
          <option value="">All Categories</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Fruits">Fruits</option>
          <option value="Dairy">Dairy</option>
          <option value="Grains">Grains</option>
        </select>
        <label className="flex items-center gap-2 px-4 py-2.5 rounded-md border border-border bg-card text-brown text-sm">
          <input
            type="checkbox"
            checked={organicOnly}
            onChange={(e) => setOrganicOnly(e.target.checked)}
            className="accent-olive"
          />
          Organic Only
        </label>
      </div>

      {loading ? (
        <p className="text-brown/60 text-center py-12">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-brown/60 text-center py-12">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-card border border-border rounded-lg p-5 flex flex-col"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-serif text-xl font-semibold text-brown">{product.name}</h3>
                {product.organic && (
                  <span className="text-xs bg-olive/10 text-olive-dark px-2 py-1 rounded-full font-medium">
                    Organic
                  </span>
                )}
              </div>
              <p className="text-brown/60 text-sm mb-1">{product.category}</p>
              <p className="text-brown font-semibold text-lg mb-1">₹{product.price} <span className="text-sm font-normal text-brown/60">/ {product.unit}</span></p>
              <p className="text-brown/60 text-sm mb-2">Available: {product.quantity} {product.unit}</p>
              <p className="text-brown/60 text-sm mb-4">
                By{' '}
                <Link to={`/farmer/${product.farmer?._id}`} className="text-terracotta font-medium hover:underline">
                  {product.farmer?.name}
                </Link>
                {product.farmer?.farmLocation && ` · ${product.farmer.farmLocation}`}
              </p>

              <div className="mt-auto flex flex-col gap-2">
                <input
                  type="number"
                  min="1"
                  max={product.quantity}
                  placeholder="Qty"
                  value={quantities[product._id] || ''}
                  onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                  className={inputClass}
                />
                <select
                  value={slots[product._id] || 'Morning (8AM-11AM)'}
                  onChange={(e) => handleSlotChange(product._id, e.target.value)}
                  className={inputClass}
                >
                  <option value="Morning (8AM-11AM)">Morning (8AM-11AM)</option>
                  <option value="Afternoon (12PM-3PM)">Afternoon (12PM-3PM)</option>
                  <option value="Evening (4PM-7PM)">Evening (4PM-7PM)</option>
                </select>
                <button
                  onClick={() => handleOrder(product._id)}
                  disabled={product.quantity === 0}
                  className="bg-olive hover:bg-olive-dark disabled:bg-brown/20 disabled:cursor-not-allowed text-cream py-2.5 rounded-md font-medium transition-colors"
                >
                  {product.quantity === 0 ? 'Out of Stock' : 'Order Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;