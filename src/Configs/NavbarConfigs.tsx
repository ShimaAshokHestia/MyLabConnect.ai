import {
  Settings,
  Bell,
  HelpCircle,
  FileText,
  BarChart3,
  Users,
} from 'lucide-react';
import type {
  UserProfile,
  NotificationItem,
  NavbarAction,
} from '../Types/KiduTypes/Navbar.types';

/**
 * Navbar Configurations for Different User Roles
 * 
 * This file contains pre-configured navbar settings for different
 * user types in the application. Each configuration can be customized
 * based on role-specific requirements.
 */

// ============================================
// Admin Configuration
// ============================================

export const adminUser: UserProfile = {
  name: 'John Doe',
  email: 'john.doe@mydconnect.com',
  role: 'Admin',
  avatar: '', // Leave empty to use initials
};

export const adminNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'New Case Submitted',
    message: 'Dr. Smith submitted a new case #12345',
    time: '5 minutes ago',
    read: false,
    type: 'info',
    icon: FileText,
  },
  {
    id: '2',
    title: 'System Update',
    message: 'System maintenance scheduled for tonight',
    time: '1 hour ago',
    read: false,
    type: 'warning',
    icon: Bell,
  },
  {
    id: '3',
    title: 'Report Ready',
    message: 'Monthly analytics report is now available',
    time: '2 hours ago',
    read: true,
    type: 'success',
    icon: BarChart3,
  },
];

export const adminProfileActions: NavbarAction[] = [
  {
    label: 'Settings',
    icon: Settings,
    onClick: () => console.log('Navigate to settings'),
  },
  {
    label: 'Help & Support',
    icon: HelpCircle,
    onClick: () => console.log('Open help center'),
  },
];

// ============================================
// Doctor Configuration
// ============================================

export const doctorUser: UserProfile = {
  name: 'Dr. Sarah Johnson',
  email: 'sarah.johnson@clinic.com',
  role: 'Doctor',
};

export const doctorNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Case Update',
    message: 'Your case #12345 is now in production',
    time: '10 minutes ago',
    read: false,
    type: 'info',
    icon: FileText,
  },
  {
    id: '2',
    title: 'Case Completed',
    message: 'Case #12340 has been completed and shipped',
    time: '1 day ago',
    read: true,
    type: 'success',
    icon: FileText,
  },
];

export const doctorProfileActions: NavbarAction[] = [
  {
    label: 'My Cases',
    icon: FileText,
    onClick: () => console.log('View my cases'),
  },
  {
    label: 'Help',
    icon: HelpCircle,
    onClick: () => console.log('Get help'),
  },
];

// ============================================
// Lab Manager Configuration
// ============================================

export const labManagerUser: UserProfile = {
  name: 'Michael Chen',
  email: 'michael.chen@dentallab.com',
  role: 'Lab Manager',
};

export const labManagerNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'New Order',
    message: '3 new cases received from Dr. Smith',
    time: '5 minutes ago',
    read: false,
    type: 'info',
    icon: FileText,
  },
  {
    id: '2',
    title: 'Production Alert',
    message: 'Case #12345 requires quality check',
    time: '30 minutes ago',
    read: false,
    type: 'warning',
    icon: Bell,
  },
];

export const labManagerProfileActions: NavbarAction[] = [
  {
    label: 'Lab Dashboard',
    icon: BarChart3,
    onClick: () => console.log('View lab dashboard'),
  },
  {
    label: 'Team Management',
    icon: Users,
    onClick: () => console.log('Manage team'),
  },
];

// ============================================
// Practice Manager Configuration
// ============================================

export const practiceManagerUser: UserProfile = {
  name: 'Emily Roberts',
  email: 'emily.roberts@practice.com',
  role: 'Practice Manager',
};

export const practiceManagerNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Invoice Ready',
    message: 'Invoice #INV-2024-001 is ready for review',
    time: '1 hour ago',
    read: false,
    type: 'info',
    icon: FileText,
  },
];

export const practiceManagerProfileActions: NavbarAction[] = [
  {
    label: 'Practice Settings',
    icon: Settings,
    onClick: () => console.log('Practice settings'),
  },
  {
    label: 'Reports',
    icon: BarChart3,
    onClick: () => console.log('View reports'),
  },
];

// ============================================
// DSO User Configuration
// ============================================

export const dsoUser: UserProfile = {
  name: 'David Martinez',
  email: 'david.martinez@dso.com',
  role: 'DSO Administrator',
};

export const dsoNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Multi-Location Update',
    message: '5 practices have pending approvals',
    time: '30 minutes ago',
    read: false,
    type: 'warning',
    icon: Bell,
  },
  {
    id: '2',
    title: 'Monthly Report',
    message: 'DSO performance report for January is available',
    time: '2 hours ago',
    read: false,
    type: 'info',
    icon: BarChart3,
  },
];

export const dsoProfileActions: NavbarAction[] = [
  {
    label: 'DSO Dashboard',
    icon: BarChart3,
    onClick: () => console.log('DSO dashboard'),
  },
  {
    label: 'Practice Management',
    icon: Users,
    onClick: () => console.log('Manage practices'),
  },
];

// ============================================
// Support Staff Configuration
// ============================================

export const supportUser: UserProfile = {
  name: 'Lisa Anderson',
  email: 'lisa.anderson@support.com',
  role: 'Support Staff',
};

export const supportNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'New Ticket',
    message: 'Support ticket #T-12345 assigned to you',
    time: '5 minutes ago',
    read: false,
    type: 'info',
    icon: HelpCircle,
  },
];

export const supportProfileActions: NavbarAction[] = [
  {
    label: 'Support Dashboard',
    icon: BarChart3,
    onClick: () => console.log('Support dashboard'),
  },
  {
    label: 'Knowledge Base',
    icon: FileText,
    onClick: () => console.log('Knowledge base'),
  },
];

// ============================================
// Helper Function
// ============================================

/**
 * Get navbar configuration based on user role
 */
export const getNavbarConfig = (role: string) => {
  switch (role.toLowerCase()) {
    case 'admin':
      return {
        user: adminUser,
        notifications: adminNotifications,
        profileActions: adminProfileActions,
      };
    case 'doctor':
      return {
        user: doctorUser,
        notifications: doctorNotifications,
        profileActions: doctorProfileActions,
      };
    case 'lab-manager':
    case 'lab':
      return {
        user: labManagerUser,
        notifications: labManagerNotifications,
        profileActions: labManagerProfileActions,
      };
    case 'practice-manager':
      return {
        user: practiceManagerUser,
        notifications: practiceManagerNotifications,
        profileActions: practiceManagerProfileActions,
      };
    case 'dso':
    case 'dso-admin':
      return {
        user: dsoUser,
        notifications: dsoNotifications,
        profileActions: dsoProfileActions,
      };
    case 'support':
      return {
        user: supportUser,
        notifications: supportNotifications,
        profileActions: supportProfileActions,
      };
    default:
      return {
        user: adminUser,
        notifications: adminNotifications,
        profileActions: adminProfileActions,
      };
  }
};