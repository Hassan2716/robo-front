import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/barbers', label: 'Our Barbers' },
  { path: '/services', label: 'Services' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];

export default function Layout() {
  const { user, logout, isAuthenticated, hasRole } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className={`${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'} fixed top-0 left-0 right-0 z-50 transition-all duration-300`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center space-x-2" aria-label="RoboCutz Home">
              <svg className="w-8 h-8 text-primary-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
              <span className="font-display text-xl font-bold text-dark-900">RoboCutz</span>
            </Link>

            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    location.pathname === link.path
                      ? 'text-primary-500'
                      : 'text-dark-600 hover:text-primary-500'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {hasRole(['customer']) && (
                    <Link to="/dashboard" className="btn-primary text-sm">
                      My Dashboard
                    </Link>
                  )}
                  {hasRole(['barber', 'receptionist', 'admin']) && (
                    <Link to="/staff" className="btn-secondary text-sm">
                      Staff Panel
                    </Link>
                  )}
                  <button onClick={handleLogout} className="btn-ghost text-sm">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-ghost text-sm">Login</Link>
                  <Link to="/register" className="btn-primary text-sm">Book Now</Link>
                </>
              )}
            </div>

            <button
              className="lg:hidden p-2 rounded-lg text-dark-600 hover:bg-dark-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {mobileMenuOpen && (
            <div id="mobile-menu" className="lg:hidden py-4 border-t border-dark-100 animate-slide-down">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-base font-medium ${
                      location.pathname === link.path
                        ? 'text-primary-500'
                        : 'text-dark-600'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-dark-100 flex flex-col space-y-3">
                  {isAuthenticated ? (
                    <>
                      {hasRole(['customer']) && (
                        <Link to="/dashboard" className="btn-primary text-center" onClick={() => setMobileMenuOpen(false)}>
                          My Dashboard
                        </Link>
                      )}
                      {hasRole(['barber', 'receptionist', 'admin']) && (
                        <Link to="/staff" className="btn-secondary text-center" onClick={() => setMobileMenuOpen(false)}>
                          Staff Panel
                        </Link>
                      )}
                      <button onClick={handleLogout} className="btn-ghost text-center">Logout</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="btn-ghost text-center" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                      <Link to="/register" className="btn-primary text-center" onClick={() => setMobileMenuOpen(false)}>Book Now</Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      <main className="flex-1 pt-16 lg:pt-20">
        <Outlet />
      </main>

      <footer className="bg-dark-950 text-dark-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-6" aria-label="RoboCutz Home">
                <svg className="w-8 h-8 text-primary-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
                <span className="font-display text-xl font-bold text-white">RoboCutz</span>
              </Link>
              <p className="text-dark-400 max-w-xs mb-6">
                Premium barber shop experience with expert barbers, modern styles, and traditional techniques.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-dark-400 hover:text-primary-500 transition-colors" aria-label="Facebook">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
                <a href="#" className="text-dark-400 hover:text-primary-500 transition-colors" aria-label="Instagram">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="text-dark-400 hover:text-primary-500 transition-colors" aria-label="Twitter">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-display text-lg font-semibold text-white mb-4">Hours</h3>
              <ul className="space-y-2 text-dark-400">
                <li className="flex justify-between"><span>Mon - Thu</span><span className="text-dark-200">9:00 AM - 7:00 PM</span></li>
                <li className="flex justify-between"><span>Friday</span><span className="text-dark-200">9:00 AM - 8:00 PM</span></li>
                <li className="flex justify-between"><span>Saturday</span><span className="text-dark-200">9:00 AM - 5:00 PM</span></li>
                <li className="flex justify-between"><span>Sunday</span><span className="text-dark-200">10:00 AM - 4:00 PM</span></li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-lg font-semibold text-white mb-4">Contact</h3>
              <ul className="space-y-2 text-dark-400">
                <li className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span>123 Main Street, City</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <span>(555) 123-4567</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <span>info@robocutz.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-dark-800 text-center text-dark-500 text-sm">
            <p>&copy; {new Date().getFullYear()} RoboCutz Barber Shop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}