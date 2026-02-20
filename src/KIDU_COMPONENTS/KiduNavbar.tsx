import React, { useState, useRef } from 'react';
import {
  Navbar as BSNavbar,
  Container,
  Form,
  Button,
  Dropdown,
  Badge,
  Modal,
  InputGroup,
} from 'react-bootstrap';
import {
  Search,
  User,
  LogOut,
  Key,
  Bell,
  Sun,
  Moon,
  Menu,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useTheme } from '../ThemeProvider/ThemeProvider';
import type {
  NavbarProps,
  NavbarState,
  NotificationItem,
} from '../Types/KiduTypes/Navbar.types';
import '../Styles/KiduStyles/Navbar.css';

/**
 * KiduNavbar Component
 *
 * Theme toggle now driven by ThemeContext (single source of truth).
 * Sidebar toggle arrow button is built-in — no separate wrapper button needed.
 */
const KiduNavbar: React.FC<NavbarProps & {
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
}> = ({
  user,
  searchPlaceholder = 'Search cases, doctors, labs...',
  onSearch,
  showSearch = true,
  notifications = [],
  onNotificationClick,
  onMarkAllAsRead,
  showNotifications = true,
  showThemeToggle = true,
  profileMenuActions = [],
  onProfileClick,
  onChangePassword,
  onSignOut,
  logoSrc,
  logoText,
  className = '',
  showMobileMenuToggle = true,
  onMobileMenuToggle,
  additionalActions,
  sidebarCollapsed = false,
  onSidebarToggle,
}) => {
  const { theme, toggleTheme } = useTheme();

  const [state, setState] = useState<NavbarState>({
    searchFocused: false,
    showSignOutDialog: false,
    showPasswordModal: false,
    showNotifications: false,
    searchQuery: '',
  });

  const searchRef = useRef<HTMLInputElement>(null);

  const handleSearchFocus = () => setState((p) => ({ ...p, searchFocused: true }));
  const handleSearchBlur = () => setState((p) => ({ ...p, searchFocused: false }));

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setState((p) => ({ ...p, searchQuery: query }));
    if (onSearch) onSearch(query);
  };

  const handleSignOut = () => {
    setState((p) => ({ ...p, showSignOutDialog: false }));
    onSignOut();
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    if (onNotificationClick) onNotificationClick(notification);
    setState((p) => ({ ...p, showNotifications: false }));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getUserInitials = (name: string): string =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <>
      <BSNavbar
        sticky="top"
        className={`app-navbar border-bottom ${className}`}
        expand="lg"
      >
        <Container fluid className="px-3 px-lg-4">

          {/* Sidebar Arrow Toggle (desktop) */}
          {onSidebarToggle && (
            <button
              className="navbar-sidebar-arrow d-none d-lg-flex"
              onClick={onSidebarToggle}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? (
                <ChevronRight size={18} />
              ) : (
                <ChevronLeft size={18} />
              )}
            </button>
          )}

          {/* Mobile Menu Toggle */}
          {showMobileMenuToggle && (
            <Button
              variant="link"
              className="navbar-mobile-toggle d-lg-none p-2"
              onClick={onMobileMenuToggle}
              aria-label="Toggle mobile menu"
            >
              <Menu className="icon-size" />
            </Button>
          )}

          {/* Logo (Optional) */}
          {(logoSrc || logoText) && (
            <BSNavbar.Brand href="#" className="navbar-logo d-none d-lg-flex">
              {logoSrc && <img src={logoSrc} alt="Logo" className="navbar-logo-img" />}
              {logoText && <span className="navbar-logo-text">{logoText}</span>}
            </BSNavbar.Brand>
          )}

          {/* Search Bar */}
          {showSearch && (
            <div
              className={`navbar-search-wrapper flex-grow-1 ${
                state.searchFocused ? 'search-focused' : ''
              }`}
            >
              <InputGroup className="navbar-search">
                <InputGroup.Text className="search-icon">
                  <Search className="icon-size" />
                </InputGroup.Text>
                <Form.Control
                  ref={searchRef}
                  type="search"
                  placeholder={searchPlaceholder}
                  value={state.searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  className="search-input"
                />
              </InputGroup>
            </div>
          )}

          {/* Spacer */}
          <div className="flex-grow-1" />

          {/* Right Side Actions */}
          <div className="navbar-actions d-flex align-items-center gap-2">
            {additionalActions}

            {/* Theme Toggle */}
            {showThemeToggle && (
              <Button
                variant="link"
                className="navbar-action-btn"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="icon-size" />
                ) : (
                  <Sun className="icon-size" />
                )}
              </Button>
            )}

            {/* Notifications */}
            {showNotifications && (
              <Dropdown align="end" className="navbar-notifications">
                <Dropdown.Toggle
                  variant="link"
                  className="navbar-action-btn position-relative"
                  id="notifications-dropdown"
                >
                  <Bell className="icon-size" />
                  {unreadCount > 0 && (
                    <Badge
                      bg="danger"
                      pill
                      className="notification-badge position-absolute"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu className="notifications-menu">
                  <div className="notifications-header d-flex justify-content-between align-items-center px-3 py-2">
                    <h6 className="mb-0">Notifications</h6>
                    {unreadCount > 0 && onMarkAllAsRead && (
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 text-primary"
                        onClick={onMarkAllAsRead}
                      >
                        Mark all as read
                      </Button>
                    )}
                  </div>
                  <Dropdown.Divider />

                  {notifications.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                      <Bell className="mb-2" size={32} />
                      <p className="mb-0">No notifications</p>
                    </div>
                  ) : (
                    <div className="notifications-list">
                      {notifications.map((notification) => (
                        <Dropdown.Item
                          key={notification.id}
                          className={`notification-item ${!notification.read ? 'unread' : ''}`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="d-flex gap-2">
                            {notification.icon && (
                              <notification.icon className="notification-icon" />
                            )}
                            <div className="flex-grow-1">
                              <div className="notification-title">{notification.title}</div>
                              <div className="notification-message">{notification.message}</div>
                              <div className="notification-time">{notification.time}</div>
                            </div>
                            {!notification.read && <div className="notification-dot" />}
                          </div>
                        </Dropdown.Item>
                      ))}
                    </div>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            )}

            {/* User Profile Dropdown */}
            <Dropdown align="end" className="navbar-profile">
              <Dropdown.Toggle
                variant="link"
                className="navbar-profile-toggle d-flex align-items-center gap-2 p-2"
                id="profile-dropdown"
              >
                <div className="profile-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="avatar-img" />
                  ) : (
                    <div className="avatar-initials">{getUserInitials(user.name)}</div>
                  )}
                </div>
                <div className="profile-info d-none d-lg-block text-start">
                  <div className="profile-name">{user.name}</div>
                  <div className="profile-role">{user.role}</div>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu className="profile-menu">
                <div className="profile-menu-header px-3 py-2">
                  <div className="profile-menu-name">{user.name}</div>
                  <div className="profile-menu-email">{user.email}</div>
                </div>
                <Dropdown.Divider />

                {onProfileClick && (
                  <Dropdown.Item onClick={onProfileClick}>
                    <User className="me-2 icon-size-sm" />
                    Profile
                  </Dropdown.Item>
                )}

                {onChangePassword && (
                  <Dropdown.Item
                    onClick={() => setState((p) => ({ ...p, showPasswordModal: true }))}
                  >
                    <Key className="me-2 icon-size-sm" />
                    Change Password
                  </Dropdown.Item>
                )}

                {profileMenuActions.map((action, index) => (
                  <Dropdown.Item key={index} onClick={action.onClick}>
                    <action.icon className="me-2 icon-size-sm" />
                    {action.label}
                  </Dropdown.Item>
                ))}

                <Dropdown.Divider />

                <Dropdown.Item
                  className="text-danger"
                  onClick={() => setState((p) => ({ ...p, showSignOutDialog: true }))}
                >
                  <LogOut className="me-2 icon-size-sm" />
                  Sign Out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Container>
      </BSNavbar>

      {/* Sign Out Confirmation Modal */}
      <Modal
        show={state.showSignOutDialog}
        onHide={() => setState((p) => ({ ...p, showSignOutDialog: false }))}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Sign Out</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <div className="mb-3">
            <LogOut size={48} className="text-danger" />
          </div>
          <p>Are you sure you want to sign out of your account?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setState((p) => ({ ...p, showSignOutDialog: false }))}
          >
            Stay Signed In
          </Button>
          <Button variant="danger" onClick={handleSignOut}>
            Sign Out
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Change Password Modal */}
      {onChangePassword && (
        <Modal
          show={state.showPasswordModal}
          onHide={() => setState((p) => ({ ...p, showPasswordModal: false }))}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Change Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Current Password</Form.Label>
                <Form.Control type="password" placeholder="Enter current password" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control type="password" placeholder="Enter new password" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control type="password" placeholder="Confirm new password" />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setState((p) => ({ ...p, showPasswordModal: false }))}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                onChangePassword();
                setState((p) => ({ ...p, showPasswordModal: false }));
              }}
            >
              Change Password
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default KiduNavbar;