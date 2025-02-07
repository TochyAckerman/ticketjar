import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'organizer' | 'customer';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based access control
  if (requiredRole) {
    // Organizer trying to access customer routes
    if (requiredRole === 'customer' && user.role === 'organizer') {
      return <Navigate to="/dashboard" replace />;
    }
    
    // Customer trying to access organizer routes
    if (requiredRole === 'organizer' && user.role === 'customer') {
      return <Navigate to="/profile" replace />;
    }

    // Role doesn't match and user is not admin
    if (user.role !== requiredRole && user.role !== 'admin') {
      return <Navigate to={user.role === 'organizer' ? '/dashboard' : '/profile'} replace />;
    }
  } else {
    // Default routing for non-role-specific protected routes
    // Organizers should generally be directed to dashboard
    if (user.role === 'organizer' && location.pathname === '/profile') {
      return <Navigate to="/dashboard" replace />;
    }
    // Customers should be directed to profile
    if (user.role === 'customer' && location.pathname === '/dashboard') {
      return <Navigate to="/profile" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute; 