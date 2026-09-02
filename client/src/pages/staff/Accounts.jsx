import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const roles = [
  { value: 'barber', label: 'Barber' },
  { value: 'receptionist', label: 'Receptionist' },
  { value: 'admin', label: 'Admin' },
];

export default function StaffAccounts() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'barber',
      phone: '',
    },
  });

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await api.get('/users?role=barber,receptionist,admin');
        setStaff(res.data.data);
      } catch (error) {
        toast.error('Failed to load staff');
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      reset({
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
      });
    } else {
      setEditingUser(null);
      reset({
        name: '',
        email: '',
        password: '',
        role: 'barber',
        phone: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const onSubmit = async (data) => {
    setUploading(true);
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser._id}`, data);
        toast.success('Staff updated');
      } else {
        await api.post('/auth/register', data);
        toast.success('Staff account created');
      }
      closeModal();
      const res = await api.get('/users?role=barber,receptionist,admin');
      setStaff(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this staff account?')) return;
    try {
      await api.delete(`/users/${userId}`);
      toast.success('Staff deleted');
      setStaff(staff.filter(s => s._id !== userId));
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const roleColors = {
    admin: 'bg-purple-100 text-purple-700',
    barber: 'bg-blue-100 text-blue-700',
    receptionist: 'bg-green-100 text-green-700',
    customer: 'bg-gray-100 text-gray-700',
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
          <h1 className="font-display text-2xl font-bold text-dark-900">Staff Accounts</h1>
          <p className="text-dark-600">Manage staff user accounts and roles</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
          </svg>
          Add Staff
        </button>
      </div>

      <div className="card overflow-hidden">
        {staff.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-dark-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
            </svg>
            <h3 className="font-display text-xl font-semibold text-dark-900 mb-2">No staff accounts</h3>
            <button onClick={() => openModal()} className="btn-primary">Add Staff</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Staff</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Last Login</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-dark-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-100">
                {staff.map((user) => (
                  <tr key={user._id} className="hover:bg-dark-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500">
                          <span className="font-display font-bold">{user.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-dark-900">{user.name}</p>
                          <p className="text-sm text-dark-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`badge ${roleColors[user.role] || 'badge-secondary'}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-dark-900">{user.phone || '-'}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-dark-500">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openModal(user)} className="btn-ghost text-sm">Edit</button>
                        <button onClick={() => handleDelete(user._id)} className="btn-ghost text-sm text-red-500 hover:bg-red-50">Delete</button>
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
              <h2 className="font-display text-xl font-semibold text-dark-900">{editingUser ? 'Edit Staff' : 'Add Staff'}</h2>
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
                <label className="label">Email *</label>
                <input type="email" {...register('email', { required: 'Email is required', pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i })} className={`input ${errors.email ? 'input-error' : ''}`} disabled={!!editingUser} />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                {editingUser && <p className="mt-1 text-xs text-dark-500">Email cannot be changed</p>}
              </div>
              <div>
                <label className="label">{editingUser ? 'New Password (leave blank to keep current)' : 'Password *'} </label>
                <input type="password" {...register('password', { ...(editingUser ? {} : { required: 'Password is required', minLength: 6 }) })} className={`input ${errors.password ? 'input-error' : ''}`} />
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
              </div>
              <div>
                <label className="label">Role *</label>
                <select {...register('role', { required: true })} className="input">
                  {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Phone</label>
                <input type="tel" {...register('phone')} className="input" placeholder="(555) 123-4567" />
              </div>
              <div className="pt-4 border-t border-dark-100 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="btn-ghost">Cancel</button>
                <button type="submit" disabled={uploading} className="btn-primary">
                  {uploading ? 'Saving...' : (editingUser ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}