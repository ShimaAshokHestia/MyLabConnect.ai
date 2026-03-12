/**
 * PickupScheduleModal.tsx  —  CREATE
 *
 * Lab      → KiduSelectPopup  (single, pre-loaded all labs)
 * Address  → KiduSelectPopup  (single, pre-loaded doctor-filtered practices)
 *                               Uses MODE 1 — identical to DentalOfficePopup
 *                               receiving `offices` + `loading` from AddNewCase
 * Cases    → KiduMultiSelectPopup  (multi, doctor-filtered cases)
 * Right panel → Address details + Google Maps embed
 */

import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "../../Styles/PickUp/PickUpModal.css";
import KiduSelectPopup, {
  KiduSelectInputPill,
  type KiduSelectColumn,
} from "../KiduSelectPopup";
import KiduMultiSelectPopup, {
  KiduMultiSelectInputPill,
  type KiduMultiSelectColumn,
} from "../Kidumultiselectpopup";
import { useTheme } from "../../ThemeProvider/ThemeProvider";
import PracticeMap from "./PraticeMap";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PickupAddressDetails {
  practiceName?: string;
  address?: string;
  email?: string;
  mobileNo?: string;
}

export interface PickupCreateFormData {
  labMasterId: number | string | null;
  pickUpDate: string;
  pickUpEarliestTime: string;
  pickUpLateTime: string;
  /** Selected practice id */
  pickUpAddress: string | number | null;
  /** Full address string built from the selected practice row */
  pickUpAddressText: string;
  caseRegistrationMasterIds: (string | number)[];
  trackingNum: string;
}

export interface PickupScheduleModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess?: () => void;

  // ── Lab (KiduSelectPopup) ─────────────────────────────────────────────────
  labSelectEndpoint?: string;
  labSelectData?: any[];
  labColumns: KiduSelectColumn<any>[];
  labIdKey?: string;
  labLabelKey: string;
  labSearchKeys?: string[];

  // ── Pickup address (KiduSelectPopup) ─────────────────────────────────────
  // MODE 1 (used here): pre-loaded doctor-filtered list — identical to how
  // DentalOfficePopup receives `offices` + `loading` from AddNewCase.
  // MODE 2 (fallback):  pass practicesFetchEndpoint for on-open fetch.
  practicesData?: any[];
  practicesLoading?: boolean;
  practicesFetchEndpoint?: string;
  practiceColumns: KiduSelectColumn<any>[];
  practiceIdKey?: string;
  practiceLabelKey: string;
  practiceSearchKeys?: string[];

  // ── Cases (KiduMultiSelectPopup) ─────────────────────────────────────────
  casesSelectEndpoint?: string;
  casesSelectData?: any[];
  caseColumns: KiduMultiSelectColumn<any>[];
  caseIdKey?: string;
  caseLabelKey: string;
  caseSearchKeys?: string[];

  // ── Submit ────────────────────────────────────────────────────────────────
  onSubmit: (data: PickupCreateFormData) => Promise<void>;
  title?: string;
  submitLabel?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt12(t: string) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  if (isNaN(h)) return t;
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function buildAddressText(row: any): string {
  return [row.address, row.city, row.postCode, row.country]
    .filter(Boolean)
    .join(", ");
}

const INIT: PickupCreateFormData = {
  labMasterId: null,
  pickUpDate: "",
  pickUpEarliestTime: "",
  pickUpLateTime: "",
  pickUpAddress: null,
  pickUpAddressText: "",
  caseRegistrationMasterIds: [],
  trackingNum: "",
};

// ─── Component ────────────────────────────────────────────────────────────────

