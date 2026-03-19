// src/LAB_CONNECT/Layout/LabLayout.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KiduLayout from '../../KIDU_COMPONENTS/KiduLayout';

import type { NotificationItem } from '../../Types/KiduTypes/Navbar.types';
import AuthService from '../../Services/AuthServices/Auth.services';
import { labConnectConfig } from './LabLayoutConfig';
import ProfileModal from '../Pages/Profile/Profilemodal';

export const LabLayout: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    labConnectConfig.notifications
  );
   // ADDED: state to open/close the profile modal
  const [showProfile, setShowProfile] = useState(false);

  const handleSignOut = () => {
    AuthService.logout();
    navigate('/', { replace: true });
  };



  // Read userTypeId from the decoded JWT user — no extra API call needed.
  // AuthService.buildUserFromToken() stores this in _cache.user.userTypeId.
  // Role IDs: 1=DSO | 2=Lab | 3=Doctor | 4=Practice | 5=Integrator | 6=AppAdmin
  const user = AuthService.getUser();
  const assistantType = user?.userTypeId ?? 2; 

  // ADDED: override the "Profile" action to open the modal.
  // All other profile actions (e.g. Change Password) are preserved unchanged.
  // const profileMenuActions = labConnectConfig.profileActions.map(action =>
  //   action.label === 'Profile'
  //     ? { ...action, onClick: () => setShowProfile(true) }
  //     : action
  // );

  return (
  <>
      <KiduLayout
        menuItems={labConnectConfig.menuItems}
        logoTitle="{my}labconnect.ai"
        logoSubtitle="Lab Connect"
        user={labConnectConfig.user}
        notifications={notifications}
        // profileMenuActions={labConnectConfig.profileActions}
        // profileMenuActions={profileMenuActions}   // ← uses overridden actions
          onProfileClick={() => setShowProfile(true)}
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
  
      {/* ADDED: Profile modal — opens when profile action is clicked */}
        <ProfileModal
          show={showProfile}
          onHide={() => setShowProfile(false)}
          user={labConnectConfig.user}
        />
  </>
  );
};

export default LabLayout;