// src/Auth/LoginForm.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, InputGroup, Spinner, Alert } from 'react-bootstrap';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { FaLock, FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';
import type { LoginRequest } from '../Types/Auth/Auth.types';
import AuthService from '../Services/AuthServices/Auth.services';

const MAX_ATTEMPTS = 5;

interface LoginFormProps {
  onForgotPassword?: () => void;
  onRequires2FA?: (userEmail: string, resendAvailableInSeconds: number) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword, onRequires2FA }) => {
  const navigate = useNavigate();

  const [userName, setUserName]               = useState('');
  const [password, setPassword]               = useState('');
  const [showPassword, setShowPassword]       = useState(false);
  const [isLoading, setIsLoading]             = useState(false);
  const [focusedField, setFocusedField]       = useState<string | null>(null);
  const [submitted, setSubmitted]             = useState(false);
  const [errors, setErrors]                   = useState({ userName: '', password: '' });
  const [failedAttempts, setFailedAttempts]   = useState(0);
  const [isAccountLocked, setIsAccountLocked] = useState(false);

  const validate = (): boolean => {
    const errs = {
      userName: userName.trim() ? '' : 'Username is required',
      password: password       ? '' : 'Password is required',
    };
    setErrors(errs);
    return !errs.userName && !errs.password;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    if (!validate() || isAccountLocked) return;

    setIsLoading(true);
    try {
      const credentials: LoginRequest = { userName: userName.trim(), password };
      const response = await AuthService.login(credentials);

      if (response.isSucess && response.value) {
        setFailedAttempts(0);

        const dto = response.value as unknown as {
          authState: string;
          token: string | null;
          resendAvailableInSeconds?: number | null;
          redirectPortal?: string | null;
        };

        switch (dto.authState) {

          case 'SUCCESS': {
            const user = AuthService.getUser();
            toast.success(`Welcome${user?.userName ? `, ${user.userName}` : ''}!`);
            setTimeout(() => navigate(AuthService.getDashboardRoute(), { replace: true }), 800);
            break;
          }

          case 'REQUIRES_PWD_CHANGE': {
            toast('You must set a new password before continuing.', { icon: '🔒' });
            setTimeout(() => navigate('/force-change-password', { replace: true }), 600);
            break;
          }

          case 'REQUIRES_CONSENT': {
            toast('Please read and accept the consent form to continue.', { icon: '📋' });
            setTimeout(() => navigate('/consent', { replace: true }), 600);
            break;
          }

          case 'REQUIRES_2FA': {
            const waitSeconds = dto.resendAvailableInSeconds ?? 180;
            const tempPayload = decodeJwtPayload(dto.token ?? '');
            const userEmail   = tempPayload?.email ?? userName.trim();
            onRequires2FA?.(userEmail, waitSeconds);
            break;
          }

          default:
            toast.error('Unexpected response from server. Please try again.');
        }

      } else {
        const message = response.error || response.customMessage || 'Login failed.';

        if (message.toLowerCase().includes('locked')) {
          setIsAccountLocked(true);
          toast.error('Your account has been locked. Please use Forgot Password to recover.');
          return;
        }

        const newCount = failedAttempts + 1;
        setFailedAttempts(newCount);

        if (newCount >= MAX_ATTEMPTS) {
          setIsAccountLocked(true);
          toast.error('Too many failed attempts. Your account is now locked. Please use Forgot Password.');
        } else {
          const remaining = MAX_ATTEMPTS - newCount;
          toast.error(
            remaining <= 2
              ? `${message} — ${remaining} attempt${remaining === 1 ? '' : 's'} remaining before lockout.`
              : message
          );
        }
      }
    } catch (err: any) {
      if (err?.message?.includes('429') || err?.message?.toLowerCase().includes('too many')) {
        toast.error('Too many requests. Please wait a moment before trying again.');
      } else {
        toast.error(err?.message || 'An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isAccountLocked) {
    return (
      <div className="login-form">
        <Alert variant="danger" className="d-flex align-items-start gap-3 p-4" style={{ borderRadius: '12px' }}>
          <Lock size={28} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <h6 className="mb-1 fw-bold">Account Locked</h6>
            <p className="mb-3 small">
              Your account has been locked due to too many failed login attempts.
              Please use Forgot Password to recover access, or contact support.
            </p>
            {onForgotPassword && (
              <Button variant="outline-danger" size="sm" onClick={onForgotPassword} style={{ borderRadius: '8px' }}>
                Forgot Password
              </Button>
            )}
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <Form onSubmit={handleSubmit} className="login-form" noValidate>

      {failedAttempts >= 3 && failedAttempts < MAX_ATTEMPTS && (
        <Alert variant="warning" className="py-2 px-3 mb-3 small" style={{ borderRadius: '8px' }}>
          ⚠️ {MAX_ATTEMPTS - failedAttempts} attempt{MAX_ATTEMPTS - failedAttempts === 1 ? '' : 's'} remaining before your account is locked.
        </Alert>
      )}

      <Form.Group className="mb-4">
        <Form.Label className={`form-label-custom ${focusedField === 'userName' ? 'focused' : ''}`}>
          Username <span className="text-danger">*</span>
        </Form.Label>
        <InputGroup>
          <InputGroup.Text className="input-icon"><FaUser /></InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Enter your username"
            value={userName}
            onChange={e => {
              setUserName(e.target.value);
              if (submitted) setErrors(p => ({ ...p, userName: e.target.value.trim() ? '' : 'Username is required' }));
            }}
            onFocus={() => setFocusedField('userName')}
            onBlur={() => setFocusedField(null)}
            isInvalid={submitted && !!errors.userName}
            disabled={isLoading}
            className="form-control-custom"
          />
          <Form.Control.Feedback type="invalid">{errors.userName}</Form.Control.Feedback>
        </InputGroup>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label className={`form-label-custom ${focusedField === 'password' ? 'focused' : ''}`}>
          Password <span className="text-danger">*</span>
        </Form.Label>
        <InputGroup>
          <InputGroup.Text className="input-icon"><FaLock /></InputGroup.Text>
          <Form.Control
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={e => {
              setPassword(e.target.value);
              if (submitted) setErrors(p => ({ ...p, password: e.target.value ? '' : 'Password is required' }));
            }}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
            isInvalid={submitted && !!errors.password}
            disabled={isLoading}
            className="form-control-custom"
          />
          <Button
            variant="outline-secondary"
            className="password-toggle-btn"
            onClick={() => setShowPassword(v => !v)}
            disabled={isLoading}
            type="button"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
          <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
        </InputGroup>
      </Form.Group>

      {onForgotPassword && (
        <div className="text-end mb-4">
          <button type="button" onClick={onForgotPassword} disabled={isLoading} className="forgot-password-btn">
            Forgot Password?
          </button>
        </div>
      )}

      <Button type="submit" disabled={isLoading} className="login-submit-btn w-100">
        {isLoading ? <Spinner animation="border" size="sm" /> : 'Sign In'}
      </Button>

      <p className="text-center mt-3 role-info">
        Access for DSO, Lab, Practice, Doctor &amp; Integrator
      </p>
    </Form>
  );
};

function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    return JSON.parse(json);
  } catch { return null; }
}

export default LoginForm;