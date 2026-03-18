// src/Auth/ConsentScreen.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../Styles/Auth/ConsentScreen.css';
import KiduLogo from '../KIDU_COMPONENTS/KiduLogo';
import HttpService from '../Services/Common/HttpService';
import AuthService from '../Services/AuthServices/Auth.services';
import KiduSecureStorage from '../Services/Common/KiduSecureStorage';
import { API_ENDPOINTS } from '../CONSTANTS/API_ENDPOINTS';
import { isValidUserTypeName } from '../Types/Auth/Auth.types';

interface ConsentSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string;
}

const consentSections: ConsentSection[] = [
  {
    id: 'data-collection',
    title: 'Data Collection & Usage',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
        <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
      </svg>
    ),
    content: 'We collect your name, contact information, and dental records solely to provide you with personalised care. Your data is stored securely on encrypted servers and is never sold to third parties. You may request a copy or deletion of your data at any time by contacting our privacy team.',
  },
  {
    id: 'medical-records',
    title: 'Medical Records & History',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),
    content: 'By continuing, you authorise {my}labconnect.ai to access and maintain your dental health records, X-rays, treatment plans, and clinical notes within this platform. These records are accessible only to authorised dental professionals involved in your care.',
  },
  {
    id: 'ai-assistance',
    title: 'AI-Assisted Diagnostics',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
    content: 'Our platform uses AI to assist dental professionals with pattern recognition, treatment suggestions, and diagnostic support. AI-generated insights are always reviewed by a qualified clinician before any clinical decision is made. You retain the right to opt out of AI-assisted analysis at any time.',
  },
  {
    id: 'communication',
    title: 'Communications & Notifications',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.06 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
      </svg>
    ),
    content: 'We may send appointment reminders, treatment updates, and platform announcements via email or SMS. You may manage notification preferences from your account settings. Transactional messages related to your care cannot be disabled while your account remains active.',
  },
  {
    id: 'third-party',
    title: 'Third-Party Integrations',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
    ),
    content: 'To deliver a seamless experience, we integrate with trusted laboratory management systems, insurance verification providers, and imaging software. Each integration is governed by data-processing agreements ensuring the same level of protection applied to your data within our platform.',
  },
];

// Must match key names in Auth.services.ts KEYS constant
const SK = {
  TOKEN:      'jwt_token',
  TEMP_TOKEN: 'jwt_temp_token',
  USER:       'auth_user',
  USER_TYPE:  'user_type_name',
  EXPIRES_AT: 'token_expires_at',
  PORTAL:     'redirect_portal',
};

const ConsentScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!AuthService.hasTempToken()) navigate('/', { replace: true });
  }, [navigate]);

  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [agreed, setAgreed]             = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 32) setScrolledToBottom(true);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAgree = async () => {
    if (!agreed || isSubmitting) return;
    setIsSubmitting(true);

    try {
      // POST /api/Auth/accept-consent-form — temp Consent_Pending token attached by HttpService
      const response = await HttpService.callApi<any>(
        API_ENDPOINTS.AUTH.ACCEPT_CONSENT,
        'POST',
        undefined,
        false
      );

      if (!response?.isSucess) {
        toast.error(response?.error || response?.customMessage || 'Failed to submit consent.');
        return;
      }

      const dto = response.value as {
        authState: string;
        token: string | null;
        redirectPortal: string | null;
        resendAvailableInSeconds?: number | null;
      };

      if (!dto?.token) {
        toast.error('Invalid server response. Please log in again.');
        AuthService.logout();
        navigate('/', { replace: true });
        return;
      }

      if (dto.authState === 'SUCCESS') {
        // 1. Store full token temporarily so HttpService sends it with /me
        await KiduSecureStorage.setItem(SK.TEMP_TOKEN, dto.token);

        // 2. Call /me to get the full user profile
        const meResponse = await HttpService.callApi<any>(API_ENDPOINTS.AUTH.ME, 'GET', undefined, false);

        if (!meResponse?.isSucess || !meResponse.value) {
          toast.error('Could not load user profile. Please log in again.');
          AuthService.logout();
          navigate('/', { replace: true });
          return;
        }

        const user = meResponse.value;

        if (!isValidUserTypeName(user.userTypeName)) {
          toast.error('Unrecognised user role. Please contact support.');
          AuthService.logout();
          navigate('/', { replace: true });
          return;
        }

        // 3. Persist full session
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        await Promise.all([
          KiduSecureStorage.setItem(SK.TOKEN,      dto.token),
          KiduSecureStorage.setItem(SK.USER,       user),
          KiduSecureStorage.setItem(SK.USER_TYPE,  user.userTypeName),
          KiduSecureStorage.setItem(SK.EXPIRES_AT, expiresAt),
          KiduSecureStorage.setItem(SK.PORTAL,     dto.redirectPortal ?? ''),
        ]);
        KiduSecureStorage.removeItem(SK.TEMP_TOKEN);

        // 4. Reload AuthService in-memory cache
        await AuthService.init();

        toast.success('Welcome! Redirecting to your portal…');
        setTimeout(() => navigate(AuthService.getDashboardRoute(), { replace: true }), 800);

      } else if (dto.authState === 'REQUIRES_2FA') {
        // Consent done but 2FA still pending — store new MFA temp token and go to login for OTP
        await KiduSecureStorage.setItem(SK.TEMP_TOKEN, dto.token);
        KiduSecureStorage.removeItem(SK.TOKEN);
        await AuthService.init();
        toast('Consent accepted. Please complete 2FA verification.', { icon: '🔐' });
        setTimeout(() => navigate('/', { replace: true }), 600);

      } else {
        toast.error('Unexpected response. Please log in again.');
        AuthService.logout();
        navigate('/', { replace: true });
      }

    } catch (err: any) {
      toast.error(err?.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = agreed && scrolledToBottom;

  return (
    <div className="consent-wrapper">
      <Container fluid className="p-0 h-100">
        <Row className="g-0 consent-row">

          <Col lg={5} className="d-none d-lg-flex consent-panel">
            <div className="consent-panel-inner">
              <div className="consent-panel-logo"><KiduLogo /></div>
              <div className="consent-panel-text animate-fade-in">
                <h3 className="panel-heading">Your privacy,<br />our responsibility.</h3>
                <p className="panel-subtext">Take a moment to understand how we handle your information before you proceed.</p>
              </div>
              <div className="consent-panel-badge">
                <span className="badge-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </span>
                <span>HIPAA Compliant &amp; Encrypted</span>
              </div>
              <div className="panel-steps">
                {['Login', 'Consent', 'Dashboard'].map((step, i) => (
                  <div key={step} className={`step-pill ${i === 1 ? 'active' : i < 1 ? 'done' : ''}`}>
                    <span className="step-dot" /><span className="step-label">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </Col>

          <Col lg={7} className="d-flex align-items-center justify-content-center consent-form-col">
            <div className="consent-card animate-fade-in">

              <div className="d-lg-none text-center mb-4"><KiduLogo /></div>

              <div className="consent-header">
                <div className="consent-icon-wrap">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <h2 className="consent-title">Terms &amp; Consent</h2>
                  <p className="consent-subtitle">Please read carefully before proceeding</p>
                </div>
              </div>

              {!scrolledToBottom && (
                <div className="scroll-hint">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                  Scroll to read all sections
                </div>
              )}

              <div ref={scrollRef} className={`consent-scroll-area ${scrolledToBottom ? 'scrolled' : ''}`}>
                <p className="consent-intro">
                  Welcome to <strong>{'{my}'}labconnect.ai</strong> — your dental care platform. Before you access the portal, please review the following terms regarding how we collect, store, and use your information. Accessing the platform constitutes your agreement to these terms.
                </p>

                {consentSections.map(section => (
                  <div
                    key={section.id}
                    className={`consent-section-item ${activeSection === section.id ? 'expanded' : ''}`}
                    onClick={() => setActiveSection(prev => prev === section.id ? null : section.id)}
                  >
                    <div className="section-header">
                      <span className="section-icon">{section.icon}</span>
                      <span className="section-title">{section.title}</span>
                      <span className="section-chevron">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </div>
                    <div className="section-body"><p>{section.content}</p></div>
                  </div>
                ))}

                <div className="consent-footer-note">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  These terms were last updated on <strong>1 March 2026</strong>. By agreeing, you confirm you are at least 18 years old or have parental/guardian consent.
                </div>
              </div>

              <div className={`consent-actions ${scrolledToBottom ? 'visible' : ''}`}>
                <Form.Check
                  type="checkbox"
                  id="consent-agree"
                  className="consent-checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  disabled={!scrolledToBottom}
                  label={
                    <span className="checkbox-label">
                      I have read and agree to the{' '}
                      <a href="#terms" className="consent-link" onClick={e => e.stopPropagation()}>Terms of Service</a>
                      {' '}and{' '}
                      <a href="#privacy" className="consent-link" onClick={e => e.stopPropagation()}>Privacy Policy</a>
                    </span>
                  }
                />

                <div className="consent-buttons">
                  <Button
                    variant="outline-secondary"
                    className="btn-decline"
                    onClick={() => { AuthService.logout(); navigate('/', { replace: true }); }}
                  >
                    Decline
                  </Button>
                  <Button className="btn-agree" disabled={!canSubmit || isSubmitting} onClick={handleAgree}>
                    {isSubmitting ? (
                      <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />Processing…</>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        I Agree &amp; Continue
                      </>
                    )}
                  </Button>
                </div>

                {!scrolledToBottom && (
                  <p className="scroll-warning">Please scroll through all sections to enable the agree button.</p>
                )}
              </div>

            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ConsentScreen;