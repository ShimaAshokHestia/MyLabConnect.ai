// // PUBLIC-PORTAL/Pages/LoginPage.tsx
// import React, { useState, type ChangeEvent, type FormEvent } from "react";
// import { Container, Card, Button, Form, Spinner } from "react-bootstrap";
// import { LogIn, Lock, Mail, Eye, EyeOff, ArrowLeft } from "lucide-react";
// import toast, { Toaster } from "react-hot-toast";
// import { useNavigate, useLocation } from "react-router-dom";
// import AuthService from "../../Services/Auth.services";
// import "../Style/Auth.css";

// interface Errors {
//   email: string;
//   password: string;
// }

// const LoginPage: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const from = location.state?.from?.pathname;

//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [errors, setErrors] = useState<Errors>({ email: "", password: "" });
//   const [submitted, setSubmitted] = useState<boolean>(false);
//   const [showPassword, setShowPassword] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [rememberMe, setRememberMe] = useState<boolean>(false);

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

//   const validateEmail = (value: string): string => {
//     if (!value) return "Email is required";
//     if (!emailRegex.test(value)) return "Please enter a valid email address";
//     return "";
//   };

//   const validatePassword = (value: string): string => {
//     if (!value) return "Password is required";
//     if (!passwordRegex.test(value))
//       return "Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char";
//     return "";
//   };

//   const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
//     const value = e.target.value;
//     setEmail(value);
//     if (submitted) setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
//   };

//   const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
//     const value = e.target.value;
//     setPassword(value);
//     if (submitted) setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
//   };

//   const handleSubmit = async (e: FormEvent): Promise<void> => {
//     e.preventDefault();
//     setSubmitted(true);
//     const emailError = validateEmail(email);
//     const passwordError = validatePassword(password);
//     setErrors({ email: emailError, password: passwordError });

//     if (!emailError && !passwordError) {
//       setIsLoading(true);
//       try {
//         const response = await AuthService.login({ email, password });
        
//         if (response.isSucess && response.value) {
//           const userRole = localStorage.getItem('user_role');
//           toast.success(userRole ? `Welcome ${userRole}!` : "Login successful!");
          
//           let dashboardRoute = AuthService.getDashboardRoute();
          
//           if (from && from !== '/login') {
//             const isStaffRoute = from.startsWith('/staff-portal');
//             const isAdminRoute = from.startsWith('/dashboard');
//             const isStaff = AuthService.isStaff();
//             const isAdmin = AuthService.isAdmin();
            
//             if (isStaff && isAdminRoute) {
//               dashboardRoute = '/staff-portal';
//             } else if (isAdmin && isStaffRoute) {
//               dashboardRoute = '/dashboard';
//             } else if ((isStaff && isStaffRoute) || (isAdmin && isAdminRoute)) {
//               dashboardRoute = from;
//             }
//           }
          
