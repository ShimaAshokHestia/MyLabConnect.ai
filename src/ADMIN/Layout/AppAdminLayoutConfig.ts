// src/APPADMIN_CONNECT/Config/LayoutConfig.ts

import { Home, BarChart3, Users, Settings, FileText, Building2, UserCog, UserPlus, FileBarChart, DollarSign, HelpCircle, Microscope, User, Key, CalendarRange } from 'lucide-react';
import type { MenuItem } from '../../Types/KiduTypes/Sidebar.types';
import type { UserProfile, NotificationItem, NavbarAction } from '../../Types/KiduTypes/Navbar.types';
import AuthService from '../../Services/AuthServices/Auth.services';

// ─── Menu Items ───────────────────────────────────────────────────
export const appAdminMenuItems: MenuItem[] = [
  {title: 'Dashboard',url: '/appadmin-connect',icon: Home,},
  {title: 'Analytics',url: '/appadmin-connect/analytics',icon: BarChart3,},
  {title: 'Masters',icon: Microscope,
    children: [
      { title: 'DSO Master List', url: '/appadmin-connect/masters/master-list', icon: Microscope },
    ],
  },
  {
    title: 'User Management',
    icon: UserCog,
    children: [
      { title: 'Users', url: '/appadmin-connect/users/user-list', icon: Users },
      { title: 'User Types', url: '/appadmin-connect/users/usertype-list', icon: UserPlus },
    ],
  },
  {
    title: 'Companies',
    url: '/appadmin-connect/companies/company-list',
    icon: Building2,
  },
  {
    title: 'Reports',
    icon: FileText,
    children: [
      { title: 'Case Summary', url: '/appadmin-connect/reports/case-summary', icon: FileBarChart },
      { title: 'Revenue Summary', url: '/appadmin-connect/reports/revenue-summary', icon: DollarSign },
      { title: 'Support Tickets', url: '/appadmin-connect/reports/support-tickets', icon: HelpCircle },
    ],
  },
  {
    title: 'Settings',
    icon: Settings,
    children: [
      { title: 'Financial Year', url: '/appadmin-connect/settings/financialYear-list', icon: CalendarRange },
    ],
  },
];

// ─── Profile Actions ──────────────────────────────────────────────
export const appAdminProfileActions: NavbarAction[] = [
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
export const appAdminNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'New DSO Registration',
    message: 'A new DSO user is pending approval.',
    time: 'Just now',
    read: false,
    type: 'info',
  },
];

// ─── Main Config (user pulled from localStorage at render time) ───
export const appAdminConnectConfig = {
  get user(): UserProfile {
    const u = AuthService.getUser();
    return {
      name: u?.userName ?? 'App Admin',
      email: u?.userEmail ?? '',
      role: u?.userTypeName ?? 'AppAdmin',
    } as UserProfile;
  },
  menuItems: appAdminMenuItems,
  profileActions: appAdminProfileActions,
  notifications: appAdminNotifications,
};