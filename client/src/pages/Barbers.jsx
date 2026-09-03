import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../utils/api';

export default function Barbers() {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const res = await api.get('/barbers?active=true');
        const barberData = res.data.data ?? [];
        setBarbers(barberData);
        const allSpecialties = [...new Set(barberData.flatMap(b => b.specialties || []))];
        setSpecialties(allSpecialties);
      } catch (err) {
        setError('Failed to load barbers');
      } finally {
        setLoading(false);
      }
    };
    fetchBarbers();
  }, []);

  const filteredBarbers = selectedSpecialty
    ? barbers.filter(b => b.specialties?.includes(selectedSpecialty))
    : barbers;

  if (loading) {
    return (
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-dark-100 rounded w-1/4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="card">
                  <div className="aspect-square bg-dark-100" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-dark-100 rounded w-3/4" />
                    <div className="h-4 bg-dark-100 rounded w-1/2" />
                    <div className="h-4 bg-dark-100 rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <svg className="w-16 h-16 mx-auto text-dark-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <h2 className="font-display text-2xl font-bold text-dark-900 mb-2">Unable to load barbers</h2>
          <p className="text-dark-600 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-dark-900 mb-2">Our Master Barbers</h1>
          <p className="text-dark-600">Meet the skilled professionals behind every great cut</p>
        </div>

        {specialties.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter by specialty">
            <button
              onClick={() => setSelectedSpecialty('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !selectedSpecialty
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-100 text-dark-600 hover:bg-dark-200'
              }`}
              aria-pressed={!selectedSpecialty}
            >
              All Barbers
            </button>
            {specialties.map((specialty) => (
              <button
                key={specialty}
                onClick={() => setSelectedSpecialty(specialty)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedSpecialty === specialty
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-100 text-dark-600 hover:bg-dark-200'
                }`}
                aria-pressed={selectedSpecialty === specialty}
              >
                {specialty}
              </button>
            ))}
          </div>
        )}

        {filteredBarbers.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 mx-auto text-dark-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <h2 className="font-display text-xl font-semibold text-dark-900 mb-2">No barbers found</h2>
            <p className="text-dark-600">Try selecting a different specialty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBarbers.map((barber) => (
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
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-600 items-center justify-center text-white text-5xl font-display" style={{ display: 'none' }}>
                          {barber.name.charAt(0)}
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-5xl font-display">
                        {barber.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h2 className="font-display text-xl font-semibold text-dark-900 mb-1">{barber.name}</h2>
                    <p className="text-primary-500 text-sm font-medium mb-3">{barber.experience}+ years experience</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {barber.specialties?.map((specialty, i) => (
                        <span key={i} className="badge-primary">{specialty}</span>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-dark-100">
                      <span className="btn-primary w-full text-center block">Book with {barber.name.split(' ')[0]}</span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}