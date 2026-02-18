import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function CustomerHome() {
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load user profile (dari localStorage)
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setCurrentUser(user);
        } else {
          navigate('/login');
          return;
        }

        // Load categories
        const catRes = await api.get('/categories');
        const catData = Array.isArray(catRes.data.data) 
          ? catRes.data.data 
          : catRes.data.data?.data || [];
        setCategories(catData);
        
        // Load transactions
        const token = localStorage.getItem('auth_token');
        if (token) {
          const trxRes = await api.get('/transactions', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          let trxData = [];
          if (trxRes.data?.data?.data && Array.isArray(trxRes.data.data.data)) {
            trxData = trxRes.data.data.data;
          } else if (Array.isArray(trxRes.data?.data)) {
            trxData = trxRes.data.data;
          } else if (Array.isArray(trxRes.data)) {
            trxData = trxRes.data;
          }
          
          setTransactions(trxData);
        }
      } catch (err) {
        console.error('Error:', err);
        navigate('/login');
      } finally {
        setLoading(false);
        setLoadingTransactions(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-20">
      
      <div className="flex justify-between items-center mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          WARUNG GEN Z
        </motion.h1>
        
        
        {currentUser && (
          <div className="flex items-center gap-4">
            <div className="bg-gray-900/50 px-4 py-2 rounded-lg text-sm">
              <span className="font-bold text-pink-400">{currentUser.name}</span>
              <span className="text-gray-400 ml-2">• Pelanggan</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-pink-600 to-cyan-500 hover:opacity-90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Grid Kategori */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {categories.map((category, index) => (
          <Link
            key={category.id}
            to={`/customer/category/${category.id}`}
            className="block"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)" }}
              className="bg-[#0f172a] border-2 border-[#7e22ce] rounded-2xl p-6 text-center cursor-pointer hover:bg-[#1e293b]"
              style={{ boxShadow: '0 0 15px rgba(126, 34, 206, 0.2)' }}
            >
              <span 
                className="font-bold text-xl"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {category.name}
              </span>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Riwayat Transaksi */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-pink-400">Riwayat Transaksi</h2>
        
        {loadingTransactions ? (
          <p className="text-gray-400">Memuat riwayat...</p>
        ) : transactions.length === 0 ? (
          <div className="text-center py-6 bg-gray-900/50 rounded-xl">
            <p className="text-gray-400">Belum ada transaksi</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 3).map((trx) => (
              <div 
                key={trx.id} 
                className="bg-gray-900/50 border border-gray-700 rounded-xl p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">Invoice: {trx.invoice_number}</h3>
                    <p className="text-sm text-gray-400">
                      {new Date(trx.created_at).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    trx.is_confirmed ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {trx.is_confirmed ? 'Selesai' : 'Menunggu'}
                  </span>
                </div>
                
                <div className="mt-2">
                  <p className="text-cyan-400">Total: Rp{Number(trx.total_amount).toLocaleString()}</p>
                  <p className="text-xs text-gray-400 mt-1">Atas nama: {trx.customer_name}</p>
                </div>
                
                
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <Link
                    to={`/customer/receipt/${trx.order_id}`}
                    className="text-blue-500 hover:text-blue-400 text-sm font-medium"
                  >
                    📄 Lihat Struk
                  </Link>
                </div>
              </div>
            ))}
            
            {transactions.length > 3 && (
              <Link 
                to="/customer/transactions" 
                className="block text-center text-pink-400 hover:text-pink-300 mt-2"
              >
                Lihat semua riwayat →
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-gray-500 text-sm">
        <p>Rasa Lokalan Gaya Global yang cocok buat lu </p>
        <p className="mt-1">© {new Date().getFullYear()} Warung Gen Z</p>
      </div>
    </div>
  );
}