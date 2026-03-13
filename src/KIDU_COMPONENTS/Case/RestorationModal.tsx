// ─────────────────────────────────────────────────────────────────────────────
// FILE: src/KIDU_COMPONENTS/Case/RestorationModal.tsx
// CHANGES: Added dsoMasterId prop; loads all step options from API via
//          PrescriptionService; bumped to 6 steps (added Shade Guide step).
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useCallback, useEffect } from "react";
import { Modal } from "react-bootstrap";
import type { RestorationFormData } from "./RestorationFormPanel";
import type { BreadcrumbStep } from "./RestorationBreadcrumb";
import RestorationBreadcrumb from "./RestorationBreadcrumb";
import TeethDiagram from "./TeethDiagram";
import RestorationFormPanel from "./RestorationFormPanel";
import "../../Styles/Case/RestorationModal.css";
import type { IdNameOption } from "../../DOCTOR_CONNECT/Service/Common/Prescription.services";
import PrescriptionService from "../../DOCTOR_CONNECT/Service/Common/Prescription.services";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface RestorationModalProps {
  show: boolean;
  onHide: () => void;
  onSave?: (data: RestorationFormData & { selectedTeeth: number[] }) => void;
  scheme?: string;
  dsoMasterId: number | null;   // ← NEW: drives all API option loading
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_FORM: RestorationFormData = {
  prosthesis:      null,
  restoration:     null,
  indication:      null,
  material:        "",
  shadeGuide:      "Default",
  shadeComments:   "",
  generalComments: "",
  masterIncisal:   "",
  masterMiddle:    "",
  masterGingival:  "",
  masterPrep:      "",
  shadeRows:       {},
};

const TOTAL_STEPS = 6; // 1-Prosthesis 2-Restoration 3-Indication 4-Material 5-Shade 6-Comments

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function buildBreadcrumbSteps(
  formData: RestorationFormData,
  scheme: string
): BreadcrumbStep[] {
  return [
    { key: "scheme",      label: "Scheme",           value: scheme,                         stepIndex: 0 },
    { key: "prosthesis",  label: "Prosthesis Type",  value: formData.prosthesis,            stepIndex: 1 },
    { key: "restoration", label: "Restoration Type", value: formData.restoration,           stepIndex: 2 },
    { key: "indication",  label: "Indication",       value: formData.indication,            stepIndex: 3 },
    { key: "material",    label: "Material Name",    value: formData.material || null,      stepIndex: 4 },
    { key: "shade",       label: "Shade Guide",      value: formData.shadeGuide !== "Default"
                                                            ? formData.shadeGuide : null,   stepIndex: 5 },
  ];
}

function clearChoicesAfterStep(
  step: number,
  formData: RestorationFormData
): Partial<RestorationFormData> {
  if (step <= 1) return {
    prosthesis: null, restoration: null, indication: null,
    material: "", shadeGuide: "Default", shadeComments: "",
    generalComments: "", masterIncisal: "", masterMiddle: "",
    masterGingival: "", masterPrep: "", shadeRows: {},
  };
  if (step <= 2) return {
    restoration: null, indication: null,
    material: "", shadeGuide: "Default", shadeComments: "",
    generalComments: "", masterIncisal: "", masterMiddle: "",
    masterGingival: "", masterPrep: "", shadeRows: {},
  };
  if (step <= 3) return {
    indication: null,
    material: "", shadeGuide: "Default", shadeComments: "",
    generalComments: "", masterIncisal: "", masterMiddle: "",
    masterGingival: "", masterPrep: "", shadeRows: {},
  };
  if (step <= 4) return {
    material: "", shadeGuide: "Default", shadeComments: "",
    generalComments: "", masterIncisal: "", masterMiddle: "",
    masterGingival: "", masterPrep: "", shadeRows: {},
  };
  if (step <= 5) return {
    shadeGuide: "Default", shadeComments: "",
    generalComments: "", masterIncisal: "", masterMiddle: "",
    masterGingival: "", masterPrep: "", shadeRows: {},
  };
  return {};
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const RestorationModal: React.FC<RestorationModalProps> = ({
  show,
  onHide,
  onSave,
  scheme = "Affordable Private",
  dsoMasterId,
}) => {
  const [currentStep,   setCurrentStep]   = useState<number>(1);
  const [formData,      setFormData]       = useState<RestorationFormData>(INITIAL_FORM);
  const [selectedTeeth, setSelectedTeeth]  = useState<Set<number>>(new Set());

  // ── API-loaded options ─────────────────────────────────────────────────────
  const [prothesisOpts,   setProthesisOpts]   = useState<IdNameOption[]>([]);
  const [restorationOpts, setRestorationOpts] = useState<IdNameOption[]>([]);
  const [indicationOpts,  setIndicationOpts]  = useState<IdNameOption[]>([]);
  const [materialOpts,    setMaterialOpts]    = useState<IdNameOption[]>([]);
  const shadeGuideOpts = PrescriptionService.getShadeGuides(); // static fallback

  // Track selected IDs for cascading (form data stores names; we need IDs to filter)
  const [selProthesisId,   setSelProthesisId]   = useState(0);
  const [selRestorationId, setSelRestorationId] = useState(0);

  const [optsLoading, setOptsLoading] = useState(false);

  // ── Reset + load prothesis options when modal opens ────────────────────────
  const handleShow = () => {
    setCurrentStep(1);
    setFormData(INITIAL_FORM);
    setSelectedTeeth(new Set());
    setProthesisOpts([]);
    setRestorationOpts([]);
    setIndicationOpts([]);
    setMaterialOpts([]);
    setSelProthesisId(0);
    setSelRestorationId(0);

    if (dsoMasterId) {
      setOptsLoading(true);
      PrescriptionService.getProthesisTypes(dsoMasterId)
        .then(setProthesisOpts)
        .finally(() => setOptsLoading(false));
    }
  };

  // ── Cascade: prothesis selected → load restoration types + indications ─────
  useEffect(() => {
    if (!selProthesisId) return;
    setOptsLoading(true);
    Promise.all([
      PrescriptionService.getRestorationTypes(selProthesisId),
      PrescriptionService.getIndications(selProthesisId),
    ])
      .then(([rest, ind]) => {
        setRestorationOpts(rest);
        setIndicationOpts(ind);
      })
      .finally(() => setOptsLoading(false));
  }, [selProthesisId]);

  // ── Cascade: restoration type selected → load materials ──────────────────
  useEffect(() => {
    if (!selRestorationId) return;
    setOptsLoading(true);
    PrescriptionService.getMaterials(selRestorationId)
      .then(setMaterialOpts)
      .finally(() => setOptsLoading(false));
  }, [selRestorationId]);

  // ── Tooth toggle ───────────────────────────────────────────────────────────
  const handleToothToggle = useCallback((num: number) => {
    setSelectedTeeth(prev => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  }, []);

  // ── Breadcrumb back-navigation ─────────────────────────────────────────────
  const handleBreadcrumbStep = useCallback(
    (stepIndex: number) => {
      if (stepIndex >= currentStep) return;
      const cleared = clearChoicesAfterStep(stepIndex, formData);
      setFormData(prev => ({ ...prev, ...cleared }));
      setCurrentStep(stepIndex);
    },
    [currentStep, formData]
  );

  // ── Form change with auto-advance + ID capture ────────────────────────────
  const handleFormChangeWithAdvance = useCallback(
    (updates: Partial<RestorationFormData>, selectedId = 0) => {
      setFormData(prev => ({ ...prev, ...updates }));

      // Step 1 → 2: prosthesis chosen
      if (updates.prosthesis !== undefined) {
        setSelProthesisId(selectedId);
        setTimeout(() => setCurrentStep(s => Math.min(s + 1, TOTAL_STEPS)), 280);
      }
      // Step 2 → 3: restoration type chosen
      else if (updates.restoration !== undefined) {
        setSelRestorationId(selectedId);
        setTimeout(() => setCurrentStep(s => Math.min(s + 1, TOTAL_STEPS)), 280);
      }
      // Step 3 → 4: indication chosen
      else if (updates.indication !== undefined) {
        setTimeout(() => setCurrentStep(s => Math.min(s + 1, TOTAL_STEPS)), 280);
      }
      // Step 4 → 5: material chosen
      else if (updates.material !== undefined) {
        setTimeout(() => setCurrentStep(s => Math.min(s + 1, TOTAL_STEPS)), 280);
      }
      // Step 5 → 6: shade guide chosen
      else if (updates.shadeGuide !== undefined && currentStep === 5) {
        setTimeout(() => setCurrentStep(s => Math.min(s + 1, TOTAL_STEPS)), 280);
      }
    },
    [currentStep]
  );

  // ── Next / Back ────────────────────────────────────────────────────────────
  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) setCurrentStep(s => s + 1);
    else handleSave();
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(s => s - 1);
  };

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSave = () => {
    onSave?.({
      ...formData,
      selectedTeeth: Array.from(selectedTeeth).sort((a, b) => a - b),
    });
    onHide();
  };

  const isLastStep        = currentStep === TOTAL_STEPS;
  const breadcrumbSteps   = buildBreadcrumbSteps(formData, scheme);

  return (
    <Modal
      show={show}
      onHide={onHide}
      onShow={handleShow}
      size="xl"
      centered
      scrollable={false}
      dialogClassName="rest-modal-dialog"
      contentClassName="rest-modal-content"
      backdropClassName="rest-modal-backdrop"
      animation
    >
      {/* ── Breadcrumb header ─────────────────────────────────────────────── */}
      <RestorationBreadcrumb
        steps={breadcrumbSteps}
        currentStep={currentStep}
        onStepClick={handleBreadcrumbStep}
        onClose={onHide}
      />

      {/* ── Body: teeth left | form right ────────────────────────────────── */}
      <Modal.Body className="rest-modal-body p-0">
        <div className="rest-body-split">

          {/* Left: Teeth diagram */}
          <div className="rest-teeth-col">
            <TeethDiagram
              selectedTeeth={selectedTeeth}
              onToothToggle={handleToothToggle}
            />
          </div>

          {/* Right: Form panel — receives API options */}
          <div className="rest-form-col">
            <RestorationFormPanel
              currentStep={currentStep}
              formData={formData}
              selectedTeeth={selectedTeeth}
              onChange={handleFormChangeWithAdvance}
              // API-driven options (replaces all hardcoded arrays in RestorationFormPanel)
              prothesisOpts={prothesisOpts}
              restorationOpts={restorationOpts}
              indicationOpts={indicationOpts}
              materialOpts={materialOpts}
              shadeGuideOpts={shadeGuideOpts}
              optsLoading={optsLoading}
            />
          </div>

        </div>
      </Modal.Body>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <div className="rest-modal-footer">
        {currentStep > 1 ? (
          <button className="rest-btn rest-btn--back" onClick={handleBack} type="button">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back
          </button>
        ) : (
          <div />
        )}

        <div className="rest-footer-right">
          <button className="rest-btn rest-btn--cancel" onClick={onHide} type="button">
            Cancel
          </button>
          <button
            className={`rest-btn ${isLastStep ? "rest-btn--save" : "rest-btn--next"}`}
            onClick={handleNext}
            type="button"
          >
            {isLastStep ? (
              <>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Save Changes
              </>
            ) : (
              <>
                Next
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RestorationModal;