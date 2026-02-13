// STAFF-PORTAL/Routes/Routes.tsx
// IMPORTANT: This component should NOT contain <Routes> or <Router>
// It's just a collection of Route definitions to be used in the main AppRoutes

import { Navigate, Route } from 'react-router-dom';
import { AdminLayout } from '../Layout/AdminLayout';


export const dsoadminConnectRoutes = (
  <Route
    path="/dsoadmin-connect/*" element={<AdminLayout />}
    // path="/admin-portal"
    // element={
    //   // <ProtectedRoute allowedRoles={['Staff']}>
    //     <AdminLayout />
    //   // </ProtectedRoute>
    // }
  >
<Route path="dashboard" element={<div><h1>Admin Dashboard</h1></div>} />
    <Route path="analytics" element={<div><h1>Analytics</h1></div>} />
    <Route path="users" element={<div><h1>User Management</h1></div>} />
    <Route path="*" element={<Navigate to="dashboard" replace />} />
   
  </Route>
);

// Alternative: Export as function
export const getdsoadminConnectRoutes = () => dsoadminConnectRoutes;