/* ============================================================
   CaseStatusUpdateModal.tsx
   Modern, clean Case Status Update modal.
   Drop-in replacement — fires onSubmit(payload) on success.
   ============================================================ */

import React, { useState, useEffect, useCallback } from 'react';
import '../Styles/KiduStyles/CasStatusUpdateModals.css';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type NewCaseStatus = 'In Production' | 'Shipped' | 'Cancelled' | '';

export interface CaseStatusUpdatePayload {
  caseId: string;
  newStatus: NewCaseStatus;
  shipDate?: string;
  arrivalDate?: string;
  trackingNo?: string;
  reason?: string;
}

export interface CaseStatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Existing case data shown as read-only info */
  caseId: string;
  submissionDate: string;
  doctorName: string;
  patientName: string;
  patientId?: string;
  currentStatus: string;
  /** Called with the form payload on submit */
  onSubmit?: (payload: CaseStatusUpdatePayload) => Promise<void> | void;
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

const STATUS_OPTIONS: NewCaseStatus[] = ['In Production', 'Shipped', 'Cancelled'];

function statusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    'case on hold':  'csm-status--hold',
    hold:            'csm-status--hold',
    submitted:       'csm-status--submitted',
    'in production': 'csm-status--production',
    production:      'csm-status--production',
    shipped:         'csm-status--transit',
    transit:         'csm-status--transit',
    recent:          'csm-status--recent',
    completed:       'csm-status--recent',
    rejected:        'csm-status--rejected',
    cancelled:       'csm-status--rejected',
  };
  return map[status.toLowerCase()] ?? 'csm-status--submitted';
}

// ─────────────────────────────────────────────────────────────
// SVG Icons
// ─────────────────────────────────────────────────────────────

const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="2" y1="2" x2="12" y2="12" />
    <line x1="12" y1="2" x2="2" y2="12" />
  </svg>
);

const IconCalendar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const IconChevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconDot = ({ color }: { color: string }) => (
  <svg width="7" height="7" viewBox="0 0 7 7">
    <circle cx="3.5" cy="3.5" r="3.5" fill={color} />
  </svg>
);

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

