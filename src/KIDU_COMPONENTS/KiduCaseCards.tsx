import React, { useState } from 'react';
import '.././Styles/KiduStyles/CaseCards.css';
import QuickChatModal from './KiduQuickChatModal';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

/** Which login context the card is rendered in — controls buttons shown */
export type CardMode =
    | 'lab'        // Lab view — no action buttons (view only in Lab view 1)
    | 'doctor'     // Doctor view — chat + status + help buttons
    | 'submitted'  // Submitted view — chat + support buttons (+ rush indicator)
    | 'dso';       // DSO view — pure view-only, no buttons at all

/** Case status — controls accent bar colour and hover glow */
export type CaseStatus =
    | 'hold'
    | 'submitted'
    | 'production'
    | 'transit'
    | 'recent'
    | 'rejected';

/** Badge variant for the type pill */
export type CaseType =
    | 'Analog'
    | 'Analog Case'
    | 'IOS Case'
    | 'IOS QC'
    | string; // allow custom labels

export interface CaseCardProps {
    // ── Identity ──
    /** Patient full name */
    patientName: string;
    /** Patient ID (shown in parentheses after name) */
    patientId?: string;
    /** Case / lab order ID e.g. MYLS700588 */
    caseId: string;
    /** Analogue / IOS / QC label */
    caseType: CaseType;

    // ── Meta ──
    /** Doctor or lab name on line 2 */
    doctorName: string;
    /** Lab name on line 3 */
    labName: string;
    /** Submission / required date string */
    date: string;

    // ── Status ──
    /** Controls accent bar colour and hover glow */
    status: CaseStatus;
    /** Whether this is a RUSH case — enables pulse animation + corner tag */
    isRush?: boolean;

    // ── Mode / Behaviour ──
    /**
     * Which login context this card lives in.
     * Controls which action buttons are rendered.
     */
    mode: CardMode;

    /**
     * Disable the chat input box in the QuickChatModal.
     * When true, the modal opens in read-only mode.
     * @default false
     */
    disableChat?: boolean;

    // ── Callbacks ──
    /** Called when the card body is clicked */
    onClick?: () => void;
    /** Called when Status button is clicked (doctor / lab modes) */
    onStatusClick?: () => void;
    /** Called when Help/Support button is clicked */
    onSupportClick?: () => void;
    /**
     * Called when a chat message is sent from the inline QuickChatModal.
     * Receives the message text; return a Promise for async handling.
     */
    onSendMessage?: (text: string) => Promise<void> | void;

    /** Stagger delay for enter animation (seconds) */
    animationDelay?: number;
}

// ─────────────────────────────────────────────────────────────
// SVG Icons (self-contained, no external dep)
// ─────────────────────────────────────────────────────────────

const IconCopy = () => (
    <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
);

const IconUser = () => (
    <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const IconBuilding = () => (
    <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
        <path d="M3 21h18" />
    </svg>
);

const IconCalendar = () => (
    <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
);

const IconChat = () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
);

const IconStatus = () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);

const IconSupport = () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 18v-6a9 9 0 0118 0v6" />
        <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" />
    </svg>
);

const IconHelp = () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);

const IconRush = () => (
    <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
);

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function getTypeBadgeClass(type: CaseType): string {
    const t = type.toLowerCase();
    if (t.includes('ios qc') || t.includes('scan qc')) return 'case-card__type-badge--qc';
    if (t.includes('ios')) return 'case-card__type-badge--ios';
    return 'case-card__type-badge--analog';
}

// ─────────────────────────────────────────────────────────────
// Inline QuickChatModal (imported interface only — keeps this
// component self-contained; swap with your real modal import)
// ─────────────────────────────────────────────────────────────

/**
 * Props subset that CaseCard needs to pass into QuickChatModal.
 * Replace this import path with wherever you store the real component.
 */

// ─────────────────────────────────────────────────────────────
// CaseCard Component
// ─────────────────────────────────────────────────────────────

