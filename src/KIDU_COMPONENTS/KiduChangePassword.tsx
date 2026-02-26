import React, { useState, useCallback } from 'react';
import { Modal, Button } from 'react-bootstrap';
import KiduValidation from './KiduValidation';
import '../Styles/KiduStyles/ChangePassword.css';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface ChangePasswordProps {
  show: boolean;
  onHide: () => void;
  /** Called with { currentPassword, newPassword } on successful submit */
  onSubmit?: (data: { currentPassword: string; newPassword: string }) => Promise<void> | void;
}

interface Fields {
  current: string;
  newPass: string;
  confirm: string;
}

interface FieldErrors {
  current: string;
  newPass: string;
  confirm: string;
}

type StrengthLevel = '' | 'weak' | 'fair' | 'good' | 'strong';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const INITIAL_FIELDS: Fields = { current: '', newPass: '', confirm: '' };
const INITIAL_ERRORS: FieldErrors = { current: '', newPass: '', confirm: '' };

function calcStrength(pw: string): { score: number; level: StrengthLevel } {
  if (!pw) return { score: 0, level: '' };
  const checks = [pw.length >= 8, /[A-Z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)];
  const score = checks.filter(Boolean).length;
  const levels: StrengthLevel[] = ['', 'weak', 'fair', 'good', 'strong'];
  return { score, level: levels[score] };
}

// SVG icons
const LockIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

const EyeIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const CheckIcon = () => (
  <svg width="8" height="8" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ErrorIcon = () => (
  <svg width="11" height="11" fill="#ef4444" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

const ChangePassword: React.FC<ChangePasswordProps> = ({ show, onHide, onSubmit }) => {
  const [fields, setFields] = useState<Fields>(INITIAL_FIELDS);
  const [errors, setErrors] = useState<FieldErrors>(INITIAL_ERRORS);
  const [visible, setVisible] = useState({ current: false, newPass: false, confirm: false });
  const [submitting, setSubmitting] = useState(false);

  // Reset on close
  const handleHide = () => {
    setFields(INITIAL_FIELDS);
    setErrors(INITIAL_ERRORS);
    setVisible({ current: false, newPass: false, confirm: false });
    setSubmitting(false);
    onHide();
  };

  // ── Field change ──
  const handleChange = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFields(p => ({ ...p, [key]: val }));
    // Live confirm check
    if (key === 'confirm' || key === 'newPass') {
      const newVal = key === 'newPass' ? val : fields.newPass;
      const confVal = key === 'confirm' ? val : fields.confirm;
      if (confVal && newVal !== confVal)
        setErrors(p => ({ ...p, confirm: 'Passwords do not match' }));
      else
        setErrors(p => ({ ...p, confirm: '' }));
    }
    if (errors[key] && key !== 'confirm')
      setErrors(p => ({ ...p, [key]: '' }));
  };

  // ── Validate all ──
  const validateAll = useCallback((): boolean => {
    const e: FieldErrors = { current: '', newPass: '', confirm: '' };
    const r1 = KiduValidation.validate(fields.current, { type: 'text', required: true, label: 'Current password' });
    if (!r1.isValid) e.current = r1.message ?? '';
    const r2 = KiduValidation.validate(fields.newPass, { type: 'text', required: true, label: 'New password', minLength: 8 });
    if (!r2.isValid) e.newPass = r2.message ?? '';
    if (!fields.confirm) e.confirm = 'Please confirm your new password';
    else if (fields.newPass !== fields.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return !Object.values(e).some(Boolean);
  }, [fields]);

  // ── Submit ──
  const handleSubmit = async () => {
    if (!validateAll()) return;
    setSubmitting(true);
    try {
      await onSubmit?.({ currentPassword: fields.current, newPassword: fields.newPass });
      handleHide();
    } catch (err: any) {
      setErrors(p => ({ ...p, current: err?.message || 'Failed to update password' }));
    } finally {
      setSubmitting(false);
    }
  };

  const { score, level } = calcStrength(fields.newPass);
  const reqs = [
    { id: 'len',     met: fields.newPass.length >= 8,         label: 'At least 8 characters' },
    { id: 'upper',   met: /[A-Z]/.test(fields.newPass),       label: 'One uppercase letter (A–Z)' },
    { id: 'num',     met: /[0-9]/.test(fields.newPass),       label: 'One number (0–9)' },
    { id: 'special', met: /[^A-Za-z0-9]/.test(fields.newPass),label: 'One special character (!@#$…)' },
  ];

  // ── Render ──
  return (
    <Modal
      show={show}
      onHide={handleHide}
      centered
      backdrop="static"
      keyboard={false}
      contentClassName="cp-modal-content"
      dialogClassName="cp-modal-dialog"
    >
      {/* Header */}
      <Modal.Header className="cp-header" closeButton={false}>
        <div className="cp-icon-wrap"><LockIcon /></div>
        <div style={{ flex: 1 }}>
          <Modal.Title className="cp-title">Change Password</Modal.Title>
          <div className="cp-subtitle">Keep your account safe with a strong password</div>
        </div>
        <Button variant="link" className="cp-close-btn" onClick={handleHide} aria-label="Close">
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </Button>
      </Modal.Header>

      {/* Body */}
      <Modal.Body className="cp-body">

        {/* Current password */}
        <div className="cp-field">
          <label className="cp-label">Current Password</label>
          <div className="cp-input-wrap">
            <input
              type={visible.current ? 'text' : 'password'}
              className={`cp-input${errors.current ? ' is-invalid' : ''}`}
              placeholder="Enter your current password"
              value={fields.current}
              onChange={handleChange('current')}
              autoComplete="current-password"
            />
            <button className="cp-eye-btn" type="button" onClick={() => setVisible(p => ({ ...p, current: !p.current }))} tabIndex={-1}>
              {visible.current ? <EyeIcon /> : <EyeOffIcon />}
            </button>
          </div>
          {errors.current && <div className="cp-error-text"><ErrorIcon />{errors.current}</div>}
        </div>

        <div className="cp-divider" />

        {/* New password */}
        <div className="cp-field">
          <label className="cp-label">New Password</label>
          <div className="cp-input-wrap">
            <input
              type={visible.newPass ? 'text' : 'password'}
              className={`cp-input${errors.newPass ? ' is-invalid' : ''}`}
              placeholder="Enter your new password"
              value={fields.newPass}
              onChange={handleChange('newPass')}
              autoComplete="new-password"
            />
            <button className="cp-eye-btn" type="button" onClick={() => setVisible(p => ({ ...p, newPass: !p.newPass }))} tabIndex={-1}>
              {visible.newPass ? <EyeIcon /> : <EyeOffIcon />}
            </button>
          </div>

          {/* Strength meter */}
          {fields.newPass && (
            <div className="cp-strength-wrap">
              <div className="cp-strength-bars">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`cp-sbar${i <= score ? ` ${level}` : ''}`} />
                ))}
              </div>
              <span className={`cp-strength-label ${level}`}>
                {level ? level.charAt(0).toUpperCase() + level.slice(1) : ''}
              </span>
            </div>
          )}

          {errors.newPass && <div className="cp-error-text"><ErrorIcon />{errors.newPass}</div>}

          {/* Requirements */}
          <div className="cp-reqs">
            {reqs.map(r => (
              <div key={r.id} className={`cp-req${r.met ? ' met' : ''}`}>
                <div className="cp-req-dot"><CheckIcon /></div>
                {r.label}
              </div>
            ))}
          </div>
        </div>

        {/* Confirm password */}
        <div className="cp-field">
          <label className="cp-label">Confirm New Password</label>
          <div className="cp-input-wrap">
            <input
              type={visible.confirm ? 'text' : 'password'}
              className={`cp-input${errors.confirm ? ' is-invalid' : fields.confirm && !errors.confirm ? ' is-valid' : ''}`}
              placeholder="Re-enter your new password"
              value={fields.confirm}
              onChange={handleChange('confirm')}
              autoComplete="new-password"
            />
            <button className="cp-eye-btn" type="button" onClick={() => setVisible(p => ({ ...p, confirm: !p.confirm }))} tabIndex={-1}>
              {visible.confirm ? <EyeIcon /> : <EyeOffIcon />}
            </button>
          </div>
          {errors.confirm && <div className="cp-error-text"><ErrorIcon />{errors.confirm}</div>}
        </div>

        {/* Submit */}
        <Button
          className="cp-submit-btn"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
              Updating…
            </>
          ) : (
            <>
              <LockIcon />
              Change Password
            </>
          )}
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default ChangePassword;