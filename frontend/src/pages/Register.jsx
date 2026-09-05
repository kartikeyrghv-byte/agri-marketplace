import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'consumer',
    farmLocation: '',
    cropTypes: '',
    farmingMethod: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...formData,
        cropTypes: formData.cropTypes ? formData.cropTypes.split(',').map(c => c.trim()) : []
      };
      const res = await API.post('/auth/register', payload);
      alert(res.data.message);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-md border border-border bg-card text-brown placeholder:text-brown/40 focus:outline-none focus:border-olive transition-colors";

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <h2 className="font-serif text-3xl font-semibold text-brown mb-2 text-center">Create an account</h2>
        <p className="text-brown/60 text-center mb-8">Join as a farmer or consumer</p>

        {error && (
          <p className="bg-terracotta/10 text-terracotta-dark text-sm px-4 py-2 rounded-md mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className={inputClass}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className={inputClass}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className={inputClass}
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="consumer">Consumer</option>
            <option value="farmer">Farmer</option>
          </select>

          {formData.role === 'farmer' && (
            <>
              <input
                type="text"
                name="farmLocation"
                placeholder="Farm Location"
                value={formData.farmLocation}
                onChange={handleChange}
                className={inputClass}
              />
              <input
                type="text"
                name="cropTypes"
                placeholder="Crops grown (comma separated)"
                value={formData.cropTypes}
                onChange={handleChange}
                className={inputClass}
              />
              <select
                name="farmingMethod"
                value={formData.farmingMethod}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Farming Method</option>
                <option value="organic">Organic</option>
                <option value="conventional">Conventional</option>
              </select>
            </>
          )}

                    <button
            type="submit"
            className="w-full bg-olive hover:bg-olive-dark text-cream px-4 py-3 rounded-md font-medium transition-colors"
          >
            Create Account
          </button>

          <p className="text-sm text-brown/60 text-center mt-2">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-olive hover:underline font-medium"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;