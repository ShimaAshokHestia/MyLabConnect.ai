import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import '../Styles/Preferencestep.css';

export interface GeneralPreferencesData {
  metalOfChoice: string;
  metalCollars: string;
  occlusionContacts: string;
  anatomy: string;
  insufficientRoom: string;
  interproximalContact: string;
  tissueShade: string;
  material: string;
  occlusalStain: string;
  shadeGuide: string;
}

export interface ImplantPreferencesData {
  scanbodySystem: string;
  implantLevel: string;
  tighteningTorque: string;
}

export interface PreferencesStepData {
  general: GeneralPreferencesData;
  implant: ImplantPreferencesData;
}

interface PreferencesStepProps {
  data: PreferencesStepData;
  onChange: (data: PreferencesStepData) => void;
}

interface RadioGroupProps {
  title: string;
  icon: React.ReactNode;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ title, icon, options, value, onChange }) => (
  <div className="pref-card">
    <div className="pref-card-header">
      <span className="pref-card-icon">{icon}</span>
      <span className="pref-card-title">{title}</span>
    </div>
    <div className="pref-options">
      {options.map((opt) => (
        <label key={opt} className={`pref-option ${value === opt ? 'selected' : ''}`}>
          <input
            type="radio"
            name={title}
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
            className="d-none"
          />
          <span className="pref-radio-dot" />
          <span className="pref-option-label">{opt}</span>
        </label>
      ))}
    </div>
  </div>
);

const GENERAL_GROUPS = [
  { key: 'metalOfChoice', title: 'Metal of Choice', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, options: ['Noble (Default)', 'Base', 'High Noble White Yellow'] },
  { key: 'metalCollars', title: 'Metal Collars', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>, options: ['Buccal', 'Lingual', 'Mesial/Distal', 'None'] },
  { key: 'occlusionContacts', title: 'Occlusion Contacts', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, options: ['In Occlusion', 'In Light Occlusion', 'Out 0.5 MM', 'Way Out 1.0 MM'] },
  { key: 'anatomy', title: 'Anatomy', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>, options: ['Detailed', 'Primary', 'Duplicated to Adjacent Anatomy (Default)'] },
  { key: 'insufficientRoom', title: 'Insufficient Room', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>, options: ['Reduce Opposing', 'Reduction Coping', 'Place Metal Island/Occlusal'] },
  { key: 'interproximalContact', title: 'Interproximal Contact', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, options: ['Normal (Default)', 'Broad/Tight'] },
  { key: 'tissueShade', title: 'Tissue Shade', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>, options: ['Clear', 'Regular Pink', 'Light Pink', 'Dark Pink', 'Mild', 'Moderate', 'Heavy', 'Ethnic (Meharry)'] },
  { key: 'material', title: 'Material', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>, options: ['Titanium Gold', 'Gold Hue', 'Zirconium'] },
  { key: 'occlusalStain', title: 'Occlusal Stain', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>, options: ['None', 'Light', 'Medium', 'Dark'] },
  { key: 'shadeGuide', title: 'Shade Guide', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>, options: ['Custom', 'VITA_3D Master', 'VITA_CLASSICAL'] },
];

const IMPLANT_GROUPS = [
  { key: 'scanbodySystem', title: 'Scanbody System', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, options: ['System A', 'System B', 'System C'] },
  { key: 'implantLevel', title: 'Implant Level', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, options: ['Bone Level', 'Tissue Level'] },
  { key: 'tighteningTorque', title: 'Tightening Torque', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>, options: ['15 Ncm', '25 Ncm', '35 Ncm'] },
];

const PreferencesStep: React.FC<PreferencesStepProps> = ({ data, onChange }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'implant'>('general');

  const updateGeneral = (key: string, value: string) => {
    onChange({ ...data, general: { ...data.general, [key]: value } });
  };

  const updateImplant = (key: string, value: string) => {
    onChange({ ...data, implant: { ...data.implant, [key]: value } });
  };

  return (
    <div className="preferences-step animate-step">
      {/* Tab Bar */}
      <div className="pref-tabs">
        <button
          className={`pref-tab ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.07 4.93A10 10 0 0 0 4.93 19.07M4.93 4.93a10 10 0 0 0 14.14 14.14"/>
          </svg>
          General Preferences
        </button>
        <button
          className={`pref-tab ${activeTab === 'implant' ? 'active' : ''}`}
          onClick={() => setActiveTab('implant')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="2" x2="12" y2="22"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          Implant Preferences
        </button>
      </div>

      {/* Grid */}
      <div className="pref-scroll-area">
        <Row className="g-3">
          {activeTab === 'general'
            ? GENERAL_GROUPS.map((g) => (
                <Col xs={12} sm={6} lg={4} key={g.key}>
                  <RadioGroup
                    title={g.title}
                    icon={g.icon}
                    options={g.options}
                    value={(data.general as any)[g.key]}
                    onChange={(v) => updateGeneral(g.key, v)}
                  />
                </Col>
              ))
            : IMPLANT_GROUPS.map((g) => (
                <Col xs={12} sm={6} lg={4} key={g.key}>
                  <RadioGroup
                    title={g.title}
                    icon={g.icon}
                    options={g.options}
                    value={(data.implant as any)[g.key]}
                    onChange={(v) => updateImplant(g.key, v)}
                  />
                </Col>
              ))}
        </Row>
      </div>
    </div>
  );
};

export default PreferencesStep;