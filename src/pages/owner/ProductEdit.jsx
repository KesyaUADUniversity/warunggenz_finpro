import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    price: '',
    stock: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load product & categories saat komponen dimuat
  useEffect(() => {
    const loadData = async () => {
      try {
        // Ambil data produk
        const productRes = await api.get(`/products/${id}`);
        const product = productRes.data.data;

        // Ambil daftar kategori
        const categoriesRes = await api.get('/categories');
        const cats = Array.isArray(categoriesRes.data.data) 
          ? categoriesRes.data.data 
          : categoriesRes.data.data?.data || [];

        // Set state
        setFormData({
          name: product.name,
          category_id: product.category?.id || '',
          price: product.price,
          stock: product.stock
        });
        setCategories(cats);
      } catch (err) {
        console.error('Error:', err);
        setError('Gagal memuat data produk');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.put(`/products/${id}`, {
        name: formData.name,
        category_id: parseInt(formData.category_id),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      });

      // Kembali ke halaman produk
      navigate('/dashboard/products');
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.message || 'Gagal update produk');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center">
        <div className="inline-block w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-400 bg-red-900/20 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 
        className="text-3xl font-black mb-6"
        style={{ fontFamily: 'Orbitron, sans-serif' }}
      >
        Edit Produk
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nama Produk */}
        <div>
          <label className="block text-gray-400 mb-2">Nama Produk</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
          />
        </div>

        {/* Kategori */}
        <div>
          <label className="block text-gray-400 mb-2">Kategori</label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
          >
            <option value="">Pilih kategori</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Harga & Stok */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 mb-2">Harga (Rp)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="1000"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Stok</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
            />
          </div>
        </div>

        {/* Tombol */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-pink-600 to-cyan-500 hover:from-pink-700 hover:to-cyan-600 text-white font-bold py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/products')}
            className="px-6 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}