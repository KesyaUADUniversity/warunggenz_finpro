import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api'; 

export default function Receipt() {
  const { id } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError('Order ID tidak ditemukan');
      return;
    }

    const fetchReceipt = async () => {
      try {
        // ✅ FIX: ganti localhost jadi pakai axios + baseURL
        const res = await api.get('/public/transaction', {
          params: { order_id: id }
        });

        const result = res.data;

        if (!result.success) {
          throw new Error(result.message || 'Transaksi tidak ditemukan');
        }

        setReceipt(result.data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Struk tidak ditemukan. Pastikan transaksi sudah dikonfirmasi.');
      }
    };

    fetchReceipt();
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow text-center max-w-md">
          <h3 className="text-xl font-bold text-red-600 mb-2">Gagal Memuat Struk</h3>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.href = '/customer'}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Memuat struk...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div id="print-area" className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Struk Pembayaran</h1>
            <p className="text-gray-500 mt-1">Warung Gen Z</p>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Invoice:</span>
              <span className="font-mono text-black">
                {receipt.invoice_number || receipt.order_id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pelanggan:</span>
              <span className="text-black">{receipt.customer_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total:</span>
              <span className="font-bold text-green-600">
                Rp{Number(receipt.total_amount).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Metode:</span>
              <span className="text-black">
                {receipt.payment_method?.toUpperCase() || 'MIDTRANS'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={`font-semibold ${
                receipt.status === 'success' ? 'text-green-600' :
                receipt.status === 'pending' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {receipt.status}
              </span>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500">
              Terima kasih atas kunjungan Anda!
            </p>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-3">
          <button
            onClick={() => {
              const printWin = window.open('', '_blank');
              printWin.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                  <title>Struk - Warung Gen Z</title>
                  <style>
                    body { 
                      width: 80mm; 
                      margin: 0 auto; 
                      padding: 10px 4px;
                      font-family: "Courier New", monospace;
                      font-size: 9px;
                      line-height: 1.15;
                      background: white;
                      color: black;
                    }
                  </style>
                </head>
                <body>
                  ${document.getElementById('print-area').innerHTML}
                </body>
                </html>
              `);
              printWin.document.close();
            }}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
          >
            Cetak Struk
          </button>

          <button
            onClick={() => window.location.href = '/customer'}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            Selesai & Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
