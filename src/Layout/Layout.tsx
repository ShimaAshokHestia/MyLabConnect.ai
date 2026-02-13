import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { MenuItem } from '../Types/KiduTypes/Sidebar.types';
import KiduSidebar from '../KIDU_COMPONENTS/KiduSidebar';
import { ThemeToggle } from '../ThemeProvider/ThemeProvider';
import '../Styles/KiduStyles/Layout.css';

interface LayoutProps {
  children?: ReactNode;
  menuItems: MenuItem[];
  logoIcon?: React.ReactNode;
  logoTitle?: string;
  logoSubtitle?: string;
  headerContent?: React.ReactNode;
  showThemeToggle?: boolean;
  className?: string;
}

/**
 * Layout Component
 * 
 * Main layout wrapper that includes:
 * - Sidebar navigation
 * - Top header/navbar
 * - Main content area
 * - Theme toggle
 * 
 * @param children - Page content
 * @param menuItems - Navigation menu items
 * @param logoIcon - Custom logo
 * @param logoTitle - Logo text
 * @param logoSubtitle - Logo subtitle
 * @param headerContent - Additional header content
 * @param showThemeToggle - Show/hide theme toggle button
 * @param className - Additional CSS classes
 */
const Layout: React.FC<LayoutProps> = ({
  children,
  menuItems,
  logoIcon,
  logoTitle,
  logoSubtitle,
  headerContent,
  showThemeToggle = true,
  className = '',
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Handle navigation
  const handleNavigate = (url: string) => {
    navigate(url);
  };

  return (
    <div className={`app-layout ${className}`}>
      {/* Sidebar */}
      <KiduSidebar
        menuItems={menuItems}
        currentPath={location.pathname}
        logoIcon={logoIcon}
        logoTitle={logoTitle}
        logoSubtitle={logoSubtitle}
        onNavigate={handleNavigate}
      />

      {/* Main Content Area */}
      <div className="main-content">
        {/* Top Header/Navbar */}
        <header className="app-header">
          <div className="app-header-content">
            {/* Left side - can be customized */}
            <div className="app-header-left">
              {headerContent}
            </div>

            {/* Right side - utilities */}
            <div className="app-header-right">
              {showThemeToggle && <ThemeToggle />}
              
              {/* Additional header items can be added here */}
              <div className="app-header-notifications">
                <button className="notification-btn" aria-label="Notifications">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="notification-badge">3</span>
                </button>
              </div>

              <div className="app-header-user">
                <button className="user-btn">
                  <div className="user-avatar">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 2a4 4 0 100 8 4 4 0 000-8zM6 14a2 2 0 00-2 2v2a1 1 0 102 0v-2a2 2 0 012-2h4a2 2 0 012 2v2a1 1 0 102 0v-2a2 2 0 00-2-2H6z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <div className="user-info">
                    <div className="user-name">John Doe</div>
                    <div className="user-role">Admin</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="app-main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;