const CaseStatusUpdateModal: React.FC<CaseStatusUpdateModalProps> = ({
  isOpen,
  onClose,
  caseId,
  submissionDate,
  doctorName,
  patientName,
  patientId,
  currentStatus,
  onSubmit,
}) => {
  const [newStatus, setNewStatus]     = useState<NewCaseStatus>('');
  const [shipDate,  setShipDate]      = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [trackingNo,  setTrackingNo]  = useState('');
  const [reason,      setReason]      = useState('');
  const [loading,     setLoading]     = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setNewStatus('');
      setShipDate('');
      setArrivalDate('');
      setTrackingNo('');
      setReason('');
      setLoading(false);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  const isValid = (): boolean => {
    if (!newStatus) return false;
    if (newStatus === 'Shipped') {
      return !!shipDate && !!arrivalDate && !!trackingNo.trim();
    }
    if (newStatus === 'Cancelled') {
      return !!reason.trim();
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!isValid() || loading) return;
    setLoading(true);
    try {
      await onSubmit?.({
        caseId,
        newStatus,
        shipDate:    newStatus === 'Shipped' ? shipDate : undefined,
        arrivalDate: newStatus === 'Shipped' ? arrivalDate : undefined,
        trackingNo:  newStatus === 'Shipped' ? trackingNo : undefined,
        reason:      newStatus === 'Cancelled' ? reason : undefined,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const displayPatient = patientId ? `${patientName} (${patientId})` : patientName;

  return (
    <div className="csm-overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-label="Case Status Update">

      <div className="csm-modal">

        {/* ── Header ── */}
        <div className="csm-header">
          <div className="csm-header-left">
            <h2 className="csm-title">Case Status Update</h2>
            <span className="csm-case-id">{caseId}</span>
          </div>
          <button className="csm-close-btn" onClick={onClose} aria-label="Close modal">
            <IconX />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="csm-body">

          {/* Info Grid */}
          <div className="csm-info-grid">
            <div className="csm-info-card">
              <span className="csm-info-label">Submission Date</span>
              <span className="csm-info-value csm-info-value--mono">{submissionDate}</span>
            </div>
            <div className="csm-info-card">
              <span className="csm-info-label">Doctor Name</span>
              <span className="csm-info-value">{doctorName}</span>
            </div>
            <div className="csm-info-card">
              <span className="csm-info-label">Patient Name</span>
              <span className="csm-info-value">{displayPatient}</span>
            </div>
            <div className="csm-info-card">
              <span className="csm-info-label">Current Status</span>
              <span className={`csm-info-value csm-info-value--status ${statusBadgeClass(currentStatus)}`}>
                <IconDot color="currentColor" />
                {currentStatus}
              </span>
            </div>
          </div>

          <div className="csm-divider" />

          {/* Form */}
          <div className="csm-form">

            {/* Status Select */}
            <div className="csm-field">
              <label className="csm-label">
                New Case Status
                <span className="csm-label-required" aria-hidden="true">*</span>
              </label>
              <div className="csm-select-wrap">
                <select
                  className="csm-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as NewCaseStatus)}
                  aria-label="Select new case status"
                >
                  <option value="" disabled>Select status…</option>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <span className="csm-select-arrow" aria-hidden="true">
                  <IconChevron />
                </span>
              </div>
            </div>

            {/* Conditional: Shipped */}
            {newStatus === 'Shipped' && (
              <div className="csm-extra-fields">
                <div className="csm-date-row">
                  <div className="csm-field">
                    <label className="csm-label">
                      Lab Shipment Date
                      <span className="csm-label-required" aria-hidden="true">*</span>
                    </label>
                    <div className="csm-input-icon-wrap">
                      <span className="csm-input-icon" aria-hidden="true"><IconCalendar /></span>
                      <input
                        type="date"
                        className="csm-input csm-input--with-icon"
                        value={shipDate}
                        onChange={(e) => setShipDate(e.target.value)}
                        aria-label="Lab shipment date"
                      />
                    </div>
                  </div>
                  <div className="csm-field">
                    <label className="csm-label">
                      Est. Arrival Date
                      <span className="csm-label-required" aria-hidden="true">*</span>
                    </label>
                    <div className="csm-input-icon-wrap">
                      <span className="csm-input-icon" aria-hidden="true"><IconCalendar /></span>
                      <input
                        type="date"
                        className="csm-input csm-input--with-icon"
                        value={arrivalDate}
                        onChange={(e) => setArrivalDate(e.target.value)}
                        aria-label="Estimated arrival date"
                      />
                    </div>
                  </div>
                </div>
                <div className="csm-field">
                  <label className="csm-label">
                    Shipment Tracking No.
                    <span className="csm-label-required" aria-hidden="true">*</span>
                  </label>
                  <input
                    type="text"
                    className="csm-input"
                    placeholder="Enter tracking number"
                    value={trackingNo}
                    onChange={(e) => setTrackingNo(e.target.value)}
                    aria-label="Shipment tracking number"
                  />
                </div>
              </div>
            )}

            {/* Conditional: Cancelled */}
            {newStatus === 'Cancelled' && (
              <div className="csm-extra-fields">
                <div className="csm-field">
                  <label className="csm-label">
                    Reason
                    <span className="csm-label-required" aria-hidden="true">*</span>
                  </label>
                  <input
                    type="text"
                    className="csm-input"
                    placeholder="Enter cancellation reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    aria-label="Cancellation reason"
                  />
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ── Footer ── */}
        <div className="csm-footer">
          <button className="csm-btn-cancel" onClick={onClose} type="button">
            Cancel
          </button>
          <button
            className="csm-btn-submit"
            onClick={handleSubmit}
            disabled={!isValid() || loading}
            type="button"
          >
            {loading ? 'Submitting…' : 'Submit Update'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CaseStatusUpdateModal;