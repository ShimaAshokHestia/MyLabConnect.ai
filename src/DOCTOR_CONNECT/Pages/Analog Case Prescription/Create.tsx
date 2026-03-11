// src/DOCTOR_CONNECT/Pages/Analog Case Prescription/AddNewCase.tsx

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Row, Col, Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import type { DentalOfficeItem } from "./DentalOfficePopup";
import PrescriptionService from "../../Service/Prescription/Prescription.services";
import AuthService from "../../../Services/AuthServices/Auth.services";
import KiduValidation from "../../../KIDU_COMPONENTS/KiduValidation";
import type { LabMasterItem } from "./LabmasterPopup";
import type { CaseRegistrationCreateDTO } from "../../Types/Case.types";
import LabMasterPopup from "./LabmasterPopup";
import DentalOfficePopup from "./DentalOfficePopup";
import KiduDropdown from "../../../KIDU_COMPONENTS/KiduDropdown";
import RestorationModal from "../../../KIDU_COMPONENTS/Case/RestorationModal";
import type { RestorationFormData } from "../../../KIDU_COMPONENTS/Case/RestorationFormPanel";
import "../../../Styles/Doctor/prescription.additions.css";
import CaseService from "../../Service/Prescription/Case.services";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface FormState {
  orderToId: number | null;
  orderToLabel: string;
  orderFromId: number | null;
  orderFromLabel: string;
  shipTo: string;
  dsoMasterId: number | null;
  dsoSchemaId: number | null;
  dsoSchemaName: string;
  dsoDoctorId: number | null;
  patientId: string;
  firstName: string;
  lastName: string;
  dueDate: string;
  caseNotes: string;
  fileType: string;
  remake: boolean;
  rush: boolean;
}

interface FormErrors {
  orderTo?: string;
  orderFrom?: string;
  patientId?: string;
  firstName?: string;
  lastName?: string;
  dueDate?: string;
  caseNotes?: string;
}

interface RestorationEntry {
  id: string;
  selectedTeeth: number[];
  prosthesis: string | null;
  restoration: string | null;
  indication: string | null;
  material: string;
  shadeGuide: string;
  shadeComments: string;
  generalComments: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const FILE_TYPE_OPTIONS = ["IOS scan", "CBCT/CT Scan", "Photograph", "Others"];

const INITIAL_FORM: FormState = {
  orderToId: null,
  orderToLabel: "",
  orderFromId: null,
  orderFromLabel: "",
  shipTo: "",
  dsoMasterId: null,
  dsoSchemaId: null,
  dsoSchemaName: "",
  dsoDoctorId: null,
  patientId: "",
  firstName: "",
  lastName: "",
  dueDate: "",
  caseNotes: "",
  fileType: "",
  remake: false,
  rush: false,
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const UploadIcon = () => (
  <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
  </svg>
);

const restorationLabel = (r: RestorationEntry): string =>
  [r.prosthesis, r.restoration, r.indication].filter(Boolean).join(" · ");

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const AddNewCase: React.FC = () => {
  // ── Form state ──────────────────────────────────────────────────────────────
  const [form, setForm]             = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors]         = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ── Popup visibility ────────────────────────────────────────────────────────
  const [showLabPopup, setShowLabPopup]                 = useState(false);
  const [showOfficePopup, setShowOfficePopup]           = useState(false);
  const [showRestorationModal, setShowRestorationModal] = useState(false);

  // ── Doctor's offices ────────────────────────────────────────────────────────
  const [myOffices, setMyOffices]           = useState<DentalOfficeItem[]>([]);
  const [officesLoading, setOfficesLoading] = useState(false);
  const [officesError, setOfficesError]     = useState<string | null>(null);

  // ── File upload ─────────────────────────────────────────────────────────────
  const [files, setFiles]       = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef            = useRef<HTMLInputElement>(null);

  // ── Additional Services modal ───────────────────────────────────────────────
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [serviceNameVal, setServiceNameVal]     = useState<string | number | null>(null);
  const [serviceComments, setServiceComments]   = useState("");
  const [serviceNameError, setServiceNameError] = useState("");

  // ── Restoration entries ─────────────────────────────────────────────────────
  const [restorations, setRestorations] = useState<RestorationEntry[]>([]);

  // ─────────────────────────────────────────────────────────────────────────────
  // On mount: read doctor identity directly from JWT — NO extra API call needed
  // ─────────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const bootstrap = async () => {
      setOfficesLoading(true);
      setOfficesError(null);

      try {
        const user = AuthService.getUser();

        // dsoDoctorId is embedded in the JWT as claim "dsoDoctorId" (e.g. "79")
        const doctorId    = user?.dsoDoctorId ?? null;
        const dsoMasterId = user?.dsoMasterId ?? null;

        if (!doctorId) {
          setOfficesError(
            "Could not find your doctor profile in session. Please log out and log in again."
          );
          return;
        }

        setForm((prev) => ({
          ...prev,
          dsoDoctorId: doctorId,
          dsoMasterId,
        }));

        const offices = await PrescriptionService.getMyOffices(doctorId);
        setMyOffices(offices);

        if (offices.length === 0) {
          setOfficesError(
            "No practice locations found for your account. Please contact your administrator."
          );
        }
      } catch (err) {
        console.error("Failed to bootstrap doctor context:", err);
        setOfficesError("Failed to load practice data. Please refresh and try again.");
      } finally {
        setOfficesLoading(false);
      }
    };

