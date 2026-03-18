import React, { useRef, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import '../Styles/Profilestep.css';
import SignatureModal from './Signaturemodal';

export interface ProfileStepData {
  gdcNo: string;
  mobileNo: string;
  emailId: string;
  avatarUrl: string | null;
  signatureUrl: string | null;
}

interface ProfileStepProps {
  data: ProfileStepData;
  onChange: (data: ProfileStepData) => void;
}

const ProfileStep: React.FC<ProfileStepProps> = ({ data, onChange }) => {
  const [showSigModal, setShowSigModal] = useState(false);
  const [sigMode, setSigMode] = useState<'draw' | 'upload'>('draw');
  const [showSigMenu, setShowSigMenu] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const sigMenuRef = useRef<HTMLDivElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange({ ...data, avatarUrl: ev.target?.result as string });
    reader.readAsDataURL(file);
  };

  const openSig = (mode: 'draw' | 'upload') => {
    setSigMode(mode);
    setShowSigMenu(false);
    setShowSigModal(true);
  };

  const handleSigSave = (dataUrl: string) => {
    onChange({ ...data, signatureUrl: dataUrl });
    setShowSigModal(false);
  };

  return (
    <div className="profile-step animate-step">
      {/* Avatar + Signature Row */}
      <div className="media-row">
        {/* Avatar */}
        <div className="avatar-zone">
          <div className="avatar-ring">
            {data.avatarUrl ? (
              <img src={data.avatarUrl} alt="Profile" className="avatar-img" />
            ) : (
              <div className="avatar-placeholder">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            )}
            <button className="avatar-edit-btn" onClick={() => fileRef.current?.click()} title="Change photo">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          </div>
          <span className="media-label">Photo</span>
          <input ref={fileRef} type="file" accept="image/*" className="d-none" onChange={handleAvatarChange} />
        </div>

        {/* Signature */}
        <div className="signature-zone" ref={sigMenuRef}>
          <div
            className="sig-preview-box"
            onClick={() => setShowSigMenu((v) => !v)}
            title="Manage signature"
          >
            {data.signatureUrl ? (
              <img src={data.signatureUrl} alt="Signature" className="sig-preview-img" />
            ) : (
              <div className="sig-empty">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.45">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
                <span>Add signature</span>
              </div>
            )}
            <div className="sig-corner-badge">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
              </svg>
            </div>
          </div>
          <span className="media-label">Signature</span>

          {showSigMenu && (
            <div className="sig-dropdown-menu">
              <button className="sig-menu-item" onClick={() => openSig('draw')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
                Draw signature
              </button>
              <button className="sig-menu-item" onClick={() => openSig('upload')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Upload signature
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Fields */}
      <Row className="g-3 mt-1">
        <Col xs={12} md={4}>
          <div className="field-group">
            <label className="field-label">GDC Number</label>
            <div className="field-input-wrap">
              <span className="field-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </span>
              <input
                type="text"
                className="field-input"
                value={data.gdcNo}
                onChange={(e) => onChange({ ...data, gdcNo: e.target.value })}
                placeholder="e.g. 1077780"
              />
            </div>
          </div>
        </Col>
        <Col xs={12} md={4}>
          <div className="field-group">
            <label className="field-label">Mobile Number</label>
            <div className="field-input-wrap">
              <span className="field-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              </span>
              <input
                type="tel"
                className="field-input"
                value={data.mobileNo}
                onChange={(e) => onChange({ ...data, mobileNo: e.target.value })}
                placeholder="e.g. 87654345671"
              />
            </div>
          </div>
        </Col>
        <Col xs={12} md={4}>
          <div className="field-group">
            <label className="field-label">Email Address</label>
            <div className="field-input-wrap">
              <span className="field-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              <input
                type="email"
                className="field-input"
                value={data.emailId}
                onChange={(e) => onChange({ ...data, emailId: e.target.value })}
                placeholder="you@example.com"
              />
            </div>
          </div>
        </Col>
      </Row>

      <SignatureModal
        show={showSigModal}
        mode={sigMode}
        onClose={() => setShowSigModal(false)}
        onSave={handleSigSave}
      />
    </div>
  );
};

export default ProfileStep;