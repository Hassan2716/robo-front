import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function CustomerProfile() {
  const { user, updateProfile, updatePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
    },
  });

  const { register: registerPass, handleSubmit: handleSubmitPass, formState: { errors: errorsPass }, watch } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = watch('newPassword');

  const onProfileSubmit = async (data) => {
    setSaving(true);
    try {
      await updateProfile(data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setChangingPassword(true);
    try {
      await updatePassword(data);
      toast.success('Password changed successfully');
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="py-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-dark-900">Profile Settings</h1>
        <p className="text-dark-600">Manage your account information and preferences</p>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-dark-200">
          <nav className="flex -mb-px" role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === 'profile'}
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'profile'
                  ? 'border-primary-500 text-primary-500'
                  : 'border-transparent text-dark-500 hover:text-dark-900'
              }`}
            >
              Profile
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'password'}
              onClick={() => setActiveTab('password')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'password'
                  ? 'border-primary-500 text-primary-500'
                  : 'border-transparent text-dark-500 hover:text-dark-900'
              }`}
            >
              Password
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-6" noValidate>
              <div>
                <label htmlFor="name" className="label">Full Name</label>
                <input
                  id="name"
                  type="text"
                  className={`input ${errors.name ? 'input-error' : ''}`}
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div>
                <label htmlFor="email" className="label">Email</label>
                <input
                  id="email"
                  type="email"
                  className="input bg-dark-50 cursor-not-allowed"
                  value={user?.email}
                  disabled
                />
                <p className="mt-1 text-sm text-dark-500">Email cannot be changed. Contact support if needed.</p>
              </div>

              <div>
                <label htmlFor="phone" className="label">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  className={`input ${errors.phone ? 'input-error' : ''}`}
                  placeholder="(555) 123-4567"
                  {...register('phone')}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
              </div>

              <div className="pt-4 border-t border-dark-200">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary w-full sm:w-auto"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handleSubmitPass(onPasswordSubmit)} className="space-y-6" noValidate>
              <div>
                <label htmlFor="currentPassword" className="label">Current Password</label>
                <input
                  id="currentPassword"
                  type="password"
                  className={`input ${errorsPass.currentPassword ? 'input-error' : ''}`}
                  placeholder="••••••••"
                  {...registerPass('currentPassword', { required: 'Current password is required' })}
                />
                {errorsPass.currentPassword && <p className="mt-1 text-sm text-red-500">{errorsPass.currentPassword.message}</p>}
              </div>

              <div>
                <label htmlFor="newPassword" className="label">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  className={`input ${errorsPass.newPassword ? 'input-error' : ''}`}
                  placeholder="••••••••"
                  {...registerPass('newPassword', { 
                    required: 'New password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                />
                {errorsPass.newPassword && <p className="mt-1 text-sm text-red-500">{errorsPass.newPassword.message}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="label">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  className={`input ${errorsPass.confirmPassword ? 'input-error' : ''}`}
                  placeholder="••••••••"
                  {...registerPass('confirmPassword', { 
                    required: 'Please confirm your password',
                    validate: value => value === newPassword || 'Passwords do not match',
                  })}
                />
                {errorsPass.confirmPassword && <p className="mt-1 text-sm text-red-500">{errorsPass.confirmPassword.message}</p>}
              </div>

              <div className="pt-4 border-t border-dark-200">
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="btn-primary w-full sm:w-auto"
                >
                  {changingPassword ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="mt-6 card p-6 bg-red-50 border-red-200">
        <h3 className="font-semibold text-red-800 mb-2">Danger Zone</h3>
        <p className="text-red-700 text-sm mb-4">Once you delete your account, there is no going back. Please be certain.</p>
        <button className="btn text-red-500 border-red-500 hover:bg-red-500 hover:text-white text-sm">Delete Account</button>
      </div>
    </div>
  );
}