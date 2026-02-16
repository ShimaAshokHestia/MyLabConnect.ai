// import React, { useState } from "react";
// import { Modal, Button, Form, Row, Col } from "react-bootstrap";
// import { UserPlus, Eye, EyeOff } from "lucide-react";
// import "../Style/Auth.css";
// import type { RegisterRequest } from "../../Types/Auth.types";
// import AuthService from "../../Services/Auth.services";
// import toast from "react-hot-toast";

// interface Props {
//   show: boolean;
//   onClose: () => void;
//   onLogin: () => void;
// }

// interface FormData {
//   staffNo: string;
//   userName: string;
//   password: string;
//   userEmail: string;
//   phoneNumber: string;
//   address: string;
// }

// interface FormErrors {
//   staffNo?: string;
//   userName?: string;
//   password?: string;
//   userEmail?: string;
//   phoneNumber?: string;
// }

// const SignupModal: React.FC<Props> = ({ show, onClose, onLogin }) => {
//   const [formData, setFormData] = useState<FormData>({
//     staffNo: "",
//     userName: "",
//     password: "",
//     userEmail: "",
//     phoneNumber: "",
//     address: "",
//   });

//   const [errors, setErrors] = useState<FormErrors>({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     // Clear error for this field when user starts typing
//     if (errors[name as keyof FormErrors]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: undefined,
//       }));
//     }
//   };

//   const validateForm = (): boolean => {
//     const newErrors: FormErrors = {};

//     // Staff Number validation
//     if (!formData.staffNo.trim()) {
//       newErrors.staffNo = "Staff number is required";
//     } else if (!/^\d+$/.test(formData.staffNo)) {
//       newErrors.staffNo = "Staff number must contain only digits";
//     } else if (parseInt(formData.staffNo) <= 0) {
//       newErrors.staffNo = "Staff number must be a positive number";
//     }

//     // Username validation
//     if (!formData.userName.trim()) {
//       newErrors.userName = "Username is required";
//     } else if (formData.userName.trim().length < 3) {
//       newErrors.userName = "Username must be at least 3 characters";
//     } else if (!/^[a-zA-Z0-9_]+$/.test(formData.userName)) {
//       newErrors.userName = "Username can only contain letters, numbers, and underscores";
//     }

//     // Password validation
//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } 
//     // else if (formData.password.length < 6) {
//     //   newErrors.password = "Password must be at least 6 characters";
//     // } else if (!/(?=.*[a-z])/.test(formData.password)) {
//     //   newErrors.password = "Password must contain at least one lowercase letter";
//     // } else if (!/(?=.*[A-Z])/.test(formData.password)) {
//     //   newErrors.password = "Password must contain at least one uppercase letter";
//     // } else if (!/(?=.*\d)/.test(formData.password)) {
//     //   newErrors.password = "Password must contain at least one number";
//     // } else if (!/(?=.*[@$!%*?&#])/.test(formData.password)) {
//     //   newErrors.password = "Password must contain at least one special character (@$!%*?&#)";
//     // }

//     // Email validation
//     if (!formData.userEmail.trim()) {
//       newErrors.userEmail = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail)) {
//       newErrors.userEmail = "Please enter a valid email address";
//     }

//     // Phone Number validation
//     if (!formData.phoneNumber.trim()) {
//       newErrors.phoneNumber = "Phone number is required";
//     } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
//       newErrors.phoneNumber = "Phone number must be exactly 10 digits";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       toast.error("Please fix the errors in the form");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const registerData: RegisterRequest = {
//         staffNo: parseInt(formData.staffNo),
//         userName: formData.userName.trim(),
//         userEmail: formData.userEmail.trim(),
//         phoneNumber: formData.phoneNumber.trim(),
//         address: formData.address.trim() || "",
//         password: formData.password,
//       };

//       const response = await AuthService.register(registerData);
//       console.log("REGISTER RESPONSE 👉", response);


//       if (response.isSucess) {
//         toast.success(response.customMessage || "Registration successful! Please login.");
        
//         // Reset form
//         setFormData({
//           staffNo: "",
//           userName: "",
//           password: "",
//           userEmail: "",
//           phoneNumber: "",
//           address: "",
//         });
//         setErrors({});
        
//         // Close modal and redirect to login
//         setTimeout(() => {
//           onClose();
//           onLogin();
//         }, 1500);
//       } else {
//         toast.error(response.customMessage || response.error || "Registration failed");
//       }
//     } catch (error: any) {
//       console.error("Registration error:", error);
//       toast.error(error?.message || "An error occurred during registration");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword((prev) => !prev);
//   };

