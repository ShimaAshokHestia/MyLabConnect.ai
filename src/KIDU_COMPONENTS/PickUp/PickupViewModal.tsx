/**
 * PickupViewModal.tsx  —  VIEW
 *
 * Read-only display of a pickup record.
 * All data comes from fetchRecord() called by the parent.
 */

import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { PickupAddressPanel, type PickupAddressDetails } from "./PickupScheduleModal";
import "../../Styles/PickUp/PickUpModal.css";
import { useTheme } from "../../ThemeProvider/ThemeProvider";

// ─── Types ───────────────────────────────────────────────────

export interface PickupViewRecord {
  id:                       number | string;
  labName?:                 string;
  pickUpDate?:              string;
  pickUpEarliestTime?:      string;
  pickUpLateTime?:          string;
  pickUpAddress?:           string;
  pickUpAddressId?:         string | number;
  cases?:                   { id: string | number; label: string }[];
  trackingNum?:             string;
  isActive?:                boolean;
  createdAt?:               string;
  updatedAt?:               string;
  // address details can be embedded or fetched via fetchAddressDetails
  practiceName?:            string;
  addressLine?:             string;
  email?:                   string;
  mobileNo?:                string;
}

export interface PickupViewModalProps {
  show:       boolean;
  onHide:     () => void;
  recordId:   number | string;

  fetchRecord:          (id: number | string) => Promise<PickupViewRecord>;
  fetchAddressDetails?: (addressId: string | number) => Promise<PickupAddressDetails>;

  title?: string;
}

// ─── Helpers ─────────────────────────────────────────────────

function fmt12(t?: string) {
  if (!t) return "—";
  const [h, m] = t.split(":").map(Number);
  if (isNaN(h)) return t;
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function fmtDate(d?: string) {
  if (!d) return "—";
  try {
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? d :
      dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return d; }
}

function fmtDateTime(d?: string) {
  if (!d) return "—";
  try {
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? d :
      dt.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit" });
  } catch { return d; }
}

// ─── Component ───────────────────────────────────────────────

const PickupViewModal: React.FC<PickupViewModalProps> = ({
  show, onHide, recordId, fetchRecord, fetchAddressDetails,
  title = "Pickup Details",
}) => {
  const { theme } = useTheme();

  const [record,      setRecord]     = useState<PickupViewRecord | null>(null);
  const [addrDetails, setAddrDetails] = useState<PickupAddressDetails | null>(null);
  const [loading,     setLoading]    = useState(false);
  const [error,       setError]      = useState<string | null>(null);

  useEffect(() => {
    if (!show || !recordId) return;
    setLoading(true); setRecord(null); setAddrDetails(null); setError(null);

    (async () => {
      try {
        const rec = await fetchRecord(recordId);
        setRecord(rec);

        if (fetchAddressDetails && rec.pickUpAddressId) {
          setAddrDetails(await fetchAddressDetails(rec.pickUpAddressId));
        } else if (rec.practiceName || rec.addressLine || rec.email || rec.mobileNo) {
          setAddrDetails({
            practiceName: rec.practiceName,
            address:      rec.addressLine,
            email:        rec.email,
            mobileNo:     rec.mobileNo,
          });
        }
      } catch {
        setError("Failed to load pickup details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [show, recordId]);

  return (
    <Modal show={show} onHide={onHide} size="xl" centered
      className={`pickup-modal ${theme === "dark" ? "pickup-modal--dark" : ""}`}
      dialogClassName="pickup-modal-dialog">
      <Modal.Body className="pickup-modal-body p-0">
        <button className="pickup-modal-close" onClick={onHide} type="button">×</button>

        <div className="pickup-modal-layout">
          {/* ── Left: details ── */}
          <div className="pickup-modal-form-panel">
            <div className="pickup-modal-header">
              <div className="pickup-modal-header-icon pickup-modal-header-icon--view">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
              <div>
                <h5 className="pickup-modal-title">{title}</h5>
                <p className="pickup-modal-subtitle">Complete pickup request information</p>
              </div>
            </div>

            {loading && (
              <div className="pickup-form-loading">
                {[100, 65, 100, 55, 80, 100, 65].map((w, i) => (
                  <div key={i}
                    className={`pickup-details-skeleton${i % 2 ? " pickup-details-skeleton--sm" : ""}`}
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="pickup-submit-error" style={{ margin: "16px 0" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {!loading && !error && record && (
              <div className="pickup-view-body">
                {/* Status + ID row */}
                <div className="pickup-view-status-row">
                  <span className={`pickup-view-badge ${record.isActive ? "active" : "inactive"}`}>
                    ● {record.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="pickup-view-id">Pickup #{record.id}</span>
                </div>

                {/* Schedule */}
                <div className="pickup-view-section">
                  <div className="pickup-view-section-title">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    Schedule
                  </div>
                  <div className="pickup-view-grid">
                    <VF label="Lab"           value={record.labName}/>
                    <VF label="Pickup Date"   value={fmtDate(record.pickUpDate)}/>
                    <VF label="Earliest Time" value={fmt12(record.pickUpEarliestTime)}/>
                    <VF label="Latest Time"   value={fmt12(record.pickUpLateTime)}/>
                  </div>
                </div>

                {/* Address */}
                <div className="pickup-view-section">
                  <div className="pickup-view-section-title">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    Pickup Address
                  </div>
                  <VF label="Address" value={record.pickUpAddress} fullWidth/>
                </div>

                {/* Cases */}
                {record.cases && record.cases.length > 0 && (
                  <div className="pickup-view-section">
                    <div className="pickup-view-section-title">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                      Patient Cases ({record.cases.length})
                    </div>
                    <div className="pickup-view-cases">
                      {record.cases.map((c) => (
                        <span key={String(c.id)} className="pickup-view-case-chip">
                          {c.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tracking */}
                <div className="pickup-view-section">
                  <div className="pickup-view-section-title">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="3" width="15" height="13" rx="2"/>
                      <path d="M16 8h4l3 5v3h-7V8z"/>
                    </svg>
                    Tracking
                  </div>
                  {record.trackingNum ? (
                    <span className="pickup-view-tracking-chip">{record.trackingNum}</span>
                  ) : (
                    <span className="pickup-view-field-value empty">No tracking number</span>
                  )}
                </div>

                {/* Timestamps */}
                {(record.createdAt || record.updatedAt) && (
                  <div className="pickup-view-section">
                    <div className="pickup-view-section-title">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      Timestamps
                    </div>
                    <div className="pickup-view-grid">
                      {record.createdAt && <VF label="Created At"  value={fmtDateTime(record.createdAt)}/>}
                      {record.updatedAt && <VF label="Updated At"  value={fmtDateTime(record.updatedAt)}/>}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Right: Address panel ── */}
          {/* ── Right: Address panel ── */}
<PickupAddressPanel details={addrDetails}/>
        </div>
      </Modal.Body>
    </Modal>
  );
};

// ─── View field ───────────────────────────────────────────────

const VF: React.FC<{ label: string; value?: string; fullWidth?: boolean }> = ({
  label, value, fullWidth,
}) => (
  <div className={`pickup-view-field${fullWidth ? " pickup-view-field--full" : ""}`}>
    <span className="pickup-view-field-label">{label}</span>
    <span className={`pickup-view-field-value${!value ? " empty" : ""}`}>
      {value || "—"}
    </span>
  </div>
);

export default PickupViewModal;