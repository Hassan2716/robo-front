import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const steps = [
  { id: 1, title: 'Barber', description: 'Choose your barber' },
  { id: 2, title: 'Service', description: 'Select a service' },
  { id: 3, title: 'Date & Time', description: 'Pick a time slot' },
  { id: 4, title: 'Confirm', description: 'Review and book' },
];

export default function Booking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      barber: '',
      service: '',
      date: '',
      time: '',
      notes: '',
    },
  });

  const selectedBarber = watch('barber');
  const selectedService = watch('service');
  const selectedDate = watch('date');

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const res = await api.get('/barbers?active=true');
        setBarbers(res.data.data);
      } catch (error) {
        toast.error('Failed to load barbers');
      }
    };
    fetchBarbers();
  }, []);

  useEffect(() => {
    if (selectedBarber) {
      const fetchServices = async () => {
        try {
          const res = await api.get(`/services?barber=${selectedBarber}&active=true`);
          setServices(res.data.data);
          setValue('service', '');
        } catch (error) {
          toast.error('Failed to load services');
        }
      };
      fetchServices();
    } else {
      setServices([]);
      setValue('service', '');
    }
  }, [selectedBarber, setValue]);

  useEffect(() => {
    if (selectedBarber && selectedService && selectedDate) {
      const fetchSlots = async () => {
        setLoadingSlots(true);
        try {
          const res = await api.get(`/appointments/slots?barberId=${selectedBarber}&date=${selectedDate}&service=${selectedService}`);
          setAvailableSlots(res.data.data);
          setValue('time', '');
        } catch (error) {
          toast.error('Failed to load available slots');
          setAvailableSlots([]);
        } finally {
          setLoadingSlots(false);
        }
      };
      fetchSlots();
    } else {
      setAvailableSlots([]);
      setValue('time', '');
    }
  }, [selectedBarber, selectedService, selectedDate, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post('/appointments', data);
      toast.success('Appointment booked successfully!');
      navigate(`/booking/confirmation/${res.data.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!selectedBarber;
      case 2: return !!selectedService;
      case 3: return !!selectedDate && !!watch('time');
      case 4: return true;
      default: return false;
    }
  };

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

  const minDate = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const selectedBarberData = barbers.find(b => b._id === selectedBarber);
  const selectedServiceData = services.find(s => s._id === selectedService);

  return (
    <div className="py-16 bg-dark-50 min-h-[calc(100vh-8rem)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-dark-500 hover:text-primary-500 transition-colors mb-6">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            Back to Home
          </Link>
          <h1 className="font-display text-3xl font-bold text-dark-900 mb-2">Book Appointment</h1>
          <p className="text-dark-600">Step {currentStep} of 4</p>
        </div>

        <div className="mb-8 hidden md:flex" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={4} aria-label="Booking progress">
          {steps.map((step, index) => (
            <div key={step.id} className="flex-1 flex flex-col items-center relative">
              {index < steps.length - 1 && (
                <div className="absolute top-5 left-1/2 w-full h-1 bg-dark-200 z-0" />
              )}
              <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
                step.id < currentStep
                  ? 'bg-primary-500 text-white'
                  : step.id === currentStep
                  ? 'bg-primary-500 text-white ring-4 ring-primary-500/20'
                  : 'bg-dark-100 text-dark-400'
              }`}>
                {step.id < currentStep ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                ) : step.id}
              </div>
              <span className={`mt-2 text-xs font-medium text-center ${step.id <= currentStep ? 'text-dark-900' : 'text-dark-400'}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>

        <div className="md:hidden mb-8 flex items-center justify-between" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={4}>
          <button onClick={prevStep} disabled={currentStep === 1} className="btn-ghost p-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <div className="flex-1 mx-4">
            <div className="h-1 bg-dark-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary-500 transition-all duration-300" style={{ width: `${(currentStep / 4) * 100}%` }} />
            </div>
            <p className="text-center text-xs text-dark-500 mt-1">Step {currentStep} of 4: {steps[currentStep - 1].title}</p>
          </div>
          <button onClick={nextStep} disabled={!canProceed() || loading} className="btn-ghost p-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card p-6 md:p-8 animate-fade-in" noValidate>
          {/* Step 1: Select Barber */}
          {currentStep === 1 && (
            <div>
              <h2 className="font-display text-xl font-bold text-dark-900 mb-2">Choose Your Barber</h2>
              <p className="text-dark-600 mb-6">Select the barber you'd like to book with</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="radiogroup" aria-label="Select barber">
                {barbers.map((barber) => (
                  <label
                    key={barber._id}
                    className={`relative cursor-pointer ${selectedBarber === barber._id ? 'ring-2 ring-primary-500' : ''}`}
                  >
                    <input
                      type="radio"
                      value={barber._id}
                      className="sr-only"
                      {...register('barber')}
                      onChange={() => nextStep()}
                    />
                    <div className="card h-full p-4 transition-all hover:shadow-md">
                      <div className="aspect-square mb-4 relative overflow-hidden rounded-lg">
                        {barber.photo ? (
                          <>
                            <img
                              src={barber.photo}
                              alt={barber.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-600 items-center justify-center text-white text-3xl font-display" style={{ display: 'none' }}>
                              {barber.name.charAt(0)}
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-3xl font-display">
                            {barber.name.charAt(0)}
                          </div>
                        )}
                        {selectedBarber === barber._id && (
                          <div className="absolute inset-0 bg-primary-500/20 flex items-center justify-center">
                            <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      <h3 className="font-display font-semibold text-dark-900">{barber.name}</h3>
                      <p className="text-primary-500 text-sm font-medium">{barber.experience}+ years</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {barber.specialties?.slice(0, 2).map((s, i) => (
                          <span key={i} className="badge-primary text-xs">{s}</span>
                        ))}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.barber && <p className="mt-2 text-sm text-red-500" role="alert">{errors.barber.message}</p>}
            </div>
          )}

          {/* Step 2: Select Service */}
          {currentStep === 2 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-dark-900 mb-2">Select a Service</h2>
                  <p className="text-dark-600">Choose the service you'd like to book</p>
                </div>
                {selectedBarberData && (
                  <div className="text-right">
                    <p className="text-sm text-dark-500">Barber:</p>
                    <p className="font-medium text-dark-900">{selectedBarberData.name}</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4" role="radiogroup" aria-label="Select service">
                {services.map((service) => (
                  <label
                    key={service._id}
                    className={`relative cursor-pointer ${selectedService === service._id ? 'ring-2 ring-primary-500' : ''}`}
                  >
                    <input
                      type="radio"
                      value={service._id}
                      className="sr-only"
                      {...register('service')}
                      onChange={() => nextStep()}
                    />
                    <div className="card p-4 flex items-center justify-between transition-all hover:shadow-md">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-display font-semibold text-dark-900">{service.name}</h3>
                          <span className="font-display text-xl font-bold text-primary-500">${service.price}</span>
                        </div>
                        <p className="text-dark-500 text-sm mt-1">{service.description || 'No description'}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-dark-500">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            {service.duration} min
                          </span>
                          <span className="badge-secondary">{service.category}</span>
                        </div>
                      </div>
                      {selectedService === service._id && (
                        <svg className="w-6 h-6 text-primary-500 ml-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                        </svg>
                      )}
                    </div>
                  </label>
                ))}
              </div>
              {services.length === 0 && (
                <div className="text-center py-12">
                  <svg className="w-12 h-12 mx-auto text-dark-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                  </svg>
                  <p className="text-dark-600">No services available for this barber</p>
                </div>
              )}
              {errors.service && <p className="mt-2 text-sm text-red-500" role="alert">{errors.service.message}</p>}
            </div>
          )}

          {/* Step 3: Select Date & Time */}
          {currentStep === 3 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-dark-900 mb-2">Pick Date & Time</h2>
                  <p className="text-dark-600">Select when you'd like to come in</p>
                </div>
                {selectedServiceData && (
                  <div className="text-right">
                    <p className="text-sm text-dark-500">Service:</p>
                    <p className="font-medium text-dark-900">{selectedServiceData.name} - ${selectedServiceData.price}</p>
                    <p className="text-sm text-dark-500">{selectedServiceData.duration} minutes</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="date" className="label">Date</label>
                  <input
                    id="date"
                    type="date"
                    min={minDate}
                    max={maxDate}
                    className={`input ${errors.date ? 'input-error' : ''}`}
                    {...register('date', { required: 'Date is required' })}
                    onChange={() => nextStep()}
                  />
                  {errors.date && <p className="mt-1 text-sm text-red-500" role="alert">{errors.date.message}</p>}
                </div>
                <div>
                  <label htmlFor="time" className="label">Time</label>
                  {loadingSlots ? (
                    <div className="input animate-pulse bg-dark-100" />
                  ) : availableSlots.length > 0 ? (
                    <select
                      id="time"
                      className={`input ${errors.time ? 'input-error' : ''}`}
                      {...register('time', { required: 'Time is required' })}
                      onChange={() => nextStep()}
                    >
                      <option value="">Select a time</option>
                      {availableSlots.map((slot) => (
                        <option key={slot} value={slot}>{formatTime(slot)}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="input bg-dark-50 text-dark-400 cursor-not-allowed" disabled>
                      No available slots for this date
                    </div>
                  )}
                  {errors.time && <p className="mt-1 text-sm text-red-500" role="alert">{errors.time.message}</p>}
                </div>
              </div>
              {availableSlots.length === 0 && selectedDate && (
                <p className="mt-4 text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                  No available slots for this date. Please select a different date.
                </p>
              )}
            </div>
          )}

          {/* Step 4: Confirm */}
          {currentStep === 4 && (
            <div>
              <h2 className="font-display text-xl font-bold text-dark-900 mb-2">Confirm Your Booking</h2>
              <p className="text-dark-600 mb-6">Please review your appointment details</p>
              
              <div className="space-y-4 mb-6">
                <div className="card p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-dark-500">Barber</p>
                      <p className="font-medium text-dark-900">{selectedBarberData?.name}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-sm text-primary-500 hover:text-primary-600"
                    >
                      Change
                    </button>
                  </div>
                </div>
                <div className="card p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-dark-500">Service</p>
                      <p className="font-medium text-dark-900">{selectedServiceData?.name}</p>
                      <p className="text-sm text-dark-500">${selectedServiceData?.price} • {selectedServiceData?.duration} min</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-sm text-primary-500 hover:text-primary-600"
                    >
                      Change
                    </button>
                  </div>
                </div>
                <div className="card p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-dark-500">Date & Time</p>
                      <p className="font-medium text-dark-900">{selectedDate ? formatDate(selectedDate) : 'Not selected'}</p>
                      <p className="text-sm text-dark-500">{watch('time') ? formatTime(watch('time')) : 'Not selected'}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="text-sm text-primary-500 hover:text-primary-600"
                    >
                      Change
                    </button>
                  </div>
                </div>
                <div className="card p-4">
                  <label htmlFor="notes" className="label mb-2">Notes (Optional)</label>
                  <textarea
                    id="notes"
                    rows={3}
                    className="input"
                    placeholder="Any special requests or notes for your barber..."
                    {...register('notes')}
                  />
                </div>
              </div>

              <div className="bg-dark-50 rounded-xl p-6">
                <h3 className="font-display text-lg font-semibold text-dark-900 mb-4">Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-dark-600">
                    <span>{selectedServiceData?.name}</span>
                    <span className="font-medium text-dark-900">${selectedServiceData?.price}</span>
                  </div>
                  <div className="flex justify-between text-dark-600">
                    <span>Estimated Duration</span>
                    <span className="font-medium text-dark-900">{selectedServiceData?.duration} minutes</span>
                  </div>
                  <div className="border-t border-dark-200 pt-2 flex justify-between">
                    <span className="font-semibold text-dark-900">Total</span>
                    <span className="font-display text-xl font-bold text-primary-500">${selectedServiceData?.price}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn-ghost flex-1"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 py-4"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Confirming...
                    </span>
                  ) : (
                    'Confirm Booking'
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}