//   return (
//     <Modal show={show} onHide={onClose} centered className="auth-modal">
//       {/* Header Section (No Change) */}
//       <div className="auth-header">
//         <div className="auth-icon">
//           <UserPlus size={23} className="auth-icon-gold" />
//         </div>
//         <h4 className="auth-title">New User Registration</h4>
//         <p className="auth-sub">Join our community of members</p>
//       </div>

//       {/* Body Starts */}
//       <Modal.Body className="auth-body">
//         <Form onSubmit={handleSubmit}>
//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>
//                   Staff Number <span className="text-danger">*</span>
//                 </Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="staffNo"
//                   value={formData.staffNo}
//                   onChange={handleInputChange}
//                   placeholder="Enter your staff number"
//                   isInvalid={!!errors.staffNo}
//                   disabled={isSubmitting}
//                 />
//                 <Form.Control.Feedback type="invalid">
//                   {errors.staffNo}
//                 </Form.Control.Feedback>
//               </Form.Group>
//             </Col>

//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>
//                   Username <span className="text-danger">*</span>
//                 </Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="userName"
//                   value={formData.userName}
//                   onChange={handleInputChange}
//                   placeholder="Enter your username"
//                   isInvalid={!!errors.userName}
//                   disabled={isSubmitting}
//                 />
//                 <Form.Control.Feedback type="invalid">
//                   {errors.userName}
//                 </Form.Control.Feedback>
//               </Form.Group>
//             </Col>

//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>
//                   Password <span className="text-danger">*</span>
//                 </Form.Label>
//                 <div className="password-wrapper position-relative">
//                   {/* <Lock className="input-icon" /> */}
//                   <Form.Control
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     placeholder="Enter your password"
//                     isInvalid={!!errors.password}
//                     disabled={isSubmitting}
//                     style={{ paddingRight: "40px" }}
//                   />
//                   <button
//                     type="button"
//                     onClick={togglePasswordVisibility}
//                     className="password-eye"
//                     // style={{
//                     //   right: "10px",
//                     //   top: "50%",
//                     //   transform: "translateY(-50%)",
//                     //   padding: "0",
//                     //   border: "none",
//                     //   background: "none",
//                     //   cursor: "pointer",
//                     //   zIndex: 10,
//                     // }}
//                     disabled={isSubmitting}
//                   >
//                     {showPassword ? (
//                       <EyeOff size={18} className="text-muted" />
//                     ) : (
//                       <Eye size={18} className="text-muted" />
//                     )}
//                   </button>
//                   <Form.Control.Feedback type="invalid">
//                     {errors.password}
//                   </Form.Control.Feedback>
//                 </div>
//               </Form.Group>
//             </Col>

//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>
//                   Email Id <span className="text-danger">*</span>
//                 </Form.Label>
//                 {/* <div className="input-icon-wrapper">
//                   <Mail className="input-icon" /> */}
//                   <Form.Control
//                     type="email"
//                     name="userEmail"
//                     value={formData.userEmail}
//                     onChange={handleInputChange}
//                     placeholder="Enter your email"
//                     isInvalid={!!errors.userEmail}
//                     disabled={isSubmitting}
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.userEmail}
//                   </Form.Control.Feedback>
//                 {/* </div> */}
//               </Form.Group>
//             </Col>

//             <Col md={6}>
//               <Form.Group className="mb-4">
//                 <Form.Label>
//                   Phone No <span className="text-danger">*</span>
//                 </Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="phoneNumber"
//                   value={formData.phoneNumber}
//                   onChange={handleInputChange}
//                   placeholder="Enter your phone number"
//                   maxLength={10}
//                   isInvalid={!!errors.phoneNumber}
//                   disabled={isSubmitting}
//                 />
//                 <Form.Control.Feedback type="invalid">
//                   {errors.phoneNumber}
//                 </Form.Control.Feedback>
//               </Form.Group>
//             </Col>

//             <Col md={6}>
//               <Form.Group className="mb-4">
//                 <Form.Label>Address</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   rows={1}
//                   name="address"
//                   value={formData.address}
//                   onChange={handleInputChange}
//                   placeholder="Enter your address"
//                   disabled={isSubmitting}
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* Register Button (No Change) */}
//           <Button
//             type="submit"
//             className="auth-btn w-100"
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? (
//               <>
//                 <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                 Registering...
//               </>
//             ) : (
//               <>
//                 <UserPlus size={18} className="me-2" /> Register
//               </>
//             )}
//           </Button>
//         </Form>

//         {/* Footer Section (No Change) */}
//         <div className="auth-footer">
//           Already have an account?{" "}
//           <button className="auth-link" onClick={onLogin} disabled={isSubmitting}>
//             Sign in
//           </button>
//         </div>

//         <p className="auth-help">
//           Need help? Call{" "}
//           <a
//             href="tel:047124721760"
//             className="text-secondary text-decoration-none"
//           >
//             047124721760
//           </a>
//         </p>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default SignupModal;