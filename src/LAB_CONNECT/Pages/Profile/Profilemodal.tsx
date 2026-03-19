// src/LAB_CONNECT/Components/ProfileModal.tsx
//
// NEW FILE — Profile modal triggered from the navbar profile action.
// Contains all fields visible in the original modal:
//   • Avatar initials + name + role + email display row
//   • Email field (read-only display)
//   • Mobile No. field (read-only display)
//   • Activate Email Notification toggle
//   • Activate Text (SMS) Notification toggle
// No API calls — all data read from the `user` prop (pure UI).
// Uses Bootstrap Modal + theme CSS variables for dark/light support.

import React, { useState } from 'react';
import { Modal, Form } from 'react-bootstrap';
import '../../Styles/Profilemodal.css';
import { useTheme } from '../../../ThemeProvider/ThemeProvider';

interface ProfileModalProps {
  show: boolean;
  onHide: () => void;
  user: {
    name: string;
    email: string;
    role: string;
  };
}

const ProfileModal: React.FC<ProfileModalProps> = ({ show, onHide, user }) => {
  const { theme } = useTheme();

  // Local toggle state — no API call, pure UI
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif]     = useState(true);

  // Derive initials for the avatar circle
  const initials = user.name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      dialogClassName="pm-dialog"
      contentClassName="pm-content"
      data-bs-theme={theme}
    >
      {/* ── Header ── */}
      <Modal.Header closeButton className="pm-header">
        <span className="pm-header-title">My Profile</span>
      </Modal.Header>

      {/* ── Body ── */}
      <Modal.Body className="pm-body">

        {/* Identity card */}
        <div className="pm-identity">
          <div className="pm-avatar">{initials}</div>
          <div className="pm-identity-info">
            <p className="pm-name">{user.name}</p>
            <p className="pm-role-badge">{user.role}</p>
            <p className="pm-email-sub">{user.email || '—'}</p>
          </div>
        </div>

        <div className="pm-rule" />

        {/* Read-only fields */}
        <div className="pm-fields">

          <div className="pm-field">
            <span className="pm-field-label">
              Email <span className="pm-required">*</span>
            </span>
            <div className="pm-field-box">
              <svg className="pm-field-ico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span className="pm-field-text">{user.email || '—'}</span>
            </div>
          </div>

          <div className="pm-field">
            <span className="pm-field-label">Mobile No.</span>
            <div className="pm-field-box">
              <svg className="pm-field-ico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                <line x1="12" y1="18" x2="12.01" y2="18"/>
              </svg>
              <span className="pm-field-text pm-placeholder">Not provided</span>
            </div>
          </div>

        </div>

        <div className="pm-rule" />

        {/* Notification preferences */}
        <p className="pm-section-heading">Notification Preferences</p>

        <div className="pm-notif-block">

          {/* Email notification toggle */}
          <div className="pm-notif-row">
            <div className="pm-notif-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span>Activate Email Notification</span>
            </div>
            <Form.Check
              type="switch"
              id="pm-email-switch"
              checked={emailNotif}
              onChange={e => setEmailNotif(e.target.checked)}
              className="pm-switch"
            />
          </div>
          {emailNotif && (
            <div className="pm-notif-value">{user.email || '—'}</div>
          )}

          {/* SMS notification toggle */}
          <div className="pm-notif-row">
            <div className="pm-notif-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                <line x1="12" y1="18" x2="12.01" y2="18"/>
              </svg>
              <span>Activate Text (SMS) Notification</span>
            </div>
            <Form.Check
              type="switch"
              id="pm-sms-switch"
              checked={smsNotif}
              onChange={e => setSmsNotif(e.target.checked)}
              className="pm-switch"
            />
          </div>
          {smsNotif && (
            <div className="pm-notif-value pm-placeholder">Not provided</div>
          )}

        </div>
      </Modal.Body>
      {/* No footer — view-only, close via header × button */}
    </Modal>
  );
};

export default ProfileModal;