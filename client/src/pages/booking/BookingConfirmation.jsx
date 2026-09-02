import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function BookingConfirmation() {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await api.get(`/appointments/${id}`);
        setAppointment(res.data.data);
      } catch (err) {
        setError('Failed to load appointment details');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [id]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="py-20 text-center">
        <div className="max-w-md mx-auto px-4">
          <svg className="w-16 h-16 mx-auto text-dark-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <h2 className="font-display text-2xl font-bold text-dark-900 mb-2">Appointment Not Found</h2>
          <p className="text-dark-600 mb-6">{error}</p>
          <Link to="/booking" className="btn-primary">Book New Appointment</Link>
        </div>
      </div>
    );
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
    'no-show': 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="py-16 bg-dark-50 min-h-[calc(100vh-8rem)]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h1 className="font-display text-3xl font-bold text-dark-900 mb-2">Booking Confirmed!</h1>
          <p className="text-dark-600">Your appointment has been successfully scheduled</p>
        </div>

        <div className="card overflow-hidden mb-6">
          <div className="bg-primary-500 px-6 py-4">
            <h2 className="font-display text-xl font-bold text-white">Appointment Details</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-dark-50 rounded-lg">
              <div>
                <p className="text-sm text-dark-500">Status</p>
                <span className={`badge ${statusColors[appointment.status] || 'badge-secondary'}`}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1).replace('-', ' ')}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-dark-500">Booking ID</p>
                <p className="font-mono text-sm text-dark-900">#{appointment._id.slice(-8).toUpperCase()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-dark-50 rounded-lg">
                <p className="text-sm text-dark-500">Barber</p>
                <p className="font-medium text-dark-900">{appointment.barber?.name}</p>
              </div>
              <div className="p-4 bg-dark-50 rounded-lg">
                <p className="text-sm text-dark-500">Service</p>
                <p className="font-medium text-dark-900">{appointment.service?.name}</p>
              </div>
              <div className="p-4 bg-dark-50 rounded-lg">
                <p className="text-sm text-dark-500">Date</p>
                <p className="font-medium text-dark-900">{formatDate(appointment.date)}</p>
              </div>
              <div className="p-4 bg-dark-50 rounded-lg">
                <p className="text-sm text-dark-500">Time</p>
                <p className="font-medium text-dark-900">{formatTime(appointment.time)}</p>
              </div>
            </div>

            <div className="p-4 bg-dark-50 rounded-lg">
              <p className="text-sm text-dark-500">Duration</p>
              <p className="font-medium text-dark-900">{appointment.service?.duration} minutes</p>
            </div>

            <div className="p-4 bg-dark-50 rounded-lg">
              <p className="text-sm text-dark-500">Total</p>
              <p className="font-display text-2xl font-bold text-primary-500">${appointment.totalPrice.toFixed(2)}</p>
            </div>

            {appointment.notes && (
              <div className="p-4 bg-dark-50 rounded-lg">
                <p className="text-sm text-dark-500">Notes</p>
                <p className="text-dark-900">{appointment.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="card p-6 bg-yellow-50 border-yellow-200 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <div>
              <h3 className="font-semibold text-yellow-800">Important Reminders</h3>
              <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                <li>• Please arrive 5-10 minutes before your appointment</li>
                <li>• Cancellations require at least 2 hours notice</li>
                <li>• A confirmation email has been sent to your email address</li>
                <li>• You'll receive a reminder 24 hours before your appointment</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/dashboard/appointments" className="btn-primary">
            View My Appointments
          </Link>
          <Link to="/" className="btn-outline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}