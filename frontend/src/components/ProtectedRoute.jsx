import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return null; // Controlled by AuthContext loading spinner
  
  if (!isAuthenticated) {
    // If attempting to hit a subscriber/admin page without a login session, divert to login flow.
    return <Navigate to="/login" replace />;
  }
  
  // Return the explicitly requested children. Supports both layout and wrapper models.
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
