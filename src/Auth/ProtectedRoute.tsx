// src/Auth/ProtectedRoute.tsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { UserTypeName } from '../Types/Auth/Auth.types';
import AuthService from '../Services/AuthServices/Auth.services';

interface ProtectedRouteProps {
  /** Which userTypeNames can access this portal */
  allowedUserTypes: UserTypeName[];
  children: React.ReactNode;
}

/**
 * Guards a portal route:
 * 1. Not authenticated → redirect to /  (login page)
 * 2. Wrong userType   → redirect to /unauthorized
 * 3. Correct userType → render children
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedUserTypes, children }) => {
  const location = useLocation();

  if (!AuthService.isAuthenticated()) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  const userTypeName = AuthService.getUserTypeName();

  if (!userTypeName || !allowedUserTypes.includes(userTypeName as UserTypeName)) {
    // Redirect to the correct portal instead of generic /unauthorized
    const correctRoute = AuthService.getDashboardRoute();
    if (correctRoute && correctRoute !== '/') {
      return <Navigate to={correctRoute} replace />;
    }
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;