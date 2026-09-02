import { useEffect, useState } from 'react';
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

const statusOrder = ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'];

export default function StaffAppointments() {
  const { hasRole } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    date: new Date().toISOString().split('T')[0],
    barber: '',
    status: '',
  });
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [barbersRes] = await Promise.all([
          api.get('/barbers?active=true'),
        ]);
        setBarbers(barbersRes.data.data);
      } catch (error) {
        toast.error('Failed to load barbers');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.date) params.append('date', filters.date);
        if (filters.barber) params.append('barber', filters.barber);
        if (filters.status) params.append('status', filters.status);
        
        const res = await api.get(`/appointments?${params.toString()}`);
        setAppointments(res.data.data);
      } catch (error) {
        toast.error('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [filters]);

  const handleStatusChange = async (appointmentId, newStatus) => {
    setUpdatingId(appointmentId);
    try {
      await api.put(`/appointments/${appointmentId}/status`, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      setAppointments(appointments.map(a => 
        a._id === appointmentId ? { ...a, status: newStatus } : a
      ));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleWalkIn = () => {
    toast('Walk-in booking would open a modal');
  };

  return (
    <div className="py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-dark-900">Appointments</h1>
          <p className="text-dark-600">Manage and view all appointments</p>
        </div>
        <button onClick={handleWalkIn} className="btn-primary">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
          Add Walk-in
        </button>
      </div>

      <div className="card p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="label mb-1">Date</label>
            <input
              type="date"
              className="input"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            />
          </div>
          <div>
            <label className="label mb-1">Barber</label>
            <select className="input" value={filters.barber} onChange={(e) => setFilters({ ...filters, barber: e.target.value })}>
              <option value="">All Barbers</option>
              {barbers.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label mb-1">Status</label>
            <select className="input" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option value="">All Statuses</option>
              {statusOrder.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}</option>)}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="card p-4">
              <div className="h-12 bg-dark-100 rounded" />
            </div>
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <div className="card p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-dark-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <p className="text-dark-600">No appointments found for the selected filters</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Barber</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Service</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-dark-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-100">
                {appointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-dark-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-dark-900">{formatTime(apt.time)}</div>
                      <div className="text-sm text-dark-500">{formatDate(apt.date)}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-dark-900">{apt.customer?.name}</div>
                      <div className="text-sm text-dark-500">{apt.customer?.email}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-dark-900">{apt.barber?.name}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-dark-900">{apt.service?.name}</div>
                      <div className="text-sm text-dark-500">{apt.service?.duration} min</div>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={apt.status}
                        onChange={(e) => handleStatusChange(apt._id, e.target.value)}
                        disabled={updatingId === apt._id}
                        className={`badge ${statusColors[apt.status]} cursor-pointer`}
                      >
                        {statusOrder.map(s => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-dark-900">${apt.totalPrice}</div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {hasRole(['receptionist', 'admin']) && (
                          <button className="btn-ghost text-sm">View</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}