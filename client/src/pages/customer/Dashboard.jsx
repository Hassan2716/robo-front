import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
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

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-dark-900">Welcome back, {user?.name?.split(' ')[0]}!</h1>
        <p className="text-dark-600">Here's what's happening with your appointments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/booking" className="card p-6 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-500">Book Appointment</p>
              <h3 className="font-display text-xl font-bold text-dark-900 mt-1">Schedule a visit</h3>
            </div>
            <div className="w-14 h-14 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-colors">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
          </div>
        </Link>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-500">Upcoming</p>
              <h3 className="font-display text-3xl font-bold text-dark-900 mt-1">{upcoming.length}</h3>
            </div>
            <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center text-green-500">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-500">Completed</p>
              <h3 className="font-display text-3xl font-bold text-dark-900 mt-1">{past.filter(a => a.status === 'completed').length}</h3>
            </div>
            <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-blue-500">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
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
      ) : upcoming.length > 0 ? (
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-dark-100 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-dark-900">Upcoming Appointments</h2>
            <Link to="/dashboard/appointments" className="text-sm text-primary-500 hover:text-primary-600">View all</Link>
          </div>
          <div className="divide-y divide-dark-100">
            {upcoming.slice(0, 3).map((apt) => (
              <Link key={apt._id} to="/dashboard/appointments" className="block p-4 hover:bg-dark-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500 flex-shrink-0 overflow-hidden">
                    {apt.barber?.photo ? (
                      <>
                        <img
                          src={apt.barber?.photo}
                          alt={apt.barber?.name}
                          className="w-full h-full object-cover rounded-xl"
                          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                        />
                        <span className="font-display text-xl font-bold w-full h-full items-center justify-center bg-primary-500/10" style={{ display: 'none' }}>
                          {apt.barber?.name?.charAt(0)}
                        </span>
                      </>
                    ) : (
                      <span className="font-display text-xl font-bold">{apt.barber?.name?.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-dark-900 truncate">{apt.service?.name}</h3>
                      <span className={`badge ${statusColors[apt.status]}`}>{apt.status}</span>
                    </div>
                    <p className="text-sm text-dark-500">{apt.barber?.name}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-dark-500">
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
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-dark-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="card p-8 text-center">
          <svg className="w-16 h-16 mx-auto text-dark-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <h3 className="font-display text-xl font-semibold text-dark-900 mb-2">No upcoming appointments</h3>
          <p className="text-dark-600 mb-6">Book your next visit to stay looking sharp</p>
          <Link to="/booking" className="btn-primary inline-block">Book Appointment</Link>
        </div>
      )}
    </div>
  );
}