import { motion } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartPanel({ isOpen, onClose }) {
  const { items, getTotalPrice, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 z-50 flex justify-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25 }}
        className="bg-gray-900 w-full max-w-md h-full overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Keranjang Belanja</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="p-6 text-center">
            <div className="text-4xl mb-4">🛒</div>
            <p className="text-gray-400">Keranjangmu masih kosong</p>
          </div>
        ) : (
          <>
            <div className="p-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{item.name}</h3>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-300 text-lg"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-400 font-bold">
                      Rp {parseFloat(item.price).toLocaleString('id-ID')}
                    </span>
                    
                    <div className="flex items-center bg-gray-700 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-white hover:bg-gray-600 rounded-l-lg"
                      >
                        -
                      </button>
                      <span className="px-3 py-1">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-white hover:bg-gray-600 rounded-r-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-right mt-1 text-sm text-gray-400">
                    Subtotal: Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-700">
              <div className="flex justify-between font-bold text-lg mb-4">
                <span>Total:</span>
                <span>Rp {getTotalPrice().toLocaleString('id-ID')}</span>
              </div>
              
              <button
                onClick={() => {
                  onClose();
                  navigate('/customer/checkout');
                }}
                className="w-full bg-gradient-to-r from-pink-600 to-cyan-500 hover:from-pink-700 hover:to-cyan-600 text-white py-3 rounded-lg font-bold"
              >
                Lanjut ke Pembayaran
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}