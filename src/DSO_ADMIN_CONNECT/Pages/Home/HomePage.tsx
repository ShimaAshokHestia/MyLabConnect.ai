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
import type { Case, TabItem } from '../../../Types/Dashboards.types';
import type { StatCardProps } from '../../../Types/KiduTypes/StatCard.types';
import KiduStatsCardsGrid from '../../../KIDU_COMPONENTS/KiduStatsCardsGrid';
import CaseTabs from '../../../KIDU_COMPONENTS/KiduCaseTabs';

// Mock data - Replace with actual API calls
const mockCases: Case[] = [
  {
    id: 'CS-2024-001',
    patient: 'John Smith',
    doctor: 'Dr. Sarah Wilson',
    lab: 'DentalLab Pro',
    product: 'Crown - Zirconia',
    status: 'on-hold',
    date: 'Jan 15, 2024',
  },
  {
    id: 'CS-2024-002',
    patient: 'Emily Davis',
    doctor: 'Dr. Michael Brown',
    lab: 'Premier Dental',
    product: 'Bridge - 3 Unit',
    status: 'in-transit',
    date: 'Jan 14, 2024',
  },
  {
    id: 'CS-2024-003',
    patient: 'Robert Johnson',
    doctor: 'Dr. Sarah Wilson',
    lab: 'DentalLab Pro',
    product: 'Veneer - Porcelain',
    status: 'in-production',
    date: 'Jan 13, 2024',
  },
  {
    id: 'CS-2024-004',
    patient: 'Maria Garcia',
    doctor: 'Dr. James Lee',
    lab: 'Smile Labs',
    product: 'Implant Crown',
    status: 'submitted',
    date: 'Jan 12, 2024',
  },
  {
    id: 'CS-2024-005',
    patient: 'David Chen',
    doctor: 'Dr. Michael Brown',
    lab: 'Premier Dental',
    product: 'Denture - Full',
    status: 'completed',
    date: 'Jan 11, 2024',
  },
  {
    id: 'CS-2024-006',
    patient: 'Lisa Anderson',
    doctor: 'Dr. Sarah Wilson',
    lab: 'DentalLab Pro',
    product: 'Inlay - Composite',
    status: 'on-hold',
    date: 'Jan 10, 2024',
  },
  {
    id: 'CS-2024-007',
    patient: 'Michael Scott',
    doctor: 'Dr. James Lee',
    lab: 'Premier Dental',
    product: 'Crown - PFM',
    status: 'in-production',
    date: 'Jan 9, 2024',
  },
];

// Tab configurations
const tabs: TabItem[] = [
  { id: 'on-hold', label: 'Case on Hold', icon: Clock, count: 12 },
  { id: 'in-transit', label: 'In Transit', icon: Truck, count: 8 },
  { id: 'in-production', label: 'In Production', icon: Package, count: 24 },
  { id: 'submitted', label: 'Submitted', icon: ClipboardList, count: 5 },
  { id: 'recent', label: 'Recent', icon: FileText, count: null },
];

/**
 * Dashboard Page Component
 * 
 * Main dashboard displaying:
 * - Statistics cards
 * - Case filtering tabs
 * - Case table
 * 
 * Features:
 * - Real-time stats
 * - Tab-based filtering
 * - Clickable cases
 * - Responsive layout
 */
const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('on-hold');
  const [_loading, _setLoading] = useState(false);

  // Filter cases based on active tab
  const filteredCases = activeTab === 'recent'
    ? mockCases
    : mockCases.filter((c) => c.status === activeTab);

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Optionally trigger data fetch here
  };

  // Handle case row click
  // const handleCaseClick = (caseItem: Case) => {
  //   console.log('Case clicked:', caseItem);
  //   // Navigate to case details or open modal
  //   // navigate(`/cases/${caseItem.id}`);
  // };

  // Statistics cards configuration
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
      {/* Page Header */}
      <div className="page-header mb-4">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">
          Welcome back! Here's an overview of your dental cases.
        </p>
      </div>

      {/* Statistics Cards */}
      <KiduStatsCardsGrid cards={statsCards} columns={4} />

      {/* Case Tabs */}
      <CaseTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        className="mb-4"
      />

      {/* Case Table ======= TABLE NEED TO BE CREATD*/} 
      {/* <CaseTable
        cases={filteredCases}
        loading={loading}
        onRowClick={handleCaseClick}
      /> */}
    </Container>
  );
};

export default HomePage;