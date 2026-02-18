// src/pages/owner/Reports.jsx
import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function Reports() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); 

  const fetchReport = async (date) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/reports/sales?start_date=${date}&end_date=${date}`);
      setReportData(response.data.data);
    } catch (err) {
      console.error('Error fetching report:', err);
      setError('Gagal memuat laporan untuk tanggal ini.');
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const summary = reportData?.summary || {};
  const transactions = reportData?.transactions || [];

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-4 md:p-6">
      <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-400 mb-6">
        Laporan Harian
      </h1>

      {/* Date Picker */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <label htmlFor="report-date" className="font-medium text-gray-300 whitespace-nowrap">
          Pilih Tanggal:
        </label>
        <input
          type="date"
          id="report-date"
          value={selectedDate}
          onChange={handleDateChange}
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500 max-w-xs"
        />
        <span className="text-gray-400 mt-1 sm:mt-0">
          ({formatDate(selectedDate)})
        </span>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-pink-500">Memuat laporan...</p>
        </div>
      ) : error ? (
        <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-6 text-center mb-8">
          {error}
        </div>
      ) : (
        <>
          {/* Statistik */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6">
              <p className="text-gray-400 text-sm">Total Transaksi</p>
              <p className="text-2xl font-bold text-cyan-400">
                {summary.total_transactions || 0}
              </p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm border border-pink-500/20 rounded-xl p-6">
              <p className="text-gray-400 text-sm">Pendapatan</p>
              <p className="text-2xl font-bold text-pink-400">
                Rp {(summary.total_sales || 0).toLocaleString('id-ID')}
              </p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6">
              <p className="text-gray-400 text-sm">Menu Terlaris</p>
              <p className="text-2xl font-bold text-white">
                {summary.top_item_name || '-'}
              </p>
              {summary.top_item_sold && (
                <p className="text-gray-400 text-sm mt-1">
                  Terjual: {summary.top_item_sold} pcs
                </p>
              )}
            </div>
          </div>

          {/* Daftar Transaksi */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-pink-500/20 rounded-xl p-6">
            <h2 className="text-xl font-bold text-pink-400 mb-4">
              Transaksi - {formatDate(selectedDate)}
            </h2>
            {transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-max">
                  <thead>
                    <tr className="text-left text-gray-400 text-sm border-b border-gray-700">
                      <th className="pb-3">No</th>
                      <th className="pb-3">Invoice</th>
                      <th className="pb-3">Pelanggan</th>
                      <th className="pb-3">Total</th>
                      <th className="pb-3">Waktu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((trx, index) => (
                      <tr key={trx.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                        <td className="py-3">{index + 1}</td>
                        <td className="py-3 font-mono">{trx.invoice_number}</td>
                        <td className="py-3">{trx.customer_name}</td>
                        <td className="py-3">Rp {trx.total_price.toLocaleString('id-ID')}</td>
                        <td className="py-3 text-sm text-gray-400">
                          {new Date(trx.created_at).toLocaleTimeString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">
                📭 Tidak ada transaksi pada tanggal ini
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}