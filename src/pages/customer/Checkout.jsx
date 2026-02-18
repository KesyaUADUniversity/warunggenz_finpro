import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import api from '../../services/api';

export default function Checkout() {
  const navigate = useNavigate();
  const { items = [], clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto-redirect jika keranjang kosong
  useEffect(() => {
    if (items.length === 0) {
      navigate('/customer', { replace: true });
    }
  }, [items, navigate]);

  if (items.length === 0) {
    return null; // akan di-redirect oleh useEffect
  }

  const getTotalPrice = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handlePay = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const orderId = `POS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const res = await api.post('/payment/create', {
        order_id: orderId,
        gross_amount: getTotalPrice(),
        customer_email: 'pelanggan@warunggenz.id',
        customer_name: customerName || 'Pelanggan Umum',
        customer_phone: '081234567890'
      });

      window.snap.pay(res.data.token, {
        onSuccess: () => {
          clearCart();
          navigate(`/customer/receipt/${orderId}`);
        },
        onPending: () => {
          navigate(`/customer/receipt/${orderId}`);
        },
        onError: () => {
          alert('Pembayaran gagal!');
          setIsProcessing(false);
        },
        onClose: () => setIsProcessing(false)
      });
    } catch (err) {
      console.error(err);
      alert('Gagal membuat transaksi.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-3xl font-black mb-6 text-center">Keranjang Belanja</h1>

      {items.map(item => (
        <div key={item.id} className="flex justify-between py-3 border-b border-gray-800">
          <div>
            <h3>{item.name}</h3>
            <p className="text-gray-400 text-sm">× {item.quantity}</p>
          </div>
          <span className="text-cyan-400">
            Rp {(item.price * item.quantity).toLocaleString('id-ID')}
          </span>
        </div>
      ))}

      <div className="mt-6 pt-4 border-t border-gray-800 flex justify-between">
        <span>Total:</span>
        <span className="text-pink-400 font-bold">
          Rp {getTotalPrice().toLocaleString('id-ID')}
        </span>
      </div>

      <div className="mt-6">
        <label className="block text-gray-300 mb-2">Nama Pelanggan</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Nama Anda"
          className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-3 text-white"
        />
      </div>

      <button
        onClick={handlePay}
        disabled={isProcessing}
        className={`mt-8 w-full py-4 rounded font-bold text-xl ${
          isProcessing ? 'bg-gray-600' : 'bg-pink-600 hover:bg-pink-700 text-white'
        }`}
      >
        {isProcessing ? 'Memproses...' : 'Bayar Sekarang'}
      </button>
    </div>
  );
}