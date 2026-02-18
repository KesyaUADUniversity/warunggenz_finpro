import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 4537000,
    totalOrders: 226,
    newOrders: 126,
    pendingOrders: 89,
    popularItem: 'Rendang Pedas'
  });

  
  useEffect(() => {
    // fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-white to-cyan-400">
          Dashboard Owner
        </h1>
        <p className="text-gray-400">Selamat datang di dashboard Warung Gen Z</p>
      </div>

      {/* Statistik Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-pink-500/20 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-1">Pendapatan Hari Ini</p>
          <p className="text-3xl font-bold text-pink-400">Rp {stats.totalRevenue.toLocaleString('id-ID')}</p>
        </div>
        
        <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-1">Total Pesanan</p>
          <p className="text-3xl font-bold text-cyan-400">{stats.totalOrders}</p>
        </div>
        
        <div className="bg-gray-900/50 backdrop-blur-sm border border-pink-500/20 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-1">Baru Hari Ini</p>
          <p className="text-3xl font-bold text-pink-400">{stats.newOrders}</p>
        </div>
        
        <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-1">Sedang Diproses</p>
          <p className="text-3xl font-bold text-cyan-400">{stats.pendingOrders}</p>
        </div>
      </div>

      {/* Daftar Pesanan */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-pink-500/20 rounded-xl p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-pink-400">Pesanan Terbaru</h2>
          <button className="text-cyan-400 hover:text-cyan-300 text-sm">Lihat Semua</button>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg">
              <div>
                <p className="font-bold">INV-{String(i).padStart(3, '0')}</p>
                <p className="text-gray-400 text-sm">Rendang Pedas x2</p>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-pink-900/50 text-pink-400 rounded-full text-xs mb-1">
                  Sedang Disiapkan
                </span>
                <button className="block w-full bg-gradient-to-r from-pink-600 to-cyan-500 hover:from-pink-700 hover:to-cyan-600 text-white text-xs py-2 rounded-lg transition">
                  Siap Diantar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Item Populer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6">
          <h3 className="font-bold text-cyan-400 mb-4">Item Paling Populer</h3>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-900/30 to-cyan-900/30 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🌶️</span>
            </div>
            <div>
              <p className="font-bold">{stats.popularItem}</p>
              <p className="text-gray-400 text-sm">24% dari total penjualan</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm border border-pink-500/20 rounded-xl p-6">
          <h3 className="font-bold text-pink-400 mb-4">Aktivitas Terkini</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>
              <p className="text-sm"><span className="font-bold">INV-001</span> telah siap diantar</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2"></div>
              <p className="text-sm">Pelanggan baru: <span className="font-bold">Budi</span></p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>
              <p className="text-sm">Stok <span className="font-bold">Rendang</span> tinggal 5 pcs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}