// src/APPADMIN_CONNECT/Routes/Route.tsx
// Do NOT wrap in <Routes> or <BrowserRouter>
// Do NOT add ProtectedRoute here — AppRoutes.tsx handles it

import { Navigate, Route } from 'react-router-dom';
import AppAdminLayout from '../Layout/AppAdminLayout';
import HomePage from '../Layout/HomePage';
import DSOmasterList from '../Pages/Master/List';
import UserList from '../Pages/User/List';
import UserTypeList from '../Pages/UserType/List';

// ── Add page imports here as you build them ────────────────────────
// import DSOmasterList from '../Pages/Master/List';
// import UserList      from '../Pages/Users/List';

export const adminConnectRoutes = (
  <Route path="/" element={<AppAdminLayout />}>

    <Route index element={<HomePage />} />

    {/* Masters */}
    {/* <Route path="masters/master-list" element={<DSOmasterList />} /> */}

    {/* User Management */}
    <Route path="users/user-list"         element={<UserList />} />
    {/* <Route path="users/user-create"       element={<UserCreate />} /> */}
    {/* <Route path="users/user-edit/:id"     element={<UserEdit />} /> */}
    {/* <Route path="users/user-view/:id"     element={<UserView />} /> */}
    <Route path="users/usertype-list"     element={<UserTypeList />} />

    {/* Companies */}
    {/* <Route path="companies/company-list"  element={<CompanyList />} /> */}

    {/* Reports */}
    <Route path="analytics"                element={<div><h5>Analytics</h5></div>} />
    <Route path="masters/master-list" element={<DSOmasterList/>}/>
    <Route path="reports/case-summary"     element={<div><h5>Case Summary</h5></div>} />
    <Route path="reports/revenue-summary"  element={<div><h5>Revenue Summary</h5></div>} />
    <Route path="reports/support-tickets"  element={<div><h5>Support Tickets</h5></div>} />

    {/* Settings */}
    <Route path="settings" element={<div><h5>Settings</h5></div>} />

    {/* Catch-all */}
    <Route path="*" element={<Navigate to="/appadmin-connect" replace />} />
  </Route>
);

export const getAdminConnectRoutes = () => adminConnectRoutes;