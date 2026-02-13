// src/Routes/AppRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { dsoadminConnectRoutes } from '../DSO_ADMIN_CONNECT/Routes/Route';
import { practiceConnectRoutes } from '../PRACTICE_CONNECT/Routes/Route';
import { dsoConnectRoutes } from '../DSO_CONNECT/Routes/Route';
import { ventorsRoutes } from '../VENTORS/Routes/Route';
import { labConnectRoutes } from '../LAB_CONNECT/Routes/Route';
// import Unauthorized from '../PUBLIC-PORTAL/Pages/Unauthorized';
// import { adminRoutes } from '../ADMIN-PORTAL/Routes/Route';
/**
 * Main application routing configuration
 * 
 * Route Structure:
 * - /unauthorized → Unauthorized Access Page
 * - /login → Redirects to / with login modal
 */
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Admin Routes */}
      {dsoadminConnectRoutes}
      {/* Practice Connect */}
      {practiceConnectRoutes}
      {/* Practice Manager */}
      {/* {practiceManagerRoutes} */}
      {/* Dso connect */}
      {dsoConnectRoutes}
      {/* Lab connect */}
      {labConnectRoutes}
      {/* Lab Group */}
      {/* {labGroupRoutes} */}
      {/* Ventor  */}
      {ventorsRoutes}
      {/* Unauthorized page */}
      {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}

      {/* Catch-all 404 - Redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;