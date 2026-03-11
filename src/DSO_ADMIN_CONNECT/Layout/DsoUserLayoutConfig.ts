// src/DSO_ADMIN_CONNECT/Config/LayoutConfig.ts

import {
    Home, BarChart3,
    Users,
    Settings,
    Link2,
    FileText,
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
    RefreshCw,
    Activity,
    Receipt,
    FileSpreadsheet,
    Gauge,
    Shield,
    Calendar,
    Eye,
    //Palette,
    Droplet,
    Layers,
    MapMinus
} from 'lucide-react';
import type { MenuItem } from '../../Types/KiduTypes/Sidebar.types';
import type { UserProfile, NotificationItem, NavbarAction } from '../../Types/KiduTypes/Navbar.types';
import AuthService from '../../Services/AuthServices/Auth.services';
import { FaProductHunt,FaPlug } from 'react-icons/fa';


// ─── Menu Items ───────────────────────────────────────────────────
export const dsoAdminMenuItems: MenuItem[] = [
    {
        title: 'Home',
        icon: Home,
        url: '/dsoadmin-connect',
        // children: [
        //     { title: 'Case on Hold', url: '/dsoadmin-connect/case-on-hold', icon: Clock, badge: 12 },
        //     { title: 'In Transit', url: '/dsoadmin-connect/in-transit', icon: Truck, badge: 8 },
        //     { title: 'In Production', url: '/dsoadmin-connect/in-production', icon: Package, badge: 24 },
        //     { title: 'Submitted', url: '/dsoadmin-connect/submitted', icon: ClipboardList, badge: 5 },
        //     { title: 'Recent', url: '/dsoadmin-connect/recent', icon: FileText },
        // ],
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
            // { title: 'Lab Group', url: '/dsoadmin-connect/masters/labgroup-list', icon: LucideMicroscope },

            { title: 'Practice', url: '/dsoadmin-connect/masters/practice-list', icon: Building2 },
            { title: 'Doctor', url: '/dsoadmin-connect/masters/doctor-list', icon: UserCog },
            { title: 'Lab', url: '/dsoadmin-connect/masters/lab-list', icon: Microscope },
            { title: 'Zone', url: '/dsoadmin-connect/setup/zone-list', icon: MapPin },
            { title: 'Territory', url: '/dsoadmin-connect/masters/territory-list', icon: MapMinus }
            // { title: 'Dental Office', url: '/dsoadmin-connect/masters/dentalOffice-list', icon: Syringe },
            // { title: 'Material', url: '/dsoadmin-connect/masters/material-list', icon: Box },


        ],
    },
    {
        title: 'Product Setup',
        icon: Users,
        children: [
            { title: 'Scheme', url: '/dsoadmin-connect/schema-list', icon: RefreshCw, },
            { title: 'Prosthesis', url: '/dsoadmin-connect/prosthesis', icon: Sparkles, },
            { title: 'Restoration', url: '/dsoadmin-connect/Restoration', icon: RefreshCw, },
            { title: 'Indication', url: '/dsoadmin-connect/indication-list', icon: Eye, },
            { title: 'Material Name', url: '/dsoadmin-connect/materialName-list', icon: Layers, },
            // { title: 'Shade Guide', url: '/dsoadmin-connect/shadeGuide-list', icon: Palette, },
            { title: 'Shade', url: '/dsoadmin-connect/shade-list', icon: Droplet, },
            { title: 'Product Group', url: '/dsoadmin-connect/masters/productGroup-list', icon: Package },
            { title: 'Products', url: '/dsoadmin-connect/masters/product-list', icon: FaProductHunt },
            { title: 'Additional Service', url: '/dsoadmin-connect/masters/additionalService-list', icon: FaPlug },
        ],
    },

    {
        title: 'Invoice & Payment',
        icon: Users,
        children: [
            { title: 'Invoices', url: '/dsoadmin-connect/invoices-list', icon: Receipt, },
            { title: 'Proforma Invoice', url: '/dsoadmin-connect/proformaInvoice-list', icon: FileSpreadsheet, },
            { title: 'Case Flow SLA', url: '/dsoadmin-connect/caseFlowSLA-list', icon: Gauge, },

        ],
    },
    {
        title: 'User Management',
        icon: Settings,
        children: [
            { title: 'Practice Manager Login', url: '/dsoadmin-connect/setup/practice-manager', icon: UserCog },
            { title: 'DSO - User Login', url: '/dsoadmin-connect/setup/dso-user', icon: Users },
            { title: 'User Role Creation', url: '/dsoadmin-connect/masters/user-role-creation-list', icon: UserPlus },
            { title: 'Lab Products Rate', url: '/dsoadmin-connect/setup/lab-products-rate', icon: DollarSign },

            // { title: 'Region', url: '/dsoadmin-connect/setup/region-list', icon: Building2 },
            { title: 'Setting', url: '/dsoadmin-connect/setup/setting-list', icon: Settings },
        ],
    },
    {
        title: 'Mapping',
        icon: Link2,
        children: [
            { title: 'Prescription Product', url: '/dsoadmin-connect/mapping/prescription-product', icon: ClipboardList },
            { title: 'Trios Doctor', url: '/dsoadmin-connect/mapping/trios-doctor', icon: UserCog },
            { title: 'Lab - DSO Doctor', url: '/dsoadmin-connect/mapping/lab-dso-doctor', icon: Users },
            { title: 'Lab - DSO Product', url: '/dsoadmin-connect/mapping/lab-dso-product', icon: Package },
            { title: 'Doctor - Pickup Service', url: '/dsoadmin-connect/mapping/doctor-pickup', icon: Truck },
            //  { title: 'Trios Product', url: '/dsoadmin-connect/mapping/trios-product', icon: Package },
        ],
    },
    {
        title: 'Reports',
        icon: FileText,
        children: [
            { title: 'Case Summary', url: '/dsoadmin-connect/reports/case-summary', icon: FileBarChart },
            { title: 'Revenue Summary', url: '/dsoadmin-connect/reports/revenue-summary', icon: DollarSign },
            { title: 'Scan QC Summary', url: '/dsoadmin-connect/reports/scanQCSummary', icon: Activity },
            { title: 'Support Tickets', url: '/dsoadmin-connect/reports/support-tickets', icon: HelpCircle },
            { title: 'Case Products', url: '/dsadmin-connect/reports/caseProducts', icon: Package },
            { title: 'Case On Hold - Aging', url: '/dsoadmin-connect/reports/case-aging', icon: Clock },
            { title: 'Login Audit', url: '/dsoadmin-connect/reports/loginAudit', icon: Shield },
            { title: 'Year Wise - Cases', url: '/dsoadmin-connect/reports/yearWise-cases', icon: Calendar },
            { title: 'Year Wise - Invoices', url: '/dsoadmin-connect/reports/yearWise-invoive', icon: Receipt },
            { title: 'Usage Adoption Report', url: '/dsoadmin-connect/reports/usage-adoption', icon: TrendingUp },
        ],
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