import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function BarberDetail() {
  const { id } = useParams();
  const { isAuthenticated, hasRole } = useAuth();
  const [barber, setBarber] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [barberRes, servicesRes] = await Promise.all([
          api.get(`/barbers/${id}`),
          api.get(`/services?barber=${id}&active=true`),
        ]);
        setBarber(barberRes.data.data);
        setServices(servicesRes.data.data);
      } catch (err) {
        setError('Failed to load barber details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const formatDay = (day) => day.charAt(0).toUpperCase() + day.slice(1);
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse space-y-8">
          <div className="flex gap-8">
            <div className="aspect-square w-64 bg-dark-100 rounded-xl" />
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-dark-100 rounded w-1/3" />
              <div className="h-4 bg-dark-100 rounded w-1/2" />
              <div className="h-4 bg-dark-100 rounded w-2/3" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
              <div key={i} className="h-20 bg-dark-100 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !barber) {
    return (
      <div className="py-20 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <svg className="w-16 h-16 mx-auto text-dark-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <h2 className="font-display text-2xl font-bold text-dark-900 mb-2">Barber not found</h2>
          <p className="text-dark-600 mb-6">The barber you're looking for doesn't exist or has been removed.</p>
          <Link to="/barbers" className="btn-primary">Back to Barbers</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/barbers" className="inline-flex items-center text-dark-500 hover:text-primary-500 transition-colors mb-8">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
          Back to Barbers
        </Link>

        <div className="card overflow-hidden">
          <div className="md:flex">
            <div className="md:w-64 aspect-square md:aspect-auto relative">
              {barber.photo ? (
                <>
                  <img
                    src={barber.photo}
                    alt={barber.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-600 items-center justify-center text-white text-8xl font-display" style={{ display: 'none' }}>
                    {barber.name.charAt(0)}
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-8xl font-display">
                  {barber.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="p-6 md:p-8 flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="font-display text-3xl font-bold text-dark-900">{barber.name}</h1>
                  <p className="text-primary-500 font-medium mt-1">{barber.experience}+ years experience</p>
                </div>
                {isAuthenticated && hasRole(['customer']) && (
                  <Link to="/booking" className="btn-primary whitespace-nowrap">
                    Book Appointment
                  </Link>
                )}
              </div>

              {barber.bio && (
                <div className="mb-6">
                  <p className="text-dark-600 leading-relaxed">{barber.bio}</p>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-display text-lg font-semibold text-dark-900 mb-3">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {barber.specialties?.map((specialty, i) => (
                    <span key={i} className="badge bg-primary-500/10 text-primary-700">{specialty}</span>
                  ))}
                </div>
              </div>

              <div className="border-t border-dark-100 pt-6">
                <h3 className="font-display text-lg font-semibold text-dark-900 mb-4">Weekly Schedule</h3>
                <div className="space-y-2">
                  {days.map(day => {
                    const schedule = barber.workingHours?.find(wh => wh.day === day);
                    const isWorking = schedule?.isWorking;
                    return (
                      <div key={day} className="flex items-center justify-between py-2 px-4 bg-dark-50 rounded-lg">
                        <span className={`font-medium ${isWorking ? 'text-dark-900' : 'text-dark-400'}`}>
                          {formatDay(day)}
                        </span>
                        <span className="text-sm">
                          {isWorking 
                            ? `${formatTime(schedule.startTime)} - ${formatTime(schedule.endTime)}`
                            : 'Closed'}
                          {schedule?.breakStart && schedule?.breakEnd && (
                            <span className="ml-2 text-xs text-dark-500">
                              (Break: {formatTime(schedule.breakStart)} - {formatTime(schedule.breakEnd)})
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {services.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-2xl font-bold text-dark-900 mb-6">Services by {barber.name.split(' ')[0]}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <article key={service._id} className="card p-6 group">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-display text-lg font-semibold text-dark-900">{service.name}</h3>
                        <span className="font-display text-xl font-bold text-primary-500">${service.price}</span>
                      </div>
                      <p className="text-dark-500 text-sm mb-2">{service.description || 'No description available'}</p>
                      <div className="flex items-center gap-4 text-sm text-dark-500">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          {service.duration} min
                        </span>
                        <span className="badge-secondary">{service.category}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}