import { useState, useEffect } from 'react';
import API from '../services/api';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleQuantityChange = (productId, value) => {
    setQuantities({ ...quantities, [productId]: value });
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
        quantity: Number(quantity)
      });
      alert(res.data.message);
      fetchProducts(); // refresh list to show updated stock
    } catch (error) {
      alert(error.response?.data?.message || 'Something went wrong');
    }
  };

  if (loading) return <p style={{ textAlign: 'center' }}>Loading products...</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>Browse Products</h2>
      {products.length === 0 ? (
        <p>No products available yet.</p>
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
              <p><strong>Farmer:</strong> {product.farmer?.name}</p>

              <input
                type="number"
                min="1"
                max={product.quantity}
                placeholder="Qty"
                value={quantities[product._id] || ''}
                onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                style={{ width: '100%', padding: '6px', marginBottom: '8px' }}
              />
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