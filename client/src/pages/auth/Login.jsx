import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const { user } = await login(data.email, data.password);
      toast.success('Welcome back!');

      const staffRoles = ['barber', 'receptionist', 'admin'];
      if (staffRoles.includes(user.role)) {
        navigate('/staff');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-16 px-4 bg-dark-50">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
              <svg className="w-10 h-10 text-primary-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
              <span className="font-display text-2xl font-bold text-dark-900">RoboCutz</span>
            </Link>
            <h1 className="font-display text-2xl font-bold text-dark-900 mb-2">Welcome Back</h1>
            <p className="text-dark-600">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div>
              <label htmlFor="email" className="label">Email</label>
              <input
                id="email"
                type="email"
                className={`input ${errors.email ? 'input-error' : ''}`}
                placeholder="your@email.com"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' },
                })}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && <p id="email-error" className="mt-1 text-sm text-red-500" role="alert">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="label">Password</label>
              <input
                id="password"
                type="password"
                className={`input ${errors.password ? 'input-error' : ''}`}
                placeholder="••••••••"
                {...register('password', { required: 'Password is required' })}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              {errors.password && <p id="password-error" className="mt-1 text-sm text-red-500" role="alert">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-dark-300 text-primary-500 focus:ring-primary-500" />
                <span className="text-sm text-dark-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary-500 hover:text-primary-600">Forgot password?</Link>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-4"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-dark-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-500 hover:text-primary-600 font-medium">Sign up</Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-dark-100">
            <p className="text-xs text-dark-500 text-center mb-4">Demo Credentials</p>
            <div className="space-y-2 text-sm">
              <p className="text-dark-600"><strong>Customer:</strong> Register a new account</p>
              <p className="text-dark-600"><strong>Admin:</strong> admin@robocutz.com / password123</p>
              <p className="text-dark-600"><strong>Receptionist:</strong> reception@robocutz.com / password123</p>
              <p className="text-dark-600"><strong>Barbers:</strong> mike@robocutz.com / password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}