// src/Routes/AppRoutes.tsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../Auth/ProtectedRoute';
import LoginPage from '../Auth/LoginPage';
import ForceChangePassword from '../Auth/ForceChangePassword';
import ConsentScreen from '../Auth/ConsentScreen';

import { dsoadminConnectRoutes }   from '../DSO_ADMIN_CONNECT/Routes/Route';
import { labConnectRoutes }        from '../LAB_CONNECT/Routes/Route';
import { practiceConnectRoutes }   from '../PRACTICE_CONNECT/Routes/Route';
import { adminConnectRoutes }      from '../ADMIN/Routes/Route';
import { doctorConnectRoutes }     from '../DOCTOR_CONNECT/Routes/Route';
import { integratorConnectRoutes } from '../INTEGRATOR_CONNECT/Routes/Route';

const Unauthorized: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
    <h2>Access Denied</h2>
    <p>You don't have permission to view this page.</p>
    <a href="/">Go to Login</a>
  </div>
);

const AppRoutes: React.FC = () => (
  <Routes>

    {/* ── Public ──────────────────────────────────────────────────── */}
    <Route path="/" element={<LoginPage />} />

    {/* ── Temp-token flows (guarded inside each component) ────────── */}
    <Route path="/force-change-password" element={<ForceChangePassword />} />
    <Route path="/consent"               element={<ConsentScreen />} />

    {/* ── AppAdmin Portal — DB: 'appadmin', 'app admin', 'super admin' */}
    <Route
      path="/appadmin-connect/*"
      element={
        <ProtectedRoute allowedUserTypes={['appadmin', 'app admin', 'super admin']}>
          <Routes>{adminConnectRoutes}</Routes>
        </ProtectedRoute>
      }
    />

    {/* ── DSO Portal — DB: 'dso', 'dso admin' ────────────────────── */}
    <Route
      path="/dsoadmin-connect/*"
      element={
        <ProtectedRoute allowedUserTypes={['dso', 'dso admin']}>
          <Routes>{dsoadminConnectRoutes}</Routes>
        </ProtectedRoute>
      }
    />

    {/* ── Lab Portal — DB: 'lab', 'lab technician' ────────────────── */}
    <Route
      path="/lab-connect/*"
      element={
        <ProtectedRoute allowedUserTypes={['lab', 'lab technician']}>
          <Routes>{labConnectRoutes}</Routes>
        </ProtectedRoute>
      }
    />

    {/* ── Practice Portal — DB: 'practice', 'practice manager' ────── */}
    <Route
      path="/practice-connect/*"
      element={
        <ProtectedRoute allowedUserTypes={['practice', 'practice manager']}>
          <Routes>{practiceConnectRoutes}</Routes>
        </ProtectedRoute>
      }
    />

    {/* ── Doctor Portal — DB: 'doctor', 'dentist' ─────────────────── */}
    <Route
      path="/doctor-connect/*"
      element={
        <ProtectedRoute allowedUserTypes={['doctor', 'dentist']}>
          <Routes>{doctorConnectRoutes}</Routes>
        </ProtectedRoute>
      }
    />

    {/* ── Integrator Portal — DB: 'integrator' ────────────────────── */}
    <Route
      path="/integrator-connect/*"
      element={
        <ProtectedRoute allowedUserTypes={['integrator']}>
          <Routes>{integratorConnectRoutes}</Routes>
        </ProtectedRoute>
      }
    />

    <Route path="/unauthorized" element={<Unauthorized />} />
    <Route path="*"             element={<Navigate to="/" replace />} />

  </Routes>
);

export default AppRoutes;