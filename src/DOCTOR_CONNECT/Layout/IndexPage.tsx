/* ============================================================
   pages/DoctorIndexPage.tsx
   Index page for DOCTOR login.

   Tabs visible: Scan Rejected | Case on Hold | In Transit |
                 In Production | Submitted | Recent
   Card mode: doctor → Chat + Status + Help buttons
              Rush cases get pulsing border + RUSH tag
   ============================================================ */

import React, { useEffect, useState } from 'react';
import type { DashboardPageData } from '../../Types/IndexPage.types';
import { fetchDashboardData } from '../../Configs/Dummydata';
import CaseDashboard from '../../KIDU_COMPONENTS/KiduCaseDashboard';


const DoctorIndexPage: React.FC = () => {
  const [data, setData] = useState<DashboardPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // ── Replace fetchDashboardData('doctor') with your real API call:
    // fetch('/api/v1/dashboard?role=doctor')
    //   .then(res => res.json())
    //   .then(setData)
    //   .catch(...)
    fetchDashboardData('doctor')
      .then(setData)
      .catch(() => setError('Failed to load dashboard. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#ef4444', fontFamily: 'Outfit,sans-serif' }}>
        {error}
      </div>
    );
  }

  return (
    <CaseDashboard
      role="doctor"
      data={data ?? {
        role: 'doctor',
        tabCounts: { rejected: 0, hold: 0, transit: 0, production: 0, submitted: 0, recent: 0 },
        cases: { rejected: [], hold: [], transit: [], production: [], submitted: [], recent: [] },
      }}
      loading={loading}
    />
  );
};

export default DoctorIndexPage;