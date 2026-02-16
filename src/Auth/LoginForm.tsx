// src/components/LoginForm.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, InputGroup, Spinner } from "react-bootstrap";
import { Eye, EyeOff } from "lucide-react";
import "../Styles/Auth/LoginForm.css";
import { FaLock, FaUser } from "react-icons/fa";

interface LoginFormProps {
    onForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate login
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setIsLoading(false);
        navigate("/dsoadmin-connect");
    };

    return (
        <Form onSubmit={handleSubmit} className="login-form">

            {/* ================= USERNAME ================= */}
            <Form.Group className="mb-4">
                <Form.Label
                    className={`form-label-custom ${focusedField === "username" ? "focused" : ""
                        }`}
                >
                    Username
                </Form.Label>

                <InputGroup>
                    <InputGroup.Text className="input-icon">
                        <FaUser/>
                    </InputGroup.Text>

                    <Form.Control
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onFocus={() => setFocusedField("username")}
                        onBlur={() => setFocusedField(null)}
                        className="form-control-custom"
                        required
                    />
                </InputGroup>
            </Form.Group>

            {/* ================= PASSWORD ================= */}
            <Form.Group className="mb-3">
                <Form.Label
                    className={`form-label-custom ${focusedField === "password" ? "focused" : ""
                        }`}
                >
                    Password
                </Form.Label>

                <InputGroup>
                    <InputGroup.Text className="input-icon">
                        <FaLock />
                    </InputGroup.Text>

                    <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField(null)}
                        className="form-control-custom"
                        required
                    />

                    <Button
                        variant="outline-secondary"
                        className="password-toggle-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        type="button"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                </InputGroup>
            </Form.Group>

            {/* ================= FORGOT PASSWORD ================= */}
            <div className="text-end mb-4">
                <button
                    type="button"
                    onClick={onForgotPassword}
                    className="forgot-password-btn"
                >
                    Forgot Password?
                </button>
            </div>

            {/* ================= SUBMIT ================= */}
            <Button
                type="submit"
                disabled={isLoading}
                className="login-submit-btn w-100"
            >
                {!isLoading ? (
                    <>
                        Sign In
                    </>
                ) : (
                    <Spinner animation="border" size="sm" />
                )}
            </Button>

            {/* ================= ROLE INFO ================= */}
            <p className="text-center mt-3 role-info">
                Access for Admin, DSO, Doctors & Labs
            </p>
        </Form>
    );
};

export default LoginForm;
