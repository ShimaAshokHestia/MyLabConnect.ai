// ============================================
// Dashboard Component Types
// ============================================

export type CaseStatus = 'on-hold' | 'in-transit' | 'in-production' | 'submitted' | 'completed';

export interface Case {
  id: string;
  patient: string;
  doctor: string;
  lab: string;
  product: string;
  status: CaseStatus;
  date: string;
}

export interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  count?: number | null;
}

export interface CaseTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export interface CaseTableProps {
  cases: Case[];
  loading?: boolean;
  onRowClick?: (caseItem: Case) => void;
  className?: string;
}

export interface DashboardPageProps {
  children?: React.ReactNode;
}