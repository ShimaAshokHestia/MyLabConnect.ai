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
 * KiduLayout
 *
 * - Sidebar toggle is controlled ONLY via the arrow button in the navbar.
 *   The sidebar's own built-in toggle button is hidden via CSS.
 * - sidebarCollapsed + mobileOpen state live here and are passed down.
 * - Theme is managed by ThemeProvider (no local theme state here).
 * - Fully responsive: sidebar slides off-canvas on mobile.
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

  const [sidebarCollapsed, setSidebarCollapsed] = useState(defaultSidebarCollapsed);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Persist sidebar state
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved !== null) setSidebarCollapsed(saved === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const handleSidebarToggle = () => setSidebarCollapsed((prev) => !prev);
  const handleMobileMenuToggle = () => setMobileMenuOpen((prev) => !prev);

  const handleNavigation = (url: string) => {
    navigate(url);
    if (window.innerWidth <= 991) setMobileMenuOpen(false);
  };

  return (
    <div className="kidu-layout">
      {/* Sidebar */}
      <aside
        className={`kidu-sidebar-slot ${sidebarCollapsed ? 'collapsed' : ''} ${
          mobileMenuOpen ? 'mobile-open' : ''
        }`}
      >
        <KiduSidebar
          menuItems={menuItems}
          currentPath={location.pathname}
          logoIcon={logoIcon}
          logoTitle={logoTitle}
          logoSubtitle={logoSubtitle}
          onNavigate={handleNavigation}
          defaultCollapsed={sidebarCollapsed}
        />
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="kidu-mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Main area */}
      <div className={`kidu-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Navbar — receives sidebar state so it can render the arrow button */}
        <KiduNavbar
          user={user}
          searchPlaceholder={searchPlaceholder}
          onSearch={onSearch}
          showSearch={showSearch}
          notifications={notifications}
          onNotificationClick={onNotificationClick}
          onMarkAllAsRead={onMarkAllAsRead}
          showNotifications={showNotifications}
          showThemeToggle
          profileMenuActions={profileMenuActions}
          onProfileClick={onProfileClick}
          onChangePassword={onChangePassword}
          onSignOut={onSignOut}
          showMobileMenuToggle
          onMobileMenuToggle={handleMobileMenuToggle}
          sidebarCollapsed={sidebarCollapsed}
          onSidebarToggle={handleSidebarToggle}
          additionalActions={additionalNavbarActions}
        />

        {/* Page content */}
        <main className="kidu-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default KiduLayout;