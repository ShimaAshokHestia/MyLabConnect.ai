// src/LAB_CONNECT/Layout/LabLayout.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KiduLayout from '../../KIDU_COMPONENTS/KiduLayout';

import type { NotificationItem } from '../../Types/KiduTypes/Navbar.types';
import AuthService from '../../Services/AuthServices/Auth.services';
import { labConnectConfig } from './LabLayoutConfig';

export const LabLayout: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    labConnectConfig.notifications
  );

  const handleSignOut = () => {
    AuthService.logout();
    navigate('/', { replace: true });
  };

  return (
    <KiduLayout
      menuItems={labConnectConfig.menuItems}
      logoTitle="{my}labconnect.ai"
      logoSubtitle="Lab Connect"
      user={labConnectConfig.user}
      notifications={notifications}
      profileMenuActions={labConnectConfig.profileActions}
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

export default LabLayout;