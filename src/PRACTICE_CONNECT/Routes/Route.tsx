// src/PRACTICE_CONNECT/Routes/Route.tsx
// Do NOT wrap in <Routes> or <BrowserRouter>
// Do NOT add ProtectedRoute here — AppRoutes.tsx handles it

import { Navigate, Route } from 'react-router-dom';
import { PracticeLayout } from '../Layout/PracticeLayout';
import HomePage from '../Layout/HomePage';

// ── Add page imports here as you build them ───────────────────────
// import ActiveCasesList  from '../Pages/Cases/Active/List';
// import PatientsList     from '../Pages/Patients/List';
// import DoctorsList      from '../Pages/Doctors/List';
// import DoctorCreate     from '../Pages/Doctors/Create';

export const practiceConnectRoutes = (
  <Route path="/" element={<PracticeLayout />}>

    {/* Home / Dashboard */}
    <Route index element={<HomePage />} />

    {/* Analytics */}
    <Route path="analytics" element={<div><h5>Analytics</h5></div>} />

    {/* Cases */}
    <Route path="cases/active"      element={<div><h5>Active Cases</h5></div>} />
    <Route path="cases/in-progress" element={<div><h5>In Progress</h5></div>} />
    <Route path="cases/completed"   element={<div><h5>Completed Cases</h5></div>} />
    <Route path="cases/recent"      element={<div><h5>Recent Cases</h5></div>} />
    <Route path="cases/create"      element={<div><h5>New Case</h5></div>} />
    <Route path="cases"             element={<div><h5>Cases</h5></div>} />

    {/* Patients */}
    <Route path="patients" element={<div><h5>Patients</h5></div>} />

    {/* Doctors */}
    <Route path="doctors/create" element={<div><h5>Add Doctor</h5></div>} />
    <Route path="doctors"        element={<div><h5>Doctors</h5></div>} />

    {/* Reports */}
    <Route path="reports/case-summary" element={<div><h5>Case Summary</h5></div>} />
    <Route path="reports/financial"    element={<div><h5>Financial Report</h5></div>} />
    <Route path="reports"              element={<div><h5>Reports</h5></div>} />

    {/* Settings */}
    <Route path="settings" element={<div><h5>Settings</h5></div>} />

    {/* Catch-all */}
    <Route path="*" element={<Navigate to="/practice-connect" replace />} />
  </Route>
);

export const getPracticeConnectRoutes = () => practiceConnectRoutes;