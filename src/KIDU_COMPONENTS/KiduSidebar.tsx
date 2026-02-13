import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import '../Styles/KiduStyles/Sidebar.css';
import type { MenuItem, SidebarProps, SidebarState } from '../Types/KiduTypes/Sidebar.types';

/**
 * Reusable Sidebar Component
 * 
 * Features:
 * - Collapsible/Expandable
 * - Sticky positioning
 * - Smooth animations
 * - Nested menu support
 * - Badge notifications
 * - Responsive design
 * - Tooltip on hover when collapsed
 * - Scrollable menu content
 * 
 * @param menuItems - Array of menu items with optional children
 * @param currentPath - Current active path for highlighting
 * @param logoIcon - Custom logo icon component
 * @param logoTitle - Main logo text
 * @param logoSubtitle - Logo subtitle text
 * @param onNavigate - Navigation callback function
 * @param defaultCollapsed - Initial collapsed state
 * @param className - Additional CSS classes
 */
const KiduSidebar: React.FC<SidebarProps> = ({
  menuItems,
  currentPath,
  logoIcon,
  logoTitle = 'MyLabConnect',
  logoSubtitle = 'Dental Care Platform',
  onNavigate,
  defaultCollapsed = false,
  className = '',
}) => {
  const [state, setState] = useState<SidebarState>({
    collapsed: defaultCollapsed,
    openMenus: ['Home'], // Default open menu
    mobileOpen: false,
  });

  const sidebarRef = useRef<HTMLDivElement>(null);

  // Initialize open menus based on current path
  useEffect(() => {
    const activeMenu = menuItems.find((item) =>
      item.children?.some((child) => child.url === currentPath)
    );
    
    if (activeMenu && !state.openMenus.includes(activeMenu.title)) {
      setState((prev) => ({
        ...prev,
        openMenus: [...prev.openMenus, activeMenu.title],
      }));
    }
  }, [currentPath, menuItems]);

  // Handle collapse toggle
  const handleToggleCollapse = () => {
    setState((prev) => ({
      ...prev,
      collapsed: !prev.collapsed,
    }));
  };

  // Handle menu toggle
  const handleToggleMenu = (menuTitle: string) => {
    setState((prev) => {
      const isOpen = prev.openMenus.includes(menuTitle);
      return {
        ...prev,
        openMenus: isOpen
          ? prev.openMenus.filter((title) => title !== menuTitle)
          : [...prev.openMenus, menuTitle],
      };
    });
  };

  // Handle navigation
  const handleNavigation = (url: string) => {
    if (onNavigate) {
      onNavigate(url);
    }
    
    // Close mobile menu on navigation
    if (window.innerWidth <= 768) {
      setState((prev) => ({ ...prev, mobileOpen: false }));
    }
  };

  // Check if path is active
  const isActive = (url?: string): boolean => {
    return url ? currentPath === url : false;
  };

  // Check if menu group is active
  const isGroupActive = (item: MenuItem): boolean => {
    return item.children?.some((child) => isActive(child.url)) || false;
  };

  // Toggle mobile menu
  const handleMobileToggle = () => {
    setState((prev) => ({ ...prev, mobileOpen: !prev.mobileOpen }));
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        state.mobileOpen
      ) {
        setState((prev) => ({ ...prev, mobileOpen: false }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [state.mobileOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`sidebar-overlay ${state.mobileOpen ? 'active' : ''}`}
        onClick={handleMobileToggle}
      />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`app-sidebar ${state.collapsed ? 'collapsed' : ''} ${
          state.mobileOpen ? 'mobile-open' : ''
        } ${className}`}
      >
        {/* Header with Logo */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            {logoIcon || (
              <div className="sidebar-logo-icon">
                <svg
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="16" cy="16" r="16" fill="#ef0d50" />
                  <path
                    d="M16 8L20 14H12L16 8Z"
                    fill="white"
                  />
                  <path
                    d="M12 18H20V24H12V18Z"
                    fill="white"
                  />
                </svg>
              </div>
            )}
            <div className="sidebar-logo-text">
              <h1 className="sidebar-logo-title">{logoTitle}</h1>
              <p className="sidebar-logo-subtitle">{logoSubtitle}</p>
            </div>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          className="sidebar-toggle"
          onClick={handleToggleCollapse}
          aria-label={state.collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft className="sidebar-toggle-icon" />
        </button>

        {/* Navigation Content */}
        <div className="sidebar-content">
          <ul className="sidebar-menu">
            {menuItems.map((item) => (
              <li key={item.title} className="sidebar-menu-item">
                {item.children ? (
                  // Menu with Children
                  <>
                    <button
                      className={`sidebar-menu-btn ${
                        state.openMenus.includes(item.title) ? 'expanded' : ''
                      } ${isGroupActive(item) ? 'active' : ''}`}
                      onClick={() => handleToggleMenu(item.title)}
                      aria-expanded={state.openMenus.includes(item.title)}
                    >
                      <item.icon className="sidebar-menu-btn-icon" />
                      <span className="sidebar-menu-btn-text">{item.title}</span>
                      <ChevronDown className="sidebar-menu-btn-chevron" />
                      
                      {/* Tooltip for collapsed state */}
                      {state.collapsed && (
                        <span className="sidebar-tooltip">{item.title}</span>
                      )}
                    </button>

                    {/* Submenu */}
                    <ul
                      className={`sidebar-submenu ${
                        state.openMenus.includes(item.title) ? 'expanded' : ''
                      }`}
                    >
                      {item.children.map((child) => (
                        <li key={child.title} className="sidebar-submenu-item">
                          <a
                            href={child.url}
                            className={`sidebar-submenu-btn ${
                              isActive(child.url) ? 'active' : ''
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleNavigation(child.url);
                            }}
                          >
                            <child.icon className="sidebar-submenu-btn-icon" />
                            <span className="sidebar-submenu-btn-text">
                              {child.title}
                            </span>
                            {child.badge && (
                              <span className="sidebar-submenu-btn-badge">
                                {child.badge}
                              </span>
                            )}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  // Single Menu Item
                  <a
                    href={item.url}
                    className={`sidebar-menu-btn ${
                      isActive(item.url) ? 'active' : ''
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (item.url) handleNavigation(item.url);
                    }}
                  >
                    <item.icon className="sidebar-menu-btn-icon" />
                    <span className="sidebar-menu-btn-text">{item.title}</span>
                    {item.badge && (
                      <span className="sidebar-menu-btn-badge">{item.badge}</span>
                    )}
                    
                    {/* Tooltip for collapsed state */}
                    {state.collapsed && (
                      <span className="sidebar-tooltip">{item.title}</span>
                    )}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default KiduSidebar;