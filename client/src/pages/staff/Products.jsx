import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const categories = [
  { value: 'haircare', label: 'Hair Care' },
  { value: 'beardcare', label: 'Beard Care' },
  { value: 'styling', label: 'Styling' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'other', label: 'Other' },
];

export default function StaffProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: 'haircare',
      barcode: '',
    },
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data.data);
      } catch (error) {
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      reset({
        name: product.name,
        description: product.description || '',
        price: product.price,
        stock: product.stock,
        category: product.category,
        barcode: product.barcode || '',
      });
    } else {
      setEditingProduct(null);
      reset({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        category: 'haircare',
        barcode: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const onSubmit = async (data) => {
    setUploading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product updated');
      } else {
        await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product created');
      }
      closeModal();
      const res = await api.get('/products');
      setProducts(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${productId}`);
      toast.success('Product deleted');
      setProducts(products.filter(p => p._id !== productId));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete');
    }
  };

  const handleStockUpdate = async (productId, newStock) => {
    try {
      await api.put(`/products/${productId}/stock`, { quantity: newStock, operation: 'set' });
      setProducts(products.map(p => p._id === productId ? { ...p, stock: newStock } : p));
    } catch (error) {
      toast.error('Failed to update stock');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="card p-4"><div className="h-12 bg-dark-100 rounded" /></div>
        ))}
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-dark-900">Products Management</h1>
          <p className="text-dark-600">Manage retail products and inventory</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
          Add Product
        </button>
      </div>

      <div className="card overflow-hidden">
        {products.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-dark-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            <h3 className="font-display text-xl font-semibold text-dark-900 mb-2">No products yet</h3>
            <button onClick={() => openModal()} className="btn-primary">Add Product</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-dark-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-100">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-dark-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-dark-100 flex items-center justify-center">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <svg className="w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-dark-900">{product.name}</p>
                          <p className="text-sm text-dark-500">{product.description?.substring(0, 40)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="badge-secondary capitalize">{product.category}</span>
                    </td>
                    <td className="px-4 py-4">${product.price}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${product.stock === 0 ? 'text-red-500' : product.stock <= 5 ? 'text-yellow-500' : 'text-green-500'}`}>
                          {product.stock}
                        </span>
                        {product.stock === 0 && <span className="badge-danger text-xs">Out</span>}
                        {product.stock > 0 && product.stock <= 5 && <span className="badge-warning text-xs">Low</span>}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`badge ${product.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            const newStock = prompt('New stock quantity:', product.stock);
                            if (newStock !== null) handleStockUpdate(product._id, parseInt(newStock) || 0);
                          }} 
                          className="btn-ghost text-sm"
                        >
                          Stock
                        </button>
                        <button onClick={() => openModal(product)} className="btn-ghost text-sm">Edit</button>
                        <button onClick={() => handleDelete(product._id)} className="btn-ghost text-sm text-red-500 hover:bg-red-50">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in" onClick={closeModal}>
          <div className="bg-white rounded-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-dark-100 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-dark-900">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={closeModal} className="p-2 text-dark-400 hover:text-dark-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4" noValidate>
              <div>
                <label className="label">Name *</label>
                <input {...register('name', { required: 'Name is required' })} className={`input ${errors.name ? 'input-error' : ''}`} />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
              </div>
              <div>
                <label className="label">Description</label>
                <textarea {...register('description')} className="input" rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Price *</label>
                  <input type="number" min="0" step="0.01" {...register('price', { required: true, valueAsNumber: true })} className={`input ${errors.price ? 'input-error' : ''}`} />
                </div>
                <div>
                  <label className="label">Stock *</label>
                  <input type="number" min="0" {...register('stock', { required: true, valueAsNumber: true })} className={`input ${errors.stock ? 'input-error' : ''}`} />
                </div>
              </div>
              <div>
                <label className="label">Category</label>
                <select {...register('category')} className="input">
                  {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Barcode (Optional)</label>
                <input {...register('barcode')} className="input" placeholder="Scan or enter barcode" />
              </div>
              <div className="pt-4 border-t border-dark-100 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="btn-ghost">Cancel</button>
                <button type="submit" disabled={uploading} className="btn-primary">
                  {uploading ? 'Saving...' : (editingProduct ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}