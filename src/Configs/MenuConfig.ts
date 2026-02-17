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
} from 'lucide-react';
import type { MenuItem } from '../Types/KiduTypes/Sidebar.types';

/**
 * Example Menu Configuration for Lab Management System
 * 
 * This can be customized for different user roles/logins:
 * - Admin
 * - Lab Manager
 * - Doctor
 * - Practice Manager
 * - DSO User
 * - Support Staff
 */

export const labMenuConfig: MenuItem[] = [
  {
    title: 'Home',
    icon: Home,
    children: [
      { 
        title: 'Case on Hold', 
        url: '/dashboard/case-on-hold', 
        icon: Clock, 
        badge: 12 
      },
      { 
        title: 'In Transit', 
        url: '/dashboard/in-transit', 
        icon: Truck, 
        badge: 8 
      },
      { 
        title: 'In Production', 
        url: '/dashboard/in-production', 
        icon: Package, 
        badge: 24 
      },
      { 
        title: 'Submitted', 
        url: '/dashboard/submitted', 
        icon: ClipboardList, 
        badge: 5 
      },
      { 
        title: 'Recent', 
        url: '/dashboard/recent', 
        icon: FileText 
      },
    ],
  },
  {
    title: 'Analytics',
    url: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    title: 'Masters',
    icon: Users,
    children: [
      { 
        title: 'Lab', 
        url: '/dashboard/masters/lab', 
        icon: Microscope 
      },
      { 
        title: 'Practice', 
        url: '/dashboard/masters/practice', 
        icon: Building2 
      },
      { 
        title: 'Doctor', 
        url: '/dsoadmin-connect/masters/doctor-list', 
        icon: UserCog 
      },
      { 
        title: 'Product Group', 
        url: '/dsoadmin-connect/masters/productGroup-list', 
        icon: Package 
      },
      { 
        title: 'User Role Creation', 
        url: '/dashboard/masters/user-roles', 
        icon: UserPlus 
      },
    ],
  },
  {
    title: 'Setup',
    icon: Settings,
    children: [
      { 
        title: 'Practice Manager Login', 
        url: '/dashboard/setup/practice-manager', 
        icon: UserCog 
      },
      { 
        title: 'DSO – User Login', 
        url: '/dashboard/setup/dso-user', 
        icon: Users 
      },
      { 
        title: 'Lab Products Rate', 
        url: '/dashboard/setup/lab-products-rate', 
        icon: DollarSign 
      },
      { 
        title: 'Zone', 
        url: '/dashboard/setup/zone', 
        icon: MapPin 
      },
    ],
  },
  {
    title: 'Mapping',
    icon: Link2,
    children: [
      { 
        title: 'Prescription Product', 
        url: '/dashboard/mapping/prescription-product', 
        icon: ClipboardList 
      },
      { 
        title: 'Trios Doctor', 
        url: '/dashboard/mapping/trios-doctor', 
        icon: UserCog 
      },
      { 
        title: 'Trios Product', 
        url: '/dashboard/mapping/trios-product', 
        icon: Package 
      },
      { 
        title: 'Lab – DSO Doctor', 
        url: '/dashboard/mapping/lab-dso-doctor', 
        icon: Users 
      },
      { 
        title: 'Lab – DSO Product', 
        url: '/dashboard/mapping/lab-dso-product', 
        icon: Package 
      },
      { 
        title: 'Doctor – Pickup Service', 
        url: '/dashboard/mapping/doctor-pickup', 
        icon: Truck 
      },
    ],
  },
  {
    title: 'Reports',
    icon: FileText,
    children: [
      { 
        title: 'Case Summary', 
        url: '/dashboard/reports/case-summary', 
        icon: FileBarChart 
      },
      { 
        title: 'Revenue Summary', 
        url: '/dashboard/reports/revenue-summary', 
        icon: DollarSign 
      },
      { 
        title: 'Support Tickets', 
        url: '/dashboard/reports/support-tickets', 
        icon: HelpCircle 
      },
      { 
        title: 'Case On Hold – Aging', 
        url: '/dashboard/reports/case-aging', 
        icon: Clock 
      },
      { 
        title: 'Usage Adoption Report', 
        url: '/dashboard/reports/usage-adoption', 
        icon: TrendingUp 
      },
    ],
  },
  {
    title: 'Invoices',
    icon: Receipt,
    children: [
      { 
        title: 'Proforma Invoice', 
        url: '/dashboard/invoices/proforma', 
        icon: Receipt 
      },
    ],
  },
];

/**
 * Example: Simplified Menu for Doctor Login
 */
export const doctorMenuConfig: MenuItem[] = [
  {
    title: 'Home',
    icon: Home,
    children: [
      { 
        title: 'My Cases', 
        url: '/doctor/cases', 
        icon: ClipboardList, 
        badge: 5 
      },
      { 
        title: 'In Progress', 
        url: '/doctor/in-progress', 
        icon: Package, 
        badge: 3 
      },
      { 
        title: 'Completed', 
        url: '/doctor/completed', 
        icon: FileText 
      },
    ],
  },
  {
    title: 'Analytics',
    url: '/doctor/analytics',
    icon: BarChart3,
  },
  {
    title: 'Reports',
    icon: FileText,
    children: [
      { 
        title: 'Case Summary', 
        url: '/doctor/reports/case-summary', 
        icon: FileBarChart 
      },
      { 
        title: 'Support Tickets', 
        url: '/doctor/reports/support-tickets', 
        icon: HelpCircle 
      },
    ],
  },
];

/**
 * Example: Menu for Practice Manager
 */
export const practiceManagerMenuConfig: MenuItem[] = [
  {
    title: 'Home',
    icon: Home,
    children: [
      { 
        title: 'Dashboard', 
        url: '/practice/dashboard', 
        icon: Home 
      },
      { 
        title: 'Active Cases', 
        url: '/practice/active-cases', 
        icon: ClipboardList, 
        badge: 15 
      },
    ],
  },
  {
    title: 'Doctors',
    icon: UserCog,
    children: [
      { 
        title: 'Manage Doctors', 
        url: '/practice/doctors', 
        icon: Users 
      },
      { 
        title: 'Add Doctor', 
        url: '/practice/doctors/add', 
        icon: UserPlus 
      },
    ],
  },
  {
    title: 'Reports',
    icon: FileText,
    children: [
      { 
        title: 'Practice Summary', 
        url: '/practice/reports/summary', 
        icon: FileBarChart 
      },
      { 
        title: 'Revenue Report', 
        url: '/practice/reports/revenue', 
        icon: DollarSign 
      },
    ],
  },
  {
    title: 'Settings',
    url: '/practice/settings',
    icon: Settings,
  },
];

/**
 * Helper function to get menu based on user role
 */
export const getMenuForRole = (role: string): MenuItem[] => {
  switch (role.toLowerCase()) {
    case 'admin':
    case 'lab':
      return labMenuConfig;
    case 'doctor':
      return doctorMenuConfig;
    case 'practice-manager':
      return practiceManagerMenuConfig;
    default:
      return labMenuConfig;
  }
};