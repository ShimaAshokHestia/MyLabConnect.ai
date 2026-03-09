import React from 'react';
import '../../Styles/Case/RestorationFormPanel.css';

// ─────────────────────────────────────────────
// Types & constants
// ─────────────────────────────────────────────

export interface ShadeRowData {
  tooth: number;
  incisal: string;
  middle: string;
  gingival: string;
  prep: string;
}

export interface RestorationFormData {
  prosthesis: string | null;
  restoration: string | null;
  indication: string | null;
  material: string;
  shadeGuide: string;
  shadeComments: string;
  generalComments: string;
  masterIncisal: string;
  masterMiddle: string;
  masterGingival: string;
  masterPrep: string;
  shadeRows: Record<number, ShadeRowData>;
}

interface RestorationFormPanelProps {
  currentStep: number;
  formData: RestorationFormData;
  selectedTeeth: Set<number>;
  onChange: (updates: Partial<RestorationFormData>) => void;
}

const SHADE_OPTIONS = ['', 'A1', 'A2', 'A3', 'A3.5', 'A4', 'B1', 'B2', 'B3', 'B4', 'C1', 'C2', 'C3', 'C4', 'D2', 'D3', 'D4'];

const PROSTHESIS_OPTIONS = ['Fixed', 'Removable'];

const RESTORATION_OPTIONS = ['Ceramic', 'Full Metal', 'PFM', 'Zirconia', 'E-Max', 'PMMA'];

const INDICATION_OPTIONS = ['NHS Crown', 'NHS Post & Core', 'Bridge', 'Implant Crown', 'Veneer', 'Onlay'];

const MATERIAL_OPTIONS = [
  '3/4 Non-Precious', 'Full Precious', 'Semi-Precious',
  'Zirconia Standard', 'Zirconia Ultra-Translucent',
  'Lithium Disilicate', 'PMMA Temporary',
];

const SHADE_GUIDE_OPTIONS = ['Default', 'Vita Classical', 'Vita 3D-Master', 'Chromascop', 'Bleach'];

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

interface ChoiceGridProps {
  label: string;
  options: string[];
  selected: string | null;
  onSelect: (val: string) => void;
}

const ChoiceGrid: React.FC<ChoiceGridProps> = ({ label, options, selected, onSelect }) => (
  <div className="rfp-step">
    <div className="rfp-section-title">
      {label} <span className="rfp-required">*</span>
    </div>
    <div className="rfp-choice-grid">
      {options.map(opt => (
        <button
          key={opt}
          className={`rfp-choice-btn ${selected === opt ? 'rfp-choice-btn--selected' : ''}`}
          onClick={() => onSelect(opt)}
          type="button"
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Step 4: Material & Shade Guide
// ─────────────────────────────────────────────

interface Step4Props {
  formData: RestorationFormData;
  onChange: (updates: Partial<RestorationFormData>) => void;
}

const Step4Material: React.FC<Step4Props> = ({ formData, onChange }) => (
  <div className="rfp-step">
    <div className="rfp-section-title">Material &amp; Shade Guide</div>
    <div className="rfp-row-2">
      <div className="rfp-field">
        <label className="rfp-label">
          Material Name <span className="rfp-required">*</span>
        </label>
        <select
          className="rfp-select"
          value={formData.material}
          onChange={e => onChange({ material: e.target.value })}
        >
          <option value="">Select material…</option>
          {MATERIAL_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      <div className="rfp-field">
        <label className="rfp-label">Shade Guide</label>
        <select
          className="rfp-select"
          value={formData.shadeGuide}
          onChange={e => onChange({ shadeGuide: e.target.value })}
        >
          {SHADE_GUIDE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Step 5: Shade Details
// ─────────────────────────────────────────────

interface Step5Props {
  formData: RestorationFormData;
  selectedTeeth: Set<number>;
  onChange: (updates: Partial<RestorationFormData>) => void;
}

const Step5Shade: React.FC<Step5Props> = ({ formData, selectedTeeth, onChange }) => {
  const sortedTeeth = Array.from(selectedTeeth).sort((a, b) => a - b);

  const updateShadeRow = (tooth: number, field: keyof Omit<ShadeRowData, 'tooth'>, value: string) => {
    onChange({
      shadeRows: {
        ...formData.shadeRows,
        [tooth]: { ...(formData.shadeRows[tooth] ?? { tooth, incisal: '', middle: '', gingival: '', prep: '' }), [field]: value },
      },
    });
  };

  const applyToAll = () => {
    const updated: Record<number, ShadeRowData> = {};
    sortedTeeth.forEach(t => {
      updated[t] = {
        tooth: t,
        incisal: formData.masterIncisal || formData.shadeRows[t]?.incisal || '',
        middle: formData.masterMiddle || formData.shadeRows[t]?.middle || '',
        gingival: formData.masterGingival || formData.shadeRows[t]?.gingival || '',
        prep: formData.masterPrep || formData.shadeRows[t]?.prep || '',
      };
    });
    onChange({ shadeRows: updated });
  };

  const ShadeSelect: React.FC<{ value: string; onChange: (v: string) => void; highlight?: boolean }> = ({ value, onChange: oc, highlight }) => (
    <select className={`rfp-select rfp-select--sm ${highlight ? 'rfp-select--highlight' : ''}`} value={value} onChange={e => oc(e.target.value)}>
      {SHADE_OPTIONS.map(o => <option key={o} value={o}>{o || '—'}</option>)}
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
            { label: 'Incisal / Occlusal', field: 'masterIncisal' as keyof RestorationFormData, type: 'select' },
            { label: 'Middle', field: 'masterMiddle' as keyof RestorationFormData, type: 'select' },
            { label: 'Gingival', field: 'masterGingival' as keyof RestorationFormData, type: 'select' },
            { label: 'Prep', field: 'masterPrep' as keyof RestorationFormData, type: 'input' },
          ].map(({ label, field, type }) => (
            <div key={field} className="rfp-field">
              <label className="rfp-label rfp-label--xs">{label}</label>
              {type === 'select' ? (
                <select
                  className="rfp-select"
                  value={String(formData[field] ?? '')}
                  onChange={e => onChange({ [field]: e.target.value })}
                >
                  {SHADE_OPTIONS.map(o => <option key={o} value={o}>{o || '—'}</option>)}
                </select>
              ) : (
                <input
                  className="rfp-input"
                  placeholder="Enter"
                  value={String(formData[field] ?? '')}
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
          <div className="rfp-table-empty">Select teeth from the diagram to add shade details</div>
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
                  const row = formData.shadeRows[tooth] ?? { tooth, incisal: '', middle: '', gingival: '', prep: '' };
                  return (
                    <tr key={tooth}>
                      <td className="rfp-td-tooth">{tooth}</td>
                      <td><ShadeSelect value={row.incisal} onChange={v => updateShadeRow(tooth, 'incisal', v)} /></td>
                      <td><ShadeSelect value={row.middle} onChange={v => updateShadeRow(tooth, 'middle', v)} highlight /></td>
                      <td><ShadeSelect value={row.gingival} onChange={v => updateShadeRow(tooth, 'gingival', v)} /></td>
                      <td>
                        <input
                          className="rfp-input rfp-input--sm"
                          placeholder="Enter"
                          value={row.prep}
                          onChange={e => updateShadeRow(tooth, 'prep', e.target.value)}
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

// ─────────────────────────────────────────────
// Main RestorationFormPanel
// ─────────────────────────────────────────────

const RestorationFormPanel: React.FC<RestorationFormPanelProps> = ({
  currentStep,
  formData,
  selectedTeeth,
  onChange,
}) => {
  return (
    <div className="rfp-container">
      {/* Step 1 */}
      {currentStep === 1 && (
        <ChoiceGrid
          label="Choose Prosthesis Type"
          options={PROSTHESIS_OPTIONS}
          selected={formData.prosthesis}
          onSelect={val => onChange({ prosthesis: val })}
        />
      )}

      {/* Step 2 */}
      {currentStep === 2 && (
        <ChoiceGrid
          label="Choose Restoration Type"
          options={RESTORATION_OPTIONS}
          selected={formData.restoration}
          onSelect={val => onChange({ restoration: val })}
        />
      )}

      {/* Step 3 */}
      {currentStep === 3 && (
        <ChoiceGrid
          label="Choose Indication"
          options={INDICATION_OPTIONS}
          selected={formData.indication}
          onSelect={val => onChange({ indication: val })}
        />
      )}

      {/* Step 4 */}
      {currentStep === 4 && (
        <Step4Material formData={formData} onChange={onChange} />
      )}

      {/* Step 5 */}
      {currentStep === 5 && (
        <Step5Shade formData={formData} selectedTeeth={selectedTeeth} onChange={onChange} />
      )}
    </div>
  );
};

export default RestorationFormPanel;