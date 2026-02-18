import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function Transaction() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions');
      
      // Ambil data dengan aman
      let data = [];
      if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
        data = response.data.data.data;
      } else if (Array.isArray(response.data?.data)) {
        data = response.data.data;
      } else if (Array.isArray(response.data)) {
        data = response.data;
      }
      
      setTransactions(data);
    } catch (error) {
      console.error('Gagal ambil data transaksi:', error);
      // Notifikasi error tanpa alert()
      showNotification('Gagal memuat daftar transaksi', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.innerHTML = `
      <div style="
        position: fixed; 
        top: 20px; 
        right: 20px; 
        background: ${type === 'success' ? 'linear-gradient(90deg, #10b981, #06b6d4)' : 'linear-gradient(90deg, #ef4444, #f97316)'}; 
        color: white; 
        padding: 12px 20px; 
        border-radius: 8px; 
        z-index: 10000;
        animation: fadeIn 0.3s, fadeOut 0.3s 2.7s;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 8px;
      ">
        <span>${type === 'success' ? '' : ''}</span>
        <span>${message}</span>
      </div>
    `;
    
    // Tambahkan CSS animasi jika belum ada
    if (!document.getElementById('toast-styles')) {
      const style = document.createElement('style');
      style.id = 'toast-styles';
      style.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeOut {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(100%); }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3000);
  };

  const handlePrint = (id) => {
    navigate(`/dashboard/cashier/receipt/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <h1 className="text-2xl font-bold mb-6">Daftar Transaksi</h1>
        <p>Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daftar Transaksi</h1>
        <button 
          onClick={() => navigate('/dashboard/cashier')}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
        >
          ← Kembali
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Belum ada transaksi</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((trx) => (
            <div 
              key={trx.id} 
              className="bg-gray-900/50 border border-gray-700 rounded-xl p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">Invoice: {trx.invoice_number}</h3>
                  <p className="text-sm text-gray-400">
                    {new Date(trx.created_at).toLocaleString('id-ID')}
                  </p>
                  <p className="text-cyan-400 mt-1">Pelanggan: {trx.customer_name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  trx.is_confirmed ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {trx.is_confirmed ? 'Dikonfirmasi' : 'Menunggu'}
                </span>
              </div>
              
              {/* Detail Produk */}
              <div className="mt-3 space-y-2">
                {(trx.details || []).map((detail) => (
                  <div key={detail.id} className="flex justify-between text-sm">
                    <span>{detail.product?.name || 'Produk'} x{detail.quantity}</span>
                    <span>Rp{Number(detail.subtotal).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              
              {/*  TOMBOL KONFIRMASI & CETAK STRUK */}
              <div className="mt-4 pt-3 border-t border-gray-700 flex justify-between items-center">
                <span className="font-bold">Total: Rp{Number(trx.total_amount).toLocaleString()}</span>
                
                <div className="flex gap-2">
                  {/* Tombol Konfirmasi */}
                  {!trx.is_confirmed && (
                    <button
                      onClick={async () => {
                        try {
                          await api.post(`/transactions/${trx.id}/confirm`);
                          showNotification('Transaksi berhasil dikonfirmasi!', 'success');
                          
                          // Refresh data
                          const res = await api.get('/transactions');
                          let data = [];
                          if (res.data?.data?.data && Array.isArray(res.data.data.data)) {
                            data = res.data.data.data;
                          } else if (Array.isArray(res.data?.data)) {
                            data = res.data.data;
                          } else if (Array.isArray(res.data)) {
                            data = res.data;
                          }
                          setTransactions(data);
                        } catch (err) {
                          showNotification(err.response?.data?.message || 'Gagal konfirmasi', 'error');
                        }
                      }}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                    >
                      Konfirmasi
                    </button>
                  )}
                  
                  {/* Tombol Cetak Struk */}
                  <button
                    onClick={() => handlePrint(trx.id)}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-90 rounded-lg text-sm font-medium"
                  >
                    Cetak Struk
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}