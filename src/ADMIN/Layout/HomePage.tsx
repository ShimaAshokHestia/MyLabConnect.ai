// src/APPADMIN_CONNECT/Pages/Home/HomePage.tsx

import React, {  } from 'react';
import { Container } from 'react-bootstrap';
import {
  Users,
  Building2,
  UserCog,
  ShieldCheck,
  Activity,
  FileText,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import AuthService from '../../Services/AuthServices/Auth.services';
import type { StatCardProps } from '../../Types/KiduTypes/StatCard.types';
import KiduStatsCardsGrid from '../../KIDU_COMPONENTS/KiduStatsCardsGrid';


// ─── Recent Activity Item type ────────────────────────────────────
interface ActivityItem {
  id: string;
  type: 'user_registered' | 'dso_added' | 'lab_added' | 'issue';
  title: string;
  description: string;
  time: string;
  icon: React.ElementType;
  iconColor: string;
}

// ─── Mock recent activity — replace with API calls ────────────────
const recentActivity: ActivityItem[] = [
  {
    id: '1',
    type: 'user_registered',
    title: 'New User Registered',
    description: 'Emily Johnson registered as a DSO user.',
    time: '5 minutes ago',
    icon: Users,
    iconColor: '#4f86f7',
  },
  {
    id: '2',
    type: 'dso_added',
    title: 'New DSO Added',
    description: 'Sunrise Dental Group has been onboarded.',
    time: '1 hour ago',
    icon: Building2,
    iconColor: '#28a745',
  },
  {
    id: '3',
    type: 'lab_added',
    title: 'New Lab Registered',
    description: 'PrecisionDental Lab joined the platform.',
    time: '3 hours ago',
    icon: CheckCircle2,
    iconColor: '#17a2b8',
  },
  {
    id: '4',
    type: 'issue',
    title: 'Support Ticket Opened',
    description: 'Ticket #T-10234 raised by Lab Connect user.',
    time: '5 hours ago',
    icon: AlertCircle,
    iconColor: '#ffc107',
  },
  {
    id: '5',
    type: 'user_registered',
    title: 'New Doctor Registered',
    description: 'Dr. Richard Brown added under Practice Connect.',
    time: 'Yesterday',
    icon: UserCog,
    iconColor: '#6f42c1',
  },
];

// ─── HomePage ─────────────────────────────────────────────────────
const HomePage: React.FC = () => {
  const user = AuthService.getUser();

  // Stats cards — replace values with real API data
  const statsCards: StatCardProps[] = [
    {
      title: 'Total Users',
      value: '142',
      change: '+8 this week',
      changeType: 'positive',
      icon: Users,
    },
    {
      title: 'DSO Groups',
      value: '18',
      change: '+2 this month',
      changeType: 'positive',
      icon: Building2,
      variant: 'info',
    },
    {
      title: 'Active Companies',
      value: '34',
      change: 'Same as last month',
      changeType: 'neutral',
      icon: ShieldCheck,
      variant: 'primary',
    },
    {
      title: 'System Activity',
      value: '99.8%',
      change: 'Uptime this month',
      changeType: 'positive',
      icon: Activity,
      variant: 'success',
    },
  ];

  return (
    <Container fluid className="dashboard-page py-4">

      {/* ── Page Header ───────────────────────────────────────────── */}
      <div className="page-header mb-4">
        <h1 className="page-title">App Admin Dashboard</h1>
        <p className="page-description">
          Welcome back, <strong>{user?.userName ?? 'Admin'}</strong>! Here's a platform overview.
        </p>
      </div>

      {/* ── Stats Cards ───────────────────────────────────────────── */}
      <KiduStatsCardsGrid cards={statsCards} columns={4} />

      {/* ── Recent Activity ───────────────────────────────────────── */}
      <div className="mt-4">
        <div className="d-flex align-items-center mb-3 gap-2">
          <FileText size={18} />
          <h5 className="mb-0">Recent Activity</h5>
        </div>

        <div className="card shadow-sm border-0">
          <div className="card-body p-0">
            {recentActivity.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="d-flex align-items-start gap-3 p-3"
                  style={{
                    borderBottom: index < recentActivity.length - 1 ? '1px solid #f0f0f0' : 'none',
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      backgroundColor: item.iconColor + '18',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={18} color={item.iconColor} />
                  </div>

                  {/* Text */}
                  <div className="flex-grow-1">
                    <p className="mb-0 fw-semibold" style={{ fontSize: '0.9rem' }}>
                      {item.title}
                    </p>
                    <p className="mb-0 text-muted" style={{ fontSize: '0.82rem' }}>
                      {item.description}
                    </p>
                  </div>

                  {/* Time */}
                  <span className="text-muted" style={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                    {item.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </Container>
  );
};

export default HomePage;