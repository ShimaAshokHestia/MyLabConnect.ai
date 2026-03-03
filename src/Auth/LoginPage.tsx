// src/Auth/LoginPage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import '../Styles/Auth/LoginPage.css';
import KiduLogo from '../KIDU_COMPONENTS/KiduLogo';
import LoginForm from './LoginForm';
import KiduForgotPassword from '../KIDU_COMPONENTS/KiduForgotPassword';
import KiduOtpModal from '../KIDU_COMPONENTS/KiduOTPModal';
import AuthService from '../Services/AuthServices/Auth.services';
import toast from 'react-hot-toast';

const carouselImages = [
  '/Images/login-carousel-1.jpg',
  '/Images/login-carousel-2.jpg',
  '/Images/login-carousel-3.jpg',
];

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // ── 2FA state ─────────────────────────────────────────────────────
  const [showOtpModal, setShowOtpModal]           = useState(false);
  const [otpDestination, setOtpDestination]       = useState('');
  const [otpResendSeconds, setOtpResendSeconds]   = useState(180);

  // ── Carousel ──────────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // ── Called by LoginForm when backend returns REQUIRES_2FA ─────────
  const handleRequires2FA = (userEmail: string, resendAvailableInSeconds: number) => {
    setOtpDestination(userEmail);
    setOtpResendSeconds(resendAvailableInSeconds);
    setShowOtpModal(true);
  };

  // ── OTP verify — called by KiduOtpModal with the 6-digit code ─────
  const handleOtpVerify = async (otp: string) => {
    const response = await AuthService.verifyOtp({ otpCode: otp });

    if (response.isSucess) {
      const user = AuthService.getUser();
      setShowOtpModal(false);
      toast.success(`Welcome${user?.userName ? `, ${user.userName}` : ''}!`);
      setTimeout(() => navigate(AuthService.getDashboardRoute(), { replace: true }), 800);
    } else {
      const msg = response.error || response.customMessage || 'Invalid OTP. Please try again.';
      // Throw so KiduOtpModal can catch it and show the error + clear inputs
      throw new Error(msg);
    }
  };

  // ── OTP resend — called by KiduOtpModal resend button ─────────────
  const handleOtpResend = async () => {
    const response = await AuthService.resendOtp();
    if (!response.isSucess) {
      const msg = response.error || response.customMessage || 'Could not resend OTP.';
      throw new Error(msg);
    }
    // Success — KiduOtpModal restarts its own countdown
  };

  // ── Forgot password ───────────────────────────────────────────────
  const handleForgotPasswordSubmit = async ({ email }: { username: string; email: string }) => {
    const response = await AuthService.forgotPassword({ email });
    if (!response.isSucess) {
      throw new Error(response.customMessage ?? response.error ?? 'Something went wrong.');
    }
  };

  return (
    <div className="login-wrapper">
      <Container fluid className="p-0">
        <Row className="g-0 login-row">

          {/* ─── Left: Carousel ──────────────────────────────────── */}
          <Col lg={6} className="d-none d-lg-flex position-relative login-carousel">
            {carouselImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Dental slide ${index + 1}`}
                className={`carousel-image ${index === currentSlide ? 'active' : ''}`}
              />
            ))}
            <div className="carousel-overlay" />
            <div className="carousel-logo animate-fade-in">
              <KiduLogo />
            </div>
            <div className="carousel-indicators-custom">
              {carouselImages.map((_, index) => (
                <Button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`indicator ${index === currentSlide ? 'active' : ''}`}
                />
              ))}
            </div>
          </Col>

          {/* ─── Right: Form ─────────────────────────────────────── */}
          <Col lg={6} className="d-flex align-items-center justify-content-center login-form-section">
            <div className="login-form-container animate-fade-in">

              <div className="d-lg-none text-center mb-4">
                <KiduLogo />
              </div>

              <div className="mb-4">
                <h2 className="login-title">Welcome Back</h2>
                <p className="login-subtitle">Sign in to access your portal</p>
              </div>

              <LoginForm
                onForgotPassword={() => setShowForgotPassword(true)}
                onRequires2FA={handleRequires2FA}
              />

              <p className="login-footer text-center mt-4">
                © 2026 {'{my}'}labconnect.ai – Dental Care Platform. All rights reserved.
              </p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* ── Forgot Password Modal ─────────────────────────────────── */}
      <KiduForgotPassword
        show={showForgotPassword}
        onHide={() => setShowForgotPassword(false)}
        onSubmit={handleForgotPasswordSubmit}
      />

      {/* ── 2FA OTP Modal ─────────────────────────────────────────── */}
      {/* Uses the existing KiduOtpModal component.                   */}
      {/* backdrop="static" so user can't dismiss during verification */}
      <KiduOtpModal
        show={showOtpModal}
        onHide={() => {
          // Allow dismiss — clears temp token so they must re-login
          setShowOtpModal(false);
          AuthService.logout();
        }}
        destination={otpDestination}
        type="email"
        digits={6}
        countdown={otpResendSeconds}
        onVerify={handleOtpVerify}
        onResend={handleOtpResend}
      />
    </div>
  );
};

export default LoginPage;