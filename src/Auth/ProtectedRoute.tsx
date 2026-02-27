// src/Auth/ProtectedRoute.tsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { UserTypeName } from '../Types/Auth/Auth.types';
import AuthService from '../Services/AuthServices/Auth.services';

interface ProtectedRouteProps {
  allowedUserTypes: UserTypeName[];
  children: React.ReactNode;
}

/**
 * Guards a portal route:
 * 1. Not authenticated at all          → redirect to / (login page)
 * 2. Has temp token only (mid-2FA or   → redirect to appropriate interim page
 *    mid-pwd-change, not yet a session)
 * 3. AC2: isDefaultPassword = true     → redirect to /force-change-password
 * 4. Wrong userType                    → redirect to correct portal
 * 5. Correct userType                  → render children
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedUserTypes, children }) => {
  const location = useLocation();

  // ── Step 1: Not authenticated ────────────────────────────────────
  // isAuthenticated() checks the FULL token (not temp token)
  if (!AuthService.isAuthenticated()) {
    // If they somehow land on a protected route mid-2FA, send them back
    if (AuthService.hasTempToken()) {
      return <Navigate to="/" replace />;
    }
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // ── Step 2: AC2 — Force password change if isDefaultPassword ─────
  // Allow the force-change-password route itself through to avoid redirect loop.
  if (
    AuthService.isDefaultPassword() &&
    location.pathname !== '/force-change-password'
  ) {
    return <Navigate to="/force-change-password" replace />;
  }

  // ── Step 3: Correct portal check ─────────────────────────────────
  const userTypeName = AuthService.getUserTypeName();

  if (!userTypeName || !allowedUserTypes.includes(userTypeName as UserTypeName)) {
    const correctRoute = AuthService.getDashboardRoute();
    if (correctRoute && correctRoute !== '/') {
      return <Navigate to={correctRoute} replace />;
    }
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;