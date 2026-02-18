import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../services/api';

// Gradient warna per kategori
const CATEGORY_GRADIENTS = {
  'Ayam Geprek': 'from-red-500 to-orange-500',
  'Nasi': 'from-yellow-500 to-amber-500',
  'Minuman': 'from-cyan-500 to-blue-500',
  'Pelengkap': 'from-green-500 to-emerald-500',
  default: 'from-purple-500 to-pink-500'
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products?per_page=100'),
          api.get('/categories')
        ]);
        
        let productsData = [];
        if (prodRes.data.data?.data) productsData = prodRes.data.data.data;
        else if (Array.isArray(prodRes.data.data)) productsData = prodRes.data.data;
        
        let categoriesData = [];
        if (catRes.data.data?.data) categoriesData = catRes.data.data.data;
        else if (Array.isArray(catRes.data.data)) categoriesData = catRes.data.data;

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter produk
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || 
        (product.category?.id?.toString() === selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  // Statistik
  const stats = useMemo(() => {
    const total = products.length;
    const lowStock = products.filter(p => p.stock <= 10).length;
    const outOfStock = products.filter(p => p.stock === 0).length;
    return { total, lowStock, outOfStock };
  }, [products]);

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus produk ini?')) return;
    
    try {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Gagal menghapus produk');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full shadow-lg"
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400"
          >
            Manajemen Produk
          </motion.h1>
          <p className="text-gray-400 mt-1">Kelola menu warungmu dengan mudah</p>
        </div>
        
        <Link
          to="/dashboard/products/create"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-pink-600 to-cyan-500 hover:from-pink-700 hover:to-cyan-600 text-white px-5 py-2.5 rounded-xl font-bold whitespace-nowrap shadow-lg shadow-pink-500/30"
        >
          + Tambah Produk
        </Link>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/50 backdrop-blur-sm border border-pink-500/20 rounded-2xl p-4"
        >
          <div className="text-2xl font-bold text-pink-400">{stats.total}</div>
          <div className="text-gray-400 text-sm">Total Produk</div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/50 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-4"
        >
          <div className="text-2xl font-bold text-yellow-400">{stats.lowStock}</div>
          <div className="text-gray-400 text-sm">Stok Rendah</div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/50 backdrop-blur-sm border border-red-500/20 rounded-2xl p-4"
        >
          <div className="text-2xl font-bold text-red-400">{stats.outOfStock}</div>
          <div className="text-gray-400 text-sm">Habis Stok</div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 min-w-[180px]"
        >
          <option value="all">Semua Kategori</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Produk */}
      <AnimatePresence>
        {filteredProducts.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-16"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              🛒
            </motion.div>
            <h3 className="text-xl font-bold text-white mb-2">Tidak ada produk ditemukan</h3>
            <p className="text-gray-400 mb-6">Coba ubah filter pencarian</p>
            <Link
              to="/dashboard/products/create"
              className="bg-gradient-to-r from-pink-600 to-cyan-500 hover:from-pink-700 hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-pink-500/20 transition-all"
            >
              + Tambah Produk
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((product, index) => {
              const gradient = CATEGORY_GRADIENTS[product.category?.name] || CATEGORY_GRADIENTS.default;
              
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                  className="bg-gray-900/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800 group"
                >
                  {/* Gambar Placeholder */}
                  <div className="h-32 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center`}>
                      <span className="text-white font-bold text-lg">
                        {product.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-white group-hover:text-pink-400 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.status === 'active' 
                          ? 'bg-green-900/30 text-green-400' 
                          : 'bg-gray-900/30 text-gray-400'
                      }`}>
                        {product.status}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-3">
                      <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${gradient} text-white`}>
                        {product.category?.name || 'Tanpa Kategori'}
                      </span>
                      <span className="font-black text-pink-400">
                        Rp {parseFloat(product.price).toLocaleString('id-ID')}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium ${
                        product.stock <= 10 ? 'text-red-400' : 'text-gray-300'
                      }`}>
                        Stok: {product.stock}
                      </span>
                      
                      <div className="flex gap-2">
                        <Link
                          to={`/dashboard/products/edit/${product.id}`}
                          className="text-xs bg-gray-800 hover:bg-gray-700 text-white px-2 py-1 rounded transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-xs bg-red-900/30 hover:bg-red-900/50 text-red-400 px-2 py-1 rounded transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}