// src/LAB_CONNECT/Config/LayoutConfig.ts

import {
    Home,
    BarChart3,
    Settings,
    FileText,
    Package,
    ClipboardList,
    Microscope,
    Truck,
    FileBarChart,
    DollarSign,
    Clock,
    User,
    Key,
} from 'lucide-react';
import type { MenuItem } from '../../Types/KiduTypes/Sidebar.types';
import type { UserProfile, NotificationItem, NavbarAction } from '../../Types/KiduTypes/Navbar.types';
import AuthService from '../../Services/AuthServices/Auth.services';

// ─── Menu Items ───────────────────────────────────────────────────
export const labMenuItems: MenuItem[] = [
    {
        title: 'Home',
        icon: Home,
        children: [
            { title: 'Dashboard', url: '/lab-connect', icon: Home },
            { title: 'Active Orders', url: '/lab-connect/orders/active', icon: Package, badge: 15 },
            { title: 'In Production', url: '/lab-connect/orders/in-production', icon: Microscope, badge: 8 },
            { title: 'Ready to Ship', url: '/lab-connect/orders/ready', icon: Truck, badge: 3 },
        ],
    },
    {
        title: 'Analytics',
        url: '/lab-connect/analytics',
        icon: BarChart3,
    },
    {
        title: 'Orders',
        url: '/lab-connect/orders',
        icon: ClipboardList,
    },
    {
        title: 'Production',
        icon: Package,
        children: [
            { title: 'Queue', url: '/lab-connect/production/queue', icon: Clock },
            { title: 'In Progress', url: '/lab-connect/production/progress', icon: Package },
            { title: 'Quality Check', url: '/lab-connect/production/quality', icon: Microscope },
        ],
    },
    {
        title: 'Reports',
        icon: FileText,
        children: [
            { title: 'Production Report', url: '/lab-connect/reports/production', icon: FileBarChart },
            { title: 'Revenue Report', url: '/lab-connect/reports/revenue', icon: DollarSign },
        ],
    },
    {
        title: 'Settings',
        url: '/lab-connect/settings',
        icon: Settings,
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