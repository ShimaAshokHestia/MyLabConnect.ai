// src/PRACTICE_CONNECT/Config/LayoutConfig.ts

import {
    Home,
    FileText,
    ClipboardList,
    User,
    Key,
    Truck,
    Headphones,
    ShoppingCart,
    Receipt,
    Star,
    MessageSquare,
    Activity,
    FileSpreadsheet
} from 'lucide-react';
import type { MenuItem } from '../../Types/KiduTypes/Sidebar.types';
import type { UserProfile, NotificationItem, NavbarAction } from '../../Types/KiduTypes/Navbar.types';
import AuthService from '../../Services/AuthServices/Auth.services';

// ─── Menu Items ───────────────────────────────────────────────────
export const practiceMenuItems: MenuItem[] = [
    {
        title: 'Home',
        icon: Home,
        children: [
            { title: 'Dashboard', url: '/practice-connect', icon: Home, },
            { title: 'My Cases', url: '/practice-connect/cases/active', icon: ClipboardList, badge: 8 },
            { title: 'Recent Orders', url: '/practice-connect/cases/recent', icon: FileText, },
        ],
    },
    {
        title: 'Pickup',
        url: '/practice-connect/pickup-list',
        icon: Truck,
    },
    {
        title: 'Support',
        url: '/practice-connect/support-list',
        icon: Headphones,
    },
    {
        title: 'Report',
        icon: FileText,
        children: [
            { title: 'Case List Report', url: '/practice-connect/report/caseListReport-list', icon: ClipboardList, badge: 8 },
            { title: 'Ticket List Report', url: '/practice-connect/report/ticketListReport-list', icon: Headphones, },
            { title: 'Case Rating Report', url: '/practice-connect/report/caseRatingReport-list', icon: Star, },
            { title: 'Case Remark Report', url: '/practice-connect/report/caseRemarkReport-list', icon: MessageSquare, },
            { title: 'Daily Scan QC Summary', url: '/practice-connect/report/dailyScanQCSummary-list', icon: Activity, },
        ],
    },
    {
        title: 'Marketplace',
        url: '/practice-connect/marketplace-list',
        icon: ShoppingCart,
    },
      {
        title: 'Invoices',
        url: '/practice-connect/invoices-list',
        icon: Receipt,
    },
      {
        title: 'SAR',
        url: '/practice-connect/SAR-list',
        icon: FileSpreadsheet,
    },
    // {
    //     title: 'Analytics',
    //     url: '/practice-connect/analytics',
    //     icon: BarChart3,
    // },
    // {
    //     title: 'Cases',
    //     icon: Package,
    //     children: [
    //         { title: 'Active Cases', url: '/practice-connect/cases/active', icon: ClipboardList, badge: 8 },
    //         { title: 'In Progress', url: '/practice-connect/cases/in-progress', icon: Clock, },
    //         { title: 'Completed', url: '/practice-connect/cases/completed', icon: FileText, },
    //         { title: 'New Case', url: '/practice-connect/cases/create', icon: UserPlus, },
    //     ],
    // },
    // {
    //     title: 'Patients',
    //     url: '/practice-connect/patients',
    //     icon: Users,
    // },
    // {
    //     title: 'Doctors',
    //     icon: UserCog,
    //     children: [
    //         { title: 'All Doctors', url: '/practice-connect/doctors', icon: UserCog },
    //         { title: 'Add Doctor', url: '/practice-connect/doctors/create', icon: UserPlus },
    //     ],
    // },
    // {
    //     title: 'Reports',
    //     icon: FileText,
    //     children: [
    //         { title: 'Case Summary', url: '/practice-connect/reports/case-summary', icon: FileBarChart },
    //         { title: 'Financial Report', url: '/practice-connect/reports/financial', icon: DollarSign },
    //     ],
    // },
    // {
    //     title: 'Settings',
    //     url: '/practice-connect/settings',
    //     icon: Settings,
    // },
];

// ─── Profile Actions ──────────────────────────────────────────────
export const practiceProfileActions: NavbarAction[] = [
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
export const practiceNotifications: NotificationItem[] = [
    {
        id: '1',
        title: 'Case Completed',
        message: 'Case #12345 has been completed and is ready for pickup.',
        time: '1 hour ago',
        read: false,
        type: 'success',
    },
];

// ─── Main Config ──────────────────────────────────────────────────
export const practiceConnectConfig = {
    get user(): UserProfile {
        const u = AuthService.getUser();
        return {
            name: u?.userName ?? 'Practice User',
            email: u?.userEmail ?? '',
            role: u?.userTypeName ?? 'Practice',
        } as UserProfile;
    },
    menuItems: practiceMenuItems,
    profileActions: practiceProfileActions,
    notifications: practiceNotifications,
};