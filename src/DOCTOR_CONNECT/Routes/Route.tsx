// src/DOCTOR_CONNECT/Routes/Route.tsx

import { Navigate, Route } from 'react-router-dom';
import { DoctorLayout } from '../Layout/DoctorLayout';
import HomePage from '../Layout/HomePage';

// ── Add page imports here as you build them ───────────────────────
// import ActiveCasesList   from '../Pages/Cases/Active/List';
// import CompletedCaseList from '../Pages/Cases/Completed/List';
// import CaseCreate        from '../Pages/Cases/Create';

export const doctorConnectRoutes = (
  <Route path="/" element={<DoctorLayout />}>

    {/* Home / Dashboard */}
    <Route index element={<HomePage />} />

    {/* Analytics */}
    <Route path="analytics" element={<div><h5>Analytics</h5></div>} />

    {/* Cases */}
    <Route path="cases/active"    element={<div><h5>Active Cases</h5></div>} />
    <Route path="cases/progress"  element={<div><h5>In Progress</h5></div>} />
    <Route path="cases/completed" element={<div><h5>Completed Cases</h5></div>} />
    <Route path="cases/create"    element={<div><h5>New Case</h5></div>} />
    <Route path="cases"           element={<div><h5>Cases</h5></div>} />

    {/* Reports */}
    <Route path="reports/case-summary"    element={<div><h5>Case Summary</h5></div>} />
    <Route path="reports/support-tickets" element={<div><h5>Support Tickets</h5></div>} />
    <Route path="reports"                 element={<div><h5>Reports</h5></div>} />

    {/* Settings */}
    <Route path="settings" element={<div><h5>Settings</h5></div>} />

    {/* Catch-all */}
    <Route path="*" element={<Navigate to="/doctor-connect" replace />} />
  </Route>
);

export const getDoctorConnectRoutes = () => doctorConnectRoutes;