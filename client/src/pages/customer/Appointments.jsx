import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

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

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
  'no-show': 'bg-gray-100 text-gray-700',
};

export default function CustomerAppointments() {
  const { user } = useAuth();
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get('/appointments/my');
        setUpcoming(res.data.data.upcoming || []);
        setPast(res.data.data.past || []);
      } catch (error) {
        toast.error('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleCancel = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    
    setCancellingId(appointmentId);
    try {
      await api.put(`/appointments/${appointmentId}/cancel`);
      toast.success('Appointment cancelled');
      setUpcoming(upcoming.filter(a => a._id !== appointmentId));
      setPast(prev => [{ ...upcoming.find(a => a._id === appointmentId), status: 'cancelled' }, ...prev]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel appointment');
    } finally {
      setCancellingId(null);
    }
  };

  const handleReschedule = (appointment) => {
    // Navigate to booking with pre-filled data would be ideal
    // For now, just show a toast
    toast('Rescheduling would navigate to booking with pre-filled data');
  };

  const appointments = activeTab === 'upcoming' ? upcoming : past;
  const emptyMessage = activeTab === 'upcoming' 
    ? 'No upcoming appointments. Book your next visit!'
    : 'No past appointments yet.';

  if (loading) {
    return (
      <div className="py-8 animate-pulse space-y-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="card p-4">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-dark-100 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-dark-100 rounded w-1/3" />
                <div className="h-4 bg-dark-100 rounded w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-dark-900">My Appointments</h1>
        <p className="text-dark-600">Manage your upcoming and past appointments</p>
      </div>

      <div className="flex gap-2 mb-6 border-b border-dark-200" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === 'upcoming'}
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === 'upcoming'
              ? 'bg-primary-500 text-white'
              : 'text-dark-500 hover:text-dark-900'
          }`}
        >
          Upcoming ({upcoming.length})
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'past'}
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === 'past'
              ? 'bg-primary-500 text-white'
              : 'text-dark-500 hover:text-dark-900'
          }`}
        >
          Past ({past.length})
        </button>
      </div>

      {appointments.length === 0 ? (
        <div className="card p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-dark-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <h3 className="font-display text-xl font-semibold text-dark-900 mb-2">{activeTab === 'upcoming' ? 'No upcoming appointments' : 'No past appointments'}</h3>
          <p className="text-dark-600 mb-6">{emptyMessage}</p>
          {activeTab === 'upcoming' && (
            <a href="/booking" className="btn-primary inline-block">Book Appointment</a>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((apt) => (
            <article key={apt._id} className="card p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500 flex-shrink-0 overflow-hidden">
                  {apt.barber?.photo ? (
                    <>
                      <img
                        src={apt.barber?.photo}
                        alt={apt.barber?.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                      />
                      <span className="font-display text-2xl font-bold w-full h-full items-center justify-center bg-primary-500/10" style={{ display: 'none' }}>
                        {apt.barber?.name?.charAt(0)}
                      </span>
                    </>
                  ) : (
                    <span className="font-display text-2xl font-bold">{apt.barber?.name?.charAt(0)}</span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-dark-900">{apt.service?.name}</h3>
                      <p className="text-dark-500">{apt.barber?.name}</p>
                    </div>
                    <span className={`badge ${statusColors[apt.status]}`}>{apt.status}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-6 mt-3 text-sm text-dark-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      {formatDate(apt.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {formatTime(apt.time)}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {apt.service?.duration} min
                    </span>
                    <span className="font-display font-bold text-primary-500">${apt.totalPrice}</span>
                  </div>
                  
                  {apt.notes && (
                    <p className="mt-2 text-sm text-dark-600 bg-dark-50 p-2 rounded-lg">{apt.notes}</p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 md:ml-auto">
                  {activeTab === 'upcoming' && apt.status !== 'cancelled' && (
                    <>
                      <button
                        onClick={() => handleCancel(apt._id)}
                        disabled={cancellingId === apt._id}
                        className="btn-ghost text-sm text-red-500 hover:bg-red-50"
                      >
                        {cancellingId === apt._id ? 'Cancelling...' : 'Cancel'}
                      </button>
                      <button
                        onClick={() => handleReschedule(apt)}
                        className="btn-outline text-sm"
                      >
                        Reschedule
                      </button>
                    </>
                  )}
                  {activeTab === 'past' && (
                    <button className="btn-outline text-sm" disabled>
                      Rebook
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}