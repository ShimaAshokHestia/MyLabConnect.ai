import { Home, BarChart3, Users, Settings, Link2, FileText, Receipt, Building2, UserCog,Package, UserPlus, MapPin, ClipboardList, Microscope,Truck,FileBarChart,DollarSign,HelpCircle,Clock,TrendingUp,User,Key} from 'lucide-react';
import type { MenuItem } from '../Types/KiduTypes/Sidebar.types';
import type { UserProfile, NotificationItem, NavbarAction } from '../Types/KiduTypes/Navbar.types';

/**
 * Layout Configurations for All 6 Login Types
 * 
 * This file contains complete layout configurations including:
 * - Menu items (sidebar)
 * - User profile
 * - Notifications
 * - Profile menu actions
 * 
 * Login Types:
 * 1. DSO Admin Connect
 * 2. Practice Connect
 * 3. DSO Connect
 * 4. Lab Connect
 * 5. Ventors (Vendors)
 * 6. Lab Group
 */

// ============================================
// 1. DSO_ADMIN CONNECT CONFIGURATION
// ============================================

export const dsoadminConnectConfig = {
    menuItems: [
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
            url: '/dsoadmin/analytics',
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
                { title: 'Zone', url: '/dsoadmin-connect/setup/zone', icon: MapPin },
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
    ] as MenuItem[],

    user: {
        name: 'David Martinez',
        email: 'david@dsogroup.com',
        role: 'DSO Administrator',
    } as UserProfile,

    notifications: [
        {
            id: '1',
            title: 'Multi-Location Update',
            message: '5 practices have pending approvals',
            time: '30 minutes ago',
            read: false,
            type: 'warning' as const,
        },
    ] as NotificationItem[],

    profileActions: [
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
    ] as NavbarAction[],
};

// ============================================
// 2. PRACTICE CONNECT CONFIGURATION
// ============================================

export const practiceConnectConfig = {
    menuItems: [
        {
            title: 'Home',
            icon: Home,
            children: [
                { title: 'Dashboard', url: '/practice/dashboard', icon: Home },
                { title: 'My Cases', url: '/practice/cases', icon: ClipboardList, badge: 8 },
                { title: 'Recent Orders', url: '/practice/orders', icon: FileText },
            ],
        },
        {
            title: 'Patients',
            url: '/practice/patients',
            icon: Users,
        },
        {
            title: 'Doctors',
            icon: UserCog,
            children: [
                { title: 'All Doctors', url: '/practice/doctors', icon: UserCog },
                { title: 'Add Doctor', url: '/practice/doctors/add', icon: UserPlus },
            ],
        },
        {
            title: 'Reports',
            icon: FileText,
            children: [
                { title: 'Case Summary', url: '/practice/reports/cases', icon: FileBarChart },
                { title: 'Financial Report', url: '/practice/reports/financial', icon: DollarSign },
            ],
        },
        {
            title: 'Settings',
            url: '/practice/settings',
            icon: Settings,
        },
    ] as MenuItem[],

    user: {
        name: 'Dr. Sarah Johnson',
        email: 'sarah@dentalclinic.com',
        role: 'Practice Manager',
    } as UserProfile,

    notifications: [
        {
            id: '1',
            title: 'Case Completed',
            message: 'Case #12345 has been completed and shipped',
            time: '1 hour ago',
            read: false,
            type: 'success' as const,
        },
    ] as NotificationItem[],

    profileActions: [
        {
            label: 'Practice Settings',
            icon: Settings,
            onClick: () => console.log('Practice settings'),
        },
    ] as NavbarAction[],
};

// ============================================
// 3. DSO CONNECT CONFIGURATION
// ============================================

