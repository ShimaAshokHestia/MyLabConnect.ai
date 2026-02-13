import { useState } from "react";
import { adminConnectConfig } from "../../Configs/LayoutConfig";
import KiduLayout from "../../KIDU_COMPONENTS/KiduLayout";

export const AdminLayout: React.FC = () => {
  const [notifications, setNotifications] = useState(adminConnectConfig.notifications);

  const handleSignOut = () => {
    window.location.href = '/login';
  };

  return (
    <KiduLayout
      menuItems={adminConnectConfig.menuItems}
      logoTitle="Admin Connect"
      logoSubtitle="System Administration"
      user={adminConnectConfig.user}
      notifications={notifications}
      profileMenuActions={adminConnectConfig.profileActions}
      onNotificationClick={(notification) => {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, read: true } : n
          )
        );
      }}
      onMarkAllAsRead={() => {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, read: true }))
        );
      }}
      onSignOut={handleSignOut}
    />
  );
};





// /**
//  * LAYOUT USAGE EXAMPLES FOR ALL 6 LOGIN TYPES
//  * 
//  * This file demonstrates how to use KiduLayout component
//  * for each of the 6 different login types.
//  */

// import React, { useState } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { adminConnectConfig } from '../../Configs/LayoutConfig';
// import KiduLayout from '../../KIDU_COMPONENTS/KiduLayout';

// // ============================================
// // EXAMPLE 1: ADMIN CONNECT
// // ============================================

// export const AdminLayout: React.FC = () => {
//   const [notifications, setNotifications] = useState(adminConnectConfig.notifications);

//   const handleSignOut = () => {
//     console.log('Admin signing out...');
//     // Clear session, redirect to login
//     window.location.href = '/login';
//   };

//   return (
    
//       <Routes>
//         <Route
//           path="/admin-connect/*"
//           element={
//             <KiduLayout
//               menuItems={adminConnectConfig.menuItems}
//               logoTitle="Admin Connect"
//               logoSubtitle="System Administration"
//               user={adminConnectConfig.user}
//               notifications={notifications}
//               profileMenuActions={adminConnectConfig.profileActions}
//               onNotificationClick={(notification) => {
//                 setNotifications((prev) =>
//                   prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
//                 );
//               }}
//               onMarkAllAsRead={() => {
//                 setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
//               }}
//               onSignOut={handleSignOut}
//             />
//           }
//         >
//           {/* Admin Routes */}
//           <Route path="dashboard" element={<div><h1>Admin Dashboard</h1></div>} />
//           <Route path="analytics" element={<div><h1>Analytics</h1></div>} />
//           <Route path="users" element={<div><h1>User Management</h1></div>} />
//           <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
//         </Route>
//       </Routes>

//   );
// };

// // ============================================
// // EXAMPLE 2: PRACTICE CONNECT
// // ============================================

// // export const PracticeConnectApp: React.FC = () => {
// //   const config = practiceConnectConfig;
// //   const [notifications, setNotifications] = useState(config.notifications);

// //   return (
// //     <BrowserRouter>
// //       <Routes>
// //         <Route
// //           path="/practice/*"
// //           element={
// //             <KiduLayout
// //               menuItems={config.menuItems}
// //               logoTitle="Practice Connect"
// //               logoSubtitle="Practice Management"
// //               user={config.user}
// //               notifications={notifications}
// //               profileMenuActions={config.profileActions}
// //               onNotificationClick={(n) => {
// //                 setNotifications((prev) =>
// //                   prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
// //                 );
// //               }}
// //               onMarkAllAsRead={() => {
// //                 setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
// //               }}
// //               onSignOut={() => (window.location.href = '/login')}
// //             />
// //           }
// //         >
// //           <Route path="dashboard" element={<div><h1>Practice Dashboard</h1></div>} />
// //           <Route path="cases" element={<div><h1>My Cases</h1></div>} />
// //           <Route path="patients" element={<div><h1>Patients</h1></div>} />
// //           <Route path="*" element={<Navigate to="/practice/dashboard" replace />} />
// //         </Route>
// //       </Routes>
// //     </BrowserRouter>
// //   );
// // };

// // ============================================
// // EXAMPLE 3: DSO CONNECT
// // ============================================

// // export const DSOConnectApp: React.FC = () => {
// //   const config = dsoConnectConfig;
// //   const [notifications, setNotifications] = useState(config.notifications);

// //   return (
// //     <BrowserRouter>
// //       <Routes>
// //         <Route
// //           path="/dso/*"
// //           element={
// //             <KiduLayout
// //               menuItems={config.menuItems}
// //               logoTitle="DSO Connect"
// //               logoSubtitle="Dental Service Organization"
// //               user={config.user}
// //               searchPlaceholder="Search cases, doctors, labs..."
// //               notifications={notifications}
// //               profileMenuActions={config.profileActions}
// //               onSearch={(query) => console.log('Search:', query)}
// //               onNotificationClick={(n) => {
// //                 setNotifications((prev) =>
// //                   prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
// //                 );
// //               }}
// //               onMarkAllAsRead={() => {
// //                 setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
// //               }}
// //               onSignOut={() => (window.location.href = '/login')}
// //             />
// //           }
// //         >
// //           <Route path="case-on-hold" element={<div><h1>Cases On Hold</h1></div>} />
// //           <Route path="in-transit" element={<div><h1>In Transit</h1></div>} />
// //           <Route path="analytics" element={<div><h1>Analytics</h1></div>} />
// //           <Route path="*" element={<Navigate to="/dso/case-on-hold" replace />} />
// //         </Route>
// //       </Routes>
// //     </BrowserRouter>
// //   );
// // };

// // ============================================
// // EXAMPLE 4: LAB CONNECT
// // ============================================

// // export const LabConnectApp: React.FC = () => {
// //   const config = labConnectConfig;

// //   return (
// //     <BrowserRouter>
// //       <Routes>
// //         <Route
// //           path="/lab/*"
// //           element={
// //             <KiduLayout
// //               menuItems={config.menuItems}
// //               logoTitle="Lab Connect"
// //               logoSubtitle="Laboratory Management"
// //               user={config.user}
// //               notifications={config.notifications}
// //               profileMenuActions={config.profileActions}
// //               onSignOut={() => (window.location.href = '/login')}
// //             />
// //           }
// //         >
// //           <Route path="dashboard" element={<div><h1>Lab Dashboard</h1></div>} />
// //           <Route path="orders" element={<div><h1>Orders</h1></div>} />
// //           <Route path="*" element={<Navigate to="/lab/dashboard" replace />} />
// //         </Route>
// //       </Routes>
// //     </BrowserRouter>
// //   );
// // };

// // ============================================
// // EXAMPLE 5: VENTORS (VENDORS)
// // ============================================

// // export const VentorsApp: React.FC = () => {
// //   const config = ventorsConfig;

// //   return (
// //     <BrowserRouter>
// //       <Routes>
// //         <Route
// //           path="/vendor/*"
// //           element={
// //             <KiduLayout
// //               menuItems={config.menuItems}
// //               logoTitle="Ventors"
// //               logoSubtitle="Vendor Management"
// //               user={config.user}
// //               notifications={config.notifications}
// //               profileMenuActions={config.profileActions}
// //               onSignOut={() => (window.location.href = '/login')}
// //             />
// //           }
// //         >
// //           <Route path="dashboard" element={<div><h1>Vendor Dashboard</h1></div>} />
// //           <Route path="products" element={<div><h1>Products</h1></div>} />
// //           <Route path="*" element={<Navigate to="/vendor/dashboard" replace />} />
// //         </Route>
// //       </Routes>
// //     </BrowserRouter>
// //   );
// // };

// // ============================================
// // EXAMPLE 6: LAB GROUP
// // ============================================

// // export const LabGroupApp: React.FC = () => {
// //   const config = labGroupConfig;

// //   return (
// //     <BrowserRouter>
// //       <Routes>
// //         <Route
// //           path="/lab-group/*"
// //           element={
// //             <KiduLayout
// //               menuItems={config.menuItems}
// //               logoTitle="Lab Group"
// //               logoSubtitle="Multi-Lab Management"
// //               user={config.user}
// //               notifications={config.notifications}
// //               profileMenuActions={config.profileActions}
// //               onSignOut={() => (window.location.href = '/login')}
// //             />
// //           }
// //         >
// //           <Route path="dashboard" element={<div><h1>Lab Group Dashboard</h1></div>} />
// //           <Route path="labs" element={<div><h1>Labs</h1></div>} />
// //           <Route path="*" element={<Navigate to="/lab-group/dashboard" replace />} />
// //         </Route>
// //       </Routes>
// //     </BrowserRouter>
// //   );
// // };

// // ============================================
// // EXAMPLE 7: DYNAMIC BASED ON USER ROLE
// // ============================================

// // export const DynamicLayoutApp: React.FC = () => {
// //   // This would come from your authentication system
// //   const [userRole] = useState('dso'); // 'admin', 'practice', 'dso', 'lab', 'vendor', 'lab-group'
// //   const config = getLayoutConfig(userRole);
// //   const [notifications, setNotifications] = useState(config.notifications);

// //   return (
// //     <BrowserRouter>
// //       <Routes>
// //         <Route
// //           path="/*"
// //           element={
// //             <KiduLayout
// //               menuItems={config.menuItems}
// //               logoTitle={`${userRole.toUpperCase()} Connect`}
// //               user={config.user}
// //               notifications={notifications}
// //               profileMenuActions={config.profileActions}
// //               onNotificationClick={(n) => {
// //                 setNotifications((prev) =>
// //                   prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
// //                 );
// //               }}
// //               onMarkAllAsRead={() => {
// //                 setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
// //               }}
// //               onSignOut={() => (window.location.href = '/login')}
// //             />
// //           }
// //         >
// //           <Route path="/" element={<div><h1>{userRole} Dashboard</h1></div>} />
// //           <Route path="*" element={<Navigate to="/" replace />} />
// //         </Route>
// //       </Routes>
// //     </BrowserRouter>
// //   );
// // };

// // ============================================
// // EXAMPLE 8: COMPLETE APP WITH ALL LOGIN TYPES
// // ============================================

// // export const CompleteMultiLoginApp: React.FC = () => {
// //   return (
// //     <BrowserRouter>
// //       <Routes>
// //         {/* Admin Connect Routes */}
// //         <Route
// //           path="/admin/*"
// //           element={
// //             <KiduLayout
// //               {...adminConnectConfig}
// //               logoTitle="Admin Connect"
// //               onSignOut={() => (window.location.href = '/login')}
// //             />
// //           }
// //         >
// //           <Route path="dashboard" element={<div><h1>Admin Dashboard</h1></div>} />
// //           <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
// //         </Route>

// //         {/* Practice Connect Routes */}
// //         <Route
// //           path="/practice/*"
// //           element={
// //             <KiduLayout
// //               {...practiceConnectConfig}
// //               logoTitle="Practice Connect"
// //               onSignOut={() => (window.location.href = '/login')}
// //             />
// //           }
// //         >
// //           <Route path="dashboard" element={<div><h1>Practice Dashboard</h1></div>} />
// //           <Route path="*" element={<Navigate to="/practice/dashboard" replace />} />
// //         </Route>

// //         {/* DSO Connect Routes */}
// //         <Route
// //           path="/dso/*"
// //           element={
// //             <KiduLayout
// //               {...dsoConnectConfig}
// //               logoTitle="DSO Connect"
// //               onSignOut={() => (window.location.href = '/login')}
// //             />
// //           }
// //         >
// //           <Route path="case-on-hold" element={<div><h1>Cases On Hold</h1></div>} />
// //           <Route path="*" element={<Navigate to="/dso/case-on-hold" replace />} />
// //         </Route>

// //         {/* Lab Connect Routes */}
// //         <Route
// //           path="/lab/*"
// //           element={
// //             <KiduLayout
// //               {...labConnectConfig}
// //               logoTitle="Lab Connect"
// //               onSignOut={() => (window.location.href = '/login')}
// //             />
// //           }
// //         >
// //           <Route path="dashboard" element={<div><h1>Lab Dashboard</h1></div>} />
// //           <Route path="*" element={<Navigate to="/lab/dashboard" replace />} />
// //         </Route>

// //         {/* Ventors Routes */}
// //         <Route
// //           path="/vendor/*"
// //           element={
// //             <KiduLayout
// //               {...ventorsConfig}
// //               logoTitle="Ventors"
// //               onSignOut={() => (window.location.href = '/login')}
// //             />
// //           }
// //         >
// //           <Route path="dashboard" element={<div><h1>Vendor Dashboard</h1></div>} />
// //           <Route path="*" element={<Navigate to="/vendor/dashboard" replace />} />
// //         </Route>

// //         {/* Lab Group Routes */}
// //         <Route
// //           path="/lab-group/*"
// //           element={
// //             <KiduLayout
// //               {...labGroupConfig}
// //               logoTitle="Lab Group"
// //               onSignOut={() => (window.location.href = '/login')}
// //             />
// //           }
// //         >
// //           <Route path="dashboard" element={<div><h1>Lab Group Dashboard</h1></div>} />
// //           <Route path="*" element={<Navigate to="/lab-group/dashboard" replace />} />
// //         </Route>

// //         {/* Default Redirect */}
// //         <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
// //       </Routes>
// //     </BrowserRouter>
// //   );
// // };



