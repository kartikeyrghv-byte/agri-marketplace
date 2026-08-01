import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 30px',
        borderBottom: '1px solid #444',
        fontFamily: 'sans-serif'
      }}
    >
      <Link to="/" style={{ fontWeight: 'bold', fontSize: '18px', textDecoration: 'none' }}>
        🌾 Agri Marketplace
      </Link>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/products">Browse Products</Link>

        {user && user.role === 'farmer' && (
          <>
            <Link to="/add-product">Add Product</Link>
            <Link to="/farmer-orders">Farmer Orders</Link>
          </>
        )}

        {user && user.role === 'consumer' && (
          <Link to="/my-orders">My Orders</Link>
        )}

        {user && user.role === 'admin' && (
            <Link to="/admin">Admin Dashboard</Link>
        )}

        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <span>Hi, {user.name}</span>
            <button onClick={handleLogout} style={{ padding: '6px 12px' }}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;