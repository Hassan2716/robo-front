import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';

// Public pages
import Home from './pages/Home';
import Barbers from './pages/Barbers';
import BarberDetail from './pages/BarberDetail';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Booking from './pages/booking/Booking';
import BookingConfirmation from './pages/booking/BookingConfirmation';

// Protected customer pages
import CustomerDashboard from './pages/customer/Dashboard';
import CustomerProfile from './pages/customer/Profile';
import CustomerAppointments from './pages/customer/Appointments';

// Staff/Admin pages
import StaffDashboard from './pages/staff/Dashboard';
import StaffAppointments from './pages/staff/Appointments';
import StaffPOS from './pages/staff/POS';
import StaffBarbers from './pages/staff/Barbers';
import StaffServices from './pages/staff/Services';
import StaffProducts from './pages/staff/Products';
import StaffReports from './pages/staff/Reports';
import StaffAccounts from './pages/staff/Accounts';

import NotFound from './pages/NotFound';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    if (user.role === 'customer') {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/staff" replace />;
    }
  }
  
  return children;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="barbers" element={<Barbers />} />
        <Route path="barbers/:id" element={<BarberDetail />} />
        <Route path="services" element={<Services />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
      <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />

      {/* Booking Flow */}
      <Route path="/booking" element={<ProtectedRoute allowedRoles={['customer']}><Booking /></ProtectedRoute>} />
      <Route path="/booking/confirmation/:id" element={<ProtectedRoute allowedRoles={['customer']}><BookingConfirmation /></ProtectedRoute>} />

      {/* Customer Dashboard */}
      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['customer']}><Layout><CustomerDashboard /></Layout></ProtectedRoute>} />
      <Route path="/dashboard/appointments" element={<ProtectedRoute allowedRoles={['customer']}><Layout><CustomerAppointments /></Layout></ProtectedRoute>} />
      <Route path="/dashboard/profile" element={<ProtectedRoute allowedRoles={['customer']}><Layout><CustomerProfile /></Layout></ProtectedRoute>} />

      {/* Staff/Admin Routes */}
      <Route path="/staff" element={<ProtectedRoute allowedRoles={['barber', 'receptionist', 'admin']}><AdminLayout><StaffDashboard /></AdminLayout></ProtectedRoute>} />
      <Route path="/staff/appointments" element={<ProtectedRoute allowedRoles={['receptionist', 'admin']}><AdminLayout><StaffAppointments /></AdminLayout></ProtectedRoute>} />
      <Route path="/staff/pos" element={<ProtectedRoute allowedRoles={['receptionist', 'admin']}><AdminLayout><StaffPOS /></AdminLayout></ProtectedRoute>} />
      <Route path="/staff/barbers" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><StaffBarbers /></AdminLayout></ProtectedRoute>} />
      <Route path="/staff/services" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><StaffServices /></AdminLayout></ProtectedRoute>} />
      <Route path="/staff/products" element={<ProtectedRoute allowedRoles={['admin', 'receptionist']}><AdminLayout><StaffProducts /></AdminLayout></ProtectedRoute>} />
      <Route path="/staff/reports" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><StaffReports /></AdminLayout></ProtectedRoute>} />
      <Route path="/staff/accounts" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><StaffAccounts /></AdminLayout></ProtectedRoute>} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;