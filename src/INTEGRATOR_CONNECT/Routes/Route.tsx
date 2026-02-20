// src/INTEGRATOR_CONNECT/Routes/Route.tsx

import { Navigate, Route } from 'react-router-dom';
import IntegratorLayout from '../Layout/InegratorLayout';
import HomePage from '../Layout/HomePage';

export const integratorConnectRoutes = (
    <Route path="/" element={<IntegratorLayout />}>

        {/* Home / Dashboard */}
        <Route index element={<HomePage />} />

        {/* Analytics */}
        <Route path="analytics" element={<div><h5>Analytics</h5></div>} />

        {/* Integrations */}
        <Route path="integrations/create" element={<div><h5>Add Integration</h5></div>} />
        <Route path="integrations/logs" element={<div><h5>Integration Logs</h5></div>} />
        <Route path="integrations" element={<div><h5>All Integrations</h5></div>} />

        {/* Jobs */}
        <Route path="jobs/active" element={<div><h5>Active Jobs</h5></div>} />
        <Route path="jobs/failed" element={<div><h5>Failed Jobs</h5></div>} />
        <Route path="jobs/completed" element={<div><h5>Completed Jobs</h5></div>} />
        <Route path="jobs/scheduled" element={<div><h5>Scheduled Jobs</h5></div>} />
        <Route path="jobs" element={<div><h5>Jobs</h5></div>} />

        {/* Reports */}
        <Route path="reports/integration" element={<div><h5>Integration Report</h5></div>} />
        <Route path="reports/revenue" element={<div><h5>Revenue Summary</h5></div>} />
        <Route path="reports/support" element={<div><h5>Support Tickets</h5></div>} />
        <Route path="reports" element={<div><h5>Reports</h5></div>} />

        {/* Settings */}
        <Route path="settings" element={<div><h5>Settings</h5></div>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/integrator-connect" replace />} />
    </Route>
);

export const getIntegratorConnectRoutes = () => integratorConnectRoutes;