import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../Styles/KiduStyles/OTPModal.css';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface OtpModalProps {
    show: boolean;
    onHide: () => void;
    /** Where the OTP was sent — shown in the subtitle */
    destination: string;
    /** 'email' | 'phone' — controls icon and label */
    type?: 'email' | 'phone';
    /** Number of OTP digits (default: 6) */
    digits?: number;
    /** Countdown seconds (default: 60) */
    countdown?: number;
    /** Called with the joined OTP string on verify */
    onVerify: (otp: string) => Promise<void> | void;
    /** Called when the user clicks "Resend" */
    onResend?: () => Promise<void> | void;
    /** Called when user clicks "Change" link */
    onChangeDestination?: () => void;
}

// ─────────────────────────────────────────────
// SVG Icons
// ─────────────────────────────────────────────

const ShieldIcon = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const MailIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

const PhoneIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.02 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.06 6.06l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
);

const CheckIcon = () => (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const ErrorIcon = () => (
    <svg width="11" height="11" fill="#ef4444" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

const RefreshIcon = () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
    </svg>
);

// ─────────────────────────────────────────────
// Timer ring constants
// ─────────────────────────────────────────────

const RADIUS = 20;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

const OtpModal: React.FC<OtpModalProps> = ({
    show,
    onHide,
    destination,
    type = 'email',
    digits = 6,
    countdown = 60,
    onVerify,
    onResend,
    onChangeDestination,
}) => {
    const [values, setValues] = useState<string[]>(Array(digits).fill(''));
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [resending, setResending] = useState(false);
    const [success, setSuccess] = useState(false);
    const [timeLeft, setTimeLeft] = useState(countdown);
    const [digitState, setDigitState] = useState<'idle' | 'error' | 'success'>('idle');

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // ── Reset when modal opens ──
    useEffect(() => {
        if (show) {
            setValues(Array(digits).fill(''));
            setError('');
            setSuccess(false);
            setSubmitting(false);
            setResending(false);
            setDigitState('idle');
            startTimer();
            // Focus first box after transition
            setTimeout(() => inputRefs.current[0]?.focus(), 200);
        }
        return () => stopTimer();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    // ── Timer ──
    const startTimer = useCallback(() => {
        stopTimer();
        setTimeLeft(countdown);
        timerRef.current = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) { stopTimer(); return 0; }
                return t - 1;
            });
        }, 1000);
    }, [countdown]);

    const stopTimer = () => {
        if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    };

    // ── Digit input handlers ──
    const handleChange = (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, '');
        if (!raw) { updateValue(idx, ''); return; }

        // Handle paste of full OTP
        if (raw.length > 1) {
            const pasted = raw.slice(0, digits).split('');
            const next = [...values];
            pasted.forEach((ch, i) => { if (idx + i < digits) next[idx + i] = ch; });
            setValues(next);
            setError('');
            setDigitState('idle');
            const focusIdx = Math.min(idx + pasted.length, digits - 1);
            inputRefs.current[focusIdx]?.focus();
            return;
        }

        updateValue(idx, raw);
        if (idx < digits - 1) inputRefs.current[idx + 1]?.focus();
    };

    const updateValue = (idx: number, val: string) => {
        setValues(p => { const n = [...p]; n[idx] = val; return n; });
        setError('');
        setDigitState('idle');
    };

    const handleKeyDown = (idx: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !values[idx] && idx > 0) {
            inputRefs.current[idx - 1]?.focus();
            updateValue(idx - 1, '');
        }
        if (e.key === 'ArrowLeft' && idx > 0) inputRefs.current[idx - 1]?.focus();
        if (e.key === 'ArrowRight' && idx < digits - 1) inputRefs.current[idx + 1]?.focus();
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, digits);
        if (!pasted) return;
        const next = [...Array(digits).fill('')];
        pasted.split('').forEach((ch, i) => { next[i] = ch; });
        setValues(next);
        setError('');
        setDigitState('idle');
        inputRefs.current[Math.min(pasted.length, digits - 1)]?.focus();
    };

    // ── Verify ──
    const handleVerify = async () => {
        const otp = values.join('');
        if (otp.length < digits) {
            setError(`Please enter all ${digits} digits`);
            setDigitState('error');
            inputRefs.current[values.findIndex(v => !v)]?.focus();
            return;
        }
        setSubmitting(true);
        setError('');
        try {
            await onVerify(otp);
            setDigitState('success');
            setSuccess(true);
            stopTimer();
        } catch (err: any) {
            setError(err?.message || 'Invalid OTP. Please try again.');
            setDigitState('error');
            // Clear inputs and refocus
            setTimeout(() => {
                setValues(Array(digits).fill(''));
                setDigitState('idle');
                inputRefs.current[0]?.focus();
            }, 900);
        } finally {
            setSubmitting(false);
        }
    };

    // ── Resend ──
    const handleResend = async () => {
        if (timeLeft > 0 || resending) return;
        setResending(true);
        setError('');
        setValues(Array(digits).fill(''));
        setDigitState('idle');
        try {
            await onResend?.();
            startTimer();
            inputRefs.current[0]?.focus();
        } catch {
            setError('Failed to resend OTP. Please try again.');
        } finally {
            setResending(false);
        }
    };

    // ── Timer ring arc ──
    const progress = timeLeft / countdown;
    const dashOffset = CIRCUMFERENCE * (1 - progress);
    const timerColor = timeLeft <= 10 ? '#ef4444' : timeLeft <= 20 ? '#f59e0b' : undefined;

    const digitClass = (idx: number) => {
        let cls = 'otp-digit';
        if (digitState === 'error') cls += ' error';
        else if (digitState === 'success') cls += ' success';
        else if (values[idx]) cls += ' filled';
        return cls;
    };

    const otp = values.join('');

    // ── Render ──
    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            backdrop="static"
            keyboard={false}
            contentClassName="otp-modal-content"
            dialogClassName="otp-modal-dialog"
        >
            {/* Header */}
            <Modal.Header className="otp-header" closeButton={false}>
                <div className="otp-icon-wrap"><ShieldIcon /></div>
                <div style={{ flex: 1 }}>
                    <Modal.Title className="otp-title">Verify Your Identity</Modal.Title>
                    <div className="otp-subtitle">
                        We sent a {digits}-digit code to&nbsp;
                        <strong>{destination}</strong>
                    </div>
                </div>
                <Button variant="link" className="otp-close-btn" onClick={onHide} aria-label="Close">
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                </Button>
            </Modal.Header>

            <Modal.Body className="otp-body">
                {success ? (
                    /* ── Success state ── */
                    <div className="otp-success">
                        <div className="otp-success-ring"><CheckIcon /></div>
                        <div className="otp-success-title">Verified Successfully!</div>
                        <div className="otp-success-sub">Your identity has been confirmed.<br />You're all set to continue.</div>
                        <div className="otp-success-chip">
                            {type === 'email' ? <MailIcon /> : <PhoneIcon />}
                            {destination}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* ── OTP inputs ── */}
                        <div className="otp-inputs" onPaste={handlePaste}>
                            {values.map((val, idx) => (
                                <React.Fragment key={idx}>
                                    {/* Separator after 3rd digit for 6-digit OTP */}
                                    {digits === 6 && idx === 3 && <div className="otp-sep" />}
                                    <input
                                        ref={el => { inputRefs.current[idx] = el; }}
                                        className={digitClass(idx)}
                                        type="tel"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={val}
                                        onChange={handleChange(idx)}
                                        onKeyDown={handleKeyDown(idx)}
                                        aria-label={`OTP digit ${idx + 1}`}
                                        autoComplete={idx === 0 ? 'one-time-code' : 'off'}
                                        disabled={submitting || success}
                                    />
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="otp-error">
                                <ErrorIcon />
                                {error}
                            </div>
                        )}

                        {/* Timer ring */}
                        <div className="otp-timer-wrap">
                            <div className="otp-timer-ring">
                                <svg width="52" height="52" viewBox="0 0 52 52">
                                    <defs>
                                        <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor={timerColor || 'var(--theme-primary)'} />
                                            <stop offset="100%" stopColor={timerColor || '#eb3a70'} />
                                        </linearGradient>
                                    </defs>
                                    <circle className="otp-timer-bg" cx="26" cy="26" r={RADIUS} />
                                    <circle
                                        className="otp-timer-arc"
                                        cx="26"
                                        cy="26"
                                        r={RADIUS}
                                        strokeDasharray={CIRCUMFERENCE}
                                        strokeDashoffset={dashOffset}
                                        style={{ stroke: timerColor ? timerColor : 'url(#timerGrad)' }}
                                    />
                                </svg>
                                <div className={`otp-timer-text${timeLeft === 0 ? ' expired' : ''}`}>
                                    {timeLeft === 0 ? 'Done' : `${timeLeft}s`}
                                </div>
                            </div>
                            <div className="otp-timer-label">
                                {timeLeft > 0 ? 'Code expires in' : 'Code expired'}
                            </div>
                        </div>

                        {/* Resend row */}
                        <div className="otp-resend-row">
                            Didn't receive it?&nbsp;
                            <button
                                className="otp-resend-btn"
                                onClick={handleResend}
                                disabled={timeLeft > 0 || resending}
                                type="button"
                            >
                                {resending ? (
                                    <><span className="spinner-border spinner-border-sm" style={{ width: '10px', height: '10px', marginRight: 4 }} />Resending…</>
                                ) : (
                                    <><span style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }}>
                                        <RefreshIcon />
                                    </span>Resend OTP</>
                                )}
                            </button>
                        </div>

                        {/* Change destination */}
                        {onChangeDestination && (
                            <div className="otp-change-hint">
                                Wrong {type === 'email' ? 'email' : 'number'}?&nbsp;
                                <button onClick={onChangeDestination} type="button">Change {type === 'email' ? 'email' : 'number'}</button>
                            </div>
                        )}

                        {/* Verify button */}
                        <Button
                            className="otp-verify-btn"
                            onClick={handleVerify}
                            disabled={submitting || otp.length < digits}
                        >
                            {submitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                    Verifying…
                                </>
                            ) : (
                                <>
                                    <ShieldIcon />
                                    Verify OTP
                                </>
                            )}
                        </Button>
                    </>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default OtpModal;