// src/DSO_ADMIN_CONNECT/Config/LayoutConfig.ts

import {
    Home,
    BarChart3,
    Users,
    Settings,
    Link2,
    FileText,
    Receipt,
    Building2,
    UserCog,
    Package,
    UserPlus,
    MapPin,
    ClipboardList,
    Microscope,
    Truck,
    FileBarChart,
    DollarSign,
    HelpCircle,
    Clock,
    TrendingUp,
    User,
    Key,
    Sparkles,
    RefreshCw
} from 'lucide-react';
import type { MenuItem } from '../../Types/KiduTypes/Sidebar.types';
import type { UserProfile, NotificationItem, NavbarAction } from '../../Types/KiduTypes/Navbar.types';
import AuthService from '../../Services/AuthServices/Auth.services';


// ─── Menu Items ───────────────────────────────────────────────────
export const dsoAdminMenuItems: MenuItem[] = [
    {
        title: 'Home',
        icon: Home,
        children: [
            { title: 'Case on Hold', url: '/dsoadmin-connect/case-on-hold', icon: Clock, badge: 12 },
            { title: 'In Transit', url: '/dsoadmin-connect/in-transit', icon: Truck, badge: 8 },
            { title: 'In Production', url: '/dsoadmin-connect/in-production', icon: Package, badge: 24 },
            { title: 'Submitted', url: '/dsoadmin-connect/submitted', icon: ClipboardList, badge: 5 },
            { title: 'Recent', url: '/dsoadmin-connect/recent', icon: FileText },
        ],
    },
    {
        title: 'Analytics',
        url: '/dsoadmin-connect/analytics',
        icon: BarChart3,
    },
    {
        title: 'Masters',
        icon: Users,
        children: [
            { title: 'Lab', url: '/dsoadmin-connect/masters/lab', icon: Microscope },
            { title: 'Practice', url: '/dsoadmin-connect/masters/practice', icon: Building2 },
            { title: 'Doctor', url: '/dsoadmin-connect/masters/doctor-list', icon: UserCog },
            { title: 'Product Group', url: '/dsoadmin-connect/masters/productGroup-list', icon: Package },
            { title: 'User Role Creation', url: '/dsoadmin-connect/masters/user-roles', icon: UserPlus },
        ],
    },
    {
        title: 'Setup',
        icon: Settings,
        children: [
            { title: 'Practice Manager Login', url: '/dsoadmin-connect/setup/practice-manager', icon: UserCog },
            { title: 'DSO – User Login', url: '/dsoadmin-connect/setup/dso-user', icon: Users },
            { title: 'Lab Products Rate', url: '/dsoadmin-connect/setup/lab-products-rate', icon: DollarSign },
            { title: 'Zone', url: '/dsoadmin-connect/setup/zone-list', icon: MapPin },
        ],
    },
    {
        title: 'Mapping',
        icon: Link2,
        children: [
            { title: 'Prescription Product', url: '/dsoadmin-connect/mapping/prescription-product', icon: ClipboardList },
            { title: 'Trios Doctor', url: '/dsoadmin-connect/mapping/trios-doctor', icon: UserCog },
            { title: 'Trios Product', url: '/dsoadmin-connect/mapping/trios-product', icon: Package },
            { title: 'Lab – DSO Doctor', url: '/dsoadmin-connect/mapping/lab-dso-doctor', icon: Users },
            { title: 'Lab – DSO Product', url: '/dsoadmin-connect/mapping/lab-dso-product', icon: Package },
            { title: 'Doctor – Pickup Service', url: '/dsoadmin-connect/mapping/doctor-pickup', icon: Truck },
        ],
    },
    {
        title: 'Reports',
        icon: FileText,
        children: [
            { title: 'Case Summary', url: '/dsoadmin-connect/reports/case-summary', icon: FileBarChart },
            { title: 'Revenue Summary', url: '/dsoadmin-connect/reports/revenue-summary', icon: DollarSign },
            { title: 'Support Tickets', url: '/dsoadmin-connect/reports/support-tickets', icon: HelpCircle },
            { title: 'Case On Hold – Aging', url: '/dsoadmin-connect/reports/case-aging', icon: Clock },
            { title: 'Usage Adoption Report', url: '/dsoadmin-connect/reports/usage-adoption', icon: TrendingUp },
        ],
    },
    {
        title: 'Invoices',
        icon: Receipt,
        children: [
            { title: 'Proforma Invoice', url: '/dsoadmin-connect/invoices/proforma', icon: Receipt },
        ],
    },
   {
        title: 'Prosthesis',
        url: '/dsoadmin-connect/prosthesis',
        icon: Sparkles,
    },
    {
        title: 'Restoration',
        url: '/dsoadmin-connect/restoration',
        icon:  RefreshCw,
    },
];

// ─── Profile Actions ──────────────────────────────────────────────
export const dsoAdminProfileActions: NavbarAction[] = [
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
export const dsoAdminNotifications: NotificationItem[] = [
    {
        id: '1',
        title: 'Multi-Location Update',
        message: '5 practices have pending approvals.',
        time: '30 minutes ago',
        read: false,
        type: 'warning',
    },
];

// ─── Main Config (user pulled from localStorage at render time) ───
export const dsoAdminConnectConfig = {
    get user(): UserProfile {
        const u = AuthService.getUser();
        return {
            name: u?.userName ?? 'DSO Admin',
            email: u?.userEmail ?? '',
            role: u?.userTypeName ?? 'DSO',
        } as UserProfile;
    },
    menuItems: dsoAdminMenuItems,
    profileActions: dsoAdminProfileActions,
    notifications: dsoAdminNotifications,
};