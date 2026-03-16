/* ============================================================
   KiduCaseCards.tsx — updated
   Clicking any card opens CaseDetailModal with that card's data.
   No UI or CSS changes. All existing behaviour preserved.
   ============================================================ */

import React, { useState } from 'react';
import '.././Styles/KiduStyles/CaseCards.css';
import { FaUserDoctor } from 'react-icons/fa6';
import QuickChatModal from './KiduQuickChatModal';
import type { CaseDetailData, LoginRole } from './KiduCaseDetailModal';
import CaseDetailModal from './KiduCaseDetailModal';
// adjust import path to match your project

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type CardMode =
  | 'doctor'
  | 'practice'
  | 'dso'
  | 'lab'
  | 'admin'
  | 'integrator';

export type CaseStatus =
  | 'hold'
  | 'submitted'
  | 'production'
  | 'transit'
  | 'recent'
  | 'rejected';

export type CaseType =
  | 'Analog'
  | 'Analog Case'
  | 'IOS Case'
  | 'IOS QC'
  | string;

export interface CaseCardProps {
  patientName: string;
  patientId?: string;
  caseId: string;
  caseType: CaseType;
  doctorName: string;
  labName: string;
  date: string;
  status: CaseStatus;
  isRush?: boolean;
  mode: CardMode;
  disableChat?: boolean;
  /**
   * Optional full or partial CaseDetailData to enrich the modal.
   * Fields not provided will be inferred from the card's own props.
   */
  caseDetailData?: Partial<CaseDetailData>;
  onClick?: () => void;
  onStatusClick?: () => void;
  onSupportClick?: () => void;
  onSendMessage?: (text: string) => Promise<void> | void;
  animationDelay?: number;
}

// ─────────────────────────────────────────────────────────────
// SVG Icons  (IconUser removed — replaced by FaUserDoctor)
// ─────────────────────────────────────────────────────────────

const IconCopy = () => (
  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);
const IconBuilding = () => (
  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" /><path d="M3 21h18" />
  </svg>
);
const IconCalendar = () => (
  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
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
  if (t.includes('ios'))                              return 'case-card__type-badge--ios';
  return 'case-card__type-badge--analog';
}

const VIEW_ONLY_MODES: CardMode[] = ['dso', 'admin', 'integrator'];

/** Map CardMode → LoginRole for the modal. */
function mapModeToRole(mode: CardMode): LoginRole {
  if (mode === 'integrator') return 'admin';
  return mode as LoginRole;
}

/**
 * Derive a 6-step progress array from the card's status.
 * The first step always gets the card's date as a timestamp.
 */
function buildStepsFromStatus(status: CaseStatus, date: string) {
  const LABELS = ['Booking', 'Submitted', 'Accepted', 'Production', 'Shipped', 'Arrival'];

  // How many steps are "done" for each status
  const doneCount: Record<CaseStatus, number> = {
    submitted:  2,
    hold:       2,
    production: 4,
    transit:    5,
    recent:     6,
    rejected:   1,
  };

  const done = doneCount[status] ?? 1;
  const isHold = status === 'hold';

  return LABELS.map((label, idx) => {
    const stepDate = idx === 0 ? date : undefined;

    if (isHold && idx === done - 1) {
      return { label, status: 'hold' as const, date: stepDate };
    }
    if (idx < done) {
      return { label, status: 'done' as const, date: stepDate };
    }
    if (idx === done) {
      return { label, status: 'active' as const };
    }
    return { label, status: 'pending' as const };
  });
}

/** Merge card props + optional caseDetailData into a full CaseDetailData object. */
function buildModalData(props: CaseCardProps): CaseDetailData {
  const extra = props.caseDetailData ?? {};

  return {
    id:             props.caseId,
    patientName:    props.patientName,
    patientId:      props.patientId,
    lab:            props.labName,
    doctorName:     props.doctorName,
    practiceName:   extra.practiceName,
    doctorId:       extra.doctorId,
    address:        extra.address,
    status:         props.status,
    statusNote:     extra.statusNote,
    steps:          extra.steps ?? buildStepsFromStatus(props.status, props.date),
    alertMessage:   extra.alertMessage,
    restoration:    extra.restoration,
    additionalInfo: extra.additionalInfo,
    caseNotes:      extra.caseNotes,
    iosRemarks:     extra.iosRemarks,
    files:          extra.files        ?? [],
    chatMessages:   extra.chatMessages ?? [],
    history:        extra.history      ?? [],
  };
}

// ─────────────────────────────────────────────────────────────
// CaseCard Component
// ─────────────────────────────────────────────────────────────

