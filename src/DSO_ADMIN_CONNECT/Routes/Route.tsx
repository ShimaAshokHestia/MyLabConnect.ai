// STAFF-PORTAL/Routes/Routes.tsx
// IMPORTANT: This component should NOT contain <Routes> or <Router>
// It's just a collection of Route definitions to be used in the main AppRoutes

import { Navigate, Route } from 'react-router-dom';
import { DsoAdminLayout } from '../Layout/DsoAdminLayout';
import HomePage from '../Pages/Home/HomePage';
//DSO Doctor
import DsoDoctorList from '../Pages/Masters/Doctors/List';

//DSO Product Group
import DsoProductGroupList from '../Pages/Masters/Product Group/List';


export const dsoadminConnectRoutes = (
  <Route
    path="/dsoadmin-connect/*" element={<DsoAdminLayout />}
    // path="/admin-portal"
    // element={
    //   // <ProtectedRoute allowedRoles={['Staff']}>
    //     <AdminLayout />
    //   // </ProtectedRoute>
    // }
  >
<Route index element={<HomePage/>} />
<Route path="analytics" element={<div><h5>Analytics</h5></div>} />
    {/* <Route path="/dsoadmin-connect/home/caseOnHold" element={</>} /> */}
    {/* <Route path="/dsoadmin-connect/home/inTransit" element={</>} /> */}
    {/* <Route path="/dsoadmin-connect/home/inProduction" element={</>} /> */}
    {/* <Route path="/dsoadmin-connect/home/submitted" element={</>} /> */}
    {/* <Route path="/dsoadmin-connect/home/recent" element={</>} /> */}

    {/* <Route path="/dsoadmin-connect/analytics" element={</>} /> */}

    {/* <Route path="/dsoadmin-connect/masters/lab" element={</>} /> */}
    {/* <Route path="/dsoadmin-connect/masters/practice" element={</>} /> */}
    <Route path="masters/doctor-list" element={<DsoDoctorList/>} />
    <Route path="masters/productGroup-list" element={<DsoProductGroupList/>} />

    {/* <Route path="/dsoadmin-connect/masters/userRoleCreation" element={</>} /> */}

    {/* <Route path="/dsoadmin-connect/setup/practiceManagerLogin" element={</>} /> */}
    {/* <Route path="/dsoadmin-connect/setup/dsoUserLogin" element={</>} /> */}
    {/* <Route path="/dsoadmin-connect/setup/labProductsRate" element={</>} /> */}
    {/* <Route path="/dsoadmin-connect/setup/zone" element={</>} /> */}

    {/* <Route path="/dsoadmin-connect/mapping/prescriptionProduct" element={</>} /> */}
    {/* <Route path="/dsoadmin-connect/mapping/triosDoctor" element={</>} /> */}
    {/* <Route path="/dsoadmin-connect/mapping/triosProduct" element={</>} /> */}
    {/* <Route path="/dsoadmin-connect/mapping/labDsoDoctor" element={</>} /> */}
    {/* <Route path="/dsoadmin-connect/mapping/labDsoProduct" element={</>} /> */}
    {/* <Route path="/dsoadmin-connect/mapping/doctorPickupService" element={</>} /> */}

    {/* <Route path="/dsoadmin-connect/reports/caseSummary" element={</>} /> */}
    {/* <Route path="/dsoadmin-connect/reports/revenueSummary" element={</>} /> */}
    {/* <Route path="/dsoadmin-connect/reports/supportTickets" element={</>} /> */}
    {/* <Route path="/dsoadmin-connect/reports/caseOnHoldAging" element={</>} /> */}
    {/* <Route path="/dsoadmin-connect/reports/usageAdoptionReport" element={</>} /> */}

    {/* <Route path="/dsoadmin-connect/invoices/proformaInvoice" element={</>} /> */}
    
    
    <Route path="masters" element={<div><h5>User Management</h5></div>} />
     <Route path="setup" element={<div><h5>User Management</h5></div>} />
      <Route path="mapping" element={<div><h5>User Management</h5></div>} />
       <Route path="reports" element={<div><h5>User Management</h5></div>} />
        <Route path="invoices" element={<div><h5>User Management</h5></div>} />
         <Route path="proforma-invoice" element={<div><h5>User Management</h5></div>} />
    <Route path="*" element={<Navigate to="dashboard" replace />} />
   
  </Route>
);

// Alternative: Export as function
export const getdsoadminConnectRoutes = () => dsoadminConnectRoutes;