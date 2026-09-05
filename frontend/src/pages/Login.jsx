import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-md border border-border bg-card text-brown placeholder:text-brown/40 focus:outline-none focus:border-olive transition-colors";

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h2 className="font-serif text-3xl font-semibold text-brown mb-2 text-center">Welcome back</h2>
        <p className="text-brown/60 text-center mb-8">Log in to your account</p>

        {error && (
          <p className="bg-terracotta/10 text-terracotta-dark text-sm px-4 py-2 rounded-md mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          <button
            type="submit"
            className="bg-olive hover:bg-olive-dark text-cream py-3 rounded-md font-medium transition-colors mt-2"
          >
            Log In
          </button>
        </form>

        <p className="text-brown/60 text-sm text-center mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-terracotta font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;