// src/DOCTOR_CONNECT/Layout/DoctorLayout.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KiduLayout from '../../KIDU_COMPONENTS/KiduLayout';

import type { NotificationItem } from '../../Types/KiduTypes/Navbar.types';
import { doctorConnectConfig } from './DoctorLayoutConfig';
import AuthService from '../../Services/AuthServices/Auth.services';
import ProfileModal from '../Components/ProfileModal';

export const DoctorLayout: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    doctorConnectConfig.notifications
  );

    const [showProfile, setShowProfile] = useState(false);

  const handleSignOut = () => {
    AuthService.logout();
    navigate('/', { replace: true });
  };

  // Read userTypeId from the decoded JWT user — no extra API call needed.
  // AuthService.buildUserFromToken() stores this in _cache.user.userTypeId.
  // Role IDs: 1=DSO | 2=Lab | 3=Doctor | 4=Practice | 5=Integrator | 6=AppAdmin
  const user = AuthService.getUser();
  const assistantType = user?.userTypeId ?? 3; // fallback to 3 (Doctor) for this layout

  return (
    <>
      <KiduLayout
        menuItems={doctorConnectConfig.menuItems}
        logoTitle="{my}labconnect.ai"
        logoSubtitle="Doctor Connect"
        user={doctorConnectConfig.user}
        notifications={notifications}
        // profileMenuActions={doctorConnectConfig.profileActions}
        onNotificationClick={(notification) =>
          setNotifications((prev) =>
            prev.map((n) => n.id === notification.id ? { ...n, read: true } : n)
          )
        }
        onMarkAllAsRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
        onSignOut={handleSignOut}
         onProfileClick={() => setShowProfile(true)}
        assistantType={assistantType}   // Add this line
    // showAssistant is optional, default true
      />
      <ProfileModal
        show={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </>
  );
};

export default DoctorLayout;