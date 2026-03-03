// src/DSO_ADMIN_CONNECT/Layout/DsoAdminLayout.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KiduLayout from '../../KIDU_COMPONENTS/KiduLayout';
import type { NotificationItem } from '../../Types/KiduTypes/Navbar.types';
import AuthService from '../../Services/AuthServices/Auth.services';
import { dsoAdminConnectConfig } from './DsoUserLayoutConfig';

export const DsoUserLayout: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    dsoAdminConnectConfig.notifications
  );

  const handleSignOut = () => {
    AuthService.logout();
    navigate('/', { replace: true });
  };

  // Read userTypeId from the decoded JWT user — no extra API call needed.
  // AuthService.buildUserFromToken() stores this in _cache.user.userTypeId.
  // Role IDs: 1=DSO | 2=Lab | 3=Doctor | 4=Practice | 5=Integrator | 6=AppAdmin
  const user = AuthService.getUser();
  const assistantType = user?.userTypeId ?? 1;

  return (
    <KiduLayout
      menuItems={dsoAdminConnectConfig.menuItems}
      logoTitle="{my}labconnect.ai"
      logoSubtitle="DSO Admin Connect"
      user={dsoAdminConnectConfig.user}
      notifications={notifications}
      profileMenuActions={dsoAdminConnectConfig.profileActions}
      onNotificationClick={(notification) =>
        setNotifications((prev) =>
          prev.map((n) => n.id === notification.id ? { ...n, read: true } : n)
        )
      }
      onMarkAllAsRead={() =>
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      }
      onSignOut={handleSignOut}
      assistantType={assistantType}
    />
  );
};

export default DsoUserLayout;