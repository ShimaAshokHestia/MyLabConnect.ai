import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";
import "./KiduPractionerPickupCreateModal.css";

// ==================== TYPES ====================

export interface PickupAddressDetail {
  practiceName?: string;
  address?: string;
  email?: string;
  mobileNo?: string;
}

export interface LabOption {
  value: string | number;
  label: string;
}

export interface AddressOption {
  value: string | number;
  label: string;
  detail?: PickupAddressDetail;
}

export interface CaseOption {
  value: string | number;
  label: string;
}

export interface PickupFormData {
  labId: string | number | null;
  pickupDate: string;
  earliestTime: string;
  latestTime: string;
  pickupAddressId: string | number | null;
  patientCaseIds: (string | number)[];
  trackingNo: string;
}

export interface KiduPractionerPickupCreateModalProps {
  show: boolean;
  onHide: () => void;
  /** Lab dropdown options */
  labOptions: LabOption[];
  /** Address dropdown options — each may carry detail for the right panel */
  addressOptions: AddressOption[];
  /** Case / patient options for the multi-select */
  caseOptions: CaseOption[];
  /** Called with the assembled form data when the user submits */
  onSubmit: (data: PickupFormData) => Promise<void> | void;
  /** Note text shown in the info banner on the right panel */
  noteText?: string;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void;
  themeColor?: string;
  loadingState?: boolean;
}

// ==================== HELPERS ====================

const DetailRow: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <div className="kppcm-detail-row">
    <span className="kppcm-detail-label">{label}</span>
    <span className="kppcm-detail-colon">:</span>
    <span className="kppcm-detail-value">{value || <span className="kppcm-detail-empty">—</span>}</span>
  </div>
);

// ==================== COMPONENT ====================

