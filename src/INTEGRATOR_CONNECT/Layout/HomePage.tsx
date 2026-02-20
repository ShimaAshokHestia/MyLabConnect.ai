// src/INTEGRATOR_CONNECT/Pages/Home/HomePage.tsx

import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  FileText,
  Link2,
  TrendingUp,
  Clock,
  XCircle,
} from 'lucide-react';
import type { TabItem } from '../../Types/Dashboards.types';
import AuthService from '../../Services/AuthServices/Auth.services';
import type { StatCardProps } from '../../Types/KiduTypes/StatCard.types';
import CaseTabs from '../../KIDU_COMPONENTS/KiduCaseTabs';
import KiduStatsCardsGrid from '../../KIDU_COMPONENTS/KiduStatsCardsGrid';


// ─── Tab config ───────────────────────────────────────────────────
const tabs: TabItem[] = [
  { id: 'active',    label: 'Active Jobs',    icon: Activity,    count: 4    },
  { id: 'failed',    label: 'Failed Jobs',    icon: XCircle,     count: 2    },
  { id: 'completed', label: 'Completed',      icon: CheckCircle2,count: 86   },
  { id: 'scheduled', label: 'Scheduled',      icon: Clock,       count: 6    },
  { id: 'recent',    label: 'Recent',         icon: FileText,    count: null },
];

// ─── HomePage ─────────────────────────────────────────────────────
const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('active');
  const user = AuthService.getUser();

  const statsCards: StatCardProps[] = [
    {
      title: 'Active Jobs',
      value: '4',
      change: 'Running now',
      changeType: 'positive',
      icon: Activity,
    },
    {
      title: 'Failed Jobs',
      value: '2',
      change: 'Needs attention',
      changeType: 'negative',
      icon: AlertCircle,
      variant: 'info',
    },
    {
      title: 'Integrations',
      value: '11',
      change: '+1 this month',
      changeType: 'positive',
      icon: Link2,
      variant: 'primary',
    },
    {
      title: 'Success Rate',
      value: '97.8%',
      change: '+0.4% from last month',
      changeType: 'positive',
      icon: TrendingUp,
      variant: 'success',
    },
  ];

  return (
    <Container fluid className="dashboard-page py-4">

      {/* ── Page Header ───────────────────────────────────────────── */}
      <div className="page-header mb-4">
        <h1 className="page-title">Integrator Dashboard</h1>
        <p className="page-description">
          Welcome back, <strong>{user?.userName ?? 'Integrator'}</strong>! Here's your integration overview.
        </p>
      </div>

      {/* ── Stats Cards ───────────────────────────────────────────── */}
      <KiduStatsCardsGrid cards={statsCards} columns={4} />

      {/* ── Jobs Tabs ─────────────────────────────────────────────── */}
      <CaseTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-4"
      />

      {/* Jobs Table — create when ready */}
      {/* <JobsTable activeTab={activeTab} /> */}

    </Container>
  );
};

export default HomePage;