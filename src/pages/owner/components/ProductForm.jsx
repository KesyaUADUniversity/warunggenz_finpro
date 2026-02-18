import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function ProductForm({ product, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    category_id: '', 
    price: '',
    stock: ''
  });
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.data || []);
      } catch (err) {
        console.error('Gagal load kategori:', err);
      }
    };
    fetchCategories();
  }, []);

 
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category_id: product.category?.id || '', 
        price: product.price || '',
        stock: product.stock || ''
      });
    }
  }, [product]);

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
      const payload = {
        name: formData.name,
        category_id: parseInt(formData.category_id), 
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };

      if (product) {
        await api.put(`/products/${product.id}`, payload);
      } else {
        await api.post('/products', payload);
      }

      onClose();
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Gagal menyimpan produk');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 mb-4 text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Nama Produk</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-1">Kategori</label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
          >
            <option value="">Pilih Kategori</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Harga (Rp)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="1000"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Stok</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-pink-600 to-cyan-500 hover:from-pink-700 hover:to-cyan-600 text-white py-2 rounded-lg font-bold disabled:opacity-50"
        >
          {loading ? 'Menyimpan...' : (product ? 'Update' : 'Simpan')}
        </button>
        <button
          type="button"
          onClick={() => onClose()}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
        >
          Batal
        </button>
      </div>
    </form>
  );
}