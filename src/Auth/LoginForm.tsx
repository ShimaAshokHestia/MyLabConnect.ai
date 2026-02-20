// src/Auth/LoginForm.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, InputGroup, Spinner } from 'react-bootstrap';
import { Eye, EyeOff } from 'lucide-react';
import { FaLock, FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';
import type { LoginRequest } from '../Types/Auth/Auth.types';
import AuthService from '../Services/AuthServices/Auth.services';

interface LoginFormProps {
  onForgotPassword?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword }) => {
  const navigate = useNavigate();

  const [userName, setUserName]       = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]     = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [submitted, setSubmitted]     = useState(false);
  const [errors, setErrors]           = useState({ userName: '', password: '' });

  // ── Validation ──────────────────────────────────────────────────
  const validate = (): boolean => {
    const errs = {
      userName: userName.trim() ? '' : 'Username is required',
      password: password       ? '' : 'Password is required',
    };
    setErrors(errs);
    return !errs.userName && !errs.password;
  };

  // ── Submit ───────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    if (!validate()) return;

    setIsLoading(true);
    try {
      const credentials: LoginRequest = { userName: userName.trim(), password };
      const response = await AuthService.login(credentials);

      if (response.isSucess && response.value) {
        const { userName: name } = response.value.user;
        toast.success(`Welcome, ${name}!`);

        const route = AuthService.getDashboardRoute();
        setTimeout(() => navigate(route, { replace: true }), 800);
      } else {
        toast.error(
          response.error ||
          response.customMessage ||
          'Login failed. Please check your credentials.'
        );
      }
    } catch (err: any) {
      toast.error(
        err?.message || 'An error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="login-form" noValidate>

      {/* ── Username ──────────────────────────────────────────────── */}
      <Form.Group className="mb-4">
        <Form.Label className={`form-label-custom ${focusedField === 'userName' ? 'focused' : ''}`}>
          Username <span className="text-danger">*</span>
        </Form.Label>
        <InputGroup>
          <InputGroup.Text className="input-icon">
            <FaUser />
          </InputGroup.Text>
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

      {/* ── Password ──────────────────────────────────────────────── */}
      <Form.Group className="mb-3">
        <Form.Label className={`form-label-custom ${focusedField === 'password' ? 'focused' : ''}`}>
          Password <span className="text-danger">*</span>
        </Form.Label>
        <InputGroup>
          <InputGroup.Text className="input-icon">
            <FaLock />
          </InputGroup.Text>
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

      {/* ── Forgot Password ───────────────────────────────────────── */}
      {onForgotPassword && (
        <div className="text-end mb-4">
          <button
            type="button"
            onClick={onForgotPassword}
            disabled={isLoading}
            className="forgot-password-btn"
          >
            Forgot Password?
          </button>
        </div>
      )}

      {/* ── Submit ────────────────────────────────────────────────── */}
      <Button
        type="submit"
        disabled={isLoading}
        className="login-submit-btn w-100"
      >
        {isLoading
          ? <Spinner animation="border" size="sm" />
          : 'Sign In'
        }
      </Button>

      <p className="text-center mt-3 role-info">
        Access for AppAdmin, DSO, Lab, Practice, Doctor &amp; Integrator
      </p>
    </Form>
  );
};

export default LoginForm;