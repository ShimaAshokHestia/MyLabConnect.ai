// STAFF-PORTAL/Routes/Routes.tsx
// IMPORTANT: This component should NOT contain <Routes> or <Router>
// It's just a collection of Route definitions to be used in the main AppRoutes

import { Navigate, Route } from 'react-router-dom';
import { DsoAdminLayout } from '../Layout/DsoAdminLayout';
import HomePage from '../Pages/Home/HomePage';


export const dsoadminConnectRoutes = (
  <Route
    path="/dsoadmin-connect/*" element={<DsoAdminLayout />}
    // path="/admin-portal"
    // element={
    //   // <ProtectedRoute allowedRoles={['Staff']}>
    //     <AdminLayout />
    //   // </ProtectedRoute>
    // }
  >
<Route index element={<HomePage/>} />
    <Route path="analytics" element={<div><h5>Analytics</h5></div>} />
    <Route path="masters" element={<div><h5>User Management</h5></div>} />
     <Route path="setup" element={<div><h5>User Management</h5></div>} />
      <Route path="mapping" element={<div><h5>User Management</h5></div>} />
       <Route path="reports" element={<div><h5>User Management</h5></div>} />
        <Route path="invoices" element={<div><h5>User Management</h5></div>} />
         <Route path="proforma-invoice" element={<div><h5>User Management</h5></div>} />
    <Route path="*" element={<Navigate to="dashboard" replace />} />
   
  </Route>
);

// Alternative: Export as function
export const getdsoadminConnectRoutes = () => dsoadminConnectRoutes;