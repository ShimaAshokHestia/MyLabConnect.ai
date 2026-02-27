// src/DSO_ADMIN_CONNECT/Routes/Route.tsx
// Do NOT wrap in <Routes> or <BrowserRouter>
// Do NOT add ProtectedRoute here — AppRoutes.tsx handles it

import { Navigate, Route } from 'react-router-dom';

// ── Masters ────────────────────────────────────────────────────────
import LabGroupList from '../Pages/Masters/Lab Group/List';

import DsoDoctorList from '../Pages/Masters/Doctors/List';

// ── Setup ──────────────────────────────────────────────────────────
import DSOZoneList from '../Pages/Setup/Zone/List';
import { DsoUserLayout } from '../Layout/DsoUserLayout';
import DsoProductGroupList from '../Pages/Masters/Product Group/List';
import DSOProsthesisTypeList from '../Pages/Prosthesis/List';
import DSOSchemaList from '../Pages/Schema/List';
import DSORestorationTypeList from '../Pages/Restoration/List';
import DSOUserList from '../Pages/Setup/DSO - User Login/List';
import LabMasterList from '../Pages/Masters/Lab/List';
import DSODentalOfficeList from '../Pages/Masters/Dental Office/List';
import DSOMaterialList from '../Pages/Masters/Material/List';
import DSORegionList from '../Pages/Setup/Region/List';
import DSOSettingList from '../Pages/Setup/Settings/List';
import DSOTerritoryList from '../Pages/Masters/Territory/List';
import DsoIndexPage from '../Layout/IndexPage';

// ── Add more page imports here as you build them ──────────────────
// import DsoLabList       from '../Pages/Masters/Lab/List';
// import DsoPracticeList  from '../Pages/Masters/Practice/List';

export const dsoadminConnectRoutes = (
  <Route path="/" element={<DsoUserLayout />}>

    {/* Home / Dashboard */}
    <Route index element={<DsoIndexPage />} />

    {/* Analytics */}
    <Route path="analytics" element={<div><h5>Analytics</h5></div>} />

    {/* Masters */}
    <Route path="masters/labgroup-list" element={<LabGroupList />} />
    <Route path="masters/lab-list" element={<LabMasterList />} />
    <Route path="masters/practice-list" element={<div><h5>Practice</h5></div>}/>
    <Route path="masters/doctor-list" element={<DsoDoctorList />} />
    <Route path="masters/productGroup-list" element={<DsoProductGroupList />} />
    <Route path="masters/user-role-creation-list" element={<div><h5>User Role Creation</h5></div>} />



    <Route path="masters/lab" element={<div><h5>Lab</h5></div>} />
    <Route path="masters/practice" element={<div><h5>Practice</h5></div>} />
    <Route path="masters/dentalOffice-list" element={<DSODentalOfficeList />} />
    <Route path="masters/material-list" element={<DSOMaterialList />} />
    <Route path="masters/territory-list" element={<DSOTerritoryList />} />


    {/* Setup */}
     <Route path="setup/practice-managerLogin-list" element={<div><h5>Practice Manager Login</h5></div>} />
     <Route path="setup/Dso-userLogin-list" element={<div><h5>User Login</h5></div>}/>
    <Route path="setup/zone-list" element={<DSOZoneList />}/>
    <Route path="setup/region-list" element={<DSORegionList />} />
    <Route path="setup/setting-list" element={<DSOSettingList />} />
    <Route path="setup/dso-user" element={<DSOUserList />} />
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
    <Route path="prosthesis" element={<DSOProsthesisTypeList />} />
    <Route path="Restoration" element={<DSORestorationTypeList />} />
    <Route path="schema-list" element={<DSOSchemaList />} />

    {/* Catch-all */}
    <Route path="*" element={<Navigate to="/dsoadmin-connect" replace />} />
  </Route>
);

export const getdsoadminConnectRoutes = () => dsoadminConnectRoutes;