const CaseCard: React.FC<CaseCardProps> = ({
    patientName,
    patientId,
    caseId,
    caseType,
    doctorName,
    labName,
    date,
    status,
    isRush = false,
    mode,
    disableChat = false,
    onClick,
    onStatusClick,
    onSupportClick,
    onSendMessage,
    animationDelay = 0,
}) => {
    const [chatOpen, setChatOpen] = useState(false);

    // Build CSS class list
    const cardClasses = [
        'case-card',
        `case-card--${status}`,
        isRush ? 'case-card--rush' : '',
        mode === 'dso' ? 'case-card--dso' : '',
    ]
        .filter(Boolean)
        .join(' ');

    // Stop card body click from firing when action buttons are clicked
    const stopProp = (e: React.MouseEvent) => e.stopPropagation();

    // ── Action button renderer ──
    const ActionBtn = ({
        type,
        label,
        children,
        onBtnClick,
    }: {
        type: string;
        label: string;
        children: React.ReactNode;
        onBtnClick: (e: React.MouseEvent) => void;
    }) => (
        <div className="case-card__tooltip-wrap">
            <button
                type="button"
                className={`case-card__action-btn case-card__action-btn--${type}`}
                onClick={onBtnClick}
                aria-label={label}
            >
                {children}
            </button>
            <div className="case-card__tooltip">{label}</div>
        </div>
    );

    // ── Resolve buttons by mode ──
    const renderActions = () => {
        if (mode === 'dso') return null; // view-only — no buttons

        if (mode === 'lab') {
            // Lab view 1 — just status + help
            return (
                <>
                    <ActionBtn
                        type="status"
                        label="Status"
                        onBtnClick={(e) => { stopProp(e); onStatusClick?.(); }}
                    >
                        <IconStatus />
                    </ActionBtn>
                    <ActionBtn
                        type="help"
                        label="Help"
                        onBtnClick={(e) => { stopProp(e); onSupportClick?.(); }}
                    >
                        <IconHelp />
                    </ActionBtn>
                </>
            );
        }

        if (mode === 'doctor') {
            // Doctor view — chat + status + help
            return (
                <>
                    <ActionBtn
                        type="chat"
                        label="Chat"
                        onBtnClick={(e) => { stopProp(e); setChatOpen(true); }}
                    >
                        <IconChat />
                    </ActionBtn>
                    <ActionBtn
                        type="status"
                        label="Status"
                        onBtnClick={(e) => { stopProp(e); onStatusClick?.(); }}
                    >
                        <IconStatus />
                    </ActionBtn>
                    <ActionBtn
                        type="help"
                        label="Help"
                        onBtnClick={(e) => { stopProp(e); onSupportClick?.(); }}
                    >
                        <IconHelp />
                    </ActionBtn>
                </>
            );
        }

        if (mode === 'submitted') {
            // Submitted view — chat + support (+ rush indicator for rush cases)
            return (
                <>
                    <ActionBtn
                        type="chat"
                        label="Chat"
                        onBtnClick={(e) => { stopProp(e); setChatOpen(true); }}
                    >
                        <IconChat />
                    </ActionBtn>
                    <ActionBtn
                        type="support"
                        label="Support"
                        onBtnClick={(e) => { stopProp(e); onSupportClick?.(); }}
                    >
                        <IconSupport />
                    </ActionBtn>
                    {isRush && (
                        <ActionBtn
                            type="rush"
                            label="Rush Case"
                            onBtnClick={stopProp}
                        >
                            R
                        </ActionBtn>
                    )}
                </>
            );
        }

        return null;
    };

    return (
        <>
            {/* ── Card ── */}
            <div
                className={cardClasses}
                style={{ animationDelay: `${animationDelay}s` }}
                onClick={onClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
                aria-label={`Case ${caseId} — ${patientName}`}
            >
                {/* Accent bar */}
                <div className="case-card__accent" aria-hidden="true" />

                {/* Rush corner tag */}
                {isRush && (
                    <div className="case-card__rush-tag" aria-label="Rush case">
                        <IconRush />
                        RUSH
                    </div>
                )}

                <div className="case-card__inner">
                    {/* Top: name + type badge */}
                    <div className="case-card__top">
                        <div className="case-card__name-block">
                            <span className="case-card__name">
                                {patientName}
                                {patientId && (
                                    <span className="case-card__pid"> ({patientId})</span>
                                )}
                            </span>
                        </div>
                        {/* Hide type badge when rush tag occupies that corner */}
                        {!isRush && (
                            <span className={`case-card__type-badge ${getTypeBadgeClass(caseType)}`}>
                                {caseType}
                            </span>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="case-card__divider" aria-hidden="true" />

                    {/* Meta rows */}
                    <div className="case-card__meta">
                        <div className="case-card__meta-row">
                            <span className="case-card__meta-icon"><IconCopy /></span>
                            <span className="case-card__meta-text case-card__meta-text--mono">{caseId}</span>
                        </div>
                        <div className="case-card__meta-row">
                            <span className="case-card__meta-icon"><IconUser /></span>
                            <span className="case-card__meta-text case-card__meta-text--bold">{doctorName}</span>
                        </div>
                        <div className="case-card__meta-row">
                            <span className="case-card__meta-icon"><IconBuilding /></span>
                            <span className="case-card__meta-text">{labName}</span>
                        </div>
                    </div>

                    {/* Footer: date + actions */}
                    <div className="case-card__footer">
                        <div className="case-card__date">
                            <IconCalendar />
                            &nbsp;{date}
                        </div>
                        <div className="case-card__actions" onClick={stopProp}>
                            {renderActions()}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Quick Chat Modal (opens from chat button) ── */}
            {(mode === 'doctor' || mode === 'submitted') && (
                <QuickChatModal
                    show={chatOpen}
                    onHide={() => setChatOpen(false)}
                    patientName={patientName}
                    caseId={caseId}
                    onSend={onSendMessage}
                    disableInput={disableChat}
                />
            )}
        </>
    );
};

export default CaseCard;

/* ─────────────────────────────────────────────────────────────
   USAGE EXAMPLES
   ─────────────────────────────────────────────────────────────

// ── Lab view (hold status, no buttons) ──
<CaseCard
  mode="lab"
  patientName="WILL BIL"
  patientId="poiuyt"
  caseId="MYLS700588"
  caseType="Analog"
  doctorName="MYLAB"
  labName="MYLAB"
  date="29/12/2025"
  status="hold"
  onClick={() => openDetailModal('MYLS700588')}
  animationDelay={0.045}
/>

// ── Doctor view ──
<CaseCard
  mode="doctor"
  patientName="WILL BIL"
  patientId="poiuyt"
  caseId="MYLS700588"
  caseType="Analog Case"
  doctorName="Bedford Demo Doctor"
  labName="MYLAB"
  date="29/12/2025"
  status="hold"
  onStatusClick={() => openStatus()}
  onSupportClick={() => openSupport()}
  onSendMessage={async (msg) => await api.send(msg)}
/>

// ── Submitted view — Rush case ──
<CaseCard
  mode="submitted"
  patientName="Alex 2"
  caseId="P700768"
  caseType="IOS Case"
  doctorName="MLC LAB"
  labName="MLC LAB"
  date="16/02/2026"
  status="submitted"
  isRush={true}
  onSendMessage={async (msg) => await api.send(msg)}
/>

// ── DSO / view-only ──
<CaseCard
  mode="dso"
  patientName="GLENN MARVEL"
  patientId="PID894"
  caseId="MLCLS700831"
  caseType="Analog Case"
  doctorName="MLC LAB"
  labName="MLC LAB"
  date="20/02/2026"
  status="submitted"
  onClick={() => openDetailModal()}
/>

// ── Disable chat input (read-only chat panel) ──
<CaseCard
  mode="doctor"
  ...
  disableChat={true}
/>
*/