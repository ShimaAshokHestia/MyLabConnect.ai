// src/LAB_CONNECT/Config/LayoutConfig.ts

import {
    Home,
    BarChart3,
    Settings,
    FileText,
    Package,
    Clock,
    User,
    Key,
    MessageSquare,
    Mail,
    Globe,
    Ticket,
    Shield,
    Users,
    Sliders,
    Scan,
    FileSpreadsheet,
    Camera,
    CheckSquare,
    AlertCircle,
    Receipt,
} from 'lucide-react';
import type { MenuItem } from '../../Types/KiduTypes/Sidebar.types';
import type { UserProfile, NotificationItem, NavbarAction } from '../../Types/KiduTypes/Navbar.types';
import AuthService from '../../Services/AuthServices/Auth.services';

// ─── Menu Items ───────────────────────────────────────────────────
export const labMenuItems: MenuItem[] = [
    {
        title: 'Home',
        url: '/lab-connect/home',
        icon: Home,
    },
    {
        title: 'Case Communication',
        icon: MessageSquare,
        children: [
            { title: 'Internal', url: '/lab-connect/caseCommunication/internal-list', icon: Mail },
            { title: 'External', url: '/lab-connect/caseCommunication/external-list', icon: Globe },
            { title: 'Open Ticket for Action', url: '/lab-connect/caseCommunication/openTicketForAction-list', icon: Ticket },
        ],
    },
    {
        title: 'Masters',
        icon: Shield,
        children: [
            { title: 'Support Types', url: '/lab-connect/masters/supportTypes-list', icon: Settings },
            { title: 'Query Types', url: '/lab-connect/masters/queryTypes-list', icon: AlertCircle },
            { title: 'Case Rating Notification', url: '/lab-connect/masters/caseRatingNotification-list', icon: Clock },
            { title: 'Lab Supply', url: '/lab-connect/masters/labSupply-list', icon: Package },
        ],
    },
    {
        title: 'User Management',
        icon: Users,
        children: [
            { title: 'Lab Login', url: '/lab-connect/userManagement/labLogin-list', icon: User },
            { title: 'Lab Control Setting', url: '/lab-connect/userManagement/labControlSetting-list', icon: Sliders },
        ],
    },
    {
        title: 'Utility',
        icon: Settings,
        children: [
            { title: 'Trios Order Creation', url: '/lab-connect/utility/triosOrderCreation-list', icon: Scan },
        ],
    },
    {
        title: 'Lab Reports',
        icon: FileSpreadsheet,
        children: [
            { title: 'Case List', url: '/lab-connect/labReports/caseList-list', icon: FileText },
            { title: 'IOS List', url: '/lab-connect/labReports/iosList-list', icon: Camera },
            { title: 'Daily Scan QC', url: '/lab-connect/labReports/dailyScanqc-list', icon: CheckSquare },
            { title: 'Case Rating', url: '/lab-connect/labReports/caseRating-list', icon: BarChart3 },
            { title: 'Ticket Status', url: '/lab-connect/labReports/ticketStatus-list', icon: Ticket },
        ],
    },
    {
        title: 'Invoices',
        url: '/lab-connect/invoices-list',
        icon: Receipt,
    },
];

// ─── Profile Actions ──────────────────────────────────────────────
export const labProfileActions: NavbarAction[] = [
    {
        label: 'Profile',
        icon: User,
        onClick: () => console.log('Profile'),
    },
    {
        label: 'Change Password',
        icon: Key,
        onClick: () => console.log('Change Password'),
    },
];

// ─── Default Notifications ────────────────────────────────────────
export const labNotifications: NotificationItem[] = [
    {
        id: '1',
        title: 'New Order',
        message: '3 new cases received and pending assignment.',
        time: '5 minutes ago',
        read: false,
        type: 'info',
    },
];

// ─── Main Config (user pulled from localStorage at render time) ───
export const labConnectConfig = {
    get user(): UserProfile {
        const u = AuthService.getUser();
        return {
            name: u?.userName ?? 'Lab User',
            email: u?.userEmail ?? '',
            role: u?.userTypeName ?? 'Lab',
        } as UserProfile;
    },
    menuItems: labMenuItems,
    profileActions: labProfileActions,
    notifications: labNotifications,
};