const PickupScheduleModal: React.FC<PickupScheduleModalProps> = ({
  show,
  onHide,
  onSuccess,
  labSelectEndpoint,
  labSelectData,
  labColumns,
  labIdKey = "id",
  labLabelKey,
  labSearchKeys,
  practicesData,
  practicesLoading = false,
  practicesFetchEndpoint,
  practiceColumns,
  practiceIdKey = "id",
  practiceLabelKey,
  practiceSearchKeys,
  casesSelectEndpoint,
  casesSelectData,
  caseColumns,
  caseIdKey = "id",
  caseLabelKey,
  caseSearchKeys,
  onSubmit,
  title = "Schedule Pickup",
  submitLabel = "Schedule Pickup",
}) => {
  const { theme } = useTheme();

  const [form, setForm]             = useState<PickupCreateFormData>(INIT);
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const [labLabel, setLabLabel]     = useState("");
  const [practiceLabel, setPracticeLabel] = useState("");
  const [caseLabels, setCaseLabels] = useState<Record<string | number, string>>({});
  const [addrDetails, setAddrDetails]   = useState<PickupAddressDetails | null>(null);
  const [submitting, setSubmitting]     = useState(false);
  const [submitError, setSubmitError]   = useState<string | null>(null);
  const [showLabPopup, setShowLabPopup]         = useState(false);
  const [showPracticePopup, setShowPracticePopup] = useState(false);
  const [showCasePopup, setShowCasePopup]       = useState(false);

  // Reset on open
  useEffect(() => {
    if (show) {
      setForm(INIT);
      setErrors({});
      setLabLabel("");
      setPracticeLabel("");
      setCaseLabels({});
      setAddrDetails(null);
      setSubmitError(null);
    }
  }, [show]);

  const set = (key: keyof PickupCreateFormData, value: any) => {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => { const n = { ...p }; delete n[key]; return n; });
  };

  // ── Lab selection ──────────────────────────────────────────────────────────
  const handleLabSelect = (row: any) => {
    set("labMasterId", row[labIdKey]);
    setLabLabel(String(row[labLabelKey] ?? row[labIdKey]));
  };

  // ── Practice selection — builds address details + map ─────────────────────
  // DoctorPracticeItem shape: { id, officeName, officeCode, address, city, postCode, country }
  const handlePracticeSelect = (row: any) => {
    const addressText = buildAddressText(row);
    setForm((p) => ({
      ...p,
      pickUpAddress: row[practiceIdKey],
      pickUpAddressText: addressText,
    }));
    setPracticeLabel(String(row[practiceLabelKey] ?? row[practiceIdKey]));
    setErrors((p) => { const n = { ...p }; delete n.pickUpAddress; return n; });
    setAddrDetails({
      practiceName: row.officeName ?? String(row[practiceLabelKey] ?? ""),
      address:      addressText,
      email:        row.email    ?? undefined,
      mobileNo:     row.mobileNo ?? row.phone ?? undefined,
    });
  };

  // ── Cases selection ────────────────────────────────────────────────────────
  const handleCasesConfirm = (rows: any[]) => {
    const ids = rows.map((r) => r[caseIdKey]);
    const lbls: Record<string | number, string> = {};
    rows.forEach((r) => { lbls[r[caseIdKey]] = String(r[caseLabelKey] ?? r[caseIdKey]); });
    set("caseRegistrationMasterIds", ids);
    setCaseLabels(lbls);
  };

  const removeCase = (id: string | number) => {
    set("caseRegistrationMasterIds",
      form.caseRegistrationMasterIds.filter((x) => String(x) !== String(id)));
    setCaseLabels((p) => { const n = { ...p }; delete n[id]; return n; });
  };

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.labMasterId)                      e.labMasterId = "Lab is required";
    if (!form.pickUpDate)                       e.pickUpDate = "Date is required";
    if (!form.pickUpEarliestTime)               e.pickUpEarliestTime = "Earliest time required";
    if (!form.pickUpLateTime)                   e.pickUpLateTime = "Latest time required";
    if (!form.pickUpAddress)                    e.pickUpAddress = "Address is required";
    if (!form.caseRegistrationMasterIds.length) e.caseRegistrationMasterIds = "At least one case required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit(form);
      onSuccess?.();
      onHide();
    } catch (err: any) {
      setSubmitError(err?.message ?? "Failed to schedule pickup.");
    } finally {
      setSubmitting(false);
    }
  };

  const caseDisplayLabels = form.caseRegistrationMasterIds.map(
    (id) => caseLabels[id] ?? String(id)
  );
  const today = new Date().toISOString().split("T")[0];

  // KiduSelectPopup MODE 1 vs MODE 2 — mirrors DentalOfficePopup spread logic:
  // { data: offices, loading } when pre-loaded, else { fetchEndpoint }
  const practicePopupProps = practicesData !== undefined
    ? { data: practicesData, loading: practicesLoading }
    : { fetchEndpoint: practicesFetchEndpoint };

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
          <button className="pickup-modal-close" onClick={onHide} type="button">×</button>

          <div className="pickup-modal-layout">

            {/* ── Left: Form ─────────────────────────────────────────────── */}
            <div className="pickup-modal-form-panel">
              <div className="pickup-modal-header">
                <div className="pickup-modal-header-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13" rx="2" />
                    <path d="M16 8h4l3 5v3h-7V8z" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>
                <div>
                  <h5 className="pickup-modal-title">{title}</h5>
                  <p className="pickup-modal-subtitle">Fill in the details to schedule a lab pickup</p>
                </div>
              </div>

              <div className="pickup-form-body">

                {/* Lab */}
                <div className="pickup-field-group">
                  <label className="pickup-field-label">
                    Lab <span className="pickup-required">*</span>
                  </label>
                  <KiduSelectInputPill
                    value={labLabel}
                    onOpen={() => setShowLabPopup(true)}
                    onClear={() => { set("labMasterId", null); setLabLabel(""); }}
                    placeholder="Select a lab..."
                    error={errors.labMasterId}
                    inputWidth="100%"
                  />
                </div>

                {/* Date + Times */}
                <div className="pickup-field-row">
                  <div className="pickup-field-group">
                    <label className="pickup-field-label">
                      Pickup Date <span className="pickup-required">*</span>
                    </label>
                    <input
                      type="date"
                      min={today}
                      className={`pickup-input ${errors.pickUpDate ? "pickup-input--error" : ""}`}
                      value={form.pickUpDate}
                      onChange={(e) => set("pickUpDate", e.target.value)}
                    />
                    {errors.pickUpDate && (
                      <span className="pickup-field-error">{errors.pickUpDate}</span>
                    )}
                  </div>

                  <div className="pickup-field-group">
                    <label className="pickup-field-label">
                      Earliest Time <span className="pickup-required">*</span>
                    </label>
                    <div className="pickup-time-wrap">
                      <input
                        type="time"
                        className={`pickup-input pickup-input--time ${errors.pickUpEarliestTime ? "pickup-input--error" : ""}`}
                        value={form.pickUpEarliestTime}
                        onChange={(e) => set("pickUpEarliestTime", e.target.value)}
                      />
                      {form.pickUpEarliestTime && (
                        <span className="pickup-time-badge">{fmt12(form.pickUpEarliestTime)}</span>
                      )}
                    </div>
                    {errors.pickUpEarliestTime && (
                      <span className="pickup-field-error">{errors.pickUpEarliestTime}</span>
                    )}
                  </div>

                  <div className="pickup-field-group">
                    <label className="pickup-field-label">
                      Latest Time <span className="pickup-required">*</span>
                    </label>
                    <div className="pickup-time-wrap">
                      <input
                        type="time"
                        className={`pickup-input pickup-input--time ${errors.pickUpLateTime ? "pickup-input--error" : ""}`}
                        value={form.pickUpLateTime}
                        onChange={(e) => set("pickUpLateTime", e.target.value)}
                      />
                      {form.pickUpLateTime && (
                        <span className="pickup-time-badge">{fmt12(form.pickUpLateTime)}</span>
                      )}
                    </div>
                    {errors.pickUpLateTime && (
                      <span className="pickup-field-error">{errors.pickUpLateTime}</span>
                    )}
                  </div>
                </div>

                {/* Pickup Address */}
                <div className="pickup-field-group">
                  <label className="pickup-field-label">
                    Pickup Address <span className="pickup-required">*</span>
                  </label>
                  <KiduSelectInputPill
                    value={practiceLabel}
                    onOpen={() => setShowPracticePopup(true)}
                    onClear={() => {
                      setForm((p) => ({ ...p, pickUpAddress: null, pickUpAddressText: "" }));
                      setPracticeLabel("");
                      setAddrDetails(null);
                    }}
                    placeholder={practicesLoading ? "Loading practices..." : "Select pickup address..."}
                    error={errors.pickUpAddress}
                    inputWidth="100%"
                    disabled={practicesLoading}
                  />
                </div>

                {/* Cases */}
                <div className="pickup-field-group">
                  <label className="pickup-field-label">
                    Patient Name / Case ID <span className="pickup-required">*</span>
                  </label>
                  <KiduMultiSelectInputPill
                    values={caseDisplayLabels}
                    onOpen={() => setShowCasePopup(true)}
                    onRemove={(i) => removeCase(form.caseRegistrationMasterIds[i])}
                    onClear={() => { set("caseRegistrationMasterIds", []); setCaseLabels({}); }}
                    placeholder="Select patient cases..."
                    error={errors.caseRegistrationMasterIds}
                    inputWidth="100%"
                  />
                </div>

                {/* Tracking */}
                <div className="pickup-field-group">
                  <label className="pickup-field-label">Tracking No.</label>
                  <input
                    type="text"
                    className="pickup-input"
                    placeholder="Enter tracking number (optional)"
                    value={form.trackingNum}
                    onChange={(e) => set("trackingNum", e.target.value)}
                  />
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
                  className="pickup-submit-btn"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting
                    ? <><span className="spinner-border spinner-border-sm me-2" />Scheduling...</>
                    : submitLabel}
                </button>
              </div>
            </div>

            {/* ── Right: Address details + Map ────────────────────────────── */}
            <PickupAddressPanel details={addrDetails} />
          </div>
        </Modal.Body>
      </Modal>

      {/* Lab popup */}
      <KiduSelectPopup
        show={showLabPopup}
        onClose={() => setShowLabPopup(false)}
        title="Select Lab"
        subtitle="Choose a lab for this pickup"
        fetchEndpoint={labSelectEndpoint}
        data={labSelectData}
        columns={labColumns}
        idKey={labIdKey}
        labelKey={labLabelKey}
        searchKeys={labSearchKeys}
        onSelect={handleLabSelect}
        rowsPerPage={10}
        rowsPerPageOptions={[5, 10, 20, 50]}
        themeColor="#ef0d50"
        multiSelect={false}
        showAddButton={false}
      />

      {/* Practice popup — MODE 1 (pre-loaded doctor offices) or MODE 2 (fetch) */}
      <KiduSelectPopup
        show={showPracticePopup}
        onClose={() => setShowPracticePopup(false)}
        title="Select Pickup Address"
        subtitle="Choose the practice / dental office for this pickup"
        {...practicePopupProps}
        columns={practiceColumns}
        idKey={practiceIdKey}
        labelKey={practiceLabelKey}
        searchKeys={practiceSearchKeys}
        onSelect={handlePracticeSelect}
        rowsPerPage={10}
        rowsPerPageOptions={[5, 10, 20]}
        themeColor="#ef0d50"
        multiSelect={false}
        showAddButton={false}
      />

      {/* Cases popup */}
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