export const dsoConnectConfig = {
    menuItems: [
        {
            title: 'Home',
            icon: Home,
            children: [
                { title: 'Case on Hold', url: '/dso/case-on-hold', icon: Clock, badge: 12 },
                { title: 'In Transit', url: '/dso/in-transit', icon: Truck, badge: 8 },
                { title: 'In Production', url: '/dso/in-production', icon: Package, badge: 24 },
                { title: 'Submitted', url: '/dso/submitted', icon: ClipboardList, badge: 5 },
                { title: 'Recent', url: '/dso/recent', icon: FileText },
            ],
        },
        {
            title: 'Analytics',
            url: '/dso/analytics',
            icon: BarChart3,
        },
        {
            title: 'Masters',
            icon: Users,
            children: [
                { title: 'Lab', url: '/dso/masters/lab', icon: Microscope },
                { title: 'Practice', url: '/dso/masters/practice', icon: Building2 },
                { title: 'Doctor', url: '/dso/masters/doctor', icon: UserCog },
                { title: 'Product Group', url: '/dso/masters/product-group', icon: Package },
                { title: 'User Role Creation', url: '/dso/masters/user-roles', icon: UserPlus },
            ],
        },
        {
            title: 'Setup',
            icon: Settings,
            children: [
                { title: 'Practice Manager Login', url: '/dso/setup/practice-manager', icon: UserCog },
                { title: 'DSO – User Login', url: '/dso/setup/dso-user', icon: Users },
                { title: 'Lab Products Rate', url: '/dso/setup/lab-products-rate', icon: DollarSign },
                { title: 'Zone', url: '/dso/setup/zone', icon: MapPin },
            ],
        },
        {
            title: 'Mapping',
            icon: Link2,
            children: [
                { title: 'Prescription Product', url: '/dso/mapping/prescription-product', icon: ClipboardList },
                { title: 'Trios Doctor', url: '/dso/mapping/trios-doctor', icon: UserCog },
                { title: 'Trios Product', url: '/dso/mapping/trios-product', icon: Package },
                { title: 'Lab – DSO Doctor', url: '/dso/mapping/lab-dso-doctor', icon: Users },
                { title: 'Lab – DSO Product', url: '/dso/mapping/lab-dso-product', icon: Package },
                { title: 'Doctor – Pickup Service', url: '/dso/mapping/doctor-pickup', icon: Truck },
            ],
        },
        {
            title: 'Reports',
            icon: FileText,
            children: [
                { title: 'Case Summary', url: '/dso/reports/case-summary', icon: FileBarChart },
                { title: 'Revenue Summary', url: '/dso/reports/revenue-summary', icon: DollarSign },
                { title: 'Support Tickets', url: '/dso/reports/support-tickets', icon: HelpCircle },
                { title: 'Case On Hold – Aging', url: '/dso/reports/case-aging', icon: Clock },
                { title: 'Usage Adoption Report', url: '/dso/reports/usage-adoption', icon: TrendingUp },
            ],
        },
        {
            title: 'Invoices',
            icon: Receipt,
            children: [
                { title: 'Proforma Invoice', url: '/dso/invoices/proforma', icon: Receipt },
            ],
        },
    ] as MenuItem[],

    user: {
        name: 'David Martinez',
        email: 'david@dsogroup.com',
        role: 'DSO Administrator',
    } as UserProfile,

    notifications: [
        {
            id: '1',
            title: 'Multi-Location Update',
            message: '5 practices have pending approvals',
            time: '30 minutes ago',
            read: false,
            type: 'warning' as const,
        },
    ] as NotificationItem[],

    profileActions: [
        {
            label: 'DSO Settings',
            icon: Settings,
            onClick: () => console.log('DSO settings'),
        },
    ] as NavbarAction[],
};

// ============================================
// 4. LAB CONNECT CONFIGURATION
// ============================================

export const labConnectConfig = {
    menuItems: [
        {
            title: 'Home',
            icon: Home,
            children: [
                { title: 'Dashboard', url: '/lab/dashboard', icon: Home },
                { title: 'Active Orders', url: '/lab/orders/active', icon: Package, badge: 15 },
                { title: 'In Production', url: '/lab/orders/production', icon: Microscope, badge: 8 },
                { title: 'Ready to Ship', url: '/lab/orders/ready', icon: Truck, badge: 3 },
            ],
        },
        {
            title: 'Orders',
            url: '/lab/orders',
            icon: ClipboardList,
        },
        {
            title: 'Production',
            icon: Package,
            children: [
                { title: 'Queue', url: '/lab/production/queue', icon: Clock },
                { title: 'In Progress', url: '/lab/production/progress', icon: Package },
                { title: 'Quality Check', url: '/lab/production/quality', icon: Microscope },
            ],
        },
        {
            title: 'Reports',
            icon: FileText,
            children: [
                { title: 'Production Report', url: '/lab/reports/production', icon: FileBarChart },
                { title: 'Revenue Report', url: '/lab/reports/revenue', icon: DollarSign },
            ],
        },
        {
            title: 'Settings',
            url: '/lab/settings',
            icon: Settings,
        },
    ] as MenuItem[],

    user: {
        name: 'Michael Chen',
        email: 'michael@dentallab.com',
        role: 'Lab Manager',
    } as UserProfile,

    notifications: [
        {
            id: '1',
            title: 'New Order',
            message: '3 new cases received from Dr. Smith',
            time: '5 minutes ago',
            read: false,
            type: 'info' as const,
        },
    ] as NotificationItem[],

    profileActions: [
        {
            label: 'Lab Settings',
            icon: Settings,
            onClick: () => console.log('Lab settings'),
        },
    ] as NavbarAction[],
};

