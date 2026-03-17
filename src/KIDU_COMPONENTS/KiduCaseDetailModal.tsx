import React, { useState, useRef, useEffect, useCallback } from 'react';
import '../Styles/KiduStyles/CaseDetailModal.css';
import { useTheme } from '../ThemeProvider/ThemeProvider';

// ── Reuse the already-built components ───────────────────────
import KiduCaseChat from './KiduCaseChat';         // replaces inline ChatPanel
import { triggerPrint } from './KiduCasePrintView';
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────

export type LoginRole = 'admin' | 'dso' | 'lab' | 'doctor' | 'practice';
export type StepStatus = 'done' | 'hold' | 'active' | 'pending';

export interface StepItem {
  label: string;
  status: StepStatus;
  date?: string;
}

export interface RestorationDetail {
  prosthesisType: string;
  restorationDetails: string;
  product: string;
  tooth: string;
  shade: string;
}

export interface FileAttachment {
  id: string;
  name: string;
  meta: string;
  url?: string;
}

export interface HistoryEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  note?: string;
}

export interface ChatMessage {
  id: string;
  side: 'lab' | 'doc';
  sender: string;
  text: string;
  time: string;
}

export interface CaseDetailData {
  id: string;
  patientName: string;
  patientId?: string;
  lab: string;
  practiceName?: string;
  doctorId?: string;
  doctorName?: string;
  address?: string;
  status?: string;
  statusNote?: string;
  steps: StepItem[];
  alertMessage?: string;
  restoration?: RestorationDetail;
  additionalInfo?: string;
  /**
   * Pass '' (empty string) → renders section with "N/A".
   * undefined → hides section entirely.
   */
  caseNotes?: string;
  iosRemarks?: string;
  files?: FileAttachment[];
  chatMessages?: ChatMessage[];
  history?: HistoryEntry[];
}

export interface CaseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: LoginRole;
  data: CaseDetailData;
  onSendMessage?: (message: string) => void;
  /** @deprecated – print is now handled internally via triggerPrint */
  onPrint?: () => void;
  onUpdateStatus?: () => void;
  onAddRestoration?: () => void;
  className?: string;
}

// ─────────────────────────────────────────────
// Role Permissions  (unchanged)
// ─────────────────────────────────────────────

const ROLE_PERMISSIONS: Record<LoginRole, {
  canSendMessage: boolean;
  canPrint: boolean;
  canPrintPrescription: boolean;
  canUpdateStatus: boolean;
  canAddRestoration: boolean;
  canDownloadFiles: boolean;
  showChat: boolean;
  chatLabel: string;
  isDoctorChat: boolean;
}> = {
  admin:    { canSendMessage: false, canPrint: false, canPrintPrescription: false, canUpdateStatus: false, canAddRestoration: false, canDownloadFiles: true,  showChat: true,  chatLabel: 'Communication',    isDoctorChat: false },
  dso:      { canSendMessage: false, canPrint: false, canPrintPrescription: false, canUpdateStatus: false, canAddRestoration: false, canDownloadFiles: true,  showChat: true,  chatLabel: 'Communication',    isDoctorChat: false },
  lab:      { canSendMessage: true,  canPrint: true,  canPrintPrescription: false, canUpdateStatus: true,  canAddRestoration: true,  canDownloadFiles: true,  showChat: true,  chatLabel: 'Communication',    isDoctorChat: false },
  doctor:   { canSendMessage: true,  canPrint: true,  canPrintPrescription: false, canUpdateStatus: false, canAddRestoration: false, canDownloadFiles: true,  showChat: true,  chatLabel: 'Talk To Practice', isDoctorChat: true  },
  practice: { canSendMessage: false, canPrint: false, canPrintPrescription: true,  canUpdateStatus: false, canAddRestoration: false, canDownloadFiles: true,  showChat: false, chatLabel: '',                isDoctorChat: false },
};

// ─────────────────────────────────────────────
// SVG Icons  (unchanged)
// ─────────────────────────────────────────────

const PrintIcon: React.FC = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 9V2h12v7" /><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
);