// ─── Right Panel: Address Details + Map ──────────────────────────────────────

export const PickupAddressPanel: React.FC<{
  details: PickupAddressDetails | null;
}> = ({ details }) => (
  <div className="pickup-modal-details-panel">
    <div className="pickup-details-header">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
      Pickup Address Details
    </div>

    {details ? (
      <div className="pickup-details-content">
        <DR icon="🏢" label="Practice Name" value={details.practiceName} />
        <DR icon="📍" label="Address"       value={details.address} />
        <DR icon="✉️" label="Email"         value={details.email} />
        <DR icon="📱" label="Mobile No"     value={details.mobileNo} />
      </div>
    ) : (
      <div className="pickup-details-empty">
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.5">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <p>Select a pickup address<br />to view practice details</p>
      </div>
    )}

    {/* Google Maps embed */}
    <div style={{
      margin: "12px 0",
      height: 200,
      borderRadius: 10,
      overflow: "hidden",
      border: "1px solid #eee",
      flexShrink: 0,
    }}>
      <PracticeMap address={details?.address ?? ""} />
    </div>

    <div className="pickup-details-note">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <span>
        <strong>Note:</strong> Requests after 12 PM will be scheduled for the next day
      </span>
    </div>
  </div>
);

// ─── Detail Row ───────────────────────────────────────────────────────────────

const DR: React.FC<{ icon: string; label: string; value?: string }> = ({
  icon, label, value,
}) => (
  <div className="pickup-detail-row">
    <span className="pickup-detail-icon">{icon}</span>
    <div className="pickup-detail-content">
      <span className="pickup-detail-label">{label}</span>
      <span className="pickup-detail-value">
        {value || <em className="pickup-detail-empty">—</em>}
      </span>
    </div>
  </div>
);

export default PickupScheduleModal;