// ============================================
// 5. VENTORS (VENDORS) CONFIGURATION
// ============================================

export const ventorsConfig = {
    menuItems: [
        {
            title: 'Dashboard',
            url: '/vendor/dashboard',
            icon: Home,
        },
        {
            title: 'Products',
            icon: Package,
            children: [
                { title: 'All Products', url: '/vendor/products', icon: Package },
                { title: 'Add Product', url: '/vendor/products/add', icon: UserPlus },
                { title: 'Inventory', url: '/vendor/inventory', icon: ClipboardList },
            ],
        },
        {
            title: 'Orders',
            icon: Receipt,
            children: [
                { title: 'Pending Orders', url: '/vendor/orders/pending', icon: Clock, badge: 7 },
                { title: 'Completed Orders', url: '/vendor/orders/completed', icon: FileText },
            ],
        },
        {
            title: 'Reports',
            icon: BarChart3,
            children: [
                { title: 'Sales Report', url: '/vendor/reports/sales', icon: DollarSign },
                { title: 'Inventory Report', url: '/vendor/reports/inventory', icon: FileBarChart },
            ],
        },
        {
            title: 'Settings',
            url: '/vendor/settings',
            icon: Settings,
        },
    ] as MenuItem[],

    user: {
        name: 'Robert Wilson',
        email: 'robert@vendorco.com',
        role: 'Vendor Manager',
    } as UserProfile,

    notifications: [
        {
            id: '1',
            title: 'New Order',
            message: 'Order #VND-12345 has been placed',
            time: '15 minutes ago',
            read: false,
            type: 'info' as const,
        },
    ] as NotificationItem[],

    profileActions: [
        {
            label: 'Vendor Settings',
            icon: Settings,
            onClick: () => console.log('Vendor settings'),
        },
    ] as NavbarAction[],
};

// ============================================
// 6. LAB GROUP CONFIGURATION
// ============================================

export const labGroupConfig = {
    menuItems: [
        {
            title: 'Dashboard',
            url: '/lab-group/dashboard',
            icon: Home,
        },
        {
            title: 'Labs',
            icon: Microscope,
            children: [
                { title: 'All Labs', url: '/lab-group/labs', icon: Microscope },
                { title: 'Add Lab', url: '/lab-group/labs/add', icon: UserPlus },
                { title: 'Performance', url: '/lab-group/labs/performance', icon: BarChart3 },
            ],
        },
        {
            title: 'Consolidated Orders',
            url: '/lab-group/orders',
            icon: ClipboardList,
            badge: 42,
        },
        {
            title: 'Reports',
            icon: FileText,
            children: [
                { title: 'Group Performance', url: '/lab-group/reports/performance', icon: TrendingUp },
                { title: 'Revenue Summary', url: '/lab-group/reports/revenue', icon: DollarSign },
                { title: 'Lab Comparison', url: '/lab-group/reports/comparison', icon: BarChart3 },
            ],
        },
        {
            title: 'Settings',
            url: '/lab-group/settings',
            icon: Settings,
        },
    ] as MenuItem[],

    user: {
        name: 'Jennifer Lee',
        email: 'jennifer@labgroup.com',
        role: 'Group Administrator',
    } as UserProfile,

    notifications: [
        {
            id: '1',
            title: 'Lab Alert',
            message: 'Lab #3 has reached production capacity',
            time: '20 minutes ago',
            read: false,
            type: 'warning' as const,
        },
    ] as NotificationItem[],

    profileActions: [
        {
            label: 'Group Settings',
            icon: Settings,
            onClick: () => console.log('Group settings'),
        },
    ] as NavbarAction[],
};

// ============================================
// HELPER FUNCTION
// ============================================

/**
 * Get layout configuration based on login type
 */
export const getLayoutConfig = (loginType: string) => {
    switch (loginType.toLowerCase()) {
        case 'dsoadmin':
        case 'dsoadmin-connect':
            return dsoadminConnectConfig;

        case 'practice':
        case 'practice-connect':
            return practiceConnectConfig;

        case 'dso':
        case 'dso-connect':
            return dsoConnectConfig;

        case 'lab':
        case 'lab-connect':
            return labConnectConfig;

        case 'vendor':
        case 'ventors':
            return ventorsConfig;

        case 'lab-group':
            return labGroupConfig;

        default:
            return dsoadminConnectConfig;
    }
};