/**
 * PickupEditModal.tsx  —  EDIT
 *
 * Read-only: Lab, Date, Earliest Time, Latest Time, Address
 * Editable:  Patient / Case ID (KiduMultiSelectPopup), Tracking No.
 *
 * Right panel: Address details + map (via PickupAddressPanel).
 */

import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { PickupAddressPanel, type PickupAddressDetails } from "./PickupScheduleModal";
import "../../Styles/PickUp/PickUpModal.css";
import KiduMultiSelectPopup, {
  KiduMultiSelectInputPill,
  type KiduMultiSelectColumn,
} from "../Kidumultiselectpopup";
import { useTheme } from "../../ThemeProvider/ThemeProvider";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PickupRecord {
  id: number | string;
  labName?: string;
  pickUpDate?: string;
  pickUpEarliestTime?: string;
  pickUpLateTime?: string;
  pickUpAddress?: string;
  pickUpAddressId?: string | number;
  caseRegistrationMasterIds?: (string | number)[];
  caseLabels?: string[];
  trackingNum?: string;
  isActive?: boolean;
}

export interface PickupEditFormData {
  caseRegistrationMasterIds: (string | number)[];
  trackingNum: string;
}

export interface PickupEditModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess?: () => void;
  recordId: number | string;

  fetchRecord: (id: number | string) => Promise<PickupRecord>;
  fetchAddressDetails: (
    addressId: string | number
  ) => Promise<PickupAddressDetails>;

  casesSelectEndpoint?: string;
  casesSelectData?: any[];
  caseColumns: KiduMultiSelectColumn<any>[];
  caseIdKey?: string;
  caseLabelKey: string;
  caseSearchKeys?: string[];

  onSubmit: (
    id: number | string,
    data: PickupEditFormData
  ) => Promise<void>;

  title?: string;
  submitLabel?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
    return isNaN(dt.getTime())
      ? d
      : dt.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
  } catch {
    return d;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

const PickupEditModal: React.FC<PickupEditModalProps> = ({
  show,
  onHide,
  onSuccess,
  recordId,
  fetchRecord,
  fetchAddressDetails,
  casesSelectEndpoint,
  casesSelectData,
  caseColumns,
  caseIdKey = "id",
  caseLabelKey,
  caseSearchKeys,
  onSubmit,
  title = "Edit Pickup",
  submitLabel = "Update",
}) => {
  const { theme } = useTheme();

  const [record, setRecord] = useState<PickupRecord | null>(null);
  const [form, setForm] = useState<PickupEditFormData>({
    caseRegistrationMasterIds: [],
    trackingNum: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [caseLabels, setCaseLabels] = useState<
    Record<string | number, string>
  >({});
  const [addrDetails, setAddrDetails] = useState<PickupAddressDetails | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showCasePopup, setShowCasePopup] = useState(false);

  useEffect(() => {
    if (!show || !recordId) return;
    setLoading(true);
    setRecord(null);
    setAddrDetails(null);
    setSubmitError(null);

    (async () => {
      try {
        const rec = await fetchRecord(recordId);
        setRecord(rec);

        const lblMap: Record<string | number, string> = {};
        (rec.caseRegistrationMasterIds ?? []).forEach((id, i) => {
          lblMap[id] = rec.caseLabels?.[i] ?? String(id);
        });
        setCaseLabels(lblMap);
        setForm({
          caseRegistrationMasterIds: rec.caseRegistrationMasterIds ?? [],
          trackingNum: rec.trackingNum ?? "",
        });

        if (rec.pickUpAddressId) {
          const details = await fetchAddressDetails(rec.pickUpAddressId);
          setAddrDetails(details);
        } else if (rec.pickUpAddress) {
          // Fallback: use address string for map if no id
          setAddrDetails({ address: rec.pickUpAddress });
        }
      } catch {
        setSubmitError("Failed to load record.");
      } finally {
        setLoading(false);
      }
    })();
  }, [show, recordId]);

  const set = (key: keyof PickupEditFormData, value: any) => {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => {
      const n = { ...p };
      delete n[key];
      return n;
    });
  };

  const handleCasesConfirm = (rows: any[]) => {
    const ids = rows.map((r) => r[caseIdKey]);
    const lbls: Record<string | number, string> = {};
    rows.forEach((r) => {
      lbls[r[caseIdKey]] = String(r[caseLabelKey] ?? r[caseIdKey]);
    });
    set("caseRegistrationMasterIds", ids);
    setCaseLabels(lbls);
  };

  const removeCase = (id: string | number) => {
    set(
      "caseRegistrationMasterIds",
      form.caseRegistrationMasterIds.filter((x) => String(x) !== String(id))
    );
    setCaseLabels((p) => {
      const n = { ...p };
      delete n[id];
      return n;
    });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.caseRegistrationMasterIds.length)
      e.caseRegistrationMasterIds = "At least one case required";
    if (!form.trackingNum.trim())
      e.trackingNum = "Tracking number is required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit(recordId, form);
      onSuccess?.();
      onHide();
    } catch (err: any) {
      setSubmitError(err?.message ?? "Update failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const caseDisplayLabels = form.caseRegistrationMasterIds.map(
    (id) => caseLabels[id] ?? String(id)
  );

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        size="xl"
        centered
        backdrop="static"
        className={`pickup-modal ${theme === "dark" ? "pickup-modal--dark" : ""}`}
        dialogClassName="pickup-modal-dialog"
      >
        <Modal.Body className="pickup-modal-body p-0">
          <button
            className="pickup-modal-close"
            onClick={onHide}
            type="button"
          >
            ×
          </button>

          <div className="pickup-modal-layout">
            {/* ── Form ──────────────────────────────────────────────────── */}
            <div className="pickup-modal-form-panel">
              <div className="pickup-modal-header">
                <div className="pickup-modal-header-icon pickup-modal-header-icon--edit">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </div>
                <div>
                  <h5 className="pickup-modal-title">{title}</h5>
                  <p className="pickup-modal-subtitle">
                    Update patient cases and tracking information
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="pickup-form-loading">
                  {[100, 65, 100, 55, 80, 100].map((w, i) => (
                    <div
                      key={i}
                      className={`pickup-details-skeleton${i % 2 ? " pickup-details-skeleton--sm" : ""}`}
                      style={{ width: `${w}%` }}
                    />
                  ))}
                </div>
              ) : (
                <div className="pickup-form-body">
                  {/* Read-only fields */}
                  <div className="pickup-readonly-section">
                    <div className="pickup-readonly-grid">
                      <ROField label="Lab" value={record?.labName} />
                      <ROField label="Pickup Date" value={fmtDate(record?.pickUpDate)} />
                      <ROField label="Earliest Time" value={fmt12(record?.pickUpEarliestTime)} />
                      <ROField label="Latest Time" value={fmt12(record?.pickUpLateTime)} />
                    </div>
                    <ROField label="Pickup Address" value={record?.pickUpAddress} fullWidth />
                  </div>

                  <div className="pickup-section-divider">
                    <span>Editable Fields</span>
                  </div>

                  {/* Cases — editable */}
                  <div className="pickup-field-group">
                    <label className="pickup-field-label">
                      Patient Name / Case ID{" "}
                      <span className="pickup-required">*</span>
                    </label>
                    <KiduMultiSelectInputPill
                      values={caseDisplayLabels}
                      onOpen={() => setShowCasePopup(true)}
                      onRemove={(i) =>
                        removeCase(form.caseRegistrationMasterIds[i])
                      }
                      onClear={() => {
                        set("caseRegistrationMasterIds", []);
                        setCaseLabels({});
                      }}
                      placeholder="Select patient cases..."
                      error={errors.caseRegistrationMasterIds}
                      inputWidth="100%"
                    />
                  </div>

                  {/* Tracking — editable */}
                  <div className="pickup-field-group">
                    <label className="pickup-field-label">
                      Tracking No.{" "}
                      <span className="pickup-required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`pickup-input ${errors.trackingNum ? "pickup-input--error" : ""}`}
                      placeholder="Enter tracking number"
                      value={form.trackingNum}
                      onChange={(e) => set("trackingNum", e.target.value)}
                    />
                    {errors.trackingNum && (
                      <span className="pickup-field-error">
                        {errors.trackingNum}
                      </span>
                    )}
                  </div>

                  {submitError && (
                    <div className="pickup-submit-error">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {submitError}
                    </div>
                  )}

                  <button
                    type="button"
                    className="pickup-submit-btn pickup-submit-btn--edit"
                    onClick={handleSubmit}
                    disabled={submitting || loading}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Updating...
                      </>
                    ) : (
                      submitLabel
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* ── Right panel ───────────────────────────────────────────── */}
            <PickupAddressPanel details={addrDetails} />
          </div>
        </Modal.Body>
      </Modal>

      <KiduMultiSelectPopup
        show={showCasePopup}
        onClose={() => setShowCasePopup(false)}
        title="Select Cases"
        subtitle="Choose one or more patient cases"
        fetchEndpoint={casesSelectEndpoint}
        data={casesSelectData}
        columns={caseColumns}
        idKey={caseIdKey}
        labelKey={caseLabelKey}
        searchKeys={caseSearchKeys}
        selectedIds={form.caseRegistrationMasterIds}
        onConfirm={handleCasesConfirm}
      />
    </>
  );
};

// ─── Read-only field ──────────────────────────────────────────────────────────

const ROField: React.FC<{
  label: string;
  value?: string;
  fullWidth?: boolean;
}> = ({ label, value, fullWidth }) => (
  <div
    className={`pickup-readonly-field${fullWidth ? " pickup-readonly-field--full" : ""}`}
  >
    <span className="pickup-readonly-label">{label}</span>
    <span className="pickup-readonly-value">{value || "—"}</span>
  </div>
);

export default PickupEditModal;