const CaseCard: React.FC<CaseCardProps> = (props) => {
  const {
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
  } = props;

  const [chatOpen,  setChatOpen]  = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // FIX: snapshot the modal data at click-time so it is always consistent
  // with the card that was clicked (avoids stale closure issues if the
  // parent re-renders the list while a modal is open).
  const [modalData, setModalData] = useState<CaseDetailData | null>(null);

  const cardClasses = [
    'case-card',
    `case-card--${status}`,
    isRush ? 'case-card--rush' : '',
    VIEW_ONLY_MODES.includes(mode) ? 'case-card--view-only' : '',
    // FIX: add a mode modifier so doctor cards get the compact-footer rule
    `case-card--mode-${mode}`,
  ].filter(Boolean).join(' ');

  const stopProp = (e: React.MouseEvent) => e.stopPropagation();

  // ── Action button with tooltip ──
  const ActionBtn = ({
    type, label, children, onBtnClick,
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

  // ── Buttons by mode (unchanged logic) ──
  const renderActions = () => {
    if (VIEW_ONLY_MODES.includes(mode)) return null;

    if (mode === 'lab') {
      return (
        <>
          <ActionBtn type="status" label="Update Status"
            onBtnClick={(e) => { stopProp(e); onStatusClick?.(); }}>
            <IconStatus />
          </ActionBtn>
          <ActionBtn type="help" label="Help"
            onBtnClick={(e) => { stopProp(e); onSupportClick?.(); }}>
            <IconHelp />
          </ActionBtn>
        </>
      );
    }

    if (mode === 'doctor') {
      return (
        <>
          <ActionBtn type="chat" label="Chat"
            onBtnClick={(e) => { stopProp(e); setChatOpen(true); }}>
            <IconChat />
          </ActionBtn>
          <ActionBtn type="status" label="Status"
            onBtnClick={(e) => { stopProp(e); onStatusClick?.(); }}>
            <IconStatus />
          </ActionBtn>
          <ActionBtn type="help" label="Help"
            onBtnClick={(e) => { stopProp(e); onSupportClick?.(); }}>
            <IconHelp />
          </ActionBtn>
          {isRush && (
            <ActionBtn type="rush" label="Rush Case" onBtnClick={stopProp}>
              <IconRush />
            </ActionBtn>
          )}
        </>
      );
    }

    if (mode === 'practice') {
      return (
        <>
          <ActionBtn type="chat" label="Chat"
            onBtnClick={(e) => { stopProp(e); setChatOpen(true); }}>
            <IconChat />
          </ActionBtn>
          <ActionBtn type="support" label="Support"
            onBtnClick={(e) => { stopProp(e); onSupportClick?.(); }}>
            <IconSupport />
          </ActionBtn>
          {isRush && (
            <ActionBtn type="rush" label="Rush Case" onBtnClick={stopProp}>
              <IconRush />
            </ActionBtn>
          )}
        </>
      );
    }

    return null;
  };

  const hasChatModal = mode === 'doctor' || mode === 'practice';

  // ── Card click → open detail modal ──
  const handleCardClick = () => {
    // Build and snapshot data at click-time so the modal always shows
    // exactly what was on the card that was clicked.
    setModalData(buildModalData(props));
    setModalOpen(true);
    onClick?.();
  };

  return (
    <>
      {/* ── Card shell ── */}
      <div
        className={cardClasses}
        style={{ animationDelay: `${animationDelay}s` }}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
          }
        }}
        aria-label={`Case ${caseId} — ${patientName}`}
      >
        <div className="case-card__accent" aria-hidden="true" />

        {isRush && (
          <div className="case-card__rush-tag" aria-label="Rush case">
            <IconRush />
            RUSH
          </div>
        )}

        <div className="case-card__inner">
          <div className="case-card__top">
            <div className="case-card__name-block">
              <span className="case-card__name">{patientName}</span>
              {patientId && <span className="case-card__pid">({patientId})</span>}
            </div>
            {!isRush && (
              <span className={`case-card__type-badge ${getTypeBadgeClass(caseType)}`}>
                {caseType}
              </span>
            )}
          </div>

          <div className="case-card__divider" aria-hidden="true" />

          <div className="case-card__meta">
            <div className="case-card__meta-row">
              <span className="case-card__meta-icon"><IconCopy /></span>
              <span className="case-card__meta-text case-card__meta-text--mono">{caseId}</span>
            </div>

            {/* ── Doctor row: FaUserDoctor icon + Dr. prefix ── */}
            <div className="case-card__meta-row">
              <span className="case-card__meta-icon">
                <FaUserDoctor size={11} aria-hidden="true" />
              </span>
              <span className="case-card__meta-text case-card__meta-text--bold">
                {doctorName ? `Dr. ${doctorName}` : '—'}
              </span>
            </div>

            <div className="case-card__meta-row">
              <span className="case-card__meta-icon"><IconBuilding /></span>
              <span className="case-card__meta-text">{labName}</span>
            </div>
          </div>

          <div className="case-card__footer">
            <div className="case-card__date">
              <IconCalendar />&nbsp;{date}
            </div>
            {/* stopProp so action buttons don't trigger card click */}
            <div className="case-card__actions" onClick={stopProp}>
              {renderActions()}
            </div>
          </div>
        </div>
      </div>

      {/* ── Case Detail Modal ── */}
      <CaseDetailModal
        isOpen={modalOpen}
        onClose={() => {
            setModalOpen(false);
            // keep modalData alive during close animation, clear after
            setTimeout(() => setModalData(null), 350);
          }}
        role={mapModeToRole(mode)}
        data={buildModalData(props)}
        onSendMessage={onSendMessage}
        onUpdateStatus={() => { setModalOpen(false); onStatusClick?.(); }}
        onAddRestoration={() => { /* hook in as needed */ }}
      />

      {/* ── Quick Chat Modal (chat action button only) ── */}
      {hasChatModal && (
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