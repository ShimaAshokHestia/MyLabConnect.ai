// src/Routes/AppRoutes.tsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../Auth/ProtectedRoute';
import LoginPage from '../Auth/LoginPage';

// ─── Portal Routes ────────────────────────────────────────────────
// Import your existing route collection files.
// Each file exports JSX <Route> elements (NOT wrapped in <Routes>).

import { dsoadminConnectRoutes }  from '../DSO_ADMIN_CONNECT/Routes/Route';
import { labConnectRoutes }       from '../LAB_CONNECT/Routes/Route';
import { practiceConnectRoutes }  from '../PRACTICE_CONNECT/Routes/Route';
import { adminConnectRoutes } from '../ADMIN/Routes/Route';
// import { doctorConnectRoutes }    from '../DOCTOR_CONNECT/Routes/Route';
// import { integratorConnectRoutes } from '../INTEGRATOR_CONNECT/Routes/Route';

// ─── Unauthorized page ────────────────────────────────────────────
// Simple page shown when a logged-in user tries to access the wrong portal
const Unauthorized: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
    <h2>Access Denied</h2>
    <p>You don't have permission to view this page.</p>
    <a href="/">Go to Login</a>
  </div>
);

// ─── AppRoutes ────────────────────────────────────────────────────
const AppRoutes: React.FC = () => (
  <Routes>
    {/* ── Public: Login ─────────────────────────────────────────── */}
    <Route path="/" element={<LoginPage />} />

    {/* ── AppAdmin Portal ───────────────────────────────────────── */}
    <Route
      path="/appadmin-connect/*"
      element={
        <ProtectedRoute allowedUserTypes={['AppAdmin']}>
          <Routes>{adminConnectRoutes}</Routes>
        </ProtectedRoute>
      }
    />

    {/* ── DSO Portal ────────────────────────────────────────────── */}
    <Route
      path="/dsoadmin-connect/*"
      element={
        <ProtectedRoute allowedUserTypes={['DSO']}>
          <Routes>{dsoadminConnectRoutes}</Routes>
        </ProtectedRoute>
      }
    />

    {/* ── Lab Portal ────────────────────────────────────────────── */}
    <Route
      path="/lab-connect/*"
      element={
        <ProtectedRoute allowedUserTypes={['Lab']}>
          <Routes>{labConnectRoutes}</Routes>
        </ProtectedRoute>
      }
    />

    {/* ── Practice Portal ───────────────────────────────────────── */}
    <Route
      path="/practice-connect/*"
      element={
        <ProtectedRoute allowedUserTypes={['Practice']}>
          <Routes>{practiceConnectRoutes}</Routes>
        </ProtectedRoute>
      }
    />

    {/* ── Doctor Portal ─────────────────────────────────────────── */}
    {/* <Route
      path="/doctor-connect/*"
      element={
        <ProtectedRoute allowedUserTypes={['Doctor']}>
          <Routes>{doctorConnectRoutes}</Routes>
        </ProtectedRoute>
      }
    /> */}

    {/* ── Integrator Portal ─────────────────────────────────────── */}
    {/* <Route
      path="/integrator-connect/*"
      element={
        <ProtectedRoute allowedUserTypes={['Integrator']}>
          <Routes>{integratorConnectRoutes}</Routes>
        </ProtectedRoute>
      }
    /> */}

    {/* ── Unauthorized ──────────────────────────────────────────── */}
    <Route path="/unauthorized" element={<Unauthorized />} />

    {/* ── Catch-all ─────────────────────────────────────────────── */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;