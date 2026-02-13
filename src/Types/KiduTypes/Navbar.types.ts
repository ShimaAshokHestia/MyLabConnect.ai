// ============================================
// Navbar Types and Interfaces
// ============================================

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type?: 'info' | 'warning' | 'success' | 'error';
  icon?: React.ComponentType<{ className?: string }>;
}

export interface NavbarAction {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'danger';
}

export interface NavbarProps {
  // User Information
  user: UserProfile;
  
  // Search Configuration
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  showSearch?: boolean;
  
  // Notifications
  notifications?: NotificationItem[];
  onNotificationClick?: (notification: NotificationItem) => void;
  onMarkAllAsRead?: () => void;
  showNotifications?: boolean;
  
  // Theme
  showThemeToggle?: boolean;
  
  // Profile Menu Actions
  profileMenuActions?: NavbarAction[];
  
  // Callbacks
  onProfileClick?: () => void;
  onChangePassword?: () => void;
  onSignOut: () => void;
  
  // Customization
  logoSrc?: string;
  logoText?: string;
  className?: string;
  
  // Mobile Menu
  showMobileMenuToggle?: boolean;
  onMobileMenuToggle?: () => void;
  
  // Additional Actions
  additionalActions?: React.ReactNode;
}

export interface NavbarState {
  searchFocused: boolean;
  showSignOutDialog: boolean;
  showPasswordModal: boolean;
  showNotifications: boolean;
  searchQuery: string;
}