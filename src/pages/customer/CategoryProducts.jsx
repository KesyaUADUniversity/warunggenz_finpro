import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import api, { API_BASE_URL } from '../../services/api'; // ← import API_BASE_URL

// Fungsi untuk dapatkan warna ikon berdasarkan nama kategori
const getCategoryColor = (categoryName) => {
  const colors = {
    'Magelangan': 'bg-purple-500',
    'Ayam Geprek': 'bg-orange-500',
    'Nasi': 'bg-yellow-500',
    'Minuman': 'bg-blue-500',
    'Indomie': 'bg-pink-500',
    'Pelengkap': 'bg-green-500',
    'Dimsum': 'bg-indigo-500',
    'Daging': 'bg-red-500',
    'Seafood': 'bg-cyan-500',
    'Sayur': 'bg-emerald-500',
    default: 'bg-gray-500'
  };
  return colors[categoryName] || colors.default;
};

export default function CategoryProducts() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart(); 
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get(`/categories/${id}`),
          api.get(`/products?category_id=${id}`)
        ]);

        setCategory(catRes.data.data);

        let data = [];
        if (prodRes.data.data?.data) data = prodRes.data.data.data;
        else if (Array.isArray(prodRes.data.data)) data = prodRes.data.data;
        setProducts(data);
      } catch (err) {
        console.error('Error:', err);
        alert('Gagal memuat kategori');
        navigate('/customer');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, navigate]);

  const handleAddToCart = (product) => {
    addToCart(product);
    
    // Notifikasi toast
    const toast = document.createElement('div');
    toast.innerHTML = `
      <div style="
        position: fixed; 
        bottom: 20px; 
        right: 20px; 
        background: linear-gradient(90deg, #ec4899, #06b6d4); 
        color: white; 
        padding: 12px 20px; 
        border-radius: 8px; 
        z-index: 1000;
        animation: fadeIn 0.3s, fadeOut 0.3s 2.7s;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        font-weight: bold;
      ">
        🛒 ${product.name} ditambahkan!
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Memuat...</div>
      </div>
    );
  }

  // Jika tidak ada produk, tampilkan pesan
  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h3 className="text-xl font-bold text-white mb-2">Belum Ada Produk</h3>
          <p className="text-gray-400 mb-6">
            Kategori ini belum memiliki produk. Silakan kembali ke menu utama.
          </p>
          <button
            onClick={() => navigate('/customer')}
            className="bg-gradient-to-r from-pink-600 to-cyan-500 hover:from-pink-700 hover:to-cyan-600 text-white px-6 py-3 rounded-lg font-bold"
          >
            Kembali ke Menu
          </button>
        </div>
      </div>
    );
  }

  // URL base untuk gambar (tanpa /api)
  const IMAGE_BASE_URL = API_BASE_URL.replace('/api', '');

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <button
        onClick={() => navigate('/customer')}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 text-white mb-6 transition-colors"
      >
        <span>Kembali ke Menu</span>
      </button>

      <h2 
        className="text-2xl font-bold text-center mb-6"
        style={{ fontFamily: 'Orbitron, sans-serif' }}
      >
        {category?.name}
      </h2>

      {/* Grid Produk - Gaya Owner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 hover:border-pink-500/50 transition-all"
          >
            {/* Gambar Produk atau Ikon Fallback */}
            <div className="w-full h-32 mb-3 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
              {product.image && product.image.trim() ? (
                <img 
                  src={`${IMAGE_BASE_URL}/storage/${product.image.trim()}`} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = `
                      <div class="w-full h-full bg-gray-800 flex items-center justify-center">
                        <span class="text-gray-400 text-xl">${product.name.charAt(0)}</span>
                      </div>
                    `;
                  }}
                />
              ) : (
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  getCategoryColor(category?.name)
                }`}>
                  <span className="text-white font-bold text-lg">
                    {product.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Nama Produk */}
            <h3 className="font-bold text-white text-center mb-1">{product.name}</h3>
            
            {/* Label Kategori */}
            <div className="flex justify-center mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                getCategoryColor(category?.name)
              } text-white`}>
                {category?.name}
              </span>
            </div>

            {/* Harga */}
            <p className="text-cyan-400 font-medium text-center mb-2">
              Rp {parseFloat(product.price).toLocaleString('id-ID')}
            </p>

            {/* Stok */}
            <div className="flex justify-center">
              <span className={`inline-block px-2 py-1 rounded text-xs ${
                product.stock <= 10 
                  ? 'bg-red-900/30 text-red-400' 
                  : 'bg-green-900/30 text-green-400'
              }`}>
                Stok: {product.stock}
              </span>
            </div>

            {/* Tombol Tambah */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => handleAddToCart(product)}
                className="bg-gradient-to-r from-pink-600 to-cyan-500 hover:from-pink-700 hover:to-cyan-600 text-white px-4 py-2 rounded-lg font-bold transition-all text-sm"
              >
                Tambah
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Tombol Lihat Keranjang */}
      <div className="mt-8 text-center">
        <button
          onClick={() => navigate('/customer/cart')}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-cyan-500 hover:from-pink-700 hover:to-cyan-600 text-white px-6 py-3 rounded-lg font-bold transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Lihat Keranjang ({0} item)
        </button>
      </div>
    </div>
  );
}