// src/PRACTICE_CONNECT/Layout/PracticeLayout.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KiduLayout from '../../KIDU_COMPONENTS/KiduLayout';

import type { NotificationItem } from '../../Types/KiduTypes/Navbar.types';
import { practiceConnectConfig } from './PracticeLayoutConfig';
import AuthService from '../../Services/AuthServices/Auth.services';

export const PracticeLayout: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    practiceConnectConfig.notifications
  );

  const handleSignOut = () => {
    AuthService.logout();
    navigate('/', { replace: true });
  };

  return (
    <KiduLayout
      menuItems={practiceConnectConfig.menuItems}
      logoTitle="{my}labconnect.ai"
      logoSubtitle="Practice Connect"
      user={practiceConnectConfig.user}
      notifications={notifications}
      profileMenuActions={practiceConnectConfig.profileActions}
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

export default PracticeLayout;