// src/APPADMIN_CONNECT/Layout/AppAdminLayout.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KiduLayout from '../../KIDU_COMPONENTS/KiduLayout';
import type { NotificationItem } from '../../Types/KiduTypes/Navbar.types';
import { appAdminConnectConfig } from './AppAdminLayoutConfig';
import AuthService from '../../Services/AuthServices/Auth.services';

export const AppAdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    appAdminConnectConfig.notifications
  );

  const handleSignOut = () => {
    AuthService.logout();
    navigate('/', { replace: true });
  };

  return (
    <KiduLayout
      menuItems={appAdminConnectConfig.menuItems}
      logoTitle="{my}labconnect.ai"
      logoSubtitle="App Admin Connect"
      user={appAdminConnectConfig.user}
      notifications={notifications}
      profileMenuActions={appAdminConnectConfig.profileActions}
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

export default AppAdminLayout;