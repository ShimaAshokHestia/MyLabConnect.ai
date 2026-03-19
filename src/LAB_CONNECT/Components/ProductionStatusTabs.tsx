// src/LAB_CONNECT/Components/ProductionStageTabs.tsx
// REDESIGNED: compact single-row pill strip — minimal height, matches status bar style

import React from 'react';
import '../Styles/ProductionStatusTabs.css';

export type ProductionStage = 'model' | 'design' | 'manufacturing' | 'qc';

export interface ProductionStageCounts {
  model: number;
  design: number;
  manufacturing: number;
  qc: number;
}

export interface ProductionStageTabsProps {
  activeStage: ProductionStage;
  onStageSelect: (stage: ProductionStage) => void;
  counts: ProductionStageCounts;
}

interface StageConfig {
  key: ProductionStage;
  label: string;
  icon: React.ReactNode;
}

const STAGES: StageConfig[] = [
  {
    key: 'model',
    label: 'Model',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
  },
  {
    key: 'design',
    label: 'Design',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 20h9"/>
        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
  },
  {
    key: 'manufacturing',
    label: 'Manufacturing',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    ),
  },
  {
    key: 'qc',
    label: 'QC',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
  },
];

const ProductionStageTabs: React.FC<ProductionStageTabsProps> = ({
  activeStage,
  onStageSelect,
  counts,
}) => {
  const activeIndex = STAGES.findIndex(s => s.key === activeStage);

  return (
    <div className="pst-bar" role="tablist" aria-label="Production pipeline stages">

      {/* Left label */}
      <span className="pst-bar-label" aria-hidden="true">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
        Pipeline
      </span>

      {/* Pills + connectors */}
      <div className="pst-pills">
        {STAGES.map((stage, idx) => {
          const isActive = stage.key === activeStage;
          const isPast   = idx < activeIndex;
          const count    = counts[stage.key];

          return (
            <React.Fragment key={stage.key}>
              <button
                className={`pst-pill${isActive ? ' active' : ''}${isPast ? ' past' : ''}`}
                onClick={() => onStageSelect(stage.key)}
                role="tab"
                aria-selected={isActive}
                type="button"
                aria-label={`${stage.label}: ${count}`}
              >
                <span className="pst-pill-icon">{stage.icon}</span>
                <span className="pst-pill-label">{stage.label}</span>
                <span className="pst-pill-count">{count}</span>
              </button>

              {/* Arrow connector */}
              {idx < STAGES.length - 1 && (
                <span className={`pst-arrow${isPast ? ' past' : ''}`} aria-hidden="true">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProductionStageTabs;