// src/DOCTOR_CONNECT/Routes/Route.tsx

import { Navigate, Route } from 'react-router-dom';
import { DoctorLayout } from '../Layout/DoctorLayout';
import AddNewCase from '../Pages/Analog Case Prescription/Create';
import DoctorIndexPage from '../Layout/IndexPage';
import CasePickupList from '../Pages/Pickup/List';
import MyCases from '../Pages/Analog Case Prescription/MyCases';

export const doctorConnectRoutes = (
  <Route path="/" element={<DoctorLayout />}>

    {/* Home / Dashboard */}
    <Route index element={<DoctorIndexPage />} />

    <Route path="add-new-case" element={<AddNewCase/>} />
    <Route path="add-new-pickup" element={<CasePickupList/>} />

    {/* Analytics */}
    <Route path="analytics" element={<div><h5>Analytics</h5></div>} />

    {/* Cases */}
    <Route path="cases/active"    element={<MyCases />} />
    <Route path="cases/progress"  element={<MyCases />} />
    <Route path="cases/completed" element={<MyCases />} />
    <Route path="cases/create"    element={<div><h5>New Case</h5></div>} />
    <Route path="cases"           element={<MyCases />} />

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