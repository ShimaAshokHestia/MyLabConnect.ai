// // ResetPasswordModal.tsx
// import React, { useState } from "react";
// import { Modal, Button, Form, Spinner } from "react-bootstrap";
// import { ArrowLeft, KeyRound, Mail } from "lucide-react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "../Style/Auth.css";
// import AuthService from "../../Services/Auth.services";

// interface Props {
//   show: boolean;
//   onClose: () => void;
//   onLogin: () => void;
// }

// const ForgotPasswordModal: React.FC<Props> = ({ show, onClose, onLogin }) => {
//   const [email, setEmail] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // ✅ Email validation
//   const isValidEmail = (value: string) =>
//     /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

//   // ✅ Send reset link
//   const handleForgotPassword = async () => {
//     setError("");

//     if (!email.trim()) {
//       setError("Email address is required");
//       return;
//     }

//     if (!isValidEmail(email)) {
//       setError("Please enter a valid email address");
//       return;
//     }

//     try {
//       setLoading(true);

//       const response = await AuthService.forgotPassword({ email });

//       if (response.isSucess) {
//         toast.success("Reset link sent to your email", {
//           position: "top-right",
//           autoClose: 2500,
//           hideProgressBar: true,
//         });

//         // Optional UX improvement
//         setEmail("");
//       } else {
//         setError(
//           response.customMessage ||
//             response.error ||
//             "Failed to send reset link"
//         );
//       }
//     } catch (err) {
//       console.error("Forgot password error:", err);
//       setError("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal show={show} onHide={onClose} centered className="auth-modal">
//       <div className="auth-header">
//         <div className="auth-icon">
//           <KeyRound size={32} className="auth-icon-gold" />
//         </div>
//         <h4 className="auth-title">Reset Password</h4>
//         <p className="auth-sub">We'll send you a reset link</p>
//       </div>

//       <Modal.Body className="auth-body">
//         <button
//           className="back-link"
//           onClick={onLogin}
//           disabled={loading}
//         >
//           <ArrowLeft size={16} /> Back to login
//         </button>

//         <Form className="mt-3" onSubmit={(e) => e.preventDefault()}>
//           <Form.Group className="mb-3">
//             <Form.Label>Email Address</Form.Label>
//             <div className="input-icon-wrapper">
//               <Mail className="input-icon" />
//               <Form.Control
//                 type="email"
//                 placeholder="Enter your email"
//                 value={email}
//                 disabled={loading}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>
//           </Form.Group>

//           {/* ❌ Error message */}
//           {error && <div className="text-danger mb-3">{error}</div>}

//           <Button
//             className="auth-btn w-100"
//             onClick={handleForgotPassword}
//             disabled={loading}
//           >
//             {loading ? (
//               <>
//                 <Spinner
//                   as="span"
//                   animation="border"
//                   size="sm"
//                   className="me-2"
//                 />
//                 Sending...
//               </>
//             ) : (
//               <>
//                 <Mail className="me-2" size={18} />
//                 Send Reset Link
//               </>
//             )}
//           </Button>
//         </Form>

//         <div className="auth-footer">
//           Remember your password?{" "}
//           <button
//             className="auth-link"
//             onClick={onLogin}
//             disabled={loading}
//           >
//             Sign in
//           </button>
//         </div>

//         <p className="auth-help">
//           Need help? Call <a href="tel:04442035575"> 047124721760</a>
//         </p>
//       </Modal.Body>

//       {/* ✅ Toast container */}
//       <ToastContainer />
//     </Modal>
//   );
// };

// export default ForgotPasswordModal;
