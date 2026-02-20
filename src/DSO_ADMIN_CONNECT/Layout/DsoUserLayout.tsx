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
    />
  );
};

export default DsoUserLayout;