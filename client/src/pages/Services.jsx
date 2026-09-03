import { useEffect, useState } from 'react';
import api from '../utils/api';

const categories = [
  { value: 'haircut', label: 'Haircuts', icon: 'scissors' },
  { value: 'beard', label: 'Beard', icon: 'beard' },
  { value: 'styling', label: 'Styling', icon: 'styling' },
  { value: 'treatment', label: 'Treatments', icon: 'treatment' },
  { value: 'package', label: 'Packages', icon: 'package' },
];

const categoryIcons = {
  scissors: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.15 9.15"/></svg>,
  beard: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>,
  styling: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
  treatment: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>,
  package: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>,
};

const ServiceCard = ({ service }) => (
  <article key={service._id} className="card p-6 group">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-lg font-semibold text-dark-900">{service.name}</h3>
          <span className="font-display text-xl font-bold text-primary-500">${service.price}</span>
        </div>
        <p className="text-dark-500 text-sm mb-3">{service.description || 'No description available'}</p>
        <div className="flex items-center gap-4 text-sm text-dark-500">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {service.duration} min
          </span>
          {service.barbers && service.barbers.length > 0 && (
            <span className="text-xs text-dark-400">
              {service.barbers.length} barber{service.barbers.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  </article>
);

const CategorySection = ({ category, groupedServices, categories, categoryIcons }) => {
  const categoryServices = groupedServices[category];
  if (!categoryServices) return null;
  const catInfo = categories.find((c) => c.value === category);
  return (
    <div key={category} className="mb-12">
      <h2 className="font-display text-xl font-semibold text-dark-900 mb-6 flex items-center gap-2">
        {categoryIcons[catInfo?.icon || 'scissors']}
        {catInfo?.label || category}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categoryServices.map((service) => (
          <ServiceCard key={service._id} service={service} />
        ))}
      </div>
    </div>
  );
};

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services?active=true');
        setServices(res.data.data ?? []);
      } catch (err) {
        setError('Failed to load services');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter((s) => s.category === activeCategory);

  const groupedServices = filteredServices.reduce((acc, service) => {
    if (!acc[service.category]) acc[service.category] = [];
    acc[service.category].push(service);
    return acc;
  }, {});

  const categoryOrder = ['haircut', 'beard', 'styling', 'treatment', 'package'];

  if (loading) {
    return (
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse space-y-8">
          <div className="h-8 bg-dark-100 rounded w-1/4" />
          <div className="h-4 bg-dark-100 rounded w-1/2" />
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-dark-100 rounded-xl" />
            ))}
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
          <h2 className="font-display text-2xl font-bold text-dark-900 mb-2">Unable to load services</h2>
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
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-dark-900 mb-2">Our Services</h1>
          <p className="text-dark-600">Premium grooming services tailored to your style</p>
        </div>

        <div className="mb-10 flex flex-wrap gap-2" role="tablist" aria-label="Service categories">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === 'all'
                ? 'bg-primary-500 text-white'
                : 'bg-dark-100 text-dark-600 hover:bg-dark-200'
            }`}
            role="tab"
            aria-selected={activeCategory === 'all'}
            aria-controls="services-panel"
          >
            All Services
          </button>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.value
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-100 text-dark-600 hover:bg-dark-200'
              }`}
              role="tab"
              aria-selected={activeCategory === cat.value}
              aria-controls="services-panel"
            >
              {categoryIcons[cat.icon]}
              {cat.label}
            </button>
          ))}
        </div>

        <div id="services-panel" role="tabpanel">
          {Object.keys(groupedServices).length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-16 h-16 mx-auto text-dark-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <h2 className="font-display text-xl font-semibold text-dark-900 mb-2">No services found</h2>
              <p className="text-dark-600">No services available in this category</p>
            </div>
          ) : (
            categoryOrder.map((category) => (
              <CategorySection
                key={category}
                category={category}
                groupedServices={groupedServices}
                categories={categories}
                categoryIcons={categoryIcons}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}