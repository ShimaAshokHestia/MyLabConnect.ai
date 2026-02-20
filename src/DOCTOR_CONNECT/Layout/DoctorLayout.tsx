// src/DOCTOR_CONNECT/Layout/DoctorLayout.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KiduLayout from '../../KIDU_COMPONENTS/KiduLayout';

import type { NotificationItem } from '../../Types/KiduTypes/Navbar.types';
import { doctorConnectConfig } from './DoctorLayoutConfig';
import AuthService from '../../Services/AuthServices/Auth.services';

export const DoctorLayout: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    doctorConnectConfig.notifications
  );

  const handleSignOut = () => {
    AuthService.logout();
    navigate('/', { replace: true });
  };

  return (
    <KiduLayout
      menuItems={doctorConnectConfig.menuItems}
      logoTitle="{my}labconnect.ai"
      logoSubtitle="Doctor Connect"
      user={doctorConnectConfig.user}
      notifications={notifications}
      profileMenuActions={doctorConnectConfig.profileActions}
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

export default DoctorLayout;