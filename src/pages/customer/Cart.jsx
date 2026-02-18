import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function Cart() {
  const { cart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Ambil nama dari user yang login
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const customerName = user.name || 'Pelanggan Umum';

  // Auto-redirect jika keranjang kosong
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/customer', { replace: true });
    }
  }, [cart, navigate]);

  if (cart.length === 0) {
    return null;
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePay = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const orderId = `POS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const res = await api.post('/payment/create', {
        order_id: orderId,
        gross_amount: total,
        customer_email: user.email || 'pelanggan@warunggenz.id',
        customer_name: customerName,
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
    <div className='min-h-screen bg-black text-white p-4'>
      <h1 className='text-2xl mb-4'>Keranjang Belanja</h1>
      
      {cart.map(item => (
        <div key={item.id} className='bg-gray-900 p-4 mb-3 rounded'>
          <div className='flex justify-between'>
            <span>{item.name}</span>
            <span>Rp{item.price.toLocaleString()}</span>
          </div>
          
          <div className='flex items-center mt-2'>
            <button 
              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
              className='bg-gray-700 px-2 rounded-l'
            >
              -
            </button>
            <span className='px-3'>{item.quantity}</span>
            <button 
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className='bg-gray-700 px-2 rounded-r'
            >
              +
            </button>
          </div>
          
          <div className='mt-2 text-right'>
            Subtotal: Rp{(item.price * item.quantity).toLocaleString()}
          </div>
        </div>
      ))}

      <div className='mt-4 p-4 bg-gray-800 rounded'>
        <div className='flex justify-between text-lg font-bold'>
          <span>Total:</span>
          <span>Rp{total.toLocaleString()}</span>
        </div>
        
        {/* Nama otomatis dari user yang login */}
        <div className="mt-4">
          <label className="block text-gray-300 mb-2">Nama Pelanggan</label>
          <input
            type="text"
            value={customerName}
            readOnly
            className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-3 text-white cursor-not-allowed"
          />
        </div>
        
        <button
          onClick={handlePay}
          disabled={isProcessing}
          className={`w-full mt-4 py-3 rounded font-bold ${
            isProcessing 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-pink-600 hover:bg-pink-700 text-white'
          }`}
        >
          {isProcessing ? 'Memproses...' : 'Bayar Sekarang'}
        </button>
      </div>
    </div>
  );
}