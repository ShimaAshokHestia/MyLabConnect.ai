import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import type { MenuItem } from '../Types/KiduTypes/Sidebar.types';
import type { UserProfile, NotificationItem, NavbarAction } from '../Types/KiduTypes/Navbar.types';
import '../Styles/KiduStyles/KiduLayout.css';
import KiduSidebar from './KiduSidebar';
import KiduNavbar from './KiduNavbar';

interface KiduLayoutProps {
  // Sidebar Configuration
  menuItems: MenuItem[];
  logoIcon?: React.ReactNode;
  logoTitle?: string;
  logoSubtitle?: string;
  
  // Navbar Configuration
  user: UserProfile;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  showSearch?: boolean;
  notifications?: NotificationItem[];
  onNotificationClick?: (notification: NotificationItem) => void;
  onMarkAllAsRead?: () => void;
  showNotifications?: boolean;
  profileMenuActions?: NavbarAction[];
  onProfileClick?: () => void;
  onChangePassword?: () => void;
  onSignOut: () => void;
  
  // Additional
  additionalNavbarActions?: React.ReactNode;
  defaultSidebarCollapsed?: boolean;
}

/**
 * Reusable Layout Component for All Login Types
 * 
 * Integrates KiduSidebar and KiduNavbar with:
 * - Sidebar collapse/expand functionality via navbar toggle
 * - Theme management (light/dark mode)
 * - Responsive design
 * - Content area with proper spacing
 * - Mobile menu support
 * - Persistent state (sidebar collapse, theme)
 * 
 * Usage:
 * <KiduLayout
 *   menuItems={dsoMenuConfig}
 *   user={userProfile}
 *   notifications={notifications}
 *   onSignOut={handleSignOut}
 * />
 */
const KiduLayout: React.FC<KiduLayoutProps> = ({
  menuItems,
  logoIcon,
  logoTitle = 'MyLabConnect',
  logoSubtitle = 'Dental Care Platform',
  user,
  searchPlaceholder,
  onSearch,
  showSearch = true,
  notifications = [],
  onNotificationClick,
  onMarkAllAsRead,
  showNotifications = true,
  profileMenuActions = [],
  onProfileClick,
  onChangePassword,
  onSignOut,
  additionalNavbarActions,
  defaultSidebarCollapsed = false,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State management
  const [sidebarCollapsed, setSidebarCollapsed] = useState(defaultSidebarCollapsed);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load sidebar collapsed state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState !== null) {
      setSidebarCollapsed(savedState === 'true');
    }
  }, []);

  // Save sidebar collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Handle sidebar toggle from navbar
  const handleSidebarToggle = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  // Handle mobile menu toggle
  const handleMobileMenuToggle = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  // Handle navigation
  const handleNavigation = (url: string) => {
    navigate(url);
    // Close mobile menu on navigation
    if (window.innerWidth <= 768) {
      setMobileMenuOpen(false);
    }
  };

  // Sync sidebar collapsed state with KiduSidebar
  useEffect(() => {
    // This effect runs when sidebarCollapsed changes
    // The sidebar component will receive the updated defaultCollapsed prop
  }, [sidebarCollapsed]);

  return (
    <div className="kidu-layout-container">
      {/* Sidebar */}
      <div className={`kidu-sidebar-wrapper ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <KiduSidebar
          menuItems={menuItems}
          currentPath={location.pathname}
          logoIcon={logoIcon}
          logoTitle={logoTitle}
          logoSubtitle={logoSubtitle}
          onNavigate={handleNavigation}
          defaultCollapsed={sidebarCollapsed}
        />
      </div>

      {/* Main Content Wrapper */}
      <div className={`kidu-main-wrapper ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Navbar */}
        <div className="kidu-navbar-wrapper">
          <KiduNavbar
            user={user}
            searchPlaceholder={searchPlaceholder}
            onSearch={onSearch}
            showSearch={showSearch}
            notifications={notifications}
            onNotificationClick={onNotificationClick}
            onMarkAllAsRead={onMarkAllAsRead}
            showNotifications={showNotifications}
            showThemeToggle={true}
            profileMenuActions={profileMenuActions}
            onProfileClick={onProfileClick}
            onChangePassword={onChangePassword}
            onSignOut={onSignOut}
            showMobileMenuToggle={true}
            onMobileMenuToggle={handleMobileMenuToggle}
            additionalActions={
              <>
                {/* Sidebar Toggle Button (Desktop) */}
                <button
                  className="kidu-navbar-sidebar-toggle d-none d-lg-flex"
                  onClick={handleSidebarToggle}
                  aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                  title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`toggle-icon ${sidebarCollapsed ? 'collapsed' : ''}`}
                  >
                    <path
                      d="M15 5L10 10L15 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 5L3 10L8 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {additionalNavbarActions}
              </>
            }
          />
        </div>

        {/* Page Content */}
        <main className="kidu-main-content-area">
          <div className="kidu-content-container">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="kidu-mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default KiduLayout;