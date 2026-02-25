// src/DOCTOR_CONNECT/Layout/HomePage.tsx

import React, { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import {
  ClipboardList,
  Clock,
  FileText,
  CheckCircle2,
  TrendingUp,
  Package,
  AlertCircle,
  Plus,
} from 'lucide-react';
import type { TabItem } from '../../Types/Dashboards.types';
import AuthService from '../../Services/AuthServices/Auth.services';
import type { StatCardProps } from '../../Types/KiduTypes/StatCard.types';
import KiduStatsCardsGrid from '../../KIDU_COMPONENTS/KiduStatsCardsGrid';
import CaseTabs from '../../KIDU_COMPONENTS/KiduCaseTabs';
import { useNavigate } from 'react-router-dom';

// ─── Tab config ───────────────────────────────────────────────────
const tabs: TabItem[] = [
  { id: 'active', label: 'Active Cases', icon: ClipboardList, count: 5 },
  { id: 'progress', label: 'In Progress', icon: Clock, count: 3 },
  { id: 'completed', label: 'Completed', icon: CheckCircle2, count: 28 },
  { id: 'recent', label: 'Recent', icon: FileText, count: null },
];

// ─── HomePage ─────────────────────────────────────────────────────
const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('active');
  const user = AuthService.getUser();
  const navigate = useNavigate();

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
      <div className="page-header mb-4 d-flex justify-content-between align-items-start flex-wrap gap-3">

        {/* Left Side */}
        <div>
          <h1 className="page-title mb-1">Doctor Dashboard</h1>
          <p className="page-description mb-0">
            Welcome back, <strong>Dr. {user?.userName ?? 'Doctor'}</strong>! Here's your case overview.
          </p>
        </div>

        {/* Right Side Button */}
        <Button
          variant="primary"
          className="d-flex align-items-center gap-2 px-3"
          style={{
            backgroundColor: 'var(--theme-primary)',
            borderColor: 'var(--theme-primary)',
            borderRadius: '0.75rem',
            fontWeight: 500,
          }}
          onClick={() => navigate('/doctor-connect/add-new-case')}
        >
          <Plus size={16} />
          Add Prescription
        </Button>

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