const KiduPractionerPickupCreateModal: React.FC<KiduPractionerPickupCreateModalProps> = ({
  show,
  onHide,
  labOptions = [],
  addressOptions = [],
  caseOptions = [],
  onSubmit,
  noteText = "Requests after 12 PM will be scheduled for the next day",
  successMessage = "Pickup scheduled successfully!",
  errorMessage,
  onSuccess,
  themeColor = "#ef0d50",
  loadingState = false,
}) => {
  // ── Form state ──────────────────────────────────────────────────────────
  const [labId, setLabId] = useState<string>("");
  const [pickupDate, setPickupDate] = useState("");
  const [earliestTime, setEarliestTime] = useState("");
  const [latestTime, setLatestTime] = useState("");
  const [pickupAddressId, setPickupAddressId] = useState<string>("");
  const [selectedCases, setSelectedCases] = useState<string[]>([]);
  const [trackingNo, setTrackingNo] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visible, setVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  // Derived: selected address detail for right panel
  const selectedAddress = addressOptions.find((a) => String(a.value) === pickupAddressId);
  const addressDetail = selectedAddress?.detail ?? {};

  // ── Show / hide animation ────────────────────────────────────────────────
  useEffect(() => {
    if (show) {
      setVisible(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimateIn(true)));
    } else {
      setAnimateIn(false);
      const t = setTimeout(() => setVisible(false), 220);
      return () => clearTimeout(t);
    }
  }, [show]);

  // ── Reset on close ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!show) {
      setLabId("");
      setPickupDate("");
      setEarliestTime("");
      setLatestTime("");
      setPickupAddressId("");
      setSelectedCases([]);
      setTrackingNo("");
      setErrors({});
      setIsSubmitting(false);
    }
  }, [show]);

  // ── Validation ───────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!labId) e.labId = "Lab is required";
    if (!pickupDate) e.pickupDate = "Pickup date is required";
    if (!earliestTime) e.earliestTime = "Earliest time is required";
    if (!latestTime) e.latestTime = "Latest time is required";
    if (!pickupAddressId) e.pickupAddressId = "Pickup address is required";
    if (selectedCases.length === 0) e.selectedCases = "At least one case is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const clearError = (field: string) =>
    setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) {
      toast.error("Please fill all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit({
        labId,
        pickupDate,
        earliestTime,
        latestTime,
        pickupAddressId,
        patientCaseIds: selectedCases,
        trackingNo,
      });
      onHide();
      await new Promise((r) => setTimeout(r, 300));
      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: successMessage,
        confirmButtonColor: themeColor,
        timer: 2000,
        showConfirmButton: true,
        confirmButtonText: "OK",
      });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      const msg = err?.message || errorMessage || "An error occurred";
      toast.error(msg);
      await Swal.fire({
        icon: "error",
        title: "Error!",
        text: msg,
        confirmButtonColor: themeColor,
        confirmButtonText: "OK",
      });
      setIsSubmitting(false);
    }
  };

  // ── Case multi-select toggle ─────────────────────────────────────────────
  const toggleCase = (val: string) => {
    setSelectedCases((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
    clearError("selectedCases");
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`kppcm-backdrop ${animateIn ? "kppcm-backdrop--in" : ""}`}
        onClick={onHide}
      />

      {/* Dialog */}
      <div className={`kppcm-dialog ${animateIn ? "kppcm-dialog--in" : ""}`}>
        {/* Floating close button */}
        <button
          type="button"
          className="kppcm-close-btn"
          onClick={onHide}
          aria-label="Close"
          style={{ backgroundColor: themeColor }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 12 12"
            fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="1" y1="1" x2="11" y2="11" />
            <line x1="11" y1="1" x2="1" y2="11" />
          </svg>
        </button>

        <div className="kppcm-body">
          {/* ── LEFT PANEL — Form ── */}
          <div className="kppcm-left">
            <h2 className="kppcm-section-title">Schedule Pickup</h2>

            {/* Lab */}
            <div className="kppcm-field">
              <label className="kppcm-label">
                Lab <span className="kppcm-required">*</span>
              </label>
              <div className="kppcm-select-wrap">
                <select
                  className={`kppcm-select ${errors.labId ? "kppcm-input--error" : ""}`}
                  value={labId}
                  onChange={(e) => { setLabId(e.target.value); clearError("labId"); }}
                >
                  <option value="">Select a lab</option>
                  {labOptions.map((o) => (
                    <option key={o.value} value={String(o.value)}>{o.label}</option>
                  ))}
                </select>
                <span className="kppcm-select-arrow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </div>
              {errors.labId && <span className="kppcm-error">{errors.labId}</span>}
            </div>

            {/* Pickup Date + Earliest Time + Latest Time */}
            <div className="kppcm-row-3">
              <div className="kppcm-field">
                <label className="kppcm-label">
                  Pickup Date <span className="kppcm-required">*</span>
                </label>
                <div className="kppcm-select-wrap">
                  <select
                    className={`kppcm-select ${errors.pickupDate ? "kppcm-input--error" : ""}`}
                    value={pickupDate}
                    onChange={(e) => { setPickupDate(e.target.value); clearError("pickupDate"); }}
                  >
                    <option value="">Pick a date</option>
                    {/* Generate next 14 days */}
                    {Array.from({ length: 14 }, (_, i) => {
                      const d = new Date();
                      d.setDate(d.getDate() + i);
                      const iso = d.toISOString().split("T")[0];
                      const label = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
                      return <option key={iso} value={iso}>{label}</option>;
                    })}
                  </select>
                  <span className="kppcm-select-arrow">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </div>
                {errors.pickupDate && <span className="kppcm-error">{errors.pickupDate}</span>}
              </div>

              <div className="kppcm-field">
                <label className="kppcm-label">
                  Earliest Time <span className="kppcm-required">*</span>
                </label>
                <div className="kppcm-time-wrap">
                  <input
                    type="time"
                    className={`kppcm-input ${errors.earliestTime ? "kppcm-input--error" : ""}`}
                    value={earliestTime}
                    onChange={(e) => { setEarliestTime(e.target.value); clearError("earliestTime"); }}
                  />
                </div>
                {errors.earliestTime && <span className="kppcm-error">{errors.earliestTime}</span>}
              </div>

              <div className="kppcm-field">
                <label className="kppcm-label">
                  Latest Time <span className="kppcm-required">*</span>
                </label>
                <div className="kppcm-time-wrap">
                  <input
                    type="time"
                    className={`kppcm-input ${errors.latestTime ? "kppcm-input--error" : ""}`}
                    value={latestTime}
                    onChange={(e) => { setLatestTime(e.target.value); clearError("latestTime"); }}
                  />
                </div>
                {errors.latestTime && <span className="kppcm-error">{errors.latestTime}</span>}
              </div>
            </div>

            {/* Pickup Address */}
            <div className="kppcm-field">
              <label className="kppcm-label">
                Pickup Address <span className="kppcm-required">*</span>
              </label>
              <div className="kppcm-select-wrap">
                <select
                  className={`kppcm-select ${errors.pickupAddressId ? "kppcm-input--error" : ""}`}
                  value={pickupAddressId}
                  onChange={(e) => { setPickupAddressId(e.target.value); clearError("pickupAddressId"); }}
                >
                  <option value="">Select address</option>
                  {addressOptions.map((o) => (
                    <option key={o.value} value={String(o.value)}>{o.label}</option>
                  ))}
                </select>
                <span className="kppcm-select-arrow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </div>
              {errors.pickupAddressId && <span className="kppcm-error">{errors.pickupAddressId}</span>}
            </div>

            {/* Patient Name / Case ID */}
            <div className="kppcm-field">
              <label className="kppcm-label">
                Patient Name / Case ID <span className="kppcm-required">*</span>
              </label>
              <div className={`kppcm-case-select ${errors.selectedCases ? "kppcm-input--error" : ""}`}>
                {selectedCases.length > 0 && (
                  <div className="kppcm-case-tags">
                    {selectedCases.map((v) => {
                      const opt = caseOptions.find((c) => String(c.value) === v);
                      return (
                        <span key={v} className="kppcm-case-tag">
                          {opt?.label ?? v}
                          <button
                            type="button"
                            className="kppcm-case-tag-remove"
                            onClick={() => toggleCase(v)}
                          >×</button>
                        </span>
                      );
                    })}
                  </div>
                )}
                <div className="kppcm-case-dropdown-wrap">
                  <select
                    className="kppcm-case-native-select"
                    value=""
                    onChange={(e) => { if (e.target.value) toggleCase(e.target.value); }}
                  >
                    <option value="">{selectedCases.length === 0 ? "Select cases" : "Add more cases..."}</option>
                    {caseOptions
                      .filter((c) => !selectedCases.includes(String(c.value)))
                      .map((c) => (
                        <option key={c.value} value={String(c.value)}>{c.label}</option>
                      ))}
                  </select>
                  <span className="kppcm-case-arrow">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </div>
              </div>
              {errors.selectedCases && <span className="kppcm-error">{errors.selectedCases}</span>}
            </div>

            {/* Tracking No */}
            <div className="kppcm-field">
              <label className="kppcm-label">Tracking No.</label>
              <input
                type="text"
                className="kppcm-input"
                placeholder="Enter Tracking No"
                value={trackingNo}
                onChange={(e) => setTrackingNo(e.target.value)}
              />
            </div>

            {/* Submit */}
            <button
              type="button"
              className="kppcm-submit-btn"
              style={{ backgroundColor: themeColor }}
              onClick={handleSubmit}
              disabled={isSubmitting || loadingState}
            >
              {isSubmitting || loadingState ? (
                <>
                  <span className="kppcm-spinner" />
                  Processing...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>

          {/* ── DIVIDER ── */}
          <div className="kppcm-divider" />

          {/* ── RIGHT PANEL — Address Details ── */}
          <div className="kppcm-right">
            <h2 className="kppcm-section-title">Pickup Address Details</h2>

            <div className="kppcm-details-block">
              <DetailRow label="Practice Name" value={addressDetail.practiceName} />
              <DetailRow label="Address"       value={addressDetail.address} />
              <DetailRow label="Email"         value={addressDetail.email} />
              <DetailRow label="Mobile No"     value={addressDetail.mobileNo} />
            </div>

            {noteText && (
              <div className="kppcm-note">
                <span className="kppcm-note-label">Note:</span>
                <span className="kppcm-note-text">{noteText}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Toaster position="top-right" />
    </>
  );
};

export default KiduPractionerPickupCreateModal;
