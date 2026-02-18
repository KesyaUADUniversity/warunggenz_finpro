import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function ProductCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    price: '',
    stock: ''
  });
  const [image, setImage] = useState(null); 
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get('/categories');
        const cats = Array.isArray(res.data.data) 
          ? res.data.data 
          : res.data.data?.data || [];
        setCategories(cats);
      } catch (err) {
        console.error('Error:', err);
        setError('Gagal memuat kategori');
      }
    };
    loadCategories();
  }, []);

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
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('category_id', formData.category_id);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('stock', formData.stock);
      if (image) {
        formDataToSend.append('image', image);
      }

      await api.post('/products', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/dashboard/products');
    } catch (err) {
      console.error('Create error:', err);
      setError(err.response?.data?.message || 'Gagal menambahkan produk');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 
        className="text-3xl font-black mb-6"
        style={{ fontFamily: 'Orbitron, sans-serif' }}
      >
        Tambah Produk Baru
      </h1>

      {error && (
        <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 mb-4 text-sm text-red-400">
          {error}
        </div>
      )}

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

        {/* Upload Gambar - Produk Baru! */}
        <div>
          <label className="block text-gray-400 mb-2">Gambar Produk</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
          />
        </div>

        {/* Tombol */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-pink-600 to-cyan-500 hover:from-pink-700 hover:to-cyan-600 text-white font-bold py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Tambah Produk'}
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