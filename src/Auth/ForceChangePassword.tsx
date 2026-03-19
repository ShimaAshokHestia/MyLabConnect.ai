// src/Auth/ForceChangePassword.tsx
//
// After submitting new password, backend returns one of:
//   REQUIRES_CONSENT  → navigate to /consent  (new user, hasn't accepted yet)
//   REQUIRES_2FA      → store temp token, go to / for OTP modal
//   SUCCESS           → call /me, complete session, go to dashboard
// Never send user back to /login — the auth chain continues forward.

import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import AuthService from '../Services/AuthServices/Auth.services';
import KiduLogo from '../KIDU_COMPONENTS/KiduLogo';
import KiduValidation from '../KIDU_COMPONENTS/KiduValidation';

// ─── Types ────────────────────────────────────────────────────────
type StrengthLevel = '' | 'weak' | 'fair' | 'good' | 'strong';

function calcStrength(pw: string): { score: number; level: StrengthLevel } {
  if (!pw) return { score: 0, level: '' };
  const checks = [
    pw.length >= 8,
    /[A-Z]/.test(pw),
    /[a-z]/.test(pw),
    /[0-9]/.test(pw),
    /[^A-Za-z0-9]/.test(pw),
  ];
  const score = Math.min(checks.filter(Boolean).length, 4);
  const levels: StrengthLevel[] = ['', 'weak', 'fair', 'good', 'strong'];
  return { score, level: levels[score] };
}

interface Fields { newPass: string; confirm: string; }
const INITIAL: Fields = { newPass: '', confirm: '' };

// ─── Icons ────────────────────────────────────────────────────────
const EyeIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
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

