import React, { useState, useRef, useEffect } from 'react';
import './ProfilePage.css';
import ProfileModal from '../../Components/ProfileModal';

// ---- Mini Dashboard Stub (to demo the modal in context) ----

const ProfilePage: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="demo-page">
      {/* Top Bar */}
      <header className="demo-topbar">
        <div className="demo-brand">
          <div className="demo-brand-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
            </svg>
          </div>
          <span className="demo-brand-name">
            <span className="demo-brand-bracket">{'{'}</span>my<span className="demo-brand-accent">{'}'}</span>labconnect
          </span>
        </div>

        <div className="demo-topbar-center">
          <div className="demo-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" placeholder="Search cases, patients…" />
            <span className="demo-search-kbd">⌘K</span>
          </div>
        </div>

        <div className="demo-topbar-right">
          <button className="demo-icon-btn" title="Notifications">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span className="demo-notif-dot" />
          </button>
          <button className="demo-icon-btn" title="Calendar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </button>

          {/* Avatar / Dropdown trigger */}
          <div className="demo-avatar-wrap" ref={dropRef}>
            <button
              className={`demo-avatar-btn ${showDropdown ? 'active' : ''}`}
              onClick={() => setShowDropdown((v) => !v)}
            >
              <div className="demo-avatar">BD</div>
              <span className="demo-username">bedfdoc</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                style={{ transform: showDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {showDropdown && (
              <div className="demo-dropdown">
                <div className="demo-dropdown-user">
                  <div className="demo-dropdown-avatar">BD</div>
                  <div>
                    <p className="demo-dropdown-name">bedfdoc</p>
                    <p className="demo-dropdown-email">test.email@mylabconnect.com</p>
                  </div>
                </div>
                <div className="demo-dropdown-divider" />
                <button
                  className="demo-dropdown-item"
                  onClick={() => {
                    setShowDropdown(false);
                    setShowProfile(true);
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Profile
                </button>
                <button className="demo-dropdown-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Change Password
                </button>
                <div className="demo-dropdown-divider" />
                <button className="demo-dropdown-item danger">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Status Chips */}
      <div className="demo-status-bar">
        {[
          { label: 'Scan Rejected', count: 0, variant: 'danger' },
          { label: 'Case on Hold', count: 5, variant: 'warning' },
          { label: 'In Transit', count: 0, variant: 'neutral' },
          { label: 'In Production', count: 5, variant: 'info' },
          { label: 'Submitted', count: 84, variant: 'success' },
          { label: 'Recent', count: 5, variant: 'neutral' },
        ].map((chip) => (
          <div key={chip.label} className={`demo-chip chip-${chip.variant} ${chip.count === 0 ? 'chip-empty' : ''}`}>
            <span className="chip-dot" />
            <span className="chip-label">{chip.label}</span>
            <span className="chip-count">{chip.count}</span>
          </div>
        ))}
        <div className="demo-chip-actions">
          <button className="demo-action-btn primary">Prescription</button>
          <button className="demo-action-btn outline">Pickup</button>
        </div>
      </div>

      {/* Empty state */}
      <div className="demo-body">
        <div className="demo-empty">
          <div className="demo-empty-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <p className="demo-empty-title">No cases available</p>
          <p className="demo-empty-sub">Click the avatar in the top-right to open your profile settings.</p>
          <button className="demo-open-profile-btn" onClick={() => setShowProfile(true)}>
            Open Profile Settings
          </button>
        </div>
      </div>

      {/* THE MODAL */}
      <ProfileModal
        show={showProfile}
        onClose={() => setShowProfile(false)}
        onSave={(data) => {
          console.log('Profile saved:', data);
        }}
      />
    </div>
  );
};

export default ProfilePage;