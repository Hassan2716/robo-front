import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated, hasRole } = useAuth();
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [barbersRes, servicesRes] = await Promise.all([
          api.get('/barbers?active=true'),
          api.get('/services?active=true'),
        ]);
        setBarbers(barbersRes.data.data?.slice(0, 3) ?? []);
        setServices(servicesRes.data.data?.slice(0, 4) ?? []);
        setError(false);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="animate-fade-in">
      <section className="relative min-h-[90vh] flex items-center justify-center bg-dark-950 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-5" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-900 to-dark-950" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500/20 text-primary-400 text-sm font-medium mb-6 animate-slide-up">
              Premium Barber Shop Experience
            </span>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
              Sharp Cuts,<br /><span className="text-primary-500">Fresh Styles</span>
            </h1>
            <p className="text-lg sm:text-xl text-dark-300 mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '200ms' }}>
              Experience the art of traditional barbering with modern precision. Expert barbers, premium products, and a atmosphere built for you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <Link to="/booking" className="btn-primary text-lg px-10 py-4">
                Book Appointment
              </Link>
              <Link to="/barbers" className="btn bg-transparent border-white text-white hover:bg-white/10 text-lg px-10 py-4">
                Meet Our Barbers
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-950 to-transparent" aria-hidden="true" />
      </section>

      <section className="py-20 bg-white" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 id="features-heading" className="font-display text-3xl sm:text-4xl font-bold text-dark-900 mb-4">
              Why Choose RoboCutz
            </h2>
            <p className="text-dark-600 max-w-2xl mx-auto">
              We combine traditional techniques with modern style to give you the best grooming experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: 'scissors', title: 'Expert Barbers', desc: 'Our team has 20+ years combined experience in classic and modern cuts.' },
              { icon: 'clock', title: 'Easy Booking', desc: 'Book online 24/7 with real-time availability and instant confirmation.' },
              { icon: 'sparkles', title: 'Premium Products', desc: 'We use only the best products for your hair and beard care needs.' },
            ].map((feature, i) => (
              <div key={i} className="text-center p-6 card hover:shadow-lg">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500">
                  {feature.icon === 'scissors' && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.15 9.15"/></svg>}
                  {feature.icon === 'clock' && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
                  {feature.icon === 'sparkles' && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L18 21l-6.857-2.286L12 17l-2.286 6.857L3 12l5.714-2.143L6 3l6.857 2.286L21 12l-5.714-2.143L12 3z"/></svg>}
                </div>
                <h3 className="font-display text-xl font-semibold text-dark-900 mb-2">{feature.title}</h3>
                <p className="text-dark-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-dark-50" aria-labelledby="barbers-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 id="barbers-heading" className="font-display text-3xl sm:text-4xl font-bold text-dark-900 mb-2">
                Our Master Barbers
              </h2>
              <p className="text-dark-600">Skilled professionals dedicated to your style</p>
            </div>
            <Link to="/barbers" className="btn-outline">
              View All Barbers
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-square bg-dark-100" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-dark-100 rounded w-3/4" />
                    <div className="h-4 bg-dark-100 rounded w-1/2" />
                    <div className="h-4 bg-dark-100 rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <p className="text-center text-dark-500 py-12">Unable to load barbers right now. Please try again later.</p>
          ) : barbers.length === 0 ? (
            <p className="text-center text-dark-500 py-12">No barbers available at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {barbers.map((barber) => (
                <article key={barber._id} className="card group">
                  <Link to={`/barbers/${barber._id}`} className="block">
                    <div className="aspect-square relative overflow-hidden">
                      {barber.photo ? (
                        <>
                          <img
                            src={barber.photo}
                            alt={barber.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-600 items-center justify-center text-white text-4xl font-display" style={{ display: 'none' }}>
                            {barber.name.charAt(0)}
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-4xl font-display">
                          {barber.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-xl font-semibold text-dark-900 mb-1">{barber.name}</h3>
                      <p className="text-primary-500 text-sm font-medium mb-3">{barber.experience}+ years experience</p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {barber.specialties?.slice(0, 3).map((specialty, i) => (
                          <span key={i} className="badge-primary">{specialty}</span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-white" aria-labelledby="services-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 id="services-heading" className="font-display text-3xl sm:text-4xl font-bold text-dark-900 mb-2">
                Popular Services
              </h2>
              <p className="text-dark-600">From classic cuts to modern styles</p>
            </div>
            <Link to="/services" className="btn-outline">View All Services</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {error ? (
              <p className="col-span-full text-center text-dark-500 py-12">Unable to load services right now. Please try again later.</p>
            ) : services.length === 0 ? (
              <p className="col-span-full text-center text-dark-500 py-12">No services available at the moment.</p>
            ) : services.map((service) => (
              <article key={service._id} className="card group p-6 flex flex-col">
                <div className="w-14 h-14 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500 mb-4 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                  {service.category === 'haircut' && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.15 9.15"/></svg>}
                  {service.category === 'beard' && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>}
                  {service.category === 'styling' && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>}
                  {service.category === 'treatment' && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>}
                </div>
                <h3 className="font-display text-lg font-semibold text-dark-900 mb-1">{service.name}</h3>
                <p className="text-dark-500 text-sm mb-3 flex-1">{service.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-dark-100">
                  <span className="font-display text-xl font-bold text-dark-900">${service.price}</span>
                  <span className="text-dark-500 text-sm">{service.duration} min</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-dark-950" aria-labelledby="cta-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="cta-heading" className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready for a Fresh Look?
          </h2>
          <p className="text-dark-300 mb-8 max-w-2xl mx-auto">
            Book your appointment today and experience the RoboCutz difference. Walk-ins welcome!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/booking" className="btn-primary text-lg px-10 py-4">
              Book Now
            </Link>
            <Link to="/contact" className="btn bg-transparent border-white text-white hover:bg-white/10 text-lg px-10 py-4">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}