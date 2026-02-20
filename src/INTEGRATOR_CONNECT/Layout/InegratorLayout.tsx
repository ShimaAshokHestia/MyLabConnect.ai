// src/INTEGRATOR_CONNECT/Layout/IntegratorLayout.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KiduLayout from '../../KIDU_COMPONENTS/KiduLayout';

import type { NotificationItem } from '../../Types/KiduTypes/Navbar.types';
import { integratorConnectConfig } from './InegratorLayoutConfig';
import AuthService from '../../Services/AuthServices/Auth.services';

export const IntegratorLayout: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    integratorConnectConfig.notifications
  );

  const handleSignOut = () => {
    AuthService.logout();
    navigate('/', { replace: true });
  };

  return (
    <KiduLayout
      menuItems={integratorConnectConfig.menuItems}
      logoTitle="{my}labconnect.ai"
      logoSubtitle="Integrator Connect"
      user={integratorConnectConfig.user}
      notifications={notifications}
      profileMenuActions={integratorConnectConfig.profileActions}
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

export default IntegratorLayout;