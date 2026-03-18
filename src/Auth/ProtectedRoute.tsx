// src/Auth/ProtectedRoute.tsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthService from '../Services/AuthServices/Auth.services';

interface ProtectedRouteProps {
  allowedUserTypes: string[];   // plain string[] — no TS union, case-insensitive at runtime
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedUserTypes, children }) => {
  const location = useLocation();

  // ── Step 1: Not authenticated ────────────────────────────────────
  if (!AuthService.isAuthenticated()) {
    if (AuthService.hasTempToken()) return <Navigate to="/" replace />;
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // ── Step 2: Force password change ────────────────────────────────
  if (AuthService.isDefaultPassword() && location.pathname !== '/force-change-password') {
    return <Navigate to="/force-change-password" replace />;
  }

  // ── Step 3: Portal access — case-insensitive ──────────────────────
  const userType = AuthService.getUserTypeName()?.toLowerCase().trim() ?? '';
  const allowed  = allowedUserTypes.map(t => t.toLowerCase().trim());

  if (!userType || !allowed.includes(userType)) {
    const correctRoute = AuthService.getDashboardRoute();
    return correctRoute && correctRoute !== '/'
      ? <Navigate to={correctRoute} replace />
      : <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;