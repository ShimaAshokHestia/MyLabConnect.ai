import React from 'react';
import '../../Styles/Case/RestorationBreadcrumb.css';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface BreadcrumbStep {
  key: string;
  label: string;
  value: string | null;
  stepIndex: number;
}

interface RestorationBreadcrumbProps {
  steps: BreadcrumbStep[];
  currentStep: number;
  onStepClick: (stepIndex: number) => void;
  onClose: () => void;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

const ChevronIcon: React.FC = () => (
  <svg
    className="bc-arrow"
    width="14"
    height="14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const CloseIcon: React.FC = () => (
  <svg
    width="13"
    height="13"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    viewBox="0 0 24 24"
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const RestorationBreadcrumb: React.FC<RestorationBreadcrumbProps> = ({
  steps,
  currentStep,
  onStepClick,
  onClose,
}) => {
  const canNavigateTo = (stepIndex: number): boolean => {
    // Can navigate back to completed steps only
    return stepIndex < currentStep;
  };

  return (
    <div className="rb-container">
      <div className="rb-steps-wrap">
        {steps.map((step, idx) => {
          const isActive = currentStep === step.stepIndex;
          const isCompleted = step.value !== null && step.stepIndex < currentStep;
          const isClickable = canNavigateTo(step.stepIndex);

          return (
            <React.Fragment key={step.key}>
              <button
                className={[
                  'rb-step',
                  isActive ? 'rb-step--active' : '',
                  isCompleted ? 'rb-step--completed' : '',
                  !step.value && !isActive ? 'rb-step--empty' : '',
                  isClickable ? 'rb-step--clickable' : '',
                ].join(' ')}
                onClick={() => isClickable && onStepClick(step.stepIndex)}
                disabled={!isClickable && !isActive}
                title={isClickable ? `Go back to ${step.label}` : undefined}
              >
                <span className="rb-step-label">{step.label}</span>
                <span className={`rb-step-value ${!step.value ? 'rb-step-value--empty' : ''}`}>
                  {step.value ?? '—'}
                </span>
                {isCompleted && (
                  <span className="rb-step-check">
                    <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                )}
              </button>

              {idx < steps.length - 1 && <ChevronIcon />}
            </React.Fragment>
          );
        })}
      </div>

      <button className="rb-close" onClick={onClose} aria-label="Close restoration modal">
        <CloseIcon />
      </button>
    </div>
  );
};

export default RestorationBreadcrumb;