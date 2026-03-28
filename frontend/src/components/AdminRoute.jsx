import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, role, loading } = useAuth();
  
  if (loading) return null;

  if (!isAuthenticated) {
    // Drop them to login if fully unauthenticated
    return <Navigate to="/login" replace />;
  }

  // Redirect standard subscribers away from strictly classified admin interfaces
  if (role !== 'admin') {
     console.warn('Unauthorized routing flagged. RBAC block executed.');
     return <Navigate to="/dashboard" replace />;
  }
  
  return children ? children : <Outlet />;
};

export default AdminRoute;
