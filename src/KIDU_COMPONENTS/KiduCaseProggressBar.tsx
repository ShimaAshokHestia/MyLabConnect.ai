import React from 'react';
import './CaseProgressStepper.css';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type StepStatus = 'done' | 'hold' | 'pending';

export interface StepItem {
  label: string;
  status: StepStatus;
}

export interface CaseProgressStepperProps {
  steps?: StepItem[];
  className?: string;
}

// ─────────────────────────────────────────────
// Default steps (matches the HTML original)
// ─────────────────────────────────────────────

const DEFAULT_STEPS: StepItem[] = [
  { label: 'Booking',    status: 'done'    },
  { label: 'Submitted',  status: 'done'    },
  { label: 'Accepted',   status: 'hold'    },
  { label: 'Production', status: 'pending' },
  { label: 'Shipped',    status: 'pending' },
  { label: 'Arrival',    status: 'pending' },
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const DoneIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const HoldIcon = () => (
  <span aria-hidden="true" style={{ fontSize: '0.7rem', fontWeight: 800 }}>!</span>
);

/** Determine line style based on the two neighbouring steps */
function getLineClass(left: StepItem, right: StepItem): string {
  if (left.status === 'done' && right.status === 'done') return 'step-line done';
  if (left.status === 'done' && right.status !== 'done') return 'step-line active';
  return 'step-line';
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

const KiduCaseProggressBar: React.FC<CaseProgressStepperProps> = ({
  steps = DEFAULT_STEPS,
  className = '',
}) => {
  return (
    <div
      className={`stepper-wrapper ${className}`}
      role="list"
      aria-label="Case progress steps"
    >
      {steps.map((step, idx) => (
        <React.Fragment key={`${step.label}-${idx}`}>
          {/* Step node */}
          <div className="stepper-item" role="listitem" aria-label={`${step.label}: ${step.status}`}>
            <div className={`step-dot ${step.status}`}>
              {step.status === 'done' && <DoneIcon />}
              {step.status === 'hold' && <HoldIcon />}
              {step.status === 'pending' && <span aria-hidden="true">{idx + 1}</span>}
            </div>
            <span className="step-label">{step.label}</span>
          </div>

          {/* Connector (not after last step) */}
          {idx < steps.length - 1 && (
            <div
              className={getLineClass(step, steps[idx + 1])}
              aria-hidden="true"
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default KiduCaseProggressBar;

// ─────────────────────────────────────────────
// Usage Example
// ─────────────────────────────────────────────
//
// import CaseProgressStepper, { StepItem } from './CaseProgressStepper';
//
// const steps: StepItem[] = [
//   { label: 'Booking',    status: 'done'    },
//   { label: 'Submitted',  status: 'done'    },
//   { label: 'Accepted',   status: 'hold'    },
//   { label: 'Production', status: 'pending' },
//   { label: 'Shipped',    status: 'pending' },
//   { label: 'Arrival',    status: 'pending' },
// ];
//
// <CaseProgressStepper steps={steps} />