// src/INTEGRATOR_CONNECT/Config/LayoutConfig.ts

import {
    Home,
    BarChart3,
    Settings,
    FileText,
    Link2,
    Database,
    Activity,
    AlertCircle,
    CheckCircle2,
    FileBarChart,
    DollarSign,
    HelpCircle,
    User,
    Key,
} from 'lucide-react';
import type { MenuItem } from '../../Types/KiduTypes/Sidebar.types';
import type { UserProfile, NotificationItem, NavbarAction } from '../../Types/KiduTypes/Navbar.types';
import AuthService from '../../Services/AuthServices/Auth.services';

// ─── Menu Items ───────────────────────────────────────────────────
export const integratorMenuItems: MenuItem[] = [
    {
        title: 'Home',
        icon: Home,
        children: [
            { title: 'Dashboard', url: '/integrator-connect', icon: Home, },
            { title: 'Active Jobs', url: '/integrator-connect/jobs/active', icon: Activity, badge: 4 },
            { title: 'Failed Jobs', url: '/integrator-connect/jobs/failed', icon: AlertCircle, badge: 2 },
            { title: 'Completed Jobs', url: '/integrator-connect/jobs/completed', icon: CheckCircle2, },
        ],
    },
    {
        title: 'Analytics',
        url: '/integrator-connect/analytics',
        icon: BarChart3,
    },
    {
        title: 'Integrations',
        icon: Link2,
        children: [
            { title: 'All Integrations', url: '/integrator-connect/integrations', icon: Link2 },
            { title: 'Add Integration', url: '/integrator-connect/integrations/create', icon: Database },
            { title: 'Logs', url: '/integrator-connect/integrations/logs', icon: FileText },
        ],
    },
    {
        title: 'Jobs',
        icon: Activity,
        children: [
            { title: 'Active', url: '/integrator-connect/jobs/active', icon: Activity, badge: 4 },
            { title: 'Failed', url: '/integrator-connect/jobs/failed', icon: AlertCircle, badge: 2 },
            { title: 'Completed', url: '/integrator-connect/jobs/completed', icon: CheckCircle2, },
            { title: 'Scheduled', url: '/integrator-connect/jobs/scheduled', icon: FileText, },
        ],
    },
    {
        title: 'Reports',
        icon: FileText,
        children: [
            { title: 'Integration Report', url: '/integrator-connect/reports/integration', icon: FileBarChart },
            { title: 'Revenue Summary', url: '/integrator-connect/reports/revenue', icon: DollarSign },
            { title: 'Support Tickets', url: '/integrator-connect/reports/support', icon: HelpCircle },
        ],
    },
    {
        title: 'Settings',
        url: '/integrator-connect/settings',
        icon: Settings,
    },
];

// ─── Profile Actions ──────────────────────────────────────────────
export const integratorProfileActions: NavbarAction[] = [
    { label: 'Profile', icon: User, onClick: () => console.log('Profile') },
    { label: 'Change Password', icon: Key, onClick: () => console.log('Change Password') },
];

// ─── Default Notifications ────────────────────────────────────────
export const integratorNotifications: NotificationItem[] = [
    {
        id: '1',
        title: 'Integration Failed',
        message: 'Trios sync job #J-2045 failed. Please review.',
        time: '15 minutes ago',
        read: false,
        type: 'warning',
    },
];

// ─── Main Config ──────────────────────────────────────────────────
export const integratorConnectConfig = {
    get user(): UserProfile {
        const u = AuthService.getUser();
        return {
            name: u?.userName ?? 'Integrator',
            email: u?.userEmail ?? '',
            role: u?.userTypeName ?? 'Integrator',
        } as UserProfile;
    },
    menuItems: integratorMenuItems,
    profileActions: integratorProfileActions,
    notifications: integratorNotifications,
};