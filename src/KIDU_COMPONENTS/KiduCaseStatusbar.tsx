import React from 'react';
import './StatusBar.css';

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
// Icon map (emoji/unicode for exact HTML match)
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

const StatusBar: React.FC<StatusBarProps> = ({
  items,
  onSelect,
  className = '',
}) => {
  const [activeKey, setActiveKey] = React.useState<StatusKey | null>(
    () => items.find((i) => i.active)?.key ?? null
  );

  const handleClick = (key: StatusKey) => {
    setActiveKey(key);
    onSelect?.(key);
  };

  return (
    <div className={`status-bar-wrapper ${className}`} role="tablist" aria-label="Case status filters">
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

// ─────────────────────────────────────────────
// Usage Example (for docs / Storybook)
// ─────────────────────────────────────────────
//
// import StatusBar, { StatusItem } from './StatusBar';
//
// const items: StatusItem[] = [
//   { key: 'hold',       label: 'Case on Hold',  count: 10, active: true },
//   { key: 'transit',    label: 'In Transit',     count: 0  },
//   { key: 'production', label: 'In Production',  count: 48 },
//   { key: 'submitted',  label: 'Submitted',      count: 77 },
//   { key: 'recent',     label: 'Recent',         count: 2  },
// ];
//
// <StatusBar items={items} onSelect={(key) => console.log(key)} />