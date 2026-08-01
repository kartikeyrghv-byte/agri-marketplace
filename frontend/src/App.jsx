import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import ProductList from './pages/ProductList';
import AddProduct from './pages/AddProduct';
import MyOrders from './pages/MyOrders';
import FarmerOrders from './pages/FarmerOrders';
import AdminDashboard from './pages/AdminDashboard';

function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '80px', fontFamily: 'sans-serif' }}>
      <h1>Farmer to Consumer Agri Marketplace</h1>
      <p>Connecting farmers directly with consumers.</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/farmer-orders" element={<FarmerOrders />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;