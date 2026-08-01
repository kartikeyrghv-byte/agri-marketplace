import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    unit: 'kg',
    organic: false,
    description: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      setError('You must be logged in as a farmer to add a product.');
      return;
    }

    try {
      const res = await API.post('/products', {
        ...formData,
        farmer: user.id
      });
      alert(res.data.message);
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>Add Product</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <input
          type="text"
          name="category"
          placeholder="Category (e.g. Vegetables)"
          value={formData.category}
          onChange={handleChange}
          required
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity Available"
          value={formData.quantity}
          onChange={handleChange}
          required
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <select
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        >
          <option value="kg">kg</option>
          <option value="litre">litre</option>
          <option value="piece">piece</option>
          <option value="dozen">dozen</option>
        </select>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input
            type="checkbox"
            name="organic"
            checked={formData.organic}
            onChange={handleChange}
          />{' '}
          Organic
        </label>
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <button type="submit" style={{ width: '100%', padding: '10px' }}>
          Add Product
        </button>
      </form>
    </div>
  );
}

export default AddProduct;