const CloseIcon: React.FC = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const AlertIcon: React.FC = () => (
  <svg width="15" height="15" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const DownloadIcon: React.FC = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

// ─────────────────────────────────────────────
// Progress Stepper  (unchanged logic)
// ─────────────────────────────────────────────

const ProgressStepper: React.FC<{ steps: StepItem[] }> = ({ steps }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const getLineClass = (left: StepItem, right: StepItem): string => {
    if (left.status === 'done' && right.status === 'done') return 'cdm-step-line cdm-step-line--done';
    if (left.status === 'done' && right.status !== 'done') return 'cdm-step-line cdm-step-line--active';
    return 'cdm-step-line';
  };

  return (
    <div className="cdm-stepper" role="list" aria-label="Case progress">
      {steps.map((step, idx) => (
        <React.Fragment key={`${step.label}-${idx}`}>
          <div
            className="cdm-stepper__item"
            role="listitem"
            aria-label={`${step.label}: ${step.status}`}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <div className={`cdm-stepper__dot cdm-stepper__dot--${step.status}${hoveredIdx === idx ? ' cdm-stepper__dot--hovered' : ''}`}>
              {step.status === 'done' && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
              {step.status === 'hold' && <span aria-hidden="true">!</span>}
              {(step.status === 'active' || step.status === 'pending') && (
                <span aria-hidden="true">{idx + 1}</span>
              )}
            </div>
            <div className="cdm-stepper__label-wrap">
              <span className="cdm-stepper__label">{step.label}</span>
              {step.date && <span className="cdm-stepper__date">{step.date}</span>}
              {!step.date && step.status === 'pending' && idx === steps.length - 1 && (
                <span className="cdm-stepper__date">To be Updated</span>
              )}
            </div>
          </div>
          {idx < steps.length - 1 && (
            <div className={getLineClass(step, steps[idx + 1])} aria-hidden="true" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────
// Section Block  (unchanged)
// ─────────────────────────────────────────────

const SectionBlock: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ icon, title, children, className = '' }) => (
  <div className={`cdm-section ${className}`}>
    <div className="cdm-section__header">
      <span className="cdm-section__icon" aria-hidden="true">{icon}</span>
      <h3 className="cdm-section__title">{title}</h3>
    </div>
    <div className="cdm-section__body">{children}</div>
  </div>
);

// ─────────────────────────────────────────────
// History Panel  (unchanged)
// ─────────────────────────────────────────────

const HistoryPanel: React.FC<{ history: HistoryEntry[] }> = ({ history }) => {
  if (history.length === 0) {
    return <p className="cdm-empty-note">No history available.</p>;
  }
  return (
    <div className="cdm-history">
      {history.map((entry, idx) => (
        <div key={entry.id} className="cdm-history__item" style={{ animationDelay: `${idx * 0.06}s` }}>
          <div className="cdm-history__dot" aria-hidden="true" />
          <div className="cdm-history__content">
            <div className="cdm-history__action">{entry.action}</div>
            <div className="cdm-history__meta">{entry.user} · {entry.timestamp}</div>
            {entry.note && <div className="cdm-history__note">{entry.note}</div>}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────
// Main Modal Component
// ─────────────────────────────────────────────

const CaseDetailModal: React.FC<CaseDetailModalProps> = ({
  isOpen,
  onClose,
  role,
  data,
  onSendMessage,
  onUpdateStatus,
  onAddRestoration,
  className = '',
}) => {
  const { theme } = useTheme();
  const [showHistory, setShowHistory] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const perms = ROLE_PERMISSIONS[role];

  // ── Use triggerPrint from CasePrintView ──────────────────────
  const handlePrint = useCallback(() => {
    // practice → prescription layout; lab/doctor → full case report
    const isPrescription = perms.canPrintPrescription && !perms.canPrint;
    triggerPrint(data, role, isPrescription);
  }, [data, role, perms]);
  // ─────────────────────────────────────────────────────────────

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setShowHistory(false);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) onClose(); };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [isOpen, onClose]);

  const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className={`cdm-overlay cdm-overlay--open ${className}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Case detail: ${data.id} ${data.patientName}`}
      data-theme={theme}
    >
      <div className={`cdm-modal${perms.showChat ? '' : ' cdm-modal--no-chat'}`}>

        {/* ─── LEFT PANEL ─────────────────────────────────────────── */}
        <div className="cdm-main">

          {/* ── STICKY TOP: header + stepper (never scrolls) ── */}
          <div className="cdm-sticky-top">

            {/* Header */}
            <div className="cdm-header">
              <div className="cdm-header__info">
                <h2 className="cdm-header__title">
                  <span className="cdm-header__id">{data.id}</span>
                  {' '}<span className="cdm-header__name">{data.patientName}</span>
                  {data.patientId && <span className="cdm-header__pid"> ({data.patientId})</span>}
                </h2>
                <p className="cdm-header__sub">
                  Patient: {data.patientId || '—'} · Lab: {data.lab}
                </p>
              </div>
              <div className="cdm-header__actions">
                {/* Print buttons now call triggerPrint directly */}
                {perms.canPrint && (
                  <button className="cdm-btn cdm-btn--print" onClick={handlePrint} type="button" aria-label="Print case">
                    <PrintIcon /><span>Print</span>
                  </button>
                )}
                {perms.canPrintPrescription && (
                  <button className="cdm-btn cdm-btn--teal" onClick={handlePrint} type="button" aria-label="Print Prescription">
                    <PrintIcon /><span>Print Prescription</span>
                  </button>
                )}
                <button className="cdm-close" onClick={onClose} type="button" aria-label="Close modal">
                  <CloseIcon />
                </button>
              </div>
            </div>

            {/* Progress Stepper — fixed, never scrolls */}
            <div className="cdm-stepper-wrap">
              <ProgressStepper steps={data.steps} />
            </div>

            {/* Alert Banner (also sticky so it's always visible) */}
            {data.alertMessage && (
              <div className="cdm-alert cdm-alert--sticky" role="alert">
                <AlertIcon />
                <span className="cdm-alert__text">{data.alertMessage}</span>
                {perms.canSendMessage && (
                  <button className="cdm-alert__btn" type="button">Reply</button>
                )}
              </div>
            )}
          </div>
          {/* /cdm-sticky-top */}

          {/* ── SCROLLABLE BODY: only this area scrolls ── */}
          <div className="cdm-scroll-body">

            {/* Doctor Information */}
            <SectionBlock
              icon={<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>}
              title="Doctor Information"
            >
              <div className="cdm-info-grid">
                {/* <div className="cdm-info-row">
                  <span className="cdm-info-label">Doctor ID</span>
                  <span className="cdm-info-value cdm-info-value--mono">{data.doctorId || '—'}</span>
                </div> */}
                <div className="cdm-info-row">
                  <span className="cdm-info-label">Doctor Name</span>
                  <span className="cdm-info-value cdm-info-value--bold">{data.doctorName || '—'}</span>
                </div>
                <div className="cdm-info-row">
                  <span className="cdm-info-label">Practice Name</span>
                  <span className="cdm-info-value">{data.practiceName || '—'}</span>
                </div>
                <div className="cdm-info-row">
                  <span className="cdm-info-label">Lab</span>
                  <span className="cdm-info-value">{data.lab}</span>
                </div>
                <div className="cdm-info-row cdm-info-row--full">
                  <span className="cdm-info-label">Address</span>
                  <span className="cdm-info-value">{data.address || '—'}</span>
                </div>
                {data.statusNote && (
                  <div className="cdm-info-row cdm-info-row--full">
                    <span className="cdm-info-label">Status</span>
                    <span className="cdm-info-value cdm-info-value--status">{data.statusNote}</span>
                  </div>
                )}
              </div>
            </SectionBlock>

            {/* Restoration Details — only shown when data.restoration is provided */}
            {data.restoration && (
              <SectionBlock
                icon={<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                title="Restoration Details"
              >
                <div className="cdm-info-grid">
                  <div className="cdm-info-row">
                    <span className="cdm-info-label">Prosthesis Type</span>
                    <span className="cdm-info-value cdm-info-value--bold">{data.restoration.prosthesisType}</span>
                  </div>
                  <div className="cdm-info-row">
                    <span className="cdm-info-label">Restoration Details</span>
                    <span className="cdm-info-value">{data.restoration.restorationDetails}</span>
                  </div>
                  <div className="cdm-info-row">
                    <span className="cdm-info-label">Product</span>
                    <span className="cdm-info-value">{data.restoration.product}</span>
                  </div>
                  <div className="cdm-info-row">
                    <span className="cdm-info-label">Tooth</span>
                    <span className="cdm-info-value cdm-info-value--mono">{data.restoration.tooth}</span>
                  </div>
                  <div className="cdm-info-row cdm-info-row--full">
                    <span className="cdm-info-label">Shade</span>
                    <span className="cdm-info-value cdm-info-value--shade cdm-info-value--mono">{data.restoration.shade}</span>
                  </div>
                </div>
              </SectionBlock>
            )}

            {/* Additional Information — only shown when provided */}
            {data.additionalInfo && (
              <SectionBlock
                icon={<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>}
                title="Additional Information"
              >
                <div className="cdm-text-block">{data.additionalInfo}</div>
              </SectionBlock>
            )}

            {/* Case Notes — shown if !== undefined; '' renders "N/A" */}
            {data.caseNotes !== undefined && (
              <SectionBlock
                icon={<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>}
                title="Case Notes"
              >
                <div className="cdm-text-block">{data.caseNotes || 'N/A'}</div>
              </SectionBlock>
            )}

            {/* IOS Remarks — shown if !== undefined; '' renders "N/A" */}
            {data.iosRemarks !== undefined && (
              <SectionBlock
                icon={<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>}
                title="IOS Remarks"
              >
                <div className="cdm-text-block">{data.iosRemarks || 'N/A'}</div>
              </SectionBlock>
            )}

            {/* Files */}
            {data.files && data.files.length > 0 && (
              <SectionBlock
                icon={<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>}
                title="Files"
              >
                <div className="cdm-files-list">
                  {data.files.map(f => (
                    <div key={f.id} className="cdm-files-list__item">
                      <div className="cdm-files-list__icon" aria-hidden="true">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" /><polyline points="13 2 13 9 20 9" />
                        </svg>
                      </div>
                      <div className="cdm-files-list__info">
                        <span className="cdm-files-list__name">{f.name}</span>
                        <span className="cdm-files-list__meta">{f.meta}</span>
                      </div>
                      {perms.canDownloadFiles && (
                        <a href={f.url || '#'} download={f.name} className="cdm-files-list__dl" aria-label={`Download ${f.name}`} title="Download">
                          <DownloadIcon /><span>Download</span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </SectionBlock>
            )}

            {/* Case History (toggle) */}
            {showHistory && (
              <SectionBlock
                icon={<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                title="Case History"
                className="cdm-section--slide-in"
              >
                <HistoryPanel history={data.history || []} />
              </SectionBlock>
            )}

            {/* Action Bar */}
            <div className="cdm-actions">
              {perms.canUpdateStatus && (
                <button className="cdm-btn cdm-btn--primary" onClick={onUpdateStatus} type="button">
                  Update Status
                </button>
              )}
              {perms.canAddRestoration && (
                <button className="cdm-btn cdm-btn--ghost" onClick={onAddRestoration} type="button">
                  + Add Restoration
                </button>
              )}
              <button
                className={`cdm-btn cdm-btn--ghost${showHistory ? ' cdm-btn--active' : ''}`}
                onClick={() => setShowHistory(v => !v)}
                type="button"
              >
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {showHistory ? 'Hide History' : 'View History'}
              </button>
              <div className="cdm-actions__spacer" />
              <button className="cdm-btn cdm-btn--danger" type="button" onClick={onClose}>
                Cancel
              </button>
            </div>

          </div>
          {/* /cdm-scroll-body */}

        </div>
        {/* /cdm-main */}

        {/* ─── RIGHT PANEL: KiduCaseChat — fully fixed, never scrolls with left ─── */}
        {perms.showChat && (
          <div className="cdm-side">
            {/*
              Using the already-built KiduCaseChat component.
              Props mapped from modal's data + permissions:
              - initialMessages → data.chatMessages
              - files           → data.files
              - onSend          → onSendMessage
              Note: KiduCaseChat has its own internal tab state (Chat/Files)
                    and its own isDoctorView tabs (Internal/External) handled
                    via the wrapper class cdm-side--doctor below if needed.
                    For doctor role we pass isDoctorView via className hint.
            */}
            <KiduCaseChat
              initialMessages={(data.chatMessages || []) as any}
              files={(data.files || []) as any}
              onSend={onSendMessage}
              className={`cdm-kidu-chat${perms.isDoctorChat ? ' cdm-kidu-chat--doctor' : ''}`}
              chatLabel={perms.chatLabel}
              isDoctorView={perms.isDoctorChat}
              canSend={perms.canSendMessage}
              canDownload={perms.canDownloadFiles}
            />
          </div>
        )}

      </div>
    </div>
  );
};

export default CaseDetailModal;