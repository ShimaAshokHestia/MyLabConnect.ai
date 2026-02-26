import React, {
    useState,
    useRef,
    useEffect,
    useCallback,
    type KeyboardEvent,
} from 'react';
import '../Styles/KiduStyles/QuickChatModal.css';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface ChatMessage {
    id: string;
    sender: 'lab' | 'doc';
    senderLabel: string;
    text: string;
    time: string;
}

export interface QuickChatModalProps {
    /** Controls visibility */
    show: boolean;
    /** Called when the user closes the modal */
    onHide: () => void;
    /** Patient / case full name displayed in the header */
    patientName: string;
    /** Case ID shown below the name, e.g. "MLCLS700831" */
    caseId: string;
    /** Pre-loaded message history */
    messages?: ChatMessage[];
    /**
     * Called when the user hits Send / Enter.
     * Return a promise if you need async (e.g. API call).
     */
    onSend?: (text: string) => Promise<void> | void;
    /** Label for the online status dot (default: "Lab online") */
    onlineLabel?: string;
    /**
     * When true, the message input and send button are hidden,
     * making the modal a read-only chat viewer.
     * @default false
     */
    disableInput?: boolean;
}

// ─────────────────────────────────────────────
// SVG icons
// ─────────────────────────────────────────────

const BackIcon = () => (
    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
);

const CloseIcon = () => (
    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18 6 6 18M6 6l12 12" />
    </svg>
);

const SendIcon = () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
);

// ─────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────

function nowTime(): string {
    return new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

// ─────────────────────────────────────────────
// Default seed messages
// ─────────────────────────────────────────────

const DEFAULT_MESSAGES: ChatMessage[] = [
    {
        id: 'msg-seed-1',
        sender: 'lab',
        senderLabel: 'Lab',
        text: 'Shade missing, kindly let me know the shade details for manufacturing.',
        time: '09:14',
    },
];

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

const QuickChatModal: React.FC<QuickChatModalProps> = ({
    show,
    onHide,
    patientName,
    caseId,
    messages: externalMessages,
    onSend,
    onlineLabel = 'Lab online',
    disableInput = false,
}) => {
    const [messages, setMessages] = useState<ChatMessage[]>(
        externalMessages ?? DEFAULT_MESSAGES
    );
    const [inputValue, setInputValue] = useState('');
    const [sending, setSending] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // ── Sync external messages ──
    useEffect(() => {
        if (externalMessages) setMessages(externalMessages);
    }, [externalMessages]);

    // ── Auto-scroll ──
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // ── Focus input on open (only when input is enabled) ──
    useEffect(() => {
        if (show && !disableInput) {
            const t = setTimeout(() => inputRef.current?.focus(), 320);
            return () => clearTimeout(t);
        }
    }, [show, disableInput]);

    // ── Send ──
    const handleSend = async () => {
        const text = inputValue.trim();
        if (!text || sending || disableInput) return;

        const outgoing: ChatMessage = {
            id: `msg-${Date.now()}`,
            sender: 'doc',
            senderLabel: 'You',
            text,
            time: nowTime(),
        };

        setMessages((prev) => [...prev, outgoing]);
        setInputValue('');
        setSending(true);

        try {
            await onSend?.(text);
        } catch (err) {
            console.error('QuickChatModal send error:', err);
        } finally {
            setSending(false);
        }
    };

    // ── Enter to send (Shift+Enter = newline) ──
    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // ── Auto-resize textarea ──
    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
        const el = e.target;
        el.style.height = 'auto';
        el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
    };

    return (
        <div
            className={`qc-overlay${show ? ' active' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label={`Chat — ${patientName}`}
            onClick={(e) => {
                if (e.target === e.currentTarget) onHide();
            }}
        >
            <div className={`qc-modal${show ? ' open' : ''}`}>

                {/* ── Header ── */}
                <div className="qc-header">
                    <button
                        className="qc-back-btn"
                        onClick={onHide}
                        aria-label="Go back"
                        type="button"
                    >
                        <BackIcon />
                    </button>

                    <div className="qc-info">
                        <div className="qc-name">{patientName}</div>
                        <div className="qc-case-id">{caseId}</div>
                        <div className="qc-online-row">
                            <div className="qc-online-dot" aria-hidden="true" />
                            <span className="qc-online-text">{onlineLabel}</span>
                        </div>
                    </div>

                    <button
                        className="qc-close-btn"
                        onClick={onHide}
                        aria-label="Close chat"
                        type="button"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* ── Messages ── */}
                <div
                    className="qc-messages"
                    role="log"
                    aria-live="polite"
                    aria-label="Chat messages"
                >
                    <div className="qc-date-divider">
                        <span>Today</span>
                    </div>

                    {messages.map((msg) => (
                        <div key={msg.id} className={`qc-msg ${msg.sender}`}>
                            <span className="qc-sender">{msg.senderLabel}</span>
                            <div className="qc-bubble">{msg.text}</div>
                            <span className="qc-time">{msg.time}</span>
                        </div>
                    ))}

                    <div ref={messagesEndRef} />
                </div>

                {/* ── Input (hidden when disableInput=true) ── */}
                {!disableInput && (
                    <div className="qc-input-wrap">
                        <textarea
                            ref={inputRef}
                            className="qc-input"
                            placeholder="Type your reply…"
                            value={inputValue}
                            onChange={handleInput}
                            onKeyDown={handleKeyDown}
                            rows={1}
                            disabled={sending}
                            aria-label="Message input"
                        />
                        <button
                            className="qc-send-btn"
                            onClick={handleSend}
                            disabled={sending || !inputValue.trim()}
                            aria-label="Send message"
                            type="button"
                        >
                            <SendIcon />
                        </button>
                    </div>
                )}

                {/* Read-only notice */}
                {disableInput && (
                    <div className="qc-readonly-notice" aria-live="polite">
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                            <rect x="3" y="11" width="18" height="11" rx="2" />
                            <path d="M7 11V7a5 5 0 0110 0v4" />
                        </svg>
                        View-only — messaging is disabled for this screen
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuickChatModal;