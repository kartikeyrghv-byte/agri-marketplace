import { Link, useNavigate } from 'react-router-dom';
   import logo from '../assets/logo.svg';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const linkClass = "text-cream/90 hover:text-cream transition-colors text-sm font-medium";

  return (
    <nav className="bg-olive px-6 md:px-10 py-4 flex justify-between items-center shadow-sm">
         <Link to="/" className="flex items-center gap-2 text-cream text-xl font-serif font-semibold">
     <img src={logo} alt="Agri Marketplace" className="w-8 h-8" />
     Agri Marketplace
   </Link>

      <div className="flex items-center gap-6">
        <Link to="/products" className={linkClass}>Browse Products</Link>

        {user && user.role === 'farmer' && (
          <>
            <Link to="/add-product" className={linkClass}>Add Product</Link>
            <Link to="/farmer-orders" className={linkClass}>Farmer Orders</Link>
          </>
        )}

        {user && user.role === 'consumer' && (
          <Link to="/my-orders" className={linkClass}>My Orders</Link>
        )}

        {user && user.role === 'admin' && (
          <Link to="/admin" className={linkClass}>Admin Dashboard</Link>
        )}

        {!user ? (
          <>
            <Link to="/login" className={linkClass}>Login</Link>
            <Link
              to="/register"
              className="bg-terracotta hover:bg-terracotta-dark text-cream px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <span className="text-cream/70 text-sm">Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-cream/10 hover:bg-cream/20 text-cream px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;