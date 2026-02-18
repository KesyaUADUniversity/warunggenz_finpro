import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function PrintReceipt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) throw new Error('Not authenticated');

        const res = await api.get(`/transactions/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = res.data?.data || res.data;
        if (!data) throw new Error('Transaksi tidak ditemukan');
        
        setTransaction(data);
        setTimeout(() => window.print(), 800);
      } catch (err) {
        console.error(err);
        alert('Gagal memuat struk. Kembali ke daftar transaksi.');
        navigate('/dashboard/cashier/transactions');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTransaction();
  }, [id, navigate]);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#fff',
        color: '#000'
      }}>
        <div>Muat struk...</div>
      </div>
    );
  }

  if (!transaction) return null;

  return (
    <div style={{
      width: '80mm',
      margin: '0 auto',
      padding: '10px 4px',
      fontFamily: '"Courier New", monospace',
      fontSize: '9px',
      lineHeight: '1.15',
      backgroundColor: '#fff',
      color: '#000',
      whiteSpace: 'pre',
      letterSpacing: '0.1px'
    }}>
      {/* Header */}
      <div style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '3px' }}>
        INVOICE
      </div>
      <div style={{ textAlign: 'center', marginBottom: '2px' }}>
        WARUNG GEN Z
      </div>
      <div style={{ textAlign: 'center', fontSize: '8px', marginBottom: '6px' }}>
        Jl. Palsu No. 007 • Demo Finpro
      </div>

      {/* Garis tebal */}
      <div style={{ 
        borderBottom: '2px solid #000',
        margin: '4px 0',
        height: '2px'
      }}></div>

      {/* Info */}
      <div>NO: {transaction.invoice_number}</div>
      <div>Tgl: {new Date(transaction.created_at).toLocaleDateString('id-ID')}</div>
      <div>Pelanggan: {transaction.customer_name}</div>
      <div>Kasir: {transaction.cashier?.name || 'Sistem'}</div>

      {/* Garis tebal */}
      <div style={{ 
        borderBottom: '2px solid #000',
        margin: '6px 0',
        height: '2px'
      }}></div>

      {/* Items */}
      {(transaction.details || []).map((d, i) => (
        <div key={i} style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '2px'
        }}>
          <span style={{ width: '52mm', overflow: 'hidden' }}>
            {d.product?.name || 'Produk'} x{d.quantity}
          </span>
          <span>{'Rp' + (d.subtotal || 0).toLocaleString('id-ID')}</span>
        </div>
      ))}

      {/* Garis tebal */}
      <div style={{ 
        borderBottom: '2px solid #000',
        margin: '6px 0',
        height: '2px'
      }}></div>

      {/* Total */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        fontWeight: 'bold',
        marginTop: '2px'
      }}>
        <span>TOTAL</span>
        <span>{'Rp' + (transaction.total_amount || 0).toLocaleString('id-ID')}</span>
      </div>

      {/* Footer */}
      <div style={{ 
        marginTop: '12px',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '10px'
      }}>
        TERIMA KASIH!
      </div>
      <div style={{ 
        textAlign: 'center',
        fontSize: '7px',
        marginTop: '2px'
      }}>
        Selamat berbelanja , anda puas kami senang
      </div>
    </div>
  );
}