//           setTimeout(() => {
//             navigate(dashboardRoute, { replace: true });
//           }, 1000);
//         } else {
//           toast.error(response.error || "Login failed.");
//         }
//       } catch (error: any) {
//         toast.error(error?.response?.data?.customMessage || "An error occurred during login.");
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   return (
//     <>
//       <Toaster position="top-right" />
//       <div className="auth-page-wrapper" style={{
//         minHeight: '100vh',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//         padding: '20px'
//       }}>
//         <Container>
//           <div style={{ maxWidth: '450px', margin: '0 auto' }}>
//             <Button 
//               variant="link" 
//               className="mb-3 text-white"
//               onClick={() => navigate('/')}
//               style={{ textDecoration: 'none' }}
//             >
//               <ArrowLeft size={18} className="me-2" />
//               Back to Home
//             </Button>

//             <Card className="shadow-lg">
//               <Card.Body className="p-4">
//                 <div className="auth-header text-center mb-4">
//                   <div className="auth-icon mb-3">
//                     <LogIn size={40} style={{ color: '#667eea' }} />
//                   </div>
//                   <h3 className="mb-2">Welcome Back</h3>
//                   <p className="text-muted">Sign in to access your Digital Command Center</p>
//                 </div>

//                 <Form onSubmit={handleSubmit}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Email Address</Form.Label>
//                     <div className="input-icon-wrapper">
//                       <Mail className="input-icon" size={18} />
//                       <Form.Control 
//                         type="email" 
//                         placeholder="Enter your email"
//                         value={email}
//                         onChange={handleEmailChange}
//                         isInvalid={submitted && !!errors.email}
//                         disabled={isLoading}
//                       />
//                       {submitted && errors.email && (
//                         <Form.Control.Feedback type="invalid">
//                           {errors.email}
//                         </Form.Control.Feedback>
//                       )}
//                     </div>
//                   </Form.Group>

//                   <Form.Group className="mb-2">
//                     <Form.Label>Password</Form.Label>
//                     <div className="input-icon-wrapper">
//                       <Lock className="input-icon" size={18} />
//                       <Form.Control 
//                         type={showPassword ? "text" : "password"}
//                         placeholder="Enter your password"
//                         value={password}
//                         onChange={handlePasswordChange}
//                         isInvalid={submitted && !!errors.password}
//                         disabled={isLoading}
//                         style={{ paddingRight: '45px' }}
//                       />
//                       <button
//                         type="button"
//                         onClick={() => !isLoading && setShowPassword(!showPassword)}
//                         disabled={isLoading}
//                         style={{
//                           position: 'absolute',
//                           right: '12px',
//                           top: '50%',
//                           transform: 'translateY(-50%)',
//                           background: 'none',
//                           border: 'none',
//                           cursor: isLoading ? 'not-allowed' : 'pointer',
//                           padding: '4px',
//                           opacity: isLoading ? 0.3 : 0.5,
//                         }}
//                       >
//                         {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                       </button>
//                       {submitted && errors.password && (
//                         <Form.Control.Feedback type="invalid">
//                           {errors.password}
//                         </Form.Control.Feedback>
//                       )}
//                     </div>
//                   </Form.Group>

//                   <div className="d-flex justify-content-between align-items-center mb-3">
//                     <Form.Check 
//                       type="checkbox" 
//                       label="Remember me"
//                       checked={rememberMe}
//                       onChange={(e) => setRememberMe(e.target.checked)}
//                       disabled={isLoading}
//                     />
//                     <Button
//                       variant="link"
//                       className="p-0"
//                       onClick={() => navigate('/forgot-password')}
//                       disabled={isLoading}
//                       style={{ fontSize: '0.9rem' }}
//                     >
//                       Forgot Password?
//                     </Button>
//                   </div>

//                   <Button 
//                     className="w-100" 
//                     type="submit"
//                     disabled={isLoading}
//                     style={{
//                       background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                       border: 'none'
//                     }}
//                   >
//                     {isLoading ? (
//                       <>
//                         <Spinner as="span" animation="border" size="sm" className="me-2" />
//                         Verifying...
//                       </>
//                     ) : (
//                       <>
//                         <LogIn size={18} className="me-2" /> Sign In
//                       </>
//                     )}
//                   </Button>
//                 </Form>

//                 <div className="text-center mt-3">
//                   <p className="mb-0">
//                     Not a member yet?{" "}
//                     <Button
//                       variant="link"
//                       className="p-0"
//                       onClick={() => navigate('/signup')}
//                       disabled={isLoading}
//                     >
//                       Create an account
//                     </Button>
//                   </p>
//                 </div>

//                 <p className="text-center text-muted mt-3 mb-0" style={{ fontSize: '0.9rem' }}>
//                   Need help? Call <a href="tel:04442035575">044-42035575</a>
//                 </p>
//               </Card.Body>
//             </Card>
//           </div>
//         </Container>
//       </div>
//     </>
//   );
// };

// export default LoginPage;