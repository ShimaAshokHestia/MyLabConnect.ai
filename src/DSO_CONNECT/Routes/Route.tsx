// STAFF-PORTAL/Routes/Routes.tsx
// IMPORTANT: This component should NOT contain <Routes> or <Router>
// It's just a collection of Route definitions to be used in the main AppRoutes

import { Route } from 'react-router-dom';


export const dsoConnectRoutes = (
  <Route
    path="/dso-connect"
    // element={
    //   // <ProtectedRoute allowedRoles={['Staff']}>
    //   //   <StaffLayout />
    //   // </ProtectedRoute>
    // }
  >
   
  </Route>
);

// Alternative: Export as function
export const getdsoConnectRoutes = () => dsoConnectRoutes;