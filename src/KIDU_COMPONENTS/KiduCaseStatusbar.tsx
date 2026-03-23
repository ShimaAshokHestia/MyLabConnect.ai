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

  // ── New optional props ──────────────────────────────────────
  /** Show "Prescription" button — pass true for doctor role */
  showPrescription?: boolean;
  /** Show "Pickup" button — pass true for doctor or practice role */
  showPickup?: boolean;
  /** Called when Prescription button is clicked */
  onPrescriptionClick?: () => void;
  /** Called when Pickup button is clicked */
  onPickupClick?: () => void;
  /** Controlled search value */
  searchValue?: string;
  /** Called on every keystroke in the search input */
  onSearchChange?: (value: string) => void;
   // ADDED: view mode toggle props
  /** Current view mode — 'grid' shows cards, 'list' shows table */
  viewMode?: 'grid' | 'list';
  /** Called when the grid/list toggle button is clicked */
  onViewModeToggle?: () => void;
}

// ─────────────────────────────────────────────
// Icon map  (unchanged)
// ─────────────────────────────────────────────

const PILL_ICONS: Record<StatusKey, React.ReactNode> = {
  rejected: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  ),
  hold: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  transit: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  production: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  submitted: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  recent: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
};

// ─────────────────────────────────────────────
// Search icon
// ─────────────────────────────────────────────

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

// ─────────────────────────────────────────────
// Prescription icon
// ─────────────────────────────────────────────

const PrescriptionIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <line x1="9" y1="12" x2="15" y2="12" />
    <line x1="9" y1="16" x2="13" y2="16" />
  </svg>
);

// ─────────────────────────────────────────────
// Pickup icon
// ─────────────────────────────────────────────

const PickupIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12H3l9-9 9 9h-2" />
    <path d="M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    <path d="M10 22V16h4v6" />
  </svg>
);

// ADDED: Grid icon for grid view toggle
const GridIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);

// ADDED: List icon for list view toggle
const ListIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

const StatusBar: React.FC<StatusBarProps> = ({
  items,
  onSelect,
  className = '',
  showPrescription = false,
  showPickup = false,
  onPrescriptionClick,
  onPickupClick,
  searchValue = '',
  onSearchChange,
   // ADDED: destructure new view mode props with defaults
  viewMode = 'grid',
  onViewModeToggle,
}) => {
  const [internalSearch, setInternalSearch] = React.useState('');

  const handleClick = (key: StatusKey) => {
    onSelect?.(key);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInternalSearch(val);
    onSearchChange?.(val);
  };

  // Use controlled value if provided, else internal state
  const currentSearch = onSearchChange ? searchValue : internalSearch;

  return (
    <div
      className={`status-bar-wrapper ${className}`}
      role="tablist"
      aria-label="Case status filters"
    >
      {/* ── Pills ── */}
      {items.map((item, idx) => (
        <React.Fragment key={item.key}>
          <button
            className={`status-pill ${item.key}${item.active ? ' active' : ''}`}
            onClick={() => handleClick(item.key)}
            role="tab"
            aria-selected={item.active || false}
            aria-label={`${item.label}: ${item.count}`}
          >
            <span className="pill-icon" aria-hidden="true">{PILL_ICONS[item.key]}</span>
            <span className="pill-label">{item.label}</span>
            <span className="status-badge">{item.count}</span>
          </button>

          {idx < items.length - 1 && (
            <div className="status-divider" role="separator" aria-hidden="true" />
          )}
        </React.Fragment>
      ))}

      {/* ── Spacer — pushes right-side controls to the far right ── */}
      <div className="status-bar-spacer" aria-hidden="true" />

      {/* ── Prescription button (doctor only) ── */}
      {showPrescription && (
        <button
          className="sbar-action-btn sbar-btn--prescription"
          onClick={onPrescriptionClick}
          aria-label="New prescription"
          type="button"
        >
          <PrescriptionIcon />
          <span className="sbar-btn-label">Prescription</span>
        </button>
      )}

      {/* ── Pickup button (doctor + practice) ── */}
      {showPickup && (
        <button
          className="sbar-action-btn sbar-btn--pickup"
          onClick={onPickupClick}
          aria-label="Pickup"
          type="button"
        >
          <PickupIcon />
          <span className="sbar-btn-label">Pickup</span>
        </button>
      )}

       {/* ADDED: View mode toggle button — switches between grid cards and list table */}
      {onViewModeToggle && (
        <button
          className={`sbar-action-btn sbar-btn--viewmode${viewMode === 'list' ? ' sbar-btn--viewmode-active' : ''}`}
          onClick={onViewModeToggle}
          aria-label={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
          type="button"
          title={viewMode === 'grid' ? 'List View' : 'Grid View'}
        >
          {viewMode === 'grid' ? <ListIcon /> : <GridIcon />}
          <span className="sbar-btn-label">{viewMode === 'grid' ? 'List' : 'Grid'}</span>
        </button>
      )}

      {/* ── Search input (all roles) ── */}
      <div className="sbar-search" role="search">
        <span className="sbar-search-icon" aria-hidden="true"><SearchIcon /></span>
        <input
          type="search"
          className="sbar-search-input"
          placeholder="Search cases..."
          value={currentSearch}
          onChange={handleSearchChange}
          aria-label="Search cases"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
};

export default StatusBar;