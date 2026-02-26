import React, { useState, useCallback } from 'react';
import { Modal, Button } from 'react-bootstrap';
import KiduValidation from './KiduValidation';
import '../Styles/KiduStyles/ForgotPassword.css';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface ForgotPasswordProps {
    show: boolean;
    onHide: () => void;
    /** Called with { username, email } on submit — implement your API call here */
    onSubmit?: (data: { username: string; email: string }) => Promise<void> | void;
}

interface Fields {
    username: string;
    email: string;
}

interface FieldErrors {
    username: string;
    email: string;
}

// ─────────────────────────────────────────────
// SVG Icons
// ─────────────────────────────────────────────

const QuestionIcon = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);

const UserIcon = () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const MailIcon = () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

const SendIcon = () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
);

const SupportIcon = () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M3 18v-6a9 9 0 0118 0v6" />
        <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

const ErrorIcon = () => (
    <svg width="11" height="11" fill="#ef4444" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ show, onHide, onSubmit }) => {
    const [fields, setFields] = useState<Fields>({ username: '', email: '' });
    const [errors, setErrors] = useState<FieldErrors>({ username: '', email: '' });
    const [submitting, setSubmitting] = useState(false);
    const [showSupport, setShowSupport] = useState(false);
    const [success, setSuccess] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    // Reset all state on close
    const handleHide = () => {
        setFields({ username: '', email: '' });
        setErrors({ username: '', email: '' });
        setSubmitting(false);
        setShowSupport(false);
        setSuccess(false);
        setSuccessMsg('');
        onHide();
    };

    const handleChange = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setFields(p => ({ ...p, [key]: val }));
        if (errors[key]) setErrors(p => ({ ...p, [key]: '' }));
    };

    const validate = useCallback((): boolean => {
        const e: FieldErrors = { username: '', email: '' };
        const r1 = KiduValidation.validate(fields.username, { type: 'text', required: true, label: 'Username' });
        if (!r1.isValid) e.username = r1.message ?? '';
        const r2 = KiduValidation.validate(fields.email, { type: 'email', required: true, label: 'Email' });
        if (!r2.isValid) e.email = r2.message ?? '';
        setErrors(e);
        return !e.username && !e.email;
    }, [fields]);

    const handleSubmit = async () => {
        if (!validate()) return;
        setSubmitting(true);
        try {
            await onSubmit?.({ username: fields.username, email: fields.email });
            setSuccessMsg(
                `If an account exists for "${fields.username}", a reset link has been sent to ${fields.email}.`
            );
            setSuccess(true);
        } catch (err: any) {
            setErrors(p => ({ ...p, email: err?.message || 'Something went wrong. Please try again.' }));
        } finally {
            setSubmitting(false);
        }
    };

    // ── Render ──
    return (
        <Modal
            show={show}
            onHide={handleHide}
            centered
            backdrop="static"
            keyboard={false}
            contentClassName="fp-modal-content"
            dialogClassName="fp-modal-dialog"
        >
            {/* Header — always visible */}
            <Modal.Header className="fp-header" closeButton={false}>
                <div className="fp-icon-wrap"><QuestionIcon /></div>
                <div style={{ flex: 1 }}>
                    <Modal.Title className="fp-title">Forgot Password</Modal.Title>
                    <div className="fp-subtitle">Enter your username and email to receive a reset link</div>
                </div>
                <Button variant="link" className="fp-close-btn" onClick={handleHide} aria-label="Close">
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                </Button>
            </Modal.Header>

            {/* SUCCESS STATE */}
            {success ? (
                <div className="fp-success-panel">
                    <div className="fp-success-icon"><CheckCircleIcon /></div>
                    <div className="fp-success-title">Check your inbox!</div>
                    <div className="fp-success-sub">{successMsg}</div>
                    <Button className="fp-back-btn" onClick={handleHide}>← Back</Button>
                </div>
            ) : (
                <>
                    {/* FORM STATE */}
                    <Modal.Body className="fp-body">
                        {/* Username */}
                        <div className="fp-field">
                            <label className="fp-label">Username</label>
                            <div className="fp-input-wrap">
                                <span className="fp-input-icon"><UserIcon /></span>
                                <input
                                    type="text"
                                    className={`fp-input${errors.username ? ' is-invalid' : ''}`}
                                    placeholder="Enter your username"
                                    value={fields.username}
                                    onChange={handleChange('username')}
                                    autoComplete="username"
                                />
                            </div>
                            {errors.username && <div className="fp-error-text"><ErrorIcon />{errors.username}</div>}
                        </div>

                        {/* Email */}
                        <div className="fp-field">
                            <label className="fp-label">Email ID</label>
                            <div className="fp-input-wrap">
                                <span className="fp-input-icon"><MailIcon /></span>
                                <input
                                    type="email"
                                    className={`fp-input${errors.email ? ' is-invalid' : ''}`}
                                    placeholder="Enter your email address"
                                    value={fields.email}
                                    onChange={handleChange('email')}
                                    autoComplete="email"
                                />
                            </div>
                            {errors.email && <div className="fp-error-text"><ErrorIcon />{errors.email}</div>}
                        </div>

                        {/* Actions */}
                        <div className="fp-actions">
                            <Button
                                className="fp-submit-btn"
                                onClick={handleSubmit}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                        Sending…
                                    </>
                                ) : (
                                    <>
                                        <SendIcon />
                                        Reset
                                    </>
                                )}
                            </Button>

                            <button className="fp-contact-link" onClick={() => setShowSupport(p => !p)} type="button">
                                <SupportIcon />
                                Contact Us
                            </button>
                        </div>
                    </Modal.Body>

                    {/* Support email — slides in */}
                    {showSupport && (
                        <div className="fp-support-panel">
                            <div className="fp-support-icon">
                                <MailIcon />
                            </div>
                            <div>
                                <div className="fp-support-label">Support email</div>
                                <a className="fp-support-email" href="mailto:support@mylabconnect.co.uk">
                                    support@mylabconnect.co.uk
                                </a>
                            </div>
                        </div>
                    )}
                </>
            )}
        </Modal>
    );
};

export default ForgotPassword;