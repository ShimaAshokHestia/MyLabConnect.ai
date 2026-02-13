// Components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthService from '../../Services/Auth.services';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('Staff' | 'Admin User' | 'Super Admin')[];
  requireAuth?: boolean;
}

/**
 * ProtectedRoute component for role-based access control
 * 
 * Usage examples:
 * 
 * 1. Require authentication only:
 *    <ProtectedRoute>
 *      <YourComponent />
 *    </ProtectedRoute>
 * 
 * 2. Admin and Super Admin only:
 *    <ProtectedRoute allowedRoles={['Admin User', 'Super Admin']}>
 *      <AdminDashboard />
 *    </ProtectedRoute>
 * 
 * 3. Staff only:
 *    <ProtectedRoute allowedRoles={['Staff']}>
 *      <StaffPortal />
 *    </ProtectedRoute>
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles,
  requireAuth = true 
}) => {
  const location = useLocation();

  // Check if user is authenticated
  const isAuthenticated = AuthService.isAuthenticated();

  // If authentication is required and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    console.log('User not authenticated, redirecting to home');
    // Redirect to home page (public portal) where user can click login button to open modal
    return <Navigate to="/" state={{ from: location, showLogin: true }} replace />;
  }

  // If no authentication required, allow access
  if (!requireAuth) {
    return <>{children}</>;
  }

  // If no specific roles are required, just check authentication
  if (!allowedRoles || allowedRoles.length === 0) {
    return <>{children}</>;
  }

  // Get user's role
  const userRole = AuthService.getUserRole();
  
  // If no role found but authentication is required, redirect to home
  if (!userRole) {
    console.log('No user role found, redirecting to home');
    AuthService.logout(); // Clear any invalid session data
    return <Navigate to="/" state={{ from: location, showLogin: true }} replace />;
  }

  // Normalize user role for comparison
  const normalizedUserRole = userRole.trim().toLowerCase();

  // Check if user's role is in the allowed roles
  const hasAccess = allowedRoles.some(role => {
    const normalizedAllowedRole = role.trim().toLowerCase();
    return normalizedUserRole === normalizedAllowedRole ||
           // Handle variations
           (normalizedAllowedRole === 'admin user' && normalizedUserRole === 'adminuser') ||
           (normalizedAllowedRole === 'super admin' && normalizedUserRole === 'superadmin');
  });

  if (!hasAccess) {
    console.log(`User role ${userRole} not authorized for this route`);
    
    // Get user's appropriate dashboard
    const dashboardRoute = AuthService.getDashboardRoute();
    
    // If dashboard route is login (invalid role), logout and redirect
    if (dashboardRoute === '/login') {
      console.log('Invalid user role, logging out');
      AuthService.logout();
      return <Navigate to="/login" replace />;
    }
    
    // Redirect to appropriate dashboard with message
    console.log(`Redirecting to appropriate dashboard: ${dashboardRoute}`);
    return <Navigate 
      to={dashboardRoute} 
      state={{ 
        message: 'You do not have permission to access that page',
        from: location 
      }} 
      replace 
    />;
  }

  // User has access, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;