    bootstrap();
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // Validation
  // ─────────────────────────────────────────────────────────────────────────────

  const validateField = useCallback(
    (name: keyof FormErrors, value: any): string => {
      const rules: Record<keyof FormErrors, any> = {
        orderTo:   { type: "select",   required: true, label: "Order To"   },
        orderFrom: { type: "select",   required: true, label: "Order From" },
        patientId: { type: "text",     required: true, label: "Patient ID",  minLength: 2 },
        firstName: { type: "text",     required: true, label: "First Name",  minLength: 2 },
        lastName:  { type: "text",     required: true, label: "Last Name",   minLength: 2 },
        dueDate:   { type: "date",     required: true, label: "Due Date"    },
        caseNotes: { type: "textarea", required: true, label: "Case Notes", minLength: 5  },
      };
      const result = KiduValidation.validate(value, rules[name]);
      return result.isValid ? "" : result.message ?? "";
    },
    []
  );

  const validateAll = (): boolean => {
    const newErrors: FormErrors = {
      orderTo:   validateField("orderTo",   form.orderToId),
      orderFrom: validateField("orderFrom", form.orderFromId),
      patientId: validateField("patientId", form.patientId),
      firstName: validateField("firstName", form.firstName),
      lastName:  validateField("lastName",  form.lastName),
      dueDate:   validateField("dueDate",   form.dueDate),
      caseNotes: validateField("caseNotes", form.caseNotes),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Handlers — text inputs
  // ─────────────────────────────────────────────────────────────────────────────

  const handleText = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name as keyof FormErrors, value),
      }));
    }
  };

  const handleCheck = (name: "remake" | "rush") =>
    setForm((prev) => ({ ...prev, [name]: !prev[name] }));

  // ─────────────────────────────────────────────────────────────────────────────
  // Handlers — Lab selection (Order To)
  // ─────────────────────────────────────────────────────────────────────────────

  const handleLabSelect = useCallback((lab: LabMasterItem) => {
    setForm((prev) => ({
      ...prev,
      orderToId:    lab.id,
      orderToLabel: lab.labName,
    }));
    setErrors((prev) => ({ ...prev, orderTo: "" }));
    setShowLabPopup(false);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // Handlers — Office selection (Order From)
  // ─────────────────────────────────────────────────────────────────────────────

  const handleOfficeSelect = useCallback(
    async (office: DentalOfficeItem) => {
      let schemaId: number | null = null;
      let schemaName = "";

      if (form.dsoMasterId) {
        const schema = await PrescriptionService.getFirstSchema(form.dsoMasterId);
        if (schema) {
          schemaId   = schema.id;
          schemaName = schema.name;
        }
      }

      setForm((prev) => ({
        ...prev,
        orderFromId:    office.id,
        orderFromLabel: office.officeName,
        shipTo:         PrescriptionService.buildShipTo(office),
        dsoSchemaId:    schemaId,
        dsoSchemaName:  schemaName,
      }));
      setErrors((prev) => ({ ...prev, orderFrom: "" }));
      setShowOfficePopup(false);
    },
    [form.dsoMasterId]
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // Handlers — Restoration
  // ─────────────────────────────────────────────────────────────────────────────

  const handleRestorationSave = useCallback(
    (data: RestorationFormData & { selectedTeeth: number[] }) => {
      setRestorations((prev) => [
        ...prev,
        {
          id:              crypto.randomUUID(),
          selectedTeeth:   data.selectedTeeth,
          prosthesis:      data.prosthesis,
          restoration:     data.restoration,
          indication:      data.indication,
          material:        data.material,
          shadeGuide:      data.shadeGuide,
          shadeComments:   data.shadeComments,
          generalComments: data.generalComments,
        },
      ]);
    },
    []
  );

  const handleRemoveRestoration = (id: string) =>
    setRestorations((prev) => prev.filter((r) => r.id !== id));

  // ─────────────────────────────────────────────────────────────────────────────
  // Handlers — File upload
  // ─────────────────────────────────────────────────────────────────────────────

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    setFiles((prev) => [...prev, ...Array.from(incoming)]);
  };

  const removeFile = (idx: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Additional Services modal
  // ─────────────────────────────────────────────────────────────────────────────

  const closeServiceModal = () => {
    setShowServiceModal(false);
    setServiceNameVal(null);
    setServiceComments("");
    setServiceNameError("");
  };

  const saveService = () => {
    if (!serviceNameVal) {
      setServiceNameError("Service Name is required");
      return;
    }
    console.log("Additional service saved:", { serviceName: serviceNameVal, comments: serviceComments });
    closeServiceModal();
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Submit / Draft / Reset
  // ─────────────────────────────────────────────────────────────────────────────

  const buildPayload = (): CaseRegistrationCreateDTO | null => {
    if (!form.orderToId || !form.orderFromId || !form.dsoMasterId || !form.dsoDoctorId) {
      return null;
    }

    return {
      caseNo:             "",
      shipTo:             form.shipTo,
      patientFirstName:   form.firstName,
      patientLastName:    form.lastName,
      patientId:          form.patientId,
      caseStatusMasterId: 1,
      dueDate:            form.dueDate || undefined,
      caseNotes:          form.caseNotes,
      dSOMasterId:        form.dsoMasterId,
      dSODentalOfficeId:  form.orderFromId,
      dSODoctorId:        form.dsoDoctorId,
      dSOSchemaId:        form.dsoSchemaId ?? 0,
      labMasterId:        form.orderToId,
      isActive:           true,
      products:           [],
      documents:          [],
      additionalServices: [],
      pickUps:            [],
    };
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    if (!validateAll()) return;

    const payload = buildPayload();
    if (!payload) {
      setSubmitError(
        !form.dsoDoctorId
          ? "Doctor profile not found in session. Please log out and log in again."
          : "Missing required context. Please re-select Order To and Order From."
      );
      return;
    }

    setSubmitting(true);
    try {
      const result = await CaseService.create(payload);
      if (result?.isSucess) {
        // ── SweetAlert2 success — replaces browser alert() ──────────────────
        await Swal.fire({
          icon:              "success",
          title:             "Case Created Successfully!",
          html:              `Case No: <strong>${result.value?.caseNo ?? ""}</strong>`,
          confirmButtonText: "OK",
          confirmButtonColor: "#ef0d50",
          timer:             4000,
          timerProgressBar:  true,
          customClass: {
            popup:         "swal-popup",
            title:         "swal-title",
            confirmButton: "swal-confirm-btn",
          },
        });
        handleReset();
      } else {
        setSubmitError(result?.customMessage ?? result?.error ?? "Failed to create case.");
      }
    } catch (err: any) {
      setSubmitError(err?.message ?? "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDraft = () => {
    const payload = buildPayload();
    console.log("Draft payload:", { ...payload, files, restorations });
  };

  const handleReset = () => {
    setForm((prev) => ({
      ...INITIAL_FORM,
      dsoDoctorId: prev.dsoDoctorId,
      dsoMasterId: prev.dsoMasterId,
    }));
    setErrors({});
    setFiles([]);
    setRestorations([]);
    setSubmitError(null);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="anc-page">
      <div className="anc-body">

        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div className="anc-header">
          <span className="anc-page-title">Add New Case</span>
          <div className="anc-header-right">
            <div className="anc-check-group">
              {(["remake", "rush"] as const).map((key) => (
                <label key={key} className="anc-check-item">
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={() => handleCheck(key)}
                  />
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* ── Offices error banner ─────────────────────────────────────────── */}
        {officesError && (
          <div style={{
            background: "#fff3cd", border: "1px solid #ffc107",
            borderRadius: 8, padding: "10px 16px", marginBottom: 12,
            fontSize: "0.82rem", color: "#856404",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <svg width="15" height="15" fill="none" stroke="currentColor"
              strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            {officesError}
          </div>
        )}

        {/* ── Submit error banner ───────────────────────────────────────────── */}
        {submitError && (
          <div style={{
            background: "#fde8ef", border: "1px solid #ef0d50",
            borderRadius: 8, padding: "10px 16px", marginBottom: 12,
            fontSize: "0.82rem", color: "#8b0029",
          }}>
            {submitError}
          </div>
        )}

        {/* ── Order info card ─────────────────────────────────────────────── */}
        <div className="anc-card">
          <Row className="g-3">

            {/* Order To */}
            <Col xs={12} md={4}>
              <label className="anc-label">
                Order To <span className="anc-required">*</span>
              </label>
              <button
                type="button"
                className={[
                  "anc-select-btn",
                  errors.orderTo ? "is-invalid" : "",
                  form.orderToId ? "anc-select-btn--selected" : "",
                ].filter(Boolean).join(" ")}
                onClick={() => setShowLabPopup(true)}
              >
                <span className={form.orderToLabel ? "anc-select-btn__value" : "anc-select-btn__placeholder"}>
                  {form.orderToLabel || "Select Lab..."}
                </span>
                {form.orderToId ? (
                  <span
                    className="anc-select-btn__clear"
                    role="button"
                    aria-label="Clear"
                    onClick={(e) => {
                      e.stopPropagation();
                      setForm((prev) => ({ ...prev, orderToId: null, orderToLabel: "" }));
                    }}
                  >
                    <svg width="11" height="11" fill="none" stroke="currentColor"
                      strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </span>
                ) : (
                  <span className="anc-select-btn__icon">
                    <svg width="13" height="13" fill="none" stroke="currentColor"
                      strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                  </span>
                )}
              </button>
              {errors.orderTo && <div className="anc-error">{errors.orderTo}</div>}
            </Col>

            {/* Order From */}
            <Col xs={12} md={4}>
              <label className="anc-label">
                Order From <span className="anc-required">*</span>
              </label>
              <button
                type="button"
                className={[
                  "anc-select-btn",
                  errors.orderFrom ? "is-invalid" : "",
                  form.orderFromId ? "anc-select-btn--selected" : "",
                ].filter(Boolean).join(" ")}
                onClick={() => !officesLoading && setShowOfficePopup(true)}
                disabled={officesLoading}
              >
                <span className={form.orderFromLabel ? "anc-select-btn__value" : "anc-select-btn__placeholder"}>
                  {officesLoading
                    ? "Loading practices..."
                    : form.orderFromLabel || "Select Practice / Office..."}
                </span>
                {form.orderFromId ? (
                  <span
                    className="anc-select-btn__clear"
                    role="button"
                    aria-label="Clear"
                    onClick={(e) => {
                      e.stopPropagation();
                      setForm((prev) => ({
                        ...prev,
                        orderFromId: null, orderFromLabel: "",
                        shipTo: "", dsoSchemaId: null, dsoSchemaName: "",
                      }));
                    }}
                  >
                    <svg width="11" height="11" fill="none" stroke="currentColor"
                      strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </span>
                ) : (
                  <span className="anc-select-btn__icon">
                    {officesLoading ? (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                          strokeLinecap="round"
                          style={{ animation: "spin 1s linear infinite" }} />
                      </svg>
                    ) : (
                      <svg width="13" height="13" fill="none" stroke="currentColor"
                        strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                      </svg>
                    )}
                  </span>
                )}
              </button>
              {errors.orderFrom && <div className="anc-error">{errors.orderFrom}</div>}
            </Col>

            {/* Ship To (read-only) */}
            <Col xs={12} md={4}>
              <label className="anc-label">Ship To</label>
              <input
                className="anc-input anc-input-readonly"
                value={form.shipTo}
                placeholder="Auto-filled from selected practice"
                readOnly
                title={form.shipTo}
              />
            </Col>

            {/* Patient ID */}
            <Col xs={12} sm={6} md={3}>
              <label className="anc-label">
                Patient ID <span className="anc-required">*</span>
              </label>
              <input
                className={`anc-input${errors.patientId ? " is-invalid" : ""}`}
                name="patientId"
                placeholder="Enter Patient ID"
                value={form.patientId}
                onChange={handleText}
                onBlur={(e) =>
                  setErrors((prev) => ({
                    ...prev,
                    patientId: validateField("patientId", e.target.value),
                  }))
                }
              />
              {errors.patientId && <div className="anc-error">{errors.patientId}</div>}
            </Col>

            {/* First Name */}
            <Col xs={12} sm={6} md={3}>
              <label className="anc-label">
                First Name <span className="anc-required">*</span>
              </label>
              <input
                className={`anc-input${errors.firstName ? " is-invalid" : ""}`}
                name="firstName"
                placeholder="Enter First Name"
                value={form.firstName}
                onChange={handleText}
                onBlur={(e) =>
                  setErrors((prev) => ({
                    ...prev,
                    firstName: validateField("firstName", e.target.value),
                  }))
                }
              />
              {errors.firstName && <div className="anc-error">{errors.firstName}</div>}
            </Col>

            {/* Last Name */}
            <Col xs={12} sm={6} md={3}>
              <label className="anc-label">
                Last Name <span className="anc-required">*</span>
              </label>
              <input
                className={`anc-input${errors.lastName ? " is-invalid" : ""}`}
                name="lastName"
                placeholder="Enter Last Name"
                value={form.lastName}
                onChange={handleText}
                onBlur={(e) =>
                  setErrors((prev) => ({
                    ...prev,
                    lastName: validateField("lastName", e.target.value),
                  }))
                }
              />
              {errors.lastName && <div className="anc-error">{errors.lastName}</div>}
            </Col>

            {/* Due Date */}
            <Col xs={12} sm={6} md={3}>
              <label className="anc-label">
                Due Date <span className="anc-required">*</span>
              </label>
              <input
                type="date"
                className={`anc-input${errors.dueDate ? " is-invalid" : ""}`}
                name="dueDate"
                value={form.dueDate}
                onChange={handleText}
                onBlur={(e) =>
                  setErrors((prev) => ({
                    ...prev,
                    dueDate: validateField("dueDate", e.target.value),
                  }))
                }
              />
              {errors.dueDate && <div className="anc-error">{errors.dueDate}</div>}
            </Col>

          </Row>
        </div>

        {/* ── Restoration Details card ─────────────────────────────────────── */}
        <div className="anc-card">
          <div className="anc-card-header">
            <span className="anc-card-title">
              Restoration Details
              {restorations.length > 0 && (
                <span className="anc-card-count">{restorations.length}</span>
              )}
            </span>
            <div className="anc-card-actions">
              <button
                className="anc-btn anc-btn-primary"
                type="button"
                onClick={() => setShowRestorationModal(true)}
              >
                Add Restoration
              </button>
              <button
                className="anc-btn anc-btn-outline"
                type="button"
                onClick={() => setShowServiceModal(true)}
              >
                Additional Services
              </button>
            </div>
          </div>

          {restorations.length === 0 ? (
            <div style={{
              minHeight: 28, color: "var(--theme-text-disabled, #aaa)",
              fontSize: "0.75rem", textAlign: "center", padding: "8px 0",
            }}>
              No restorations added yet. Click "Add Restoration" to begin.
            </div>
          ) : (
            <div className="anc-restoration-list">
              {restorations.map((r, idx) => (
                <div key={r.id} className="anc-restoration-row">
                  <span className="anc-rest-index">{idx + 1}</span>
                  <div className="anc-rest-teeth">
                    {r.selectedTeeth.length > 0 ? (
                      r.selectedTeeth.map((t) => (
                        <span key={t} className="anc-rest-tooth-badge">{t}</span>
                      ))
                    ) : (
                      <span className="anc-rest-no-teeth">No teeth</span>
                    )}
                  </div>
                  <div className="anc-rest-summary">
                    <span className="anc-rest-summary-main">{restorationLabel(r)}</span>
                    {r.material && (
                      <span className="anc-rest-summary-sub">
                        {r.material}
                        {r.shadeGuide && r.shadeGuide !== "Default" ? ` · ${r.shadeGuide}` : ""}
                      </span>
                    )}
                  </div>
                  <button
                    className="anc-rest-remove"
                    type="button"
                    onClick={() => handleRemoveRestoration(r.id)}
                    aria-label={`Remove restoration ${idx + 1}`}
                  >
                    <svg width="13" height="13" fill="none" stroke="currentColor"
                      strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Document + Case Notes ────────────────────────────────────────── */}
        <div className="anc-split">

          {/* Document Attachment */}
          <div className="anc-card">
            <div className="anc-card-header">
              <span className="anc-card-title">Document Attachment</span>
              <div className="anc-filetype-wrap">
                <span className="anc-filetype-label">File Type</span>
                <select
                  className="anc-filetype-select"
                  value={form.fileType}
                  name="fileType"
                  onChange={handleText}
                >
                  <option value="">Select File Type</option>
                  {FILE_TYPE_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div
              className={`anc-dropzone${dragOver ? " dragover" : ""}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              role="button"
              tabIndex={0}
              aria-label="Upload files"
              onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
            >
              <div className="anc-dropzone-icon"><UploadIcon /></div>
              <span className="anc-dropzone-text">Drag and Drop Files here or Choose file</span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              multiple
              style={{ display: "none" }}
              onChange={(e) => addFiles(e.target.files)}
            />

            {files.length > 0 && (
              <div className="anc-file-list">
                {files.map((f, i) => (
                  <div key={i} className="anc-file-chip">
                    <span className="anc-file-chip-name">{f.name}</span>
                    <button className="anc-file-chip-remove" type="button"
                      onClick={() => removeFile(i)} aria-label="Remove file">×</button>
                  </div>
                ))}
              </div>
            )}

            <div className="anc-file-note">Note: Max 2GB file upload allowed</div>

            <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}>
              <button className="anc-btn anc-btn-outline" type="button"
                onClick={() => fileInputRef.current?.click()}>
                Upload Files
              </button>
            </div>
          </div>

          {/* Case Notes */}
          <div className="anc-card">
            <div className="anc-card-header">
              <span className="anc-card-title">
                Case Notes <span className="anc-required">*</span>
              </span>
            </div>
            <textarea
              className={`anc-textarea${errors.caseNotes ? " is-invalid" : ""}`}
              name="caseNotes"
              placeholder="Enter case notes..."
              value={form.caseNotes}
              onChange={handleText}
              onBlur={(e) =>
                setErrors((prev) => ({
                  ...prev,
                  caseNotes: validateField("caseNotes", e.target.value),
                }))
              }
              style={{ height: "calc(100% - 50px)", minHeight: 130 }}
            />
            {errors.caseNotes && <div className="anc-error">{errors.caseNotes}</div>}
          </div>
        </div>

      </div>

      {/* ── Sticky footer ────────────────────────────────────────────────────── */}
      <div className="anc-footer">
        <button className="anc-btn anc-btn-reset" type="button"
          onClick={handleReset} disabled={submitting}>
          Reset
        </button>
        <button className="anc-btn anc-btn-draft" type="button"
          onClick={handleDraft} disabled={submitting}>
          Draft
        </button>
        <button className="anc-btn anc-btn-submit" type="button"
          onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          Popups & Modals
      ════════════════════════════════════════════════════════════════════════ */}

      <LabMasterPopup
        show={showLabPopup}
        onClose={() => setShowLabPopup(false)}
        onSelect={handleLabSelect}
      />

      <DentalOfficePopup
        show={showOfficePopup}
        onClose={() => setShowOfficePopup(false)}
        onSelect={handleOfficeSelect}
        offices={myOffices}
        loading={officesLoading}
      />

      <RestorationModal
        show={showRestorationModal}
        onHide={() => setShowRestorationModal(false)}
        onSave={handleRestorationSave}
        scheme={form.dsoSchemaName || "Default"}
        dsoMasterId={form.dsoMasterId}
      />

      {/* Additional Services Modal */}
      <Modal show={showServiceModal} onHide={closeServiceModal}
        centered size="sm" dialogClassName="anc-modal">
        <Modal.Header closeButton>
          <Modal.Title>Additional Services</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="anc-label">
              Service Name <span className="anc-required">*</span>
            </label>
            <KiduDropdown
              value={serviceNameVal}
              onChange={(val) => {
                setServiceNameVal(val);
                if (serviceNameError) setServiceNameError("");
              }}
              placeholder="Select Service Name"
              error={serviceNameError}
              inputWidth="100%"
            />
          </div>
          <div>
            <label className="anc-label">General Comments</label>
            <textarea
              className="anc-textarea"
              placeholder="Enter any General Comments"
              value={serviceComments}
              onChange={(e) => setServiceComments(e.target.value)}
              rows={3}
              style={{ resize: "vertical" }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" className="anc-btn anc-btn-outline" onClick={closeServiceModal}>
            Cancel
          </Button>
          <Button className="anc-btn anc-btn-primary" style={{ border: "none" }} onClick={saveService}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        /* ── SweetAlert2 theme overrides ─────────────────────────────── */
        .swal-popup {
          border-radius: 14px !important;
          font-family: inherit !important;
          padding: 2rem 1.5rem !important;
        }
        .swal-title {
          font-size: 1.2rem !important;
          font-weight: 600 !important;
          color: #1a1a2e !important;
        }
        .swal-confirm-btn {
          border-radius: 8px !important;
          font-weight: 600 !important;
          padding: 0.5rem 2rem !important;
          font-size: 0.9rem !important;
        }
      `}</style>
    </div>
  );
};

export default AddNewCase;