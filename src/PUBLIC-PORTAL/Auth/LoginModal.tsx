// PUBLIC-PORTAL/Auth/LoginModal.tsx
import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { LogIn, Lock, Mail, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AuthService from "../../Services/Auth.services";

// Define the interface for LoginModal props
export interface LoginModalProps {
  show: boolean;
  onClose: () => void;
  onSignup: () => void;
  onForgot: () => void;
}

interface Errors {
  userName: string;
  password: string;
}

const LoginModal: React.FC<LoginModalProps> = ({ show, onClose, onSignup, onForgot }) => {
  const navigate = useNavigate();
  
 const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({ userName: "", password: "" });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  
  // ONLY REQUIRED VALIDATION
  const validateUserName = (value: string): string => {
    if (!value) return "Username is required";
    return "";
  };

  const validatePassword = (value: string): string => {
    if (!value) return "Password is required";
    return "";
  };

  const handleUserNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setUserName(value);
    if (submitted) {
      setErrors((prev) => ({ ...prev, userName: validateUserName(value) }));
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setPassword(value);
    if (submitted) {
      setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    }
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setSubmitted(true);
   const userNameError = validateUserName(userName);
    const passwordError = validatePassword(password);

     setErrors({ userName: userNameError, password: passwordError });

   if (!userNameError && !passwordError) {
      setIsLoading(true);
      try {
        const response = await AuthService.login({ userName, password });
        
        if (response.isSucess && response.value) {
          // Verify user role is valid
          const userRole = localStorage.getItem('user_role');
          
          if (!userRole) {
            toast.error("Invalid user credentials. Please contact administrator.");
            AuthService.logout();
            setIsLoading(false);
            return;
          }

          toast.success(`Welcome ${response.value.user.userName}!`);
          
          const dashboardRoute = AuthService.getDashboardRoute();
          
          // If dashboard route is login, it means invalid role
          if (dashboardRoute === '/login') {
            toast.error("Invalid user role. Please contact administrator.");
            AuthService.logout();
            setIsLoading(false);
            return;
          }
          
          setTimeout(() => {
            onClose(); // Close modal
            navigate(dashboardRoute, { replace: true });
          }, 1000);
        } else {
          toast.error(response.error || response.customMessage || "Login failed.");
        }
      } catch (error: any) {
        console.error('Login error:', error);
        toast.error(error?.response?.data?.customMessage || "An error occurred during login.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Reset form when modal closes
  const handleClose = () => {
    setUserName("");
    setPassword("");
   setErrors({ userName: "", password: "" });
    setSubmitted(false);
    setShowPassword(false);
    setRememberMe(false);
    onClose();
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose}
      centered 
      className="auth-modal"
    >
      <div className="auth-header">
        <div className="auth-icon">
          <LogIn size={23} className="auth-icon-gold" />
        </div>
        <h4 className="auth-title">Welcome Back</h4>
        <p className="auth-sub">Sign in to access your Digital Command Center</p>
      </div>
      <Modal.Body className="auth-body">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label>Username <span className="text-danger">*</span></Form.Label>
            <div className="input-icon-wrapper">
              <Mail className="input-icon" size={18} />
              <Form.Control 
                type="text" 
                placeholder="Enter your username"
                value={userName}
                onChange={handleUserNameChange}
                isInvalid={submitted && !!errors.userName}
                disabled={isLoading}
              />
              {submitted && errors.userName && (
                <Form.Control.Feedback type="invalid">
                  {errors.userName}
                </Form.Control.Feedback>
              )}
            </div>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Password <span className="text-danger">*</span></Form.Label>
            <div className="input-icon-wrapper">
              <Lock className="input-icon" size={18} />
              <Form.Control 
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                isInvalid={submitted && !!errors.password}
                disabled={isLoading}
                style={{ paddingRight: '45px' }}
              />
              <button
                type="button"
                onClick={() => !isLoading && setShowPassword(!showPassword)}
                disabled={isLoading}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  padding: '4px',
                  opacity: isLoading ? 0.3 : 0.5,
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {submitted && errors.password && (
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              )}
            </div>
          </Form.Group>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <Form.Check 
              type="checkbox" 
              label="Remember me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
            />
            <button 
              className="auth-link" 
              type="button" 
              onClick={onForgot}
              disabled={isLoading}
            >
              Forgot Password?
            </button>
          </div>

          <Button 
            className="auth-btn w-100" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Verifying...
              </>
            ) : (
              <>
                <LogIn size={18} className="me-2" /> Sign In
              </>
            )}
          </Button>
        </Form>

        <div className="auth-footer">
          Not a member yet?{" "}
          <button 
            className="auth-link" 
            onClick={onSignup}
            disabled={isLoading}
          >
           Register here
          </button>
        </div>

        <p className="auth-help">
          Need help? Call <a href="tel:04442035575" className="text-secondary text-decoration-none">047124721760</a>
        </p>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;