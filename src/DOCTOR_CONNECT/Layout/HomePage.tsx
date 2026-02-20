// src/DOCTOR_CONNECT/Pages/Home/HomePage.tsx

import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import {
  ClipboardList,
  Clock,
  FileText,
  CheckCircle2,
  TrendingUp,
  Package,
  AlertCircle,
} from 'lucide-react';
import type { TabItem } from '../../Types/Dashboards.types';
import AuthService from '../../Services/AuthServices/Auth.services';
import type { StatCardProps } from '../../Types/KiduTypes/StatCard.types';
import KiduStatsCardsGrid from '../../KIDU_COMPONENTS/KiduStatsCardsGrid';
import CaseTabs from '../../KIDU_COMPONENTS/KiduCaseTabs';

// ─── Tab config ───────────────────────────────────────────────────
const tabs: TabItem[] = [
  { id: 'active',    label: 'Active Cases', icon: ClipboardList, count: 5    },
  { id: 'progress',  label: 'In Progress',  icon: Clock,         count: 3    },
  { id: 'completed', label: 'Completed',    icon: CheckCircle2,  count: 28   },
  { id: 'recent',    label: 'Recent',       icon: FileText,      count: null },
];

// ─── HomePage ─────────────────────────────────────────────────────
const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('active');
  const user = AuthService.getUser();

  const statsCards: StatCardProps[] = [
    {
      title: 'My Active Cases',
      value: '8',
      change: '+2 this week',
      changeType: 'positive',
      icon: Package,
    },
    {
      title: 'In Progress',
      value: '3',
      change: '1 due today',
      changeType: 'neutral',
      icon: Clock,
      variant: 'info',
    },
    {
      title: 'Pending Review',
      value: '2',
      change: 'Awaiting approval',
      changeType: 'neutral',
      icon: AlertCircle,
      variant: 'primary',
    },
    {
      title: 'Completed (Month)',
      value: '28',
      change: '+14% from last month',
      changeType: 'positive',
      icon: TrendingUp,
      variant: 'success',
    },
  ];

  return (
    <Container fluid className="dashboard-page py-4">

      {/* ── Page Header ───────────────────────────────────────────── */}
      <div className="page-header mb-4">
        <h1 className="page-title">Doctor Dashboard</h1>
        <p className="page-description">
          Welcome back, <strong>Dr. {user?.userName ?? 'Doctor'}</strong>! Here's your case overview.
        </p>
      </div>

      {/* ── Stats Cards ───────────────────────────────────────────── */}
      <KiduStatsCardsGrid cards={statsCards} columns={4} />

      {/* ── Case Tabs ─────────────────────────────────────────────── */}
      <CaseTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-4"
      />

      {/* Case Table — create when ready */}
      {/* <CaseTable activeTab={activeTab} /> */}

    </Container>
  );
};

export default HomePage;