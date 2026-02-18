import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCart } from '../contexts/CartContext';

export default function Layout() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { cart } = useCart();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="bg-gray-800 border-b border-pink-500/20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-pink-400">Warung Gen Z</h1>
            <span className="text-sm bg-gray-700 px-2 py-1 rounded">
              {user?.role === 'owner' ? 'Owner' : 
               user?.role === 'kasir' ? 'Kasir' : 'Pelanggan'}
            </span>
          </div>
          
          <div className="flex items-center space-x-6">
            {user?.role === 'owner' && (
              <>
                <Link to="/dashboard/owner" className="hover:text-cyan-400 transition">Dashboard</Link>
                <Link to="/dashboard/products" className="hover:text-cyan-400 transition">Produk</Link>
                <Link to="/dashboard/reports" className="hover:text-cyan-400 transition">Laporan</Link>
              </>
            )}
            
            {user?.role === 'kasir' && (
              <>
                <Link to="/dashboard/cashier" className="hover:text-cyan-400 transition">Transaksi</Link>
                <Link to="/dashboard/cashier/pending-orders" className="hover:text-cyan-400 transition">Order Menunggu</Link>
              </>
            )}

            {/* Ikon keranjang untuk PELANGGAN */}
            {user?.role === 'user' && (
              <Link to="/customer/cart" className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            
            <button 
              onClick={handleLogout}
              className="text-pink-400 hover:text-pink-300 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      {/* Konten Halaman */}
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}