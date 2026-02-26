import React from 'react';
import '../Styles/KiduStyles/CaseStatusBar.css';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type StatusKey =
  | 'hold'
  | 'transit'
  | 'production'
  | 'submitted'
  | 'recent'
  | 'rejected';

export interface StatusItem {
  key: StatusKey;
  label: string;
  count: number;
  active?: boolean;
}

export interface StatusBarProps {
  items: StatusItem[];
  /** Called when a pill is clicked — receives the key of the clicked pill */
  onSelect?: (key: StatusKey) => void;
  className?: string;
}

// ─────────────────────────────────────────────
// Icon map
// ─────────────────────────────────────────────

const PILL_ICONS: Record<StatusKey, string> = {
  hold: '⚠',
  transit: '🚚',
  production: '⚙',
  submitted: '✓',
  recent: '🕐',
  rejected: '✕',
};

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

const StatusBar: React.FC<StatusBarProps> = ({ items, onSelect, className = '' }) => {
  const [activeKey, setActiveKey] = React.useState<StatusKey | null>(
    () => items.find((i) => i.active)?.key ?? null
  );

  const handleClick = (key: StatusKey) => {
    setActiveKey(key);
    onSelect?.(key);
  };

  return (
    <div
      className={`status-bar-wrapper ${className}`}
      role="tablist"
      aria-label="Case status filters"
    >
      {items.map((item, idx) => (
        <React.Fragment key={item.key}>
          <button
            className={`status-pill ${item.key}${activeKey === item.key ? ' active' : ''}`}
            onClick={() => handleClick(item.key)}
            role="tab"
            aria-selected={activeKey === item.key}
            aria-label={`${item.label}: ${item.count}`}
          >
            <span aria-hidden="true">{PILL_ICONS[item.key]}</span>
            <span className="pill-label">{item.label}</span>
            <span className="status-badge">{item.count}</span>
          </button>

          {idx < items.length - 1 && (
            <div className="status-divider" role="separator" aria-hidden="true" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StatusBar;