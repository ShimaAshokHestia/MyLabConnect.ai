// src/LAB_CONNECT/Routes/Route.tsx
// Do NOT wrap in <Routes> or <BrowserRouter>
// Do NOT add ProtectedRoute here — AppRoutes.tsx handles it

import { Navigate, Route } from 'react-router-dom';
import LabLayout from '../Layout/LabLayout';
import HomePage from '../Layout/HomePage';
import LabSupportTypeList from '../Pages/Masters/Support Types/List';
import CaseDashboard from '../../KIDU_COMPONENTS/KiduCaseDashboard';

// ── Add page imports here as you build them ───────────────────────
// import ActiveOrdersList    from '../Pages/Orders/Active/List';
// import ProductionQueueList from '../Pages/Production/Queue/List';

export const labConnectRoutes = (
  <Route path="/" element={<LabLayout />}>

    {/* Home / Dashboard */}
    {/* <Route index element={<HomePage />} /> */}
     <Route index element={    <CaseDashboard loginMode="lab" user={{ initials:'ML', name:'My Lab', email:'lab@example.com' }} />
} />

    {/* Case Communication */}
    <Route path="caseCommunication/internal-list" element={<div><h5>All Orders</h5></div>} />
    <Route path="caseCommunication/external-list" element={<LabSupportTypeList />} />
    <Route path="caseCommunication/openTicketForAction-list" element={<div><h5>In Production</h5></div>} />


    {/* MASTERS */}
    <Route path="masters/supportTypes-list" element={<LabSupportTypeList />} />
    <Route path="masters/queryTypes-list" element={<div><h5>In Production</h5></div>} />
    <Route path="masters/caseRatingNotification-list" element={<div><h5>Ready to Ship</h5></div>} />
    <Route path="masters/labSupply-list" element={<div><h5>Ready to Ship</h5></div>} />

    {/* USER MANAGEMENT */}
    <Route path="userManagement/labLogin-list" element={<div><h5>Production Queue</h5></div>} />
    <Route path="userManagement/labControlSetting-list" element={<div><h5>In Progress</h5></div>} />

    {/* UTILITY */}
    <Route path="utility/triosOrderCreation-list" element={<div><h5>Production Report</h5></div>} />

    {/* LAB REPORTS */}
    <Route path="labReports/caseList-list" element={<div><h5>Settings</h5></div>} />
    <Route path="labReports/iosList-list" element={<div><h5>Settings</h5></div>} />
    <Route path="labReports/dailyScanqc-list" element={<div><h5>Settings</h5></div>} />
    <Route path="labReports/caseRating-list" element={<div><h5>Settings</h5></div>} />
    <Route path="labReports/ticketStatus-list" element={<div><h5>Settings</h5></div>} />

    {/* Invoice */}
    <Route path="invoices-list" element={<div><h5>Settings</h5></div>} />

    {/* Catch-all */}
    <Route path="*" element={<Navigate to="/lab-connect" replace />} />
  </Route>
);

export const getLabConnectRoutes = () => labConnectRoutes;