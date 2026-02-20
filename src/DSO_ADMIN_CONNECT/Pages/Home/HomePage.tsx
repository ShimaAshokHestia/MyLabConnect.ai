// src/DSO_ADMIN_CONNECT/Pages/Home/HomePage.tsx

import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import {
  Clock,
  Truck,
  Package,
  ClipboardList,
  FileText,
  TrendingUp,
  Users,
  Building2,
} from 'lucide-react';
import type { TabItem } from '../../../Types/Dashboards.types';
import type { StatCardProps } from '../../../Types/KiduTypes/StatCard.types';
import KiduStatsCardsGrid from '../../../KIDU_COMPONENTS/KiduStatsCardsGrid';
import CaseTabs from '../../../KIDU_COMPONENTS/KiduCaseTabs';
import AuthService from '../../../Services/AuthServices/Auth.services';

// ─── Tabs — matches DSO Admin menu Home children exactly ──────────
const tabs: TabItem[] = [
  { id: 'on-hold',       label: 'Case on Hold',  icon: Clock,        count: 12   },
  { id: 'in-transit',    label: 'In Transit',    icon: Truck,        count: 8    },
  { id: 'in-production', label: 'In Production', icon: Package,      count: 24   },
  { id: 'submitted',     label: 'Submitted',     icon: ClipboardList,count: 5    },
  { id: 'recent',        label: 'Recent',        icon: FileText,     count: null },
];

// ─── HomePage ─────────────────────────────────────────────────────
const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('on-hold');
  const user = AuthService.getUser();

  // Replace with API fetch filtered by activeTab
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const statsCards: StatCardProps[] = [
    {
      title: 'Total Cases',
      value: '156',
      change: '+12% from last month',
      changeType: 'positive',
      icon: FileText,
    },
    {
      title: 'Active Doctors',
      value: '24',
      change: '+2 new this week',
      changeType: 'positive',
      icon: Users,
      variant: 'info',
    },
    {
      title: 'Partner Labs',
      value: '8',
      change: 'Same as last month',
      changeType: 'neutral',
      icon: Building2,
      variant: 'primary',
    },
    {
      title: 'Revenue',
      value: '$45.2K',
      change: '+8.5% from last month',
      changeType: 'positive',
      icon: TrendingUp,
      variant: 'success',
    },
  ];

  return (
    <Container fluid className="dashboard-page py-4">

      {/* ── Page Header ───────────────────────────────────────────── */}
      <div className="page-header mb-4">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">
          Welcome back, <strong>{user?.userName ?? 'DSO Admin'}</strong>! Here's an overview of your dental cases.
        </p>
      </div>

      {/* ── Stats Cards ───────────────────────────────────────────── */}
      <KiduStatsCardsGrid cards={statsCards} columns={4} />

      {/* ── Case Tabs ─────────────────────────────────────────────── */}
      <CaseTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        className="mb-4"
      />

      {/* Case Table — create when ready */}
      {/* <CaseTable activeTab={activeTab} /> */}

    </Container>
  );
};

export default HomePage;