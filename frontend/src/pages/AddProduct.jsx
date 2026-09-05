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

  const inputClass = "w-full px-4 py-3 rounded-md border border-border bg-card text-brown placeholder:text-brown/40 focus:outline-none focus:border-olive transition-colors";

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <h2 className="font-serif text-3xl font-semibold text-brown mb-2 text-center">Add a Product</h2>
        <p className="text-brown/60 text-center mb-8">List your produce for consumers to discover</p>

        {error && (
          <p className="bg-terracotta/10 text-terracotta-dark text-sm px-4 py-2 rounded-md mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
            className={inputClass}
          />
          <input
            type="text"
            name="category"
            placeholder="Category (e.g. Vegetables)"
            value={formData.category}
            onChange={handleChange}
            required
            className={inputClass}
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
            className={inputClass}
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity Available"
            value={formData.quantity}
            onChange={handleChange}
            required
            className={inputClass}
          />
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="kg">kg</option>
            <option value="litre">litre</option>
            <option value="piece">piece</option>
            <option value="dozen">dozen</option>
          </select>
          <label className="flex items-center gap-2 text-brown text-sm">
            <input
              type="checkbox"
              name="organic"
              checked={formData.organic}
              onChange={handleChange}
              className="accent-olive"
            />
            Organic
          </label>
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className={inputClass}
          />
          <button
            type="submit"
            className="bg-olive hover:bg-olive-dark text-cream py-3 rounded-md font-medium transition-colors mt-2"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;