import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import ProductList from './pages/ProductList';
import AddProduct from './pages/AddProduct';
import MyOrders from './pages/MyOrders';
import FarmerOrders from './pages/FarmerOrders';
import AdminDashboard from './pages/AdminDashboard';
import FarmerProfile from './pages/FarmerProfile';

function Home() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
      <p className="text-terracotta font-medium text-sm mb-4 tracking-wide">Fresh from the source</p>
      <h1 className="font-serif text-5xl md:text-6xl font-semibold text-brown max-w-3xl leading-tight">
        Farmer to Consumer Agri Marketplace
      </h1>
      <p className="text-brown/70 text-lg mt-6 max-w-xl">
        Buy fresh, honestly-priced produce straight from the farmers who grow it — no middlemen, no markup.
      </p>
      <div className="flex gap-4 mt-10">
  <Link
    to="/products"
    className="bg-olive hover:bg-olive-dark text-cream px-6 py-3 rounded-md font-medium transition-colors"
  >
    Browse Products
  </Link>

  <Link
    to="/register"
    className="border border-brown/20 hover:border-brown/40 text-brown px-6 py-3 rounded-md font-medium transition-colors"
  >
    Join as a Farmer
  </Link>
</div>
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
        <Route path="/farmer/:id" element={<FarmerProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;