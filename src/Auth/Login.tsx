// src/pages/Login.tsx

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./Login.css";

import carousel1 from "@/assets/login-carousel-1.jpg";
import carousel2 from "@/assets/login-carousel-2.jpg";
import carousel3 from "@/assets/login-carousel-3.jpg";
import carousel4 from "@/assets/login-carousel-4.jpg";
import carousel5 from "@/assets/login-carousel-5.jpg";

const carouselImages: string[] = [
  carousel1,
  carousel2,
  carousel3,
  carousel4,
  carousel5,
];

const Login: React.FC = () => {
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="login-wrapper">
      <Container fluid className="p-0">
        <Row className="g-0 min-vh-100">

          {/* ================= LEFT SIDE - CAROUSEL ================= */}
          <Col lg={6} className="d-none d-lg-flex position-relative login-carousel">
            
            {carouselImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Dental slide ${index + 1}`}
                className={`carousel-image ${
                  index === currentSlide ? "active" : ""
                }`}
              />
            ))}

            {/* Overlay */}
            <div className="carousel-overlay" />

            {/* Logo */}
            <div className="carousel-logo animate-fade-in">
              <MYDLogo />
            </div>

            {/* Indicators */}
            <div className="carousel-indicators-custom">
              {carouselImages.map((_, index) => (
                <Button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`indicator ${
                    index === currentSlide ? "active" : ""
                  }`}
                />
              ))}
            </div>
          </Col>

          {/* ================= RIGHT SIDE - FORM ================= */}
          <Col
            lg={6}
            className="d-flex align-items-center justify-content-center login-form-section"
          >
            <div className="login-form-container animate-fade-in">

              {/* Mobile Logo */}
              <div className="d-lg-none text-center mb-4">
                <MYDLogo />
              </div>

              {/* Theme Toggle */}
              <div className="theme-toggle-wrapper">
                <ThemeToggle />
              </div>

              {/* Welcome Text */}
              <div className="mb-4">
                <h2 className="login-title">Welcome Back</h2>
                <p className="login-subtitle">
                  Sign in to access your portal
                </p>
              </div>

              {/* Login Form */}
              <LoginForm
                onForgotPassword={() => setShowForgotPassword(true)}
              />

              {/* Footer */}
              <p className="login-footer text-center mt-4">
                © 2024 {"{my}"}labconnect.ai – Dental Care Platform.
                All rights reserved.
              </p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        open={showForgotPassword}
        onOpenChange={setShowForgotPassword}
      />
    </div>
  );
};

export default Login;
