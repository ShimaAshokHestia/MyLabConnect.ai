// src/DOCTOR_CONNECT/Config/LayoutConfig.ts

import {
    Home,
    BarChart3,
    Settings,
    FileText,
    ClipboardList,
    Clock,
    Package,
    CheckCircle2,
    HelpCircle,
    FileBarChart,
    User,
    Key,
} from 'lucide-react';
import type { MenuItem } from '../../Types/KiduTypes/Sidebar.types';
import type { UserProfile, NotificationItem, NavbarAction } from '../../Types/KiduTypes/Navbar.types';
import AuthService from '../../Services/AuthServices/Auth.services';


// ─── Menu Items ───────────────────────────────────────────────────
export const doctorMenuItems: MenuItem[] = [
    {
        title: 'Home',
        icon: Home,
        children: [
            { title: 'Dashboard', url: '/doctor-connect', icon: Home, },
            { title: 'My Cases', url: '/doctor-connect/cases/active', icon: ClipboardList, badge: 5 },
            { title: 'In Progress', url: '/doctor-connect/cases/progress', icon: Clock, badge: 3 },
            { title: 'Completed', url: '/doctor-connect/cases/completed', icon: CheckCircle2, },
        ],
    },
    {
        title: 'Analytics',
        url: '/doctor-connect/analytics',
        icon: BarChart3,
    },
    {
        title: 'Cases',
        icon: Package,
        children: [
            { title: 'Active Cases', url: '/doctor-connect/cases/active', icon: ClipboardList, badge: 5 },
            { title: 'In Progress', url: '/doctor-connect/cases/progress', icon: Clock, },
            { title: 'Completed', url: '/doctor-connect/cases/completed', icon: CheckCircle2, },
            { title: 'New Case', url: '/doctor-connect/cases/create', icon: FileText, },
        ],
    },
    {
        title: 'Reports',
        icon: FileText,
        children: [
            { title: 'Case Summary', url: '/doctor-connect/reports/case-summary', icon: FileBarChart },
            { title: 'Support Tickets', url: '/doctor-connect/reports/support-tickets', icon: HelpCircle },
        ],
    },
    {
        title: 'Settings',
        url: '/doctor-connect/settings',
        icon: Settings,
    },
];

// ─── Profile Actions ──────────────────────────────────────────────
export const doctorProfileActions: NavbarAction[] = [
    { label: 'Profile', icon: User, onClick: () => console.log('Profile') },
    { label: 'Change Password', icon: Key, onClick: () => console.log('Change Password') },
];

// ─── Default Notifications ────────────────────────────────────────
export const doctorNotifications: NotificationItem[] = [
    {
        id: '1',
        title: 'Case Update',
        message: 'Case #12345 is now in production.',
        time: '10 minutes ago',
        read: false,
        type: 'info',
    },
];

// ─── Main Config ──────────────────────────────────────────────────
export const doctorConnectConfig = {
    get user(): UserProfile {
        const u = AuthService.getUser();
        return {
            name: u?.userName ?? 'Doctor',
            email: u?.userEmail ?? '',
            role: u?.userTypeName ?? 'Doctor',
        } as UserProfile;
    },
    menuItems: doctorMenuItems,
    profileActions: doctorProfileActions,
    notifications: doctorNotifications,
};