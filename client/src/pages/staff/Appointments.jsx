import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const todayStr = () => new Date().toISOString().split('T')[0];

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
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [walkInForm, setWalkInForm] = useState({
    barber: '',
    service: '',
    date: todayStr(),
    time: '',
    customerName: '',
    customerPhone: '',
    notes: '',
  });
  const [walkInErrors, setWalkInErrors] = useState({});
  const [walkInSubmitting, setWalkInSubmitting] = useState(false);
  const [services, setServices] = useState([]);

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
    if (walkInForm.barber) {
      const fetchServices = async () => {
        try {
          const res = await api.get(`/services?barber=${walkInForm.barber}&active=true`);
          setServices(res.data.data);
        } catch (error) {
          setServices([]);
        }
      };
      fetchServices();
    } else {
      setServices([]);
    }
  }, [walkInForm.barber]);

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

  const openWalkInModal = () => {
    setWalkInForm({
      barber: '',
      service: '',
      date: todayStr(),
      time: '',
      customerName: '',
      customerPhone: '',
      notes: '',
    });
    setWalkInErrors({});
    setServices([]);
    setShowWalkInModal(true);
  };

  const closeWalkInModal = () => {
    setShowWalkInModal(false);
    setWalkInErrors({});
  };

  const handleWalkInChange = (field, value) => {
    setWalkInForm(prev => ({ ...prev, [field]: value }));
    if (walkInErrors[field]) {
      setWalkInErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (field === 'barber') {
      setWalkInForm(prev => ({ ...prev, service: '' }));
    }
  };

  const validateWalkIn = () => {
    const errs = {};
    if (!walkInForm.barber) errs.barber = 'Please select a barber';
    if (!walkInForm.service) errs.service = 'Please select a service';
    if (!walkInForm.date) errs.date = 'Please select a date';
    if (!walkInForm.time) errs.time = 'Please enter a time';
    if (!walkInForm.customerName.trim()) errs.customerName = 'Customer name is required';
    setWalkInErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleWalkInSubmit = async () => {
    if (!validateWalkIn()) return;
    setWalkInSubmitting(true);
    try {
      const payload = {
        barber: walkInForm.barber,
        service: walkInForm.service,
        date: new Date(walkInForm.date).toISOString(),
        time: walkInForm.time,
        notes: walkInForm.notes || `Walk-in customer: ${walkInForm.customerName}, Phone: ${walkInForm.customerPhone || 'N/A'}`,
      };
      await api.post('/appointments/walk-in', payload);
      toast.success('Walk-in appointment created successfully');
      closeWalkInModal();
      const params = new URLSearchParams();
      if (filters.date) params.append('date', filters.date);
      if (filters.barber) params.append('barber', filters.barber);
      if (filters.status) params.append('status', filters.status);
      const aptRes = await api.get(`/appointments?${params.toString()}`);
      setAppointments(aptRes.data.data);
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to create walk-in appointment';
      if (error.response?.data?.errors) {
        const fieldErrors = {};
        error.response.data.errors.forEach(err => {
          if (err.param) fieldErrors[err.param] = err.msg;
        });
        setWalkInErrors(fieldErrors);
      } else {
        toast.error(msg);
      }
    } finally {
      setWalkInSubmitting(false);
    }
  };

  return (
    <div className="py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-dark-900">Appointments</h1>
          <p className="text-dark-600">Manage and view all appointments</p>
        </div>
        <button onClick={openWalkInModal} className="btn-primary">
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

      {showWalkInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in p-4" onClick={closeWalkInModal}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-dark-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
              <h2 className="font-display text-xl font-semibold text-dark-900">Add Walk-in Appointment</h2>
              <button onClick={closeWalkInModal} className="p-2 text-dark-400 hover:text-dark-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label">Barber *</label>
                <select
                  className={`input ${walkInErrors.barber ? 'input-error' : ''}`}
                  value={walkInForm.barber}
                  onChange={(e) => handleWalkInChange('barber', e.target.value)}
                >
                  <option value="">Select a barber</option>
                  {barbers.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                </select>
                {walkInErrors.barber && <p className="mt-1 text-sm text-red-500">{walkInErrors.barber}</p>}
              </div>

              <div>
                <label className="label">Service *</label>
                <select
                  className={`input ${walkInErrors.service ? 'input-error' : ''}`}
                  value={walkInForm.service}
                  onChange={(e) => handleWalkInChange('service', e.target.value)}
                  disabled={!walkInForm.barber}
                >
                  <option value="">Select a service</option>
                  {services.map(s => <option key={s._id} value={s._id}>{s.name} - ${s.price}</option>)}
                </select>
                {walkInErrors.service && <p className="mt-1 text-sm text-red-500">{walkInErrors.service}</p>}
                {walkInForm.barber && services.length === 0 && <p className="mt-1 text-sm text-dark-500">No services available for this barber</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Date *</label>
                  <input
                    type="date"
                    className={`input ${walkInErrors.date ? 'input-error' : ''}`}
                    value={walkInForm.date}
                    onChange={(e) => handleWalkInChange('date', e.target.value)}
                  />
                  {walkInErrors.date && <p className="mt-1 text-sm text-red-500">{walkInErrors.date}</p>}
                </div>
                <div>
                  <label className="label">Time *</label>
                  <input
                    type="time"
                    className={`input ${walkInErrors.time ? 'input-error' : ''}`}
                    value={walkInForm.time}
                    onChange={(e) => handleWalkInChange('time', e.target.value)}
                  />
                  {walkInErrors.time && <p className="mt-1 text-sm text-red-500">{walkInErrors.time}</p>}
                </div>
              </div>

              <div>
                <label className="label">Customer Name *</label>
                <input
                  type="text"
                  className={`input ${walkInErrors.customerName ? 'input-error' : ''}`}
                  placeholder="Walk-in customer name"
                  value={walkInForm.customerName}
                  onChange={(e) => handleWalkInChange('customerName', e.target.value)}
                />
                {walkInErrors.customerName && <p className="mt-1 text-sm text-red-500">{walkInErrors.customerName}</p>}
              </div>

              <div>
                <label className="label">Customer Phone (optional)</label>
                <input
                  type="tel"
                  className="input"
                  placeholder="(555) 123-4567"
                  value={walkInForm.customerPhone}
                  onChange={(e) => handleWalkInChange('customerPhone', e.target.value)}
                />
              </div>

              <div>
                <label className="label">Notes (optional)</label>
                <textarea
                  className="input"
                  rows={2}
                  placeholder="Any special requests..."
                  value={walkInForm.notes}
                  onChange={(e) => handleWalkInChange('notes', e.target.value)}
                />
              </div>

              <div className="pt-4 border-t border-dark-100 flex justify-end gap-3">
                <button type="button" onClick={closeWalkInModal} className="btn-ghost">Cancel</button>
                <button type="button" onClick={handleWalkInSubmit} disabled={walkInSubmitting} className="btn-primary">
                  {walkInSubmitting ? 'Creating...' : 'Create Walk-in'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}