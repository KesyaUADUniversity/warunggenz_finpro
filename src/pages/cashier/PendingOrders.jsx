import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Notification from '../../components/Notification';

export default function PendingOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const loadOrders = async () => {
    try {
      const res = await api.get('/transactions?is_confirmed=0');
      const data = res.data?.data?.data || [];
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error:', err);
      showNotification('Gagal memuat data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleConfirm = async (orderId) => {
    try {
      // Konfirmasi order
      await api.post(`/transactions/${orderId}/confirm`);
      
      // Hapus order yang sudah dikonfirmasi dari state (lebih cepat)
      setOrders(prev => prev.filter(order => order.id !== orderId));
      
      showNotification('order berhasil dikonfirmasi!', 'success');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Gagal konfirmasi';
      showNotification(` ${errorMsg}`, 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Memuat order menunggu...</div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-pink-400">Order Menunggu Konfirmasi</h1>
      
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
        />
      )}

      {orders.length === 0 ? (
        <div className="text-center text-gray-400 py-12 bg-gray-800 rounded-lg">
          <div className="text-4xl mb-4">🛒</div>
          <p className="text-lg">Tidak ada order menunggu konfirmasi</p>
          <p className="text-sm mt-2">Pastikan pelanggan sudah checkout</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-4 mb-3">
                    <div>
                      <span className="text-gray-400 text-sm">Invoice:</span>
                      <p className="font-mono text-white ml-2">{order.invoice_number}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Pelanggan:</span>
                      <p className="text-cyan-400 ml-2">{order.customer_name}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Total:</span>
                      <p className="text-green-400 ml-2">Rp{Number(order.total_amount).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {order.details && order.details.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">Detail Produk:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {order.details.map(detail => (
                          <div key={detail.id} className="text-sm">
                            <span className="text-white">{detail.product?.name || 'Produk'}</span>
                            <span className="text-gray-400 ml-2">× {detail.quantity}</span>
                            <span className="text-green-400 ml-2">Rp{Number(detail.subtotal).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center">
                  <button
                    onClick={() => handleConfirm(order.id)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 
                              text-white px-4 py-2 rounded-lg font-medium transition-all"
                  >
                    Konfirmasi
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