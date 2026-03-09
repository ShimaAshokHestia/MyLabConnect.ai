import React, { useState, useCallback } from 'react';
import { Modal } from 'react-bootstrap';
import type { RestorationFormData } from './RestorationFormPanel';
import type { BreadcrumbStep } from './RestorationBreadcrumb';
import RestorationBreadcrumb from './RestorationBreadcrumb';
import TeethDiagram from './TeethDiagram';
import RestorationFormPanel from './RestorationFormPanel';
import '../../Styles/Case/RestorationModal.css';


// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface RestorationModalProps {
  show: boolean;
  onHide: () => void;
  /** Called with the completed form data on save */
  onSave?: (data: RestorationFormData & { selectedTeeth: number[] }) => void;
  /** Scheme label shown in the first breadcrumb step — passed from parent context */
  scheme?: string;
}

// ─────────────────────────────────────────────
// Initial state
// ─────────────────────────────────────────────

const INITIAL_FORM: RestorationFormData = {
  prosthesis: null,
  restoration: null,
  indication: null,
  material: '',
  shadeGuide: 'Default',
  shadeComments: '',
  generalComments: '',
  masterIncisal: '',
  masterMiddle: '',
  masterGingival: '',
  masterPrep: '',
  shadeRows: {},
};

const TOTAL_STEPS = 5;

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function buildBreadcrumbSteps(formData: RestorationFormData, scheme: string): BreadcrumbStep[] {
  return [
    { key: 'scheme',      label: 'Scheme',           value: scheme,                stepIndex: 0 },
    { key: 'prosthesis',  label: 'Prosthesis Type',  value: formData.prosthesis,   stepIndex: 1 },
    { key: 'restoration', label: 'Restoration Type', value: formData.restoration,  stepIndex: 2 },
    { key: 'indication',  label: 'Indication',       value: formData.indication,   stepIndex: 3 },
    { key: 'material',    label: 'Material Name',    value: formData.material || null, stepIndex: 4 },
    { key: 'shade',       label: 'Shade Guide',      value: formData.shadeGuide !== 'Default' ? formData.shadeGuide : null, stepIndex: 5 },
  ];
}

/** Clears all choices that come after a given step when navigating back */
function clearChoicesAfterStep(step: number, formData: RestorationFormData): Partial<RestorationFormData> {
  if (step <= 1) return { prosthesis: null, restoration: null, indication: null, material: '', shadeGuide: 'Default', shadeComments: '', generalComments: '', masterIncisal: '', masterMiddle: '', masterGingival: '', masterPrep: '', shadeRows: {} };
  if (step <= 2) return { restoration: null, indication: null, material: '', shadeGuide: 'Default', shadeComments: '', generalComments: '', masterIncisal: '', masterMiddle: '', masterGingival: '', masterPrep: '', shadeRows: {} };
  if (step <= 3) return { indication: null, material: '', shadeGuide: 'Default', shadeComments: '', generalComments: '', masterIncisal: '', masterMiddle: '', masterGingival: '', masterPrep: '', shadeRows: {} };
  if (step <= 4) return { material: '', shadeGuide: 'Default', shadeComments: '', generalComments: '', masterIncisal: '', masterMiddle: '', masterGingival: '', masterPrep: '', shadeRows: {} };
  return {};
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

const RestorationModal: React.FC<RestorationModalProps> = ({
  show,
  onHide,
  onSave,
  scheme = 'Affordable Private',
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<RestorationFormData>(INITIAL_FORM);
  const [selectedTeeth, setSelectedTeeth] = useState<Set<number>>(new Set());

  // ── Reset on open ──
  const handleShow = () => {
    setCurrentStep(1);
    setFormData(INITIAL_FORM);
    setSelectedTeeth(new Set());
  };

  // ── Form data updater ──
  const handleFormChange = useCallback((updates: Partial<RestorationFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  // ── Tooth toggle ──
  const handleToothToggle = useCallback((num: number) => {
    setSelectedTeeth(prev => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  }, []);

  // ── Breadcrumb navigation (back only) ──
  const handleBreadcrumbStep = useCallback((stepIndex: number) => {
    if (stepIndex >= currentStep) return; // forward nav not allowed from breadcrumb
    const cleared = clearChoicesAfterStep(stepIndex, formData);
    setFormData(prev => ({ ...prev, ...cleared }));
    setCurrentStep(stepIndex);
  }, [currentStep, formData]);

  // ── Step auto-advance (choice grids) ──
  // RestorationFormPanel calls onChange; we listen for field changes that trigger auto-advance
  const handleFormChangeWithAdvance = useCallback((updates: Partial<RestorationFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    // Auto-advance on choice selection (steps 1-3)
    if (currentStep <= 3 && (updates.prosthesis !== undefined || updates.restoration !== undefined || updates.indication !== undefined)) {
      setTimeout(() => setCurrentStep(s => Math.min(s + 1, TOTAL_STEPS)), 280);
    }
  }, [currentStep]);

  // ── Next / Back ──
  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(s => s + 1);
    } else {
      handleSave();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(s => s - 1);
    }
  };

  // ── Save ──
  const handleSave = () => {
    if (onSave) {
      onSave({ ...formData, selectedTeeth: Array.from(selectedTeeth).sort((a, b) => a - b) });
    }
    onHide();
  };

  const isLastStep = currentStep === TOTAL_STEPS;

  const breadcrumbSteps = buildBreadcrumbSteps(formData, scheme);

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
      {/* ── Breadcrumb header (no default Modal.Header) ── */}
      <RestorationBreadcrumb
        steps={breadcrumbSteps}
        currentStep={currentStep}
        onStepClick={handleBreadcrumbStep}
        onClose={onHide}
      />

      {/* ── Body: teeth left | form right ── */}
      <Modal.Body className="rest-modal-body p-0">
        <div className="rest-body-split">
          {/* Left: Teeth diagram */}
          <div className="rest-teeth-col">
            <TeethDiagram
              selectedTeeth={selectedTeeth}
              onToothToggle={handleToothToggle}
            />
          </div>

          {/* Right: Form panel */}
          <div className="rest-form-col">
            <RestorationFormPanel
              currentStep={currentStep}
              formData={formData}
              selectedTeeth={selectedTeeth}
              onChange={handleFormChangeWithAdvance}
            />
          </div>
        </div>
      </Modal.Body>

      {/* ── Footer ── */}
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
            className={`rest-btn ${isLastStep ? 'rest-btn--save' : 'rest-btn--next'}`}
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