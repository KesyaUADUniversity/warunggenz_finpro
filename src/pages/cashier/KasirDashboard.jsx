import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function KasirDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Ambil data user dari localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-pink-500/30 p-4">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-600 to-cyan-500 rounded-full flex items-center justify-center">
              <span className="font-black text-white">WG</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Warung Gen Z</h1>
              <p className="text-xs text-gray-400">Dashboard Kasir</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <div className="text-right">
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-gray-400 capitalize">{user.role}</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-gradient-to-r from-pink-600 to-cyan-500 hover:opacity-90 text-white rounded-lg text-sm font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900/50 border border-pink-500/20 rounded-xl p-6 text-center">
            <h3 className="text-pink-400 font-bold mb-2">Pesanan Baru</h3>
            <p className="text-3xl font-black">5</p>
          </div>
          <div className="bg-gray-900/50 border border-yellow-500/20 rounded-xl p-6 text-center">
            <h3 className="text-yellow-400 font-bold mb-2">Sedang Dimasak</h3>
            <p className="text-3xl font-black">3</p>
          </div>
          <div className="bg-gray-900/50 border border-green-500/20 rounded-xl p-6 text-center">
            <h3 className="text-green-400 font-bold mb-2">Siap Diambil</h3>
            <p className="text-3xl font-black">2</p>
          </div>
        </div>

        <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">Aksi Cepat</h2>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => navigate('/dashboard/cashier/transactions')}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg font-bold hover:opacity-90 transition"
            >
              Lihat Semua Pesanan
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg font-bold hover:opacity-90 transition">
              Buat Pesanan Manual
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12 py-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Warung Gen Z - POS System
      </footer>
    </div>
  );
}