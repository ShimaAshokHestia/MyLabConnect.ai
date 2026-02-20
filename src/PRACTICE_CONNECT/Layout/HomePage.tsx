// src/PRACTICE_CONNECT/Pages/Home/HomePage.tsx

import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import {
    ClipboardList,
    Clock,
    FileText,
    Users,
    UserCog,
    TrendingUp,
    Package,
    CheckCircle2,
} from 'lucide-react';
import type { TabItem } from '../../Types/Dashboards.types';
import AuthService from '../../Services/AuthServices/Auth.services';
import type { StatCardProps } from '../../Types/KiduTypes/StatCard.types';
import KiduStatsCardsGrid from '../../KIDU_COMPONENTS/KiduStatsCardsGrid';
import CaseTabs from '../../KIDU_COMPONENTS/KiduCaseTabs';


// ─── Tab config ───────────────────────────────────────────────────
const tabs: TabItem[] = [
    { id: 'active', label: 'Active Cases', icon: ClipboardList, count: 8 },
    { id: 'in-progress', label: 'In Progress', icon: Clock, count: 5 },
    { id: 'completed', label: 'Completed', icon: CheckCircle2, count: 42 },
    { id: 'recent', label: 'Recent', icon: FileText, count: null },
];

// ─── HomePage ─────────────────────────────────────────────────────
const HomePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('active');
    const user = AuthService.getUser();

    const statsCards: StatCardProps[] = [
        {
            title: 'Active Cases',
            value: '13',
            change: '+3 since yesterday',
            changeType: 'positive',
            icon: Package,
        },
        {
            title: 'Patients',
            value: '86',
            change: '+4 this month',
            changeType: 'positive',
            icon: Users,
            variant: 'info',
        },
        {
            title: 'Doctors',
            value: '6',
            change: 'Same as last month',
            changeType: 'neutral',
            icon: UserCog,
            variant: 'primary',
        },
        {
            title: 'Cases Completed',
            value: '42',
            change: '+8.1% from last month',
            changeType: 'positive',
            icon: TrendingUp,
            variant: 'success',
        },
    ];

    return (
        <Container fluid className="dashboard-page py-4">

            {/* ── Page Header ───────────────────────────────────────────── */}
            <div className="page-header mb-4">
                <h1 className="page-title">Practice Dashboard</h1>
                <p className="page-description">
                    Welcome back, <strong>{user?.userName ?? 'Practice User'}</strong>! Here's your practice overview.
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