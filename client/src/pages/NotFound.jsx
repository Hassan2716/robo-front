import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="font-display text-9xl font-bold text-primary-500/20 mb-4">404</h1>
        <h2 className="font-display text-3xl font-bold text-dark-900 mb-4">Page Not Found</h2>
        <p className="text-dark-600 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/" className="btn-primary">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Back to Home
          </Link>
          <Link to="/barbers" className="btn-outline">Book Appointment</Link>
        </div>
      </div>
    </div>
  );
}