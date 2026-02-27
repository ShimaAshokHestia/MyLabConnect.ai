// src/ADMIN/Layout/AppAdminLayout.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KiduLayout from '../../KIDU_COMPONENTS/KiduLayout';
import KiduProfileModal from '../../KIDU_COMPONENTS/KiduProfileModal';
import type { NotificationItem } from '../../Types/KiduTypes/Navbar.types';
import { appAdminConnectConfig } from './AppAdminLayoutConfig';
import AuthService from '../../Services/AuthServices/Auth.services';
import type { CustomApiResponse } from '../../Types/Auth/Auth.types';
import toast from 'react-hot-toast';

export const AppAdminLayout: React.FC = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<NotificationItem[]>(
    appAdminConnectConfig.notifications
  );
  const [showProfile, setShowProfile] = useState(false);
  const [, setShowPasswordModal] = useState(false);

  const handleSignOut = () => {
    AuthService.logout();
    navigate('/', { replace: true });
  };

  // ✅ FIX: Explicitly type result as CustomApiResponse so TS knows .isSucess exists
  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    const result = await AuthService.changePassword({ currentPassword, newPassword }) as CustomApiResponse;
    if (result.isSucess) {
      toast.success('Password changed successfully!');
    } else {
      toast.error(result.customMessage ?? result.error ?? 'Failed to change password.');
    }
  };

  return (
    <>
      <KiduLayout
        menuItems={appAdminConnectConfig.menuItems}
        logoTitle="{my}labconnect.ai"
        logoSubtitle="App Admin Connect"
        user={appAdminConnectConfig.user}
        notifications={notifications}
        onNotificationClick={(notification) =>
          setNotifications((prev) =>
            prev.map((n) => n.id === notification.id ? { ...n, read: true } : n)
          )
        }
        onMarkAllAsRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
        onProfileClick={() => setShowProfile(true)}
        onChangePassword={handleChangePassword}
        onSignOut={handleSignOut}
      />

      <KiduProfileModal
        show={showProfile}
        onHide={() => setShowProfile(false)}
        onChangePassword={() => {
          setShowProfile(false);
          setShowPasswordModal(true);
        }}
      />
    </>
  );
};

export default AppAdminLayout;