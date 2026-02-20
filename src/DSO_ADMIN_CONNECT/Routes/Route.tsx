// src/DSO_ADMIN_CONNECT/Routes/Route.tsx
// Do NOT wrap in <Routes> or <BrowserRouter>
// Do NOT add ProtectedRoute here — AppRoutes.tsx handles it

import { Navigate, Route } from 'react-router-dom';
import HomePage from '../Pages/Home/HomePage';

// ── Masters ────────────────────────────────────────────────────────
import DsoDoctorList from '../Pages/Masters/Doctors/List';

// ── Setup ──────────────────────────────────────────────────────────
import DSOZoneList from '../Pages/Setup/Zone/List';
import { DsoUserLayout } from '../Layout/DsoUserLayout';
import DsoProductGroupList from '../Pages/Masters/Product Group/List';

// ── Add more page imports here as you build them ──────────────────
// import DsoLabList       from '../Pages/Masters/Lab/List';
// import DsoPracticeList  from '../Pages/Masters/Practice/List';

export const dsoadminConnectRoutes = (
  <Route path="/" element={<DsoUserLayout />}>

    {/* Home / Dashboard */}
    <Route index element={<HomePage />} />

    {/* Analytics */}
    <Route path="analytics" element={<div><h5>Analytics</h5></div>} />

    {/* Masters */}
    <Route path="masters/doctor-list" element={<DsoDoctorList />} />
    <Route path="masters/productGroup-list" element={<DsoProductGroupList />} />
    <Route path="masters/lab" element={<div><h5>Lab</h5></div>} />
    <Route path="masters/practice" element={<div><h5>Practice</h5></div>} />
    <Route path="masters/user-roles" element={<div><h5>User Role Creation</h5></div>} />
    <Route path="masters" element={<div><h5>Masters</h5></div>} />

    {/* Setup */}
    <Route path="setup/zone-list" element={<DSOZoneList />} />
    <Route path="setup/practice-manager" element={<div><h5>Practice Manager Login</h5></div>} />
    <Route path="setup/dso-user" element={<div><h5>DSO User Login</h5></div>} />
    <Route path="setup/lab-products-rate" element={<div><h5>Lab Products Rate</h5></div>} />
    <Route path="setup" element={<div><h5>Setup</h5></div>} />

    {/* Mapping */}
    <Route path="mapping/prescription-product" element={<div><h5>Prescription Product</h5></div>} />
    <Route path="mapping/trios-doctor" element={<div><h5>Trios Doctor</h5></div>} />
    <Route path="mapping/trios-product" element={<div><h5>Trios Product</h5></div>} />
    <Route path="mapping/lab-dso-doctor" element={<div><h5>Lab DSO Doctor</h5></div>} />
    <Route path="mapping/lab-dso-product" element={<div><h5>Lab DSO Product</h5></div>} />
    <Route path="mapping/doctor-pickup" element={<div><h5>Doctor Pickup Service</h5></div>} />
    <Route path="mapping" element={<div><h5>Mapping</h5></div>} />

    {/* Reports */}
    <Route path="reports/case-summary" element={<div><h5>Case Summary</h5></div>} />
    <Route path="reports/revenue-summary" element={<div><h5>Revenue Summary</h5></div>} />
    <Route path="reports/support-tickets" element={<div><h5>Support Tickets</h5></div>} />
    <Route path="reports/case-aging" element={<div><h5>Case On Hold Aging</h5></div>} />
    <Route path="reports/usage-adoption" element={<div><h5>Usage Adoption Report</h5></div>} />
    <Route path="reports" element={<div><h5>Reports</h5></div>} />

    {/* Invoices */}
    <Route path="invoices/proforma" element={<div><h5>Proforma Invoice</h5></div>} />
    <Route path="invoices" element={<div><h5>Invoices</h5></div>} />

    {/* Catch-all */}
    <Route path="*" element={<Navigate to="/dsoadmin-connect" replace />} />
  </Route>
);

export const getdsoadminConnectRoutes = () => dsoadminConnectRoutes;