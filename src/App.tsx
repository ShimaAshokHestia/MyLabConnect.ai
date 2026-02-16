// // App.tsx
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import "./Styles/ThemeStyle/Theme.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import AppRoutes from './Routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;

// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// // Import Bootstrap CSS
// import 'bootstrap/dist/css/bootstrap.min.css';
// // Import custom theme
// import './Styles/ThemeStyle/Theme.scss';
// // Import layout styles
// import './Styles/KiduStyles/Layout.css';
// import { getMenuForRole } from './Configs/MenuConfig';
// import { ThemeProvider } from './ThemeProvider/ThemeProvider';
// import Layout from './Layout/Layout';

/**
 * Example Page Components
 */
// const DashboardPage: React.FC = () => (
//   <div className="page-container">
//     <div className="page-header">
//       <h1 className="page-title">Dashboard</h1>
//       <p className="page-description">Welcome to your dashboard</p>
//     </div>
//     <div className="content-card">
//       <h2>Overview</h2>
//       <p>This is your main dashboard view.</p>
//     </div>
//   </div>
// );

// const CaseOnHoldPage: React.FC = () => (
//   <div className="page-container">
//     <div className="page-header">
//       <h1 className="page-title">Cases On Hold</h1>
//       <p className="page-description">View and manage cases that are currently on hold</p>
//     </div>
//     <div className="content-card">
//       <h3>Case List</h3>
//       <p>List of cases on hold will appear here.</p>
//     </div>
//   </div>
// );

// const AnalyticsPage: React.FC = () => (
//   <div className="page-container">
//     <div className="page-header">
//       <h1 className="page-title">Analytics</h1>
//       <p className="page-description">View detailed analytics and reports</p>
//     </div>
//     <div className="content-card">
//       <h3>Analytics Dashboard</h3>
//       <p>Charts and metrics will be displayed here.</p>
//     </div>
//   </div>
// );

// const LabManagementPage: React.FC = () => (
//   <div className="page-container">
//     <div className="page-header">
//       <h1 className="page-title">Lab Management</h1>
//       <p className="page-description">Manage partner laboratories and their details</p>
//     </div>
//     <div className="content-card">
//       <h3>Laboratory List</h3>
//       <p>Laboratory management interface goes here.</p>
//     </div>
//   </div>
// );

// /**
//  * Main App Component
//  */
// const App: React.FC = () => {
//   // In a real app, this would come from authentication/user context
//   const userRole = 'admin'; // or 'lab', 'doctor', 'practice-manager'
//   const menuItems = getMenuForRole(userRole);

//   // Custom logo component (optional)
//   const CustomLogo = (
//     <div className="sidebar-logo-icon">
//       <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
//         <circle cx="16" cy="16" r="16" fill="#ef0d50" />
//         <text
//           x="16"
//           y="20"
//           textAnchor="middle"
//           fill="white"
//           fontSize="14"
//           fontWeight="bold"
//         >
//           ML
//         </text>
//       </svg>
//     </div>
//   );

//   return (
//     <ThemeProvider defaultTheme="light">
//       <BrowserRouter>
//         <Layout
//           menuItems={menuItems}
//           logoIcon={CustomLogo}
//           logoTitle="MyLabConnect"
//           logoSubtitle="Dental Care Platform"
//           showThemeToggle={true}
//           headerContent={
//             <div className="d-flex align-items-center gap-3">
//               <button className="btn btn-sm btn-outline-secondary d-md-none">
//                 <span>☰</span>
//               </button>
//               <div className="input-group" style={{ maxWidth: '400px' }}>
//                 <input
//                   type="search"
//                   className="form-control form-control-sm"
//                   placeholder="Search cases, doctors, labs..."
//                 />
//               </div>
//             </div>
//           }
//         >
//           <Routes>
//             <Route path="/" element={<Navigate to="/dashboard/case-on-hold" replace />} />
//             <Route path="/dashboard" element={<DashboardPage />} />
//             <Route path="/dashboard/case-on-hold" element={<CaseOnHoldPage />} />
//             <Route path="/dashboard/in-transit" element={<CaseOnHoldPage />} />
//             <Route path="/dashboard/in-production" element={<CaseOnHoldPage />} />
//             <Route path="/dashboard/submitted" element={<CaseOnHoldPage />} />
//             <Route path="/dashboard/recent" element={<CaseOnHoldPage />} />
//             <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
//             <Route path="/dashboard/masters/lab" element={<LabManagementPage />} />
//             <Route path="/dashboard/masters/practice" element={<LabManagementPage />} />
//             <Route path="/dashboard/masters/doctor" element={<LabManagementPage />} />
//             <Route path="/dashboard/masters/product-group" element={<LabManagementPage />} />
//             <Route path="/dashboard/masters/user-roles" element={<LabManagementPage />} />
//             <Route path="*" element={<Navigate to="/dashboard/case-on-hold" replace />} />
//           </Routes>
//         </Layout>
//       </BrowserRouter>
//     </ThemeProvider>
//   );
// };

// export default App;