/* ============================================================
   pages/AdminIndexPage.tsx
   Index page for ADMIN login.

   Tabs visible: Scan Rejected | Case on Hold | In Transit |
                 In Production | Submitted | Recent (all 6)
   Card mode: admin → View-only (no action buttons)
              Full visibility across all practices / labs / DSOs

   // CHANGED: replaced fetchDashboardData dummy with useDashboardCases.
   // No filters passed → backend returns ALL cases across all DSOs/labs.
   ============================================================ */

import React from 'react';
import CaseDashboard from '../../KIDU_COMPONENTS/KiduCaseDashboard';
import { useDashboardCases } from '../../DOCTOR_CONNECT/Types/Common/UseDashBoard.types';

const AdminIndexPage: React.FC = () => {
  const { data, loading, error, refresh } = useDashboardCases({
    role: 'admin',
    // No dSODoctorId / dSOMasterId / labMasterId → fetches ALL cases
  });

  if (error) {
    return (
      <div
        style={{
          padding: 40,
          textAlign: 'center',
          color: '#ef4444',
          fontFamily: 'Outfit,sans-serif',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span>{error}</span>
        <button
          onClick={refresh}
          style={{
            padding: '8px 20px',
            borderRadius: 8,
            border: '1.5px solid #ef4444',
            background: 'transparent',
            color: '#ef4444',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.85rem',
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <CaseDashboard
      role="admin"
      data={data}
      loading={loading}
    />
  );
};

export default AdminIndexPage;