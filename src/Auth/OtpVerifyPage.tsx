// src/Routes/AppRoutes.tsx
// ─── DIFF: Add /verify-otp route ─────────────────────────────────────────────
// Only the new route needs adding. Rest of the file is unchanged.
//
// ADD this import at the top of your existing AppRoutes.tsx:
//   import OtpVerifyPage from '../Auth/OtpVerifyPage';
//
// ADD this route alongside the /force-change-password route:
//
//   {/* ── AC3: 2FA OTP verification ──────────────────────────────── */}
//   <Route
//     path="/verify-otp"
//     element={<OtpVerifyPage />}
//   />
//
// ─── Full updated file for reference: ────────────────────────────────────────

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../Auth/ProtectedRoute';
import LoginPage from '../Auth/LoginPage';
import ForceChangePassword from '../Auth/ForceChangePassword';
import OtpVerifyPage from '../Auth/OtpVerifyPage';  // ← NEW

// ─── Portal Routes ─────────────────────────────────────────────────
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

    {/* ── Public: Login ──────────────────────────────────────────── */}
    <Route path="/" element={<LoginPage />} />

    {/* ── AC3: 2FA OTP verification (no ProtectedRoute needed —     */}
    {/*         guarded internally by hasTempToken check) ────────── */}
    <Route path="/verify-otp" element={<OtpVerifyPage />} />

    {/* ── AC2: Forced password change (guarded internally) ───────── */}
    <Route
      path="/force-change-password"
      element={
        <ProtectedRoute allowedUserTypes={['AppAdmin', 'DSO', 'Lab', 'Practice', 'Doctor', 'Integrator']}>
          <ForceChangePassword />
        </ProtectedRoute>
      }
    />

    {/* ── AppAdmin Portal ────────────────────────────────────────── */}
    <Route
      path="/appadmin-connect/*"
      element={
        <ProtectedRoute allowedUserTypes={['AppAdmin']}>
          <Routes>{adminConnectRoutes}</Routes>
        </ProtectedRoute>
      }
    />

    {/* ── DSO Portal ─────────────────────────────────────────────── */}
    <Route
      path="/dsoadmin-connect/*"
      element={
        <ProtectedRoute allowedUserTypes={['DSO']}>
          <Routes>{dsoadminConnectRoutes}</Routes>
        </ProtectedRoute>
      }
    />

    {/* ── Lab Portal ─────────────────────────────────────────────── */}
    <Route
      path="/lab-connect/*"
      element={
        <ProtectedRoute allowedUserTypes={['Lab']}>
          <Routes>{labConnectRoutes}</Routes>
        </ProtectedRoute>
      }
    />

    {/* ── Practice Portal ────────────────────────────────────────── */}
    <Route
      path="/practice-connect/*"
      element={
        <ProtectedRoute allowedUserTypes={['Practice']}>
          <Routes>{practiceConnectRoutes}</Routes>
        </ProtectedRoute>
      }
    />

    {/* ── Doctor Portal ──────────────────────────────────────────── */}
    <Route
      path="/doctor-connect/*"
      element={
        <ProtectedRoute allowedUserTypes={['Doctor']}>
          <Routes>{doctorConnectRoutes}</Routes>
        </ProtectedRoute>
      }
    />

    {/* ── Integrator Portal ──────────────────────────────────────── */}
    <Route
      path="/integrator-connect/*"
      element={
        <ProtectedRoute allowedUserTypes={['Integrator']}>
          <Routes>{integratorConnectRoutes}</Routes>
        </ProtectedRoute>
      }
    />

    {/* ── Unauthorized ───────────────────────────────────────────── */}
    <Route path="/unauthorized" element={<Unauthorized />} />

    {/* ── Catch-all ──────────────────────────────────────────────── */}
    <Route path="*" element={<Navigate to="/" replace />} />

  </Routes>
);

export default AppRoutes;