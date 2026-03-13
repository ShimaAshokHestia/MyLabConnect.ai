// ─────────────────────────────────────────────────────────────────────────────
// FILE: src/KIDU_COMPONENTS/Case/RestorationFormPanel.tsx
// CHANGES:
//   • Removed ALL hardcoded option arrays (PROSTHESIS_OPTIONS etc.)
//   • Accepts API-driven option props from RestorationModal
//   • onChange now accepts optional selectedId for cascading
//   • Step 5 = Shade Guide choice grid (new step, matches old system)
//   • Step 6 = Comments + optional shade table (was step 5 before)
//   • Loading shimmer + empty state for materials
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import "../../Styles/Case/RestorationFormPanel.css";
import type { IdNameOption } from "../../DOCTOR_CONNECT/Service/Common/Prescription.services";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ShadeRowData {
  tooth:    number;
  incisal:  string;
  middle:   string;
  gingival: string;
  prep:     string;
}

export interface RestorationFormData {
  prosthesis:      string | null;
  restoration:     string | null;
  indication:      string | null;
  material:        string;
  shadeGuide:      string;
  shadeComments:   string;
  generalComments: string;
  masterIncisal:   string;
  masterMiddle:    string;
  masterGingival:  string;
  masterPrep:      string;
  shadeRows:       Record<number, ShadeRowData>;
}

interface RestorationFormPanelProps {
  currentStep:  number;
  formData:     RestorationFormData;
  selectedTeeth: Set<number>;
  // onChange accepts optional selectedId for cascading in parent
  onChange: (updates: Partial<RestorationFormData>, selectedId?: number) => void;

  // ── API-driven options (all hardcoded arrays removed) ──────────────────────
  prothesisOpts:   IdNameOption[];
  restorationOpts: IdNameOption[];
  indicationOpts:  IdNameOption[];
  materialOpts:    IdNameOption[];
  shadeGuideOpts:  IdNameOption[];
  optsLoading:     boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Shade options (only used in per-tooth table, step 6)
// ─────────────────────────────────────────────────────────────────────────────

const SHADE_OPTIONS = [
  "", "A1", "A2", "A3", "A3.5", "A4",
  "B1", "B2", "B3", "B4",
  "C1", "C2", "C3", "C4",
  "D2", "D3", "D4",
];

// ─────────────────────────────────────────────────────────────────────────────
// Loading shimmer
// ─────────────────────────────────────────────────────────────────────────────

const OptionsLoading: React.FC = () => (
  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: "4px 0" }}>
    {[120, 90, 140, 80, 110].map((w, i) => (
      <div
        key={i}
        style={{
          width: w,
          height: 38,
          borderRadius: 8,
          background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",
          backgroundSize: "200% 100%",
          animation: "rfp-shimmer 1.4s infinite",
        }}
      />
    ))}
    <style>{`@keyframes rfp-shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Empty state (materials step when no materials configured)
// ─────────────────────────────────────────────────────────────────────────────

const NoMaterials: React.FC = () => (
  <div style={{ textAlign: "center", padding: "36px 0" }}>
    <svg width="48" height="48" fill="none" stroke="#94a3b8" strokeWidth="1.2" viewBox="0 0 24 24">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
    <p style={{ color: "#64748b", margin: "10px 0 4px", fontSize: "0.88rem", fontWeight: 500 }}>
      No material name available
    </p>
    <span style={{ color: "#94a3b8", fontSize: "0.75rem" }}>Please try again later</span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Reusable choice grid — now takes IdNameOption[] for ID capture
// ─────────────────────────────────────────────────────────────────────────────

interface ChoiceGridProps {
  label:    string;
  options:  IdNameOption[];
  selected: string | null;
  onSelect: (name: string, id: number) => void;
  loading:  boolean;
}

const ChoiceGrid: React.FC<ChoiceGridProps> = ({ label, options, selected, onSelect, loading }) => (
  <div className="rfp-step">
    <div className="rfp-section-title">
      {label} <span className="rfp-required">*</span>
    </div>
    {loading ? (
      <OptionsLoading />
    ) : options.length === 0 ? (
      <div style={{ color: "#94a3b8", fontSize: "0.8rem", padding: "8px 0" }}>
        No options available.
      </div>
    ) : (
      <div className="rfp-choice-grid">
        {options.map(opt => (
          <button
            key={opt.id}
            className={`rfp-choice-btn${selected === opt.name ? " rfp-choice-btn--selected" : ""}`}
            onClick={() => onSelect(opt.name, opt.id)}
            type="button"
          >
            {opt.name}
          </button>
        ))}
      </div>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Step 6: Shade Details (comments + per-tooth table)
// ─────────────────────────────────────────────────────────────────────────────

interface Step6Props {
  formData:     RestorationFormData;
  selectedTeeth: Set<number>;
  onChange:     (updates: Partial<RestorationFormData>) => void;
}

const Step6Shade: React.FC<Step6Props> = ({ formData, selectedTeeth, onChange }) => {
  const sortedTeeth = Array.from(selectedTeeth).sort((a, b) => a - b);

  const updateShadeRow = (
    tooth: number,
    field: keyof Omit<ShadeRowData, "tooth">,
    value: string
  ) => {
    onChange({
      shadeRows: {
        ...formData.shadeRows,
        [tooth]: {
          ...(formData.shadeRows[tooth] ?? { tooth, incisal: "", middle: "", gingival: "", prep: "" }),
          [field]: value,
        },
      },
    });
  };

  const applyToAll = () => {
    const updated: Record<number, ShadeRowData> = {};
    sortedTeeth.forEach(t => {
      updated[t] = {
        tooth:    t,
        incisal:  formData.masterIncisal  || formData.shadeRows[t]?.incisal  || "",
        middle:   formData.masterMiddle   || formData.shadeRows[t]?.middle   || "",
        gingival: formData.masterGingival || formData.shadeRows[t]?.gingival || "",
        prep:     formData.masterPrep     || formData.shadeRows[t]?.prep     || "",
      };
    });
    onChange({ shadeRows: updated });
  };

  const ShadeSelect: React.FC<{
    value: string;
    onChange: (v: string) => void;
    highlight?: boolean;
  }> = ({ value, onChange: oc, highlight }) => (
    <select
      className={`rfp-select rfp-select--sm${highlight ? " rfp-select--highlight" : ""}`}
      value={value}
      onChange={e => oc(e.target.value)}
    >
      {SHADE_OPTIONS.map(o => <option key={o} value={o}>{o || "—"}</option>)}
    </select>
  );

  return (
    <div className="rfp-step">
      <div className="rfp-section-title">Shade Details</div>

      {/* Comments row */}
      <div className="rfp-row-2">
        <div className="rfp-field">
          <label className="rfp-label">Shade Comments</label>
          <textarea
            className="rfp-textarea"
            placeholder="Enter any shade comments…"
            value={formData.shadeComments}
            onChange={e => onChange({ shadeComments: e.target.value })}
            rows={3}
          />
        </div>
        <div className="rfp-field">
          <label className="rfp-label">General Comments</label>
          <textarea
            className="rfp-textarea"
            placeholder="Enter any general comments…"
            value={formData.generalComments}
            onChange={e => onChange({ generalComments: e.target.value })}
            rows={3}
          />
        </div>
      </div>

      {/* Master shade box */}
      <div className="rfp-master-shade">
        <div className="rfp-master-shade-hd">
          <div>
            <span className="rfp-master-title">Master Shade Settings</span>
            <span className="rfp-master-sub"> — applies to all selected teeth</span>
          </div>
          <button className="rfp-apply-all-btn" type="button" onClick={applyToAll}>
            Apply to All
          </button>
        </div>
        <div className="rfp-master-grid">
          {[
            { label: "Incisal / Occlusal", field: "masterIncisal"  as keyof RestorationFormData, type: "select" },
            { label: "Middle",             field: "masterMiddle"   as keyof RestorationFormData, type: "select" },
            { label: "Gingival",           field: "masterGingival" as keyof RestorationFormData, type: "select" },
            { label: "Prep",               field: "masterPrep"     as keyof RestorationFormData, type: "input"  },
          ].map(({ label, field, type }) => (
            <div key={field} className="rfp-field">
              <label className="rfp-label rfp-label--xs">{label}</label>
              {type === "select" ? (
                <select
                  className="rfp-select"
                  value={String(formData[field] ?? "")}
                  onChange={e => onChange({ [field]: e.target.value })}
                >
                  {SHADE_OPTIONS.map(o => <option key={o} value={o}>{o || "—"}</option>)}
                </select>
              ) : (
                <input
                  className="rfp-input"
                  placeholder="Enter"
                  value={String(formData[field] ?? "")}
                  onChange={e => onChange({ [field]: e.target.value })}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Per-tooth shade table */}
      <div>
        <div className="rfp-section-title rfp-section-title--sub">Tooth Details</div>
        {sortedTeeth.length === 0 ? (
          <div className="rfp-table-empty">
            Select teeth from the diagram to add shade details
          </div>
        ) : (
          <div className="rfp-table-wrap">
            <table className="rfp-table">
              <thead>
                <tr>
                  <th>Tooth</th>
                  <th>Incisal / Occlusal</th>
                  <th className="rfp-th-required">Middle</th>
                  <th>Gingival</th>
                  <th>Prep</th>
                </tr>
              </thead>
              <tbody>
                {sortedTeeth.map(tooth => {
                  const row = formData.shadeRows[tooth] ?? {
                    tooth, incisal: "", middle: "", gingival: "", prep: "",
                  };
                  return (
                    <tr key={tooth}>
                      <td className="rfp-td-tooth">{tooth}</td>
                      <td><ShadeSelect value={row.incisal}  onChange={v => updateShadeRow(tooth, "incisal",  v)} /></td>
                      <td><ShadeSelect value={row.middle}   onChange={v => updateShadeRow(tooth, "middle",   v)} highlight /></td>
                      <td><ShadeSelect value={row.gingival} onChange={v => updateShadeRow(tooth, "gingival", v)} /></td>
                      <td>
                        <input
                          className="rfp-input rfp-input--sm"
                          placeholder="Enter"
                          value={row.prep}
                          onChange={e => updateShadeRow(tooth, "prep", e.target.value)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

const RestorationFormPanel: React.FC<RestorationFormPanelProps> = ({
  currentStep,
  formData,
  selectedTeeth,
  onChange,
  prothesisOpts,
  restorationOpts,
  indicationOpts,
  materialOpts,
  shadeGuideOpts,
  optsLoading,
}) => {
  return (
    <div className="rfp-container">

      {/* Step 1 — Prosthesis Type */}
      {currentStep === 1 && (
        <ChoiceGrid
          label="Choose Prosthesis Type"
          options={prothesisOpts}
          selected={formData.prosthesis}
          onSelect={(name, id) => onChange({ prosthesis: name }, id)}
          loading={optsLoading}
        />
      )}

      {/* Step 2 — Restoration Type */}
      {currentStep === 2 && (
        <ChoiceGrid
          label="Choose Restoration Type"
          options={restorationOpts}
          selected={formData.restoration}
          onSelect={(name, id) => onChange({ restoration: name }, id)}
          loading={optsLoading}
        />
      )}

      {/* Step 3 — Indication */}
      {currentStep === 3 && (
        <ChoiceGrid
          label="Choose Indication"
          options={indicationOpts}
          selected={formData.indication}
          onSelect={(name, id) => onChange({ indication: name }, id)}
          loading={optsLoading}
        />
      )}

      {/* Step 4 — Material Name (with empty state) */}
      {currentStep === 4 && (
        <div className="rfp-step">
          <div className="rfp-section-title">
            Choose Material Name <span className="rfp-required">*</span>
          </div>
          {optsLoading ? (
            <OptionsLoading />
          ) : materialOpts.length === 0 ? (
            <NoMaterials />
          ) : (
            <div className="rfp-choice-grid">
              {materialOpts.map(opt => (
                <button
                  key={opt.id}
                  className={`rfp-choice-btn${formData.material === opt.name ? " rfp-choice-btn--selected" : ""}`}
                  onClick={() => onChange({ material: opt.name }, opt.id)}
                  type="button"
                >
                  {opt.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 5 — Shade Guide (choice grid — NEW step matching old system) */}
      {currentStep === 5 && (
        <div className="rfp-step">
          <div className="rfp-section-title">
            Choose Shade Guide <span className="rfp-required">*</span>
          </div>
          <div className="rfp-choice-grid">
            {shadeGuideOpts.map(opt => (
              <button
                key={opt.id}
                className={`rfp-choice-btn${formData.shadeGuide === opt.name ? " rfp-choice-btn--selected" : ""}`}
                onClick={() => onChange({ shadeGuide: opt.name })}
                type="button"
              >
                {opt.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 6 — Shade details + comments (was step 5 before) */}
      {currentStep === 6 && (
        <Step6Shade
          formData={formData}
          selectedTeeth={selectedTeeth}
          onChange={onChange}
        />
      )}

    </div>
  );
};

export default RestorationFormPanel;