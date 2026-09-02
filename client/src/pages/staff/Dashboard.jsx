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

const icons = {
  calendar: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>,
  user: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>,
  dollar: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  clock: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  scissors: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.15 9.15"/></svg>,
  chart: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
};

const colorClasses = {
  blue: 'bg-blue-500/10 text-blue-500',
  green: 'bg-green-500/10 text-green-500',
  purple: 'bg-purple-500/10 text-purple-500',
  yellow: 'bg-yellow-500/10 text-yellow-500',
  primary: 'bg-primary-500/10 text-primary-500',
};

export default function StaffDashboard() {
  const { user, hasRole } = useAuth();
  const [stats, setStats] = useState({});
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isBarber = user?.role === 'barber';
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (isBarber) {
          // Barber: fetch their own appointments (controller filters by barber profile)
          const apptsRes = await api.get(`/appointments?date=${todayStr}`);
          const allAppts = apptsRes.data.data || [];
          setTodayAppointments(allAppts.filter(a => a.status !== 'cancelled'));

          // Also fetch upcoming (next 7 days) - reuse same endpoint without date filter
          const upcomingRes = await api.get('/appointments');
          const allUpcoming = (upcomingRes.data.data || []).filter(
            a => a.status !== 'cancelled' && new Date(a.date) >= new Date(todayStr)
          );
          setUpcomingAppointments(allUpcoming.slice(0, 10));
        } else {
          // Admin / Receptionist: fetch dashboard stats + today's appointments
          const [statsRes, apptsRes] = await Promise.all([
            api.get('/reports/dashboard'),
            api.get(`/appointments?date=${todayStr}`),
          ]);
          setStats(statsRes.data.data);
          setTodayAppointments((apptsRes.data.data || []).filter(a => a.status !== 'cancelled'));
        }
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to load dashboard data';
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isBarber, todayStr]);

  // --- Barber Dashboard ---
  if (isBarber) {
    if (loading) {
      return (
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="card p-6">
                <div className="h-6 bg-dark-100 rounded w-1/2" />
                <div className="h-10 bg-dark-100 rounded w-1/3 mt-4" />
              </div>
            ))}
          </div>
          <div className="card p-6"><div className="h-6 bg-dark-100 rounded w-1/4 mb-4" /><div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-16 bg-dark-100 rounded" />)}</div></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="py-8">
          <div className="card p-8 text-center">
            <svg className="w-16 h-16 mx-auto text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            <h2 className="font-display text-xl font-semibold text-dark-900 mb-2">Failed to load dashboard</h2>
            <p className="text-dark-600 mb-6">{error}</p>
            <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
          </div>
        </div>
      );
    }

    const barberStatCards = [
      { label: "Today's Appointments", value: todayAppointments.length, icon: 'calendar', color: 'blue' },
      { label: 'Upcoming (7 days)', value: upcomingAppointments.length, icon: 'clock', color: 'primary' },
      { label: 'Completed Today', value: todayAppointments.filter(a => a.status === 'completed').length, icon: 'scissors', color: 'green' },
    ];

    return (
      <div className="py-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-dark-900">Welcome, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-dark-600">Here's your schedule for today</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {barberStatCards.map((stat, i) => (
            <div key={i} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-dark-500">{stat.label}</p>
                  <h3 className="font-display text-2xl font-bold text-dark-900 mt-1">{stat.value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[stat.color]}`}>
                  {icons[stat.icon]}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="p-6 border-b border-dark-100 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-dark-900">Today's Schedule</h2>
          </div>
          {todayAppointments.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-dark-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              <p className="text-dark-600">No appointments scheduled for today</p>
            </div>
          ) : (
            <div className="divide-y divide-dark-100">
              {todayAppointments.map((apt) => (
                <div key={apt._id} className="p-4 hover:bg-dark-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500 flex-shrink-0">
                      <span className="font-display font-bold">{apt.customer?.name?.charAt(0) || '?'}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-dark-900">{apt.service?.name}</h3>
                        <span className={`badge ${statusColors[apt.status]}`}>{apt.status}</span>
                      </div>
                      <p className="text-sm text-dark-500">{apt.customer?.name}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-dark-500">
                        <span>{formatTime(apt.time)}</span>
                        <span>${apt.totalPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {upcomingAppointments.length > 0 && (
          <div className="card mt-6">
            <div className="p-6 border-b border-dark-100">
              <h2 className="font-display text-lg font-semibold text-dark-900">Upcoming This Week</h2>
            </div>
            <div className="divide-y divide-dark-100">
              {upcomingAppointments.map((apt) => (
                <div key={apt._id} className="p-4 hover:bg-dark-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 flex-shrink-0">
                      <span className="font-display font-bold">{apt.customer?.name?.charAt(0) || '?'}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-dark-900">{apt.service?.name}</h3>
                      <p className="text-sm text-dark-500">{apt.customer?.name}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-dark-500">
                        <span>{formatDate(apt.date)}</span>
                        <span>{formatTime(apt.time)}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`badge ${statusColors[apt.status]}`}>{apt.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- Admin / Receptionist Dashboard ---
  const statCards = [
    { label: "Today's Appointments", value: stats.todayAppointments || 0, icon: 'calendar', color: 'blue', link: '/staff/appointments' },
    { label: 'Walk-ins Today', value: stats.todayWalkIns || 0, icon: 'user', color: 'green', link: '/staff/pos' },
    { label: 'Revenue Today', value: `$${(stats.todayRevenue || 0).toFixed(2)}`, icon: 'dollar', color: 'purple', link: '/staff/reports' },
    { label: 'Pending', value: stats.pendingAppointments || 0, icon: 'clock', color: 'yellow', link: '/staff/appointments' },
  ];

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card p-6">
              <div className="h-6 bg-dark-100 rounded w-1/2" />
              <div className="h-10 bg-dark-100 rounded w-1/3 mt-4" />
            </div>
          ))}
        </div>
        <div className="card p-6">
          <div className="h-6 bg-dark-100 rounded w-1/4 mb-4" />
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-dark-100 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="card p-8 text-center">
          <svg className="w-16 h-16 mx-auto text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <h2 className="font-display text-xl font-semibold text-dark-900 mb-2">Failed to load dashboard</h2>
          <p className="text-dark-600 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-dark-900">Dashboard</h1>
        <p className="text-dark-600">Overview of today's activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, i) => (
          <Link key={i} to={stat.link} className="card p-6 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-500">{stat.label}</p>
                <h3 className="font-display text-2xl font-bold text-dark-900 mt-1">{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[stat.color]} group-hover:scale-110 transition-transform`}>
                {icons[stat.icon]}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick action cards for receptionist/admin */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/staff/appointments" className="card p-6 group hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              {icons.calendar}
            </div>
            <div>
              <h3 className="font-display font-semibold text-dark-900">Manage Appointments</h3>
              <p className="text-sm text-dark-500">View and update all bookings</p>
            </div>
          </div>
        </Link>
        <Link to="/staff/pos" className="card p-6 group hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              {icons.scissors}
            </div>
            <div>
              <h3 className="font-display font-semibold text-dark-900">Point of Sale</h3>
              <p className="text-sm text-dark-500">Process walk-in sales</p>
            </div>
          </div>
        </Link>
        {hasRole(['admin']) && (
          <Link to="/staff/reports" className="card p-6 group hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                {icons.chart}
              </div>
              <div>
                <h3 className="font-display font-semibold text-dark-900">Reports</h3>
                <p className="text-sm text-dark-500">Analytics and revenue</p>
              </div>
            </div>
          </Link>
        )}
        {hasRole(['receptionist']) && (
          <Link to="/staff/products" className="card p-6 group hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                {icons.user}
              </div>
              <div>
                <h3 className="font-display font-semibold text-dark-900">Products</h3>
                <p className="text-sm text-dark-500">Manage inventory</p>
              </div>
            </div>
          </Link>
        )}
      </div>

      <div className="card">
        <div className="p-6 border-b border-dark-100 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-dark-900">Today's Appointments</h2>
          <Link to="/staff/appointments" className="text-sm text-primary-500 hover:text-primary-600">View all</Link>
        </div>

        {todayAppointments.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-dark-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <p className="text-dark-600">No appointments scheduled for today</p>
          </div>
        ) : (
          <div className="divide-y divide-dark-100">
            {todayAppointments.slice(0, 10).map((apt) => (
              <div key={apt._id} className="p-4 hover:bg-dark-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500 flex-shrink-0 overflow-hidden">
                    {apt.barber?.photo ? (
                      <img
                        src={apt.barber.photo}
                        alt={apt.barber?.name}
                        className="w-full h-full object-cover rounded-xl"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                      />
                    ) : null}
                    <span className="font-display font-bold" style={{ display: apt.barber?.photo ? 'none' : 'flex' }}>
                      {apt.barber?.name?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-dark-900">{apt.service?.name}</h3>
                      <span className={`badge ${statusColors[apt.status]}`}>{apt.status}</span>
                    </div>
                    <p className="text-sm text-dark-500">{apt.barber?.name} • {apt.customer?.name}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-dark-500">
                      <span>{formatTime(apt.time)}</span>
                      <span>${apt.totalPrice}</span>
                    </div>
                  </div>
                </div>
                {hasRole(['receptionist', 'admin']) && (
                  <Link to="/staff/appointments" className="btn-ghost text-sm">Manage</Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