// ─── Component ────────────────────────────────────────────────────
const ForceChangePassword: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!AuthService.hasTempToken()) navigate('/', { replace: true });
  }, [navigate]);

  const [fields, setFields]       = useState<Fields>(INITIAL);
  const [errors, setErrors]       = useState<Fields>({ newPass: '', confirm: '' });
  const [visible, setVisible]     = useState({ newPass: false, confirm: false });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFields(p => ({ ...p, [key]: val }));
    if (key === 'confirm' || key === 'newPass') {
      const newVal  = key === 'newPass'  ? val : fields.newPass;
      const confVal = key === 'confirm' ? val : fields.confirm;
      setErrors(p => ({
        ...p,
        confirm: confVal && newVal !== confVal ? 'Passwords do not match' : '',
      }));
    }
    if (errors[key] && key !== 'confirm') setErrors(p => ({ ...p, [key]: '' }));
  };

  const validateAll = useCallback((): boolean => {
    const e: Fields = { newPass: '', confirm: '' };
    const r = KiduValidation.validate(fields.newPass, {
      type: 'text', required: true, label: 'New password', minLength: 8,
    });
    if (!r.isValid) e.newPass = r.message ?? '';
    else if (!/[a-z]/.test(fields.newPass)) e.newPass = 'Must contain at least one lowercase letter';
    if (!fields.confirm)                    e.confirm = 'Please confirm your new password';
    else if (fields.newPass !== fields.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return !e.newPass && !e.confirm;
  }, [fields]);

  const handleSubmit = async () => {
    if (!validateAll()) return;
    setSubmitting(true);

    try {
      const response = await AuthService.changeDefaultPassword({ newPassword: fields.newPass });

      if (!response.isSucess) {
        const msg = response.error || response.customMessage || 'Failed to change password.';
        toast.error(msg);
        setErrors(p => ({ ...p, newPass: msg }));
        return;
      }

      // Backend returns the NEXT step in the auth chain directly.
      // We must handle it here — never send the user back to /login.
      const dto = response.value as unknown as {
        authState: string;
        token: string | null;
        redirectPortal: string | null;
        resendAvailableInSeconds?: number | null;
      };

      switch (dto?.authState) {

        case 'SUCCESS': {
          // All gates cleared — session is already complete via Auth.services
          // (changeDefaultPassword calls completeSessionFromMe internally)
          const user = AuthService.getUser();
          toast.success(`Password updated! Welcome${user?.userName ? `, ${user.userName}` : ''}!`);
          setTimeout(() => navigate(AuthService.getDashboardRoute(), { replace: true }), 800);
          break;
        }

        case 'REQUIRES_CONSENT': {
          // Password changed but user hasn't accepted consent yet
          // Token is already stored as temp by Auth.services.changeDefaultPassword
          toast('Password updated! Please accept the consent form to continue.', { icon: '📋' });
          setTimeout(() => navigate('/consent', { replace: true }), 600);
          break;
        }

        case 'REQUIRES_2FA': {
          // Password changed, consent already approved, but 2FA pending
          // Token is already stored as temp by Auth.services.changeDefaultPassword
          toast('Password updated! Please complete 2FA verification.', { icon: '🔐' });
          // Navigate to login page where OTP modal will appear automatically
          setTimeout(() => navigate('/', { replace: true }), 600);
          break;
        }

        default:
          toast.error('Unexpected response. Please log in again.');
          AuthService.logout();
          navigate('/', { replace: true });
      }

    } catch (err: any) {
      toast.error(err?.message || 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const { score, level } = calcStrength(fields.newPass);
  const reqs = [
    { id: 'len',     met: fields.newPass.length >= 8,          label: 'At least 8 characters' },
    { id: 'upper',   met: /[A-Z]/.test(fields.newPass),        label: 'One uppercase letter (A–Z)' },
    { id: 'lower',   met: /[a-z]/.test(fields.newPass),        label: 'One lowercase letter (a–z)' },
    { id: 'num',     met: /[0-9]/.test(fields.newPass),        label: 'One number (0–9)' },
    { id: 'special', met: /[^A-Za-z0-9]/.test(fields.newPass), label: 'One special character (!@#$…)' },
  ];

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--theme-bg)', padding: '24px',
    }}>
      <div style={{
        width: '100%', maxWidth: '440px',
        background: 'var(--theme-bg-paper)', borderRadius: '20px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.10)', padding: '40px 36px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <KiduLogo />
        </div>

        <div style={{ marginBottom: '28px', textAlign: 'center' }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--theme-primary), #eb3a70)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px', boxShadow: '0 4px 16px rgba(239,13,80,0.3)',
          }}>
            <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="2.2" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <h5 style={{ fontWeight: 700, marginBottom: 6, color: 'var(--theme-text-primary)' }}>Set Your New Password</h5>
          <p style={{ fontSize: '0.83rem', color: 'var(--theme-text-secondary, #6b7280)', margin: 0 }}>
            Your account was created with a temporary password.
            Please set a secure password to continue.
          </p>
        </div>

        {/* New Password */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 6, color: 'var(--theme-text-primary)' }}>
            New Password <span style={{ color: 'var(--theme-danger, #ef4444)' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={visible.newPass ? 'text' : 'password'}
              placeholder="Enter your new password"
              value={fields.newPass}
              onChange={handleChange('newPass')}
              autoComplete="new-password"
              style={{
                width: '100%', padding: '10px 40px 10px 12px',
                border: `1.5px solid ${errors.newPass ? 'var(--theme-danger, #ef4444)' : 'var(--theme-border)'}`,
                borderRadius: '10px', fontSize: '0.88rem', outline: 'none',
                background: 'var(--theme-bg-input, var(--theme-bg-hover))',
                color: 'var(--theme-text-primary)', boxSizing: 'border-box',
              }}
            />
            <button type="button" onClick={() => setVisible(p => ({ ...p, newPass: !p.newPass }))}
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--theme-text-secondary)' }}>
              {visible.newPass ? <EyeIcon /> : <EyeOffIcon />}
            </button>
          </div>
          {errors.newPass && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 5, fontSize: '0.75rem', color: 'var(--theme-danger, #ef4444)' }}>
              <ErrorIcon />{errors.newPass}
            </div>
          )}

          {fields.newPass && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <div style={{ display: 'flex', gap: 4, flex: 1 }}>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} style={{
                    flex: 1, height: 4, borderRadius: 4,
                    background: i <= score
                      ? (level === 'weak' ? '#ef4444' : level === 'fair' ? '#f59e0b' : level === 'good' ? '#3b82f6' : '#22c55e')
                      : 'var(--theme-border)',
                    transition: 'background 0.2s',
                  }} />
                ))}
              </div>
              <span style={{
                fontSize: '0.72rem', fontWeight: 600, minWidth: 36,
                color: level === 'weak' ? '#ef4444' : level === 'fair' ? '#f59e0b' : level === 'good' ? '#3b82f6' : '#22c55e',
              }}>
                {level ? level.charAt(0).toUpperCase() + level.slice(1) : ''}
              </span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', marginTop: 10 }}>
            {reqs.map(r => (
              <div key={r.id} style={{
                display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem',
                color: r.met ? 'var(--theme-success, #22c55e)' : 'var(--theme-text-disabled)',
              }}>
                <div style={{
                  width: 14, height: 14, borderRadius: '50%',
                  background: r.met ? 'var(--theme-success, #22c55e)' : 'var(--theme-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'background 0.18s',
                }}>
                  <CheckIcon />
                </div>
                {r.label}
              </div>
            ))}
          </div>
        </div>

        {/* Confirm Password */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 6, color: 'var(--theme-text-primary)' }}>
            Confirm Password <span style={{ color: 'var(--theme-danger, #ef4444)' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={visible.confirm ? 'text' : 'password'}
              placeholder="Re-enter your new password"
              value={fields.confirm}
              onChange={handleChange('confirm')}
              autoComplete="new-password"
              style={{
                width: '100%', padding: '10px 40px 10px 12px',
                border: `1.5px solid ${errors.confirm ? 'var(--theme-danger, #ef4444)' : fields.confirm && !errors.confirm ? 'var(--theme-success, #22c55e)' : 'var(--theme-border)'}`,
                borderRadius: '10px', fontSize: '0.88rem', outline: 'none',
                background: 'var(--theme-bg-input, var(--theme-bg-hover))',
                color: 'var(--theme-text-primary)', boxSizing: 'border-box',
              }}
            />
            <button type="button" onClick={() => setVisible(p => ({ ...p, confirm: !p.confirm }))}
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--theme-text-secondary)' }}>
              {visible.confirm ? <EyeIcon /> : <EyeOffIcon />}
            </button>
          </div>
          {errors.confirm && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 5, fontSize: '0.75rem', color: 'var(--theme-danger, #ef4444)' }}>
              <ErrorIcon />{errors.confirm}
            </div>
          )}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
            background: 'linear-gradient(135deg, var(--theme-primary, #ef0d50), #eb3a70)',
            color: '#fff', fontWeight: 700, fontSize: '0.88rem',
            boxShadow: '0 4px 16px rgba(239,13,80,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {submitting
            ? <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" /> Updating…</>
            : 'Set New Password & Continue'
          }
        </Button>

        <p style={{ fontSize: '0.72rem', color: 'var(--theme-text-disabled)', textAlign: 'center', marginTop: 16, marginBottom: 0 }}>
          You cannot access your portal until this step is complete.
        </p>
      </div>
    </div>
  );
};

export default ForceChangePassword;