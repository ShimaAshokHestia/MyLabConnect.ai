// src/LAB_CONNECT/Routes/Route.tsx
// Do NOT wrap in <Routes> or <BrowserRouter>
// Do NOT add ProtectedRoute here — AppRoutes.tsx handles it

import { Navigate, Route } from 'react-router-dom';
import LabLayout from '../Layout/LabLayout';
import HomePage from '../Layout/HomePage';

// ── Add page imports here as you build them ───────────────────────
// import ActiveOrdersList    from '../Pages/Orders/Active/List';
// import ProductionQueueList from '../Pages/Production/Queue/List';

export const labConnectRoutes = (
  <Route path="/" element={<LabLayout />}>

    {/* Home / Dashboard */}
    <Route index element={<HomePage />} />

    {/* Analytics */}
    <Route path="analytics" element={<div><h5>Analytics</h5></div>} />

    {/* Orders */}
    <Route path="orders"                element={<div><h5>All Orders</h5></div>} />
    <Route path="orders/active"         element={<div><h5>Active Orders</h5></div>} />
    <Route path="orders/in-production"  element={<div><h5>In Production</h5></div>} />
    <Route path="orders/ready"          element={<div><h5>Ready to Ship</h5></div>} />

    {/* Production */}
    <Route path="production/queue"    element={<div><h5>Production Queue</h5></div>} />
    <Route path="production/progress" element={<div><h5>In Progress</h5></div>} />
    <Route path="production/quality"  element={<div><h5>Quality Check</h5></div>} />
    <Route path="production"          element={<div><h5>Production</h5></div>} />

    {/* Reports */}
    <Route path="reports/production" element={<div><h5>Production Report</h5></div>} />
    <Route path="reports/revenue"    element={<div><h5>Revenue Report</h5></div>} />
    <Route path="reports"            element={<div><h5>Reports</h5></div>} />

    {/* Settings */}
    <Route path="settings" element={<div><h5>Settings</h5></div>} />

    {/* Catch-all */}
    <Route path="*" element={<Navigate to="/lab-connect" replace />} />
  </Route>
);

export const getLabConnectRoutes = () => labConnectRoutes;