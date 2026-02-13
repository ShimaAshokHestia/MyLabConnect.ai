// ============================================
// Sidebar Types and Interfaces
// ============================================

export interface SubMenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export interface MenuItem {
  title: string;
  url?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  children?: SubMenuItem[];
}

export interface SidebarProps {
  menuItems: MenuItem[];
  currentPath: string;
  logoIcon?: React.ReactNode;
  logoTitle?: string;
  logoSubtitle?: string;
  onNavigate?: (url: string) => void;
  defaultCollapsed?: boolean;
  className?: string;
}

export interface SidebarState {
  collapsed: boolean;
  openMenus: string[];
  mobileOpen: boolean;
}