// src/LAB_CONNECT/Pages/Home/HomePage.tsx

import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import {
  Truck,
  Package,
  ClipboardList,
  FileText,
  Microscope,
  TrendingUp,
} from 'lucide-react';
import type { TabItem } from '../../Types/Dashboards.types';
import AuthService from '../../Services/AuthServices/Auth.services';
import type { StatCardProps } from '../../Types/KiduTypes/StatCard.types';
import KiduStatsCardsGrid from '../../KIDU_COMPONENTS/KiduStatsCardsGrid';
import CaseTabs from '../../KIDU_COMPONENTS/KiduCaseTabs';


// ─── Tab config ───────────────────────────────────────────────────
const tabs: TabItem[] = [
  { id: 'active',        label: 'Active Orders',  icon: Package,      count: 15 },
  { id: 'in-production', label: 'In Production',  icon: Microscope,   count: 8  },
  { id: 'ready',         label: 'Ready to Ship',  icon: Truck,        count: 3  },
  { id: 'completed',     label: 'Completed',      icon: ClipboardList,count: 42 },
  { id: 'recent',        label: 'Recent',         icon: FileText,     count: null },
];

// ─── HomePage ─────────────────────────────────────────────────────
const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('active');
  const user = AuthService.getUser();

  const statsCards: StatCardProps[] = [
    {
      title: 'Active Orders',
      value: '26',
      change: '+5 since yesterday',
      changeType: 'positive',
      icon: Package,
    },
    {
      title: 'In Production',
      value: '8',
      change: '2 due today',
      changeType: 'neutral',
      icon: Microscope,
      variant: 'info',
    },
    {
      title: 'Ready to Ship',
      value: '3',
      change: 'Awaiting pickup',
      changeType: 'neutral',
      icon: Truck,
      variant: 'primary',
    },
    {
      title: 'Revenue (Month)',
      value: '$18.4K',
      change: '+6.2% from last month',
      changeType: 'positive',
      icon: TrendingUp,
      variant: 'success',
    },
  ];

  return (
    <Container fluid className="dashboard-page py-4">

      {/* ── Page Header ───────────────────────────────────────────── */}
      <div className="page-header mb-4">
        <h1 className="page-title">Lab Dashboard</h1>
        <p className="page-description">
          Welcome back, <strong>{user?.userName ?? 'Lab User'}</strong>! Here's your lab overview.
        </p>
      </div>

      {/* ── Stats Cards ───────────────────────────────────────────── */}
      <KiduStatsCardsGrid cards={statsCards} columns={4} />

      {/* ── Order Tabs ────────────────────────────────────────────── */}
      <CaseTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-4"
      />

      {/* Order Table — create when ready */}
      {/* <OrderTable activeTab={activeTab} /> */}

    </Container>
  );
};

export default HomePage;