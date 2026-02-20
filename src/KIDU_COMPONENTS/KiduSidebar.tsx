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
 * - Nested menu support (accordion — only one open at a time)
 * - Badge notifications
 * - Responsive design
 * - Hover-expand when collapsed (submenu flies out)
 * - Scrollable menu content
 */
const KiduSidebar: React.FC<SidebarProps> = ({
  menuItems,
  currentPath,
  logoIcon,
  logoTitle = '{my}labconnect.ai',
  logoSubtitle = 'Dental Care Platform',
  onNavigate,
  defaultCollapsed = false,
  className = '',
}) => {
  const [state, setState] = useState<SidebarState>({
    collapsed: defaultCollapsed,
    openMenus: ['Home'],
    mobileOpen: false,
  });

  // Track which menu is hovered when sidebar is collapsed
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

  const sidebarRef = useRef<HTMLDivElement>(null);

  // Initialize open menus based on current path
  useEffect(() => {
    const activeMenu = menuItems.find((item) =>
      item.children?.some((child) => child.url === currentPath)
    );
    if (activeMenu && !state.openMenus.includes(activeMenu.title)) {
      setState((prev) => ({
        ...prev,
        openMenus: [activeMenu.title], // accordion: only the active one open
      }));
    }
  }, [currentPath, menuItems]);

  const handleToggleCollapse = () => {
    setState((prev) => ({ ...prev, collapsed: !prev.collapsed }));
    setHoveredMenu(null);
  };

  // ── CHANGE 1: Accordion — only one menu open at a time ───────────────────
  const handleToggleMenu = (menuTitle: string) => {
    setState((prev) => {
      const isOpen = prev.openMenus.includes(menuTitle);
      return {
        ...prev,
        // If already open → close it; otherwise open only this one
        openMenus: isOpen ? [] : [menuTitle],
      };
    });
  };

  const handleNavigation = (url: string) => {
    if (onNavigate) onNavigate(url);
    if (window.innerWidth <= 768) {
      setState((prev) => ({ ...prev, mobileOpen: false }));
    }
  };

  const isActive = (url?: string): boolean => url ? currentPath === url : false;

  const isGroupActive = (item: MenuItem): boolean =>
    item.children?.some((child) => isActive(child.url)) || false;

  const handleMobileToggle = () =>
    setState((prev) => ({ ...prev, mobileOpen: !prev.mobileOpen }));

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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [state.mobileOpen]);

  return (
    <>
      <div
        className={`sidebar-overlay ${state.mobileOpen ? 'active' : ''}`}
        onClick={handleMobileToggle}
      />

      <div
        ref={sidebarRef}
        className={`app-sidebar ${state.collapsed ? 'collapsed' : ''} ${
          state.mobileOpen ? 'mobile-open' : ''
        } ${className}`}
      >
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            {logoIcon || (
              <div className="sidebar-logo-icon">
                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="16" fill="#ef0d50" />
                  <path d="M16 8L20 14H12L16 8Z" fill="white" />
                  <path d="M12 18H20V24H12V18Z" fill="white" />
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
              <li
                key={item.title}
                className="sidebar-menu-item"
                // ── CHANGE 2: hover-expand when collapsed ──────────────────
                onMouseEnter={() => state.collapsed && item.children ? setHoveredMenu(item.title) : undefined}
                onMouseLeave={() => state.collapsed ? setHoveredMenu(null) : undefined}
              >
                {item.children ? (
                  <>
                    <button
                      className={`sidebar-menu-btn ${
                        state.openMenus.includes(item.title) ? 'expanded' : ''
                      } ${isGroupActive(item) ? 'active' : ''}`}
                      onClick={() => {
                        if (state.collapsed) {
                          // In collapsed mode toggle is handled by hover; click expands sidebar
                          handleToggleCollapse();
                        } else {
                          handleToggleMenu(item.title);
                        }
                      }}
                      aria-expanded={
                        state.collapsed
                          ? hoveredMenu === item.title
                          : state.openMenus.includes(item.title)
                      }
                    >
                      <item.icon className="sidebar-menu-btn-icon" />
                      <span className="sidebar-menu-btn-text">{item.title}</span>
                      <ChevronDown className="sidebar-menu-btn-chevron" />

                      {state.collapsed && (
                        <span className="sidebar-tooltip">{item.title}</span>
                      )}
                    </button>

                    {/* Submenu — normal expanded mode */}
                    {!state.collapsed && (
                      <ul
                        className={`sidebar-submenu ${
                          state.openMenus.includes(item.title) ? 'expanded' : ''
                        }`}
                      >
                        {item.children.map((child) => (
                          <li key={child.title} className="sidebar-submenu-item">
                            <a
                              href={child.url}
                              className={`sidebar-submenu-btn ${isActive(child.url) ? 'active' : ''}`}
                              onClick={(e) => { e.preventDefault(); handleNavigation(child.url); }}
                            >
                              <child.icon className="sidebar-submenu-btn-icon" />
                              <span className="sidebar-submenu-btn-text">{child.title}</span>
                              {child.badge && (
                                <span className="sidebar-submenu-btn-badge">{child.badge}</span>
                              )}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Submenu — collapsed hover flyout */}
                    {state.collapsed && hoveredMenu === item.title && (
                      <ul className="sidebar-submenu-flyout">
                        <li className="sidebar-submenu-flyout-title">{item.title}</li>
                        {item.children.map((child) => (
                          <li key={child.title} className="sidebar-submenu-item">
                            <a
                              href={child.url}
                              className={`sidebar-submenu-btn ${isActive(child.url) ? 'active' : ''}`}
                              onClick={(e) => { e.preventDefault(); handleNavigation(child.url); }}
                            >
                              <child.icon className="sidebar-submenu-btn-icon" />
                              <span className="sidebar-submenu-btn-text">{child.title}</span>
                              {child.badge && (
                                <span className="sidebar-submenu-btn-badge">{child.badge}</span>
                              )}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <a
                    href={item.url}
                    className={`sidebar-menu-btn ${isActive(item.url) ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); if (item.url) handleNavigation(item.url); }}
                  >
                    <item.icon className="sidebar-menu-btn-icon" />
                    <span className="sidebar-menu-btn-text">{item.title}</span>
                    {item.badge && (
                      <span className="sidebar-menu-btn-badge">{item.badge}</span>
                    )}
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