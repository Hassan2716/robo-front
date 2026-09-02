import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const categories = [
  { value: 'haircut', label: 'Haircut' },
  { value: 'beard', label: 'Beard' },
  { value: 'styling', label: 'Styling' },
  { value: 'treatment', label: 'Treatment' },
  { value: 'package', label: 'Package' },
];

export default function StaffServices() {
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      duration: 30,
      category: 'haircut',
      barbers: [],
    },
  });

  const selectedBarbers = watch('barbers');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, barbersRes] = await Promise.all([
          api.get('/services'),
          api.get('/barbers?active=true'),
        ]);
        setServices(servicesRes.data.data);
        setBarbers(barbersRes.data.data);
      } catch (error) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openModal = (service = null) => {
    if (service) {
      setEditingService(service);
      reset({
        name: service.name,
        description: service.description || '',
        price: service.price,
        duration: service.duration,
        category: service.category,
        barbers: service.barbers?.map(b => b._id) || [],
      });
    } else {
      setEditingService(null);
      reset({
        name: '',
        description: '',
        price: 0,
        duration: 30,
        category: 'haircut',
        barbers: [],
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingService(null);
  };

  const onSubmit = async (data) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('price', data.price.toString());
      formData.append('duration', data.duration.toString());
      formData.append('category', data.category);
      data.barbers.forEach(id => formData.append('barbers', id));

      if (editingService) {
        await api.put(`/services/${editingService._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Service updated');
      } else {
        await api.post('/services', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Service created');
      }
      closeModal();
      const res = await api.get('/services');
      setServices(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save service');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await api.delete(`/services/${serviceId}`);
      toast.success('Service deleted');
      setServices(services.filter(s => s._id !== serviceId));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete');
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
          <h1 className="font-display text-2xl font-bold text-dark-900">Services Management</h1>
          <p className="text-dark-600">Manage services and pricing</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
          Add Service
        </button>
      </div>

      <div className="card overflow-hidden">
        {services.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-dark-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.15 9.15"/>
            </svg>
            <h3 className="font-display text-xl font-semibold text-dark-900 mb-2">No services yet</h3>
            <button onClick={() => openModal()} className="btn-primary">Add Service</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Service</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Duration</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Barbers</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-dark-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-100">
                {services.map((service) => (
                  <tr key={service._id} className="hover:bg-dark-50">
                    <td className="px-4 py-4">
                      <p className="font-medium text-dark-900">{service.name}</p>
                      <p className="text-sm text-dark-500">{service.description?.substring(0, 50)}...</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="badge-secondary capitalize">{service.category}</span>
                    </td>
                    <td className="px-4 py-4">${service.price}</td>
                    <td className="px-4 py-4">{service.duration} min</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {service.barbers?.map((b, i) => (
                          <span key={i} className="badge-secondary text-xs">{b.name}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`badge ${service.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openModal(service)} className="btn-ghost text-sm">Edit</button>
                        <button onClick={() => handleDelete(service._id)} className="btn-ghost text-sm text-red-500 hover:bg-red-50">Delete</button>
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
              <h2 className="font-display text-xl font-semibold text-dark-900">{editingService ? 'Edit Service' : 'Add Service'}</h2>
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
                  <label className="label">Duration (min) *</label>
                  <input type="number" min="15" {...register('duration', { required: true, valueAsNumber: true })} className={`input ${errors.duration ? 'input-error' : ''}`} />
                </div>
              </div>
              <div>
                <label className="label">Category</label>
                <select {...register('category')} className="input">
                  {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Barbers</label>
                <div className="space-y-1">
                  {barbers.map(barber => (
                    <label key={barber._id} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" value={barber._id} {...register('barbers')} className="w-4 h-4 rounded border-dark-300 text-primary-500 focus:ring-primary-500" />
                      <span className="text-sm text-dark-700">{barber.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-dark-100 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="btn-ghost">Cancel</button>
                <button type="submit" disabled={uploading} className="btn-primary">
                  {uploading ? 'Saving...' : (editingService ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}