import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function StaffBarbers() {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBarber, setEditingBarber] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      specialties: '',
      experience: 0,
      bio: '',
      workingHours: [],
    },
  });

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const res = await api.get('/barbers');
        setBarbers(res.data.data);
      } catch (error) {
        toast.error('Failed to load barbers');
      } finally {
        setLoading(false);
      }
    };
    fetchBarbers();
  }, []);

  const openModal = (barber = null) => {
    if (barber) {
      setEditingBarber(barber);
      reset({
        name: barber.name,
        specialties: barber.specialties?.join(', ') || '',
        experience: barber.experience || 0,
        bio: barber.bio || '',
      });
    } else {
      setEditingBarber(null);
      reset({
        name: '',
        specialties: '',
        experience: 0,
        bio: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBarber(null);
  };

  const onSubmit = async (data) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('specialties', data.specialties);
      formData.append('experience', data.experience.toString());
      formData.append('bio', data.bio);

      if (editingBarber) {
        await api.put(`/barbers/${editingBarber._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Barber updated successfully');
      } else {
        await api.post('/barbers', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Barber created successfully');
      }
      closeModal();
      // Refresh
      const res = await api.get('/barbers');
      setBarbers(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save barber');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (barberId) => {
    if (!window.confirm('Are you sure you want to delete this barber?')) return;
    
    try {
      await api.delete(`/barbers/${barberId}`);
      toast.success('Barber deleted');
      setBarbers(barbers.filter(b => b._id !== barberId));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete barber');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="card p-4">
            <div className="h-12 bg-dark-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-dark-900">Barbers Management</h1>
          <p className="text-dark-600">Manage barber profiles and schedules</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
          Add Barber
        </button>
      </div>

      <div className="card overflow-hidden">
        {barbers.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-dark-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <h3 className="font-display text-xl font-semibold text-dark-900 mb-2">No barbers yet</h3>
            <p className="text-dark-600 mb-6">Add your first barber to get started</p>
            <button onClick={() => openModal()} className="btn-primary">Add Barber</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Barber</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Specialties</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Experience</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-dark-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-100">
                {barbers.map((barber) => (
                  <tr key={barber._id} className="hover:bg-dark-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500">
                          {barber.photo ? (
                            <>
                              <img
                                src={barber.photo}
                                alt={barber.name}
                                className="w-full h-full object-cover rounded-full"
                                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                              />
                              <span className="font-display font-bold w-full h-full items-center justify-center" style={{ display: 'none' }}>
                                {barber.name?.charAt(0)}
                              </span>
                            </>
                          ) : (
                            <span className="font-display font-bold">{barber.name?.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-dark-900">{barber.name}</p>
                          <p className="text-sm text-dark-500">{barber.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {barber.specialties?.map((s, i) => (
                          <span key={i} className="badge-primary text-xs">{s}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-dark-900">{barber.experience}+ years</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`badge ${barber.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {barber.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openModal(barber)} className="btn-ghost text-sm">Edit</button>
                        <button onClick={() => handleDelete(barber._id)} className="btn-ghost text-sm text-red-500 hover:bg-red-50">Delete</button>
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
              <h2 className="font-display text-xl font-semibold text-dark-900">{editingBarber ? 'Edit Barber' : 'Add Barber'}</h2>
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
                <label className="label">Specialties (comma separated)</label>
                <input {...register('specialties')} className="input" placeholder="e.g., Classic Cuts, Fades, Beard Trim" />
              </div>
              <div>
                <label className="label">Experience (years)</label>
                <input type="number" min="0" {...register('experience', { valueAsNumber: true })} className="input" />
              </div>
              <div>
                <label className="label">Bio</label>
                <textarea {...register('bio')} className="input" rows={3} placeholder="Short bio for customers..." />
              </div>
              <div className="pt-4 border-t border-dark-100 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="btn-ghost">Cancel</button>
                <button type="submit" disabled={uploading} className="btn-primary">
                  {uploading ? 'Saving...' : (editingBarber ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}