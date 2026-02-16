// ============================================
// StatCard Types and Interfaces
// ============================================

export type ChangeType = 'positive' | 'negative' | 'neutral';

export interface StatCardProps {
  // Card Content
  title: string;
  value: string | number;
  
  // Optional Change Indicator
  change?: string;
  changeType?: ChangeType;
  
  // Icon
  icon: React.ComponentType<{ className?: string; size?: number }>;
  
  // Styling
  className?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  
  // Interaction
  onClick?: () => void;
  loading?: boolean;
}

export interface StatCardsGridProps {
  cards: StatCardProps[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}