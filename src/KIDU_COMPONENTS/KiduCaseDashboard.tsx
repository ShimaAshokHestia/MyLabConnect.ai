import React, { useState } from 'react';
import '../Styles/KiduStyles/CaseDashboard.css';
import type { StatusItem, StatusKey } from './KiduCaseStatusbar';
import StatusBar from './KiduCaseStatusbar';
import CaseCard, { type CardMode, type CaseStatus } from './KiduCaseCards';

// ─────────────────────────────────────────────────────────────
// Data Types
// ─────────────────────────────────────────────────────────────

export type ViewKey = 'lab' | 'doctor' | 'submitted' | 'full';

export interface DashboardUser {
  initials: string;
  name: string;
  email: string;
}

export interface CaseDashboardProps {
  loginMode: CardMode;
  user?: DashboardUser;
  appTitle?: React.ReactNode;
}

// ─────────────────────────────────────────────────────────────
// All Case Data
// ─────────────────────────────────────────────────────────────

interface RawCase {
  id: string;
  name: string;
  pid?: string;
  lab: string;
  doc: string;
  type: string;
  date: string;
  status: CaseStatus;
  isRush?: boolean;
  mode: CardMode;
}

const LAB_CASES: RawCase[] = [
  { id: 'MYLS700588', name: 'WILL BIL',        pid: 'poiuyt',    lab: 'MYLAB',               doc: 'MYLAB',               type: 'Analog', date: '29/12/2025', status: 'hold', mode: 'lab' },
  { id: 'MYLS700578', name: 'SHIRLEY WILL',    pid: 'pid78345',  lab: 'MYLAB',               doc: 'MYLAB',               type: 'Analog', date: '27/12/2025', status: 'hold', mode: 'lab' },
  { id: 'MYLS700568', name: 'GILL WILL',       pid: 'poiuy',     lab: 'MYLAB',               doc: 'MYLAB',               type: 'Analog', date: '26/12/2025', status: 'hold', mode: 'lab' },
  { id: 'MYLS700666', name: 'FIONA CHURCH',    pid: 'pid089',    lab: 'MYLAB',               doc: 'MYLAB',               type: 'Analog', date: '21/01/2026', status: 'hold', mode: 'lab' },
  { id: 'MYLS700642', name: 'MARY BRANDO',     pid: 'PID578998', lab: 'MYLAB',               doc: 'MYLAB',               type: 'Analog', date: '08/01/2026', status: 'hold', mode: 'lab' },
  { id: 'MYLS700622', name: 'VIVIAN RICHARD',  pid: 'pid7854',   lab: 'MYLAB',               doc: 'MYLAB',               type: 'Analog', date: '04/01/2026', status: 'hold', mode: 'lab' },
  { id: 'DILS700072', name: 'GRIFFEN CHARLES', pid: '45678',     lab: 'Dental Infinity Lab', doc: 'Dental Infinity Lab', type: 'Analog', date: '02/12/2025', status: 'hold', mode: 'lab' },
  { id: 'DILS700052', name: 'ALLEY GILLIAN',   pid: 'pid457',    lab: 'Dental Infinity Lab', doc: 'Dental Infinity Lab', type: 'Analog', date: '02/12/2025', status: 'hold', mode: 'lab' },
  { id: 'DILS700048', name: 'SHARON WILSON',   pid: 'PID5674',   lab: 'Dental Infinity Lab', doc: 'Dental Infinity Lab', type: 'Analog', date: '02/12/2025', status: 'hold', mode: 'lab' },
  { id: 'DILS700042', name: 'SIMON VINCENT',   pid: 'PID3456',   lab: 'Dental Infinity Lab', doc: 'Dental Infinity Lab', type: 'Analog', date: '02/12/2025', status: 'hold', mode: 'lab' },
];

const DOCTOR_CASES: RawCase[] = [
  { id: 'MYLS700588', name: 'WILL BIL',        pid: 'poiuyt',    lab: 'MYLAB', doc: 'Bedford Demo Doctor',   type: 'Analog Case', date: '29/12/2025', status: 'hold', mode: 'doctor' },
  { id: 'MYLS700578', name: 'SHIRLEY WILL',    pid: 'pid78345',  lab: 'MYLAB', doc: 'TEST JAMES',            type: 'Analog Case', date: '27/12/2025', status: 'hold', mode: 'doctor' },
  { id: 'MYLS700568', name: 'GILL WILL',       pid: 'poiuy',     lab: 'MYLAB', doc: 'Bedford Demo Doctor',   type: 'Analog Case', date: '26/12/2025', status: 'hold', mode: 'doctor' },
  { id: 'MYLS700666', name: 'FIONA CHURCH',    pid: 'pid089',    lab: 'MYLAB', doc: 'Bedford Demo Doctor',   type: 'Analog Case', date: '21/01/2026', status: 'hold', mode: 'doctor' },
  { id: 'MYLS700642', name: 'MARY BRANDO',     pid: 'PID578998', lab: 'MYLAB', doc: 'MyDentist Demo Doctor', type: 'Analog Case', date: '08/01/2026', status: 'hold', mode: 'doctor' },
  { id: 'MYLS700622', name: 'VIVIAN RICHARD',  pid: 'pid7854',   lab: 'MYLAB', doc: 'Bedford Demo Doctor',   type: 'Analog Case', date: '04/01/2026', status: 'hold', mode: 'doctor' },
];

const SUBMITTED_CASES: RawCase[] = [
  { id: 'MLCLS700831', name: 'GLENN MARVEL',   pid: 'PID894',   lab: 'MLC LAB',             doc: 'MLC LAB',             type: 'Analog Case', date: '20/02/2026', status: 'submitted',                 mode: 'submitted' },
  { id: 'MLCLS700830', name: 'WILLIAM EDWARD', pid: 'pid896',   lab: 'MLC LAB',             doc: 'MLC LAB',             type: 'Analog Case', date: '19/02/2026', status: 'submitted',                 mode: 'submitted' },
  { id: 'P700812',     name: 'C C',            pid: '1000586',  lab: 'MLC LAB',             doc: 'MLC LAB',             type: 'IOS Case',    date: '19/02/2026', status: 'submitted', isRush: true,   mode: 'submitted' },
  { id: 'P700767',     name: 'Alex 2',                          lab: 'MLC LAB',             doc: 'MLC LAB',             type: 'IOS QC',      date: '16/02/2026', status: 'submitted', isRush: true,   mode: 'submitted' },
  { id: 'P700768',     name: 'Alex 2',                          lab: 'MLC LAB',             doc: 'MLC LAB',             type: 'IOS QC',      date: '16/02/2026', status: 'submitted', isRush: true,   mode: 'submitted' },
  { id: 'P700769',     name: 'Alex 2',                          lab: 'MLC LAB',             doc: 'MLC LAB',             type: 'IOS QC',      date: '16/02/2026', status: 'submitted', isRush: true,   mode: 'submitted' },
  { id: 'P700816',     name: 'Alex 2',                          lab: 'MLC LAB',             doc: 'MLC LAB',             type: 'IOS QC',      date: '16/02/2026', status: 'submitted', isRush: true,   mode: 'submitted' },
  { id: 'DILS700590',  name: 'NEIL DAVIS',     pid: 'pid45225', lab: 'Dental Infinity Lab', doc: 'Dental Infinity Lab', type: 'Analog Case', date: '29/12/2025', status: 'submitted',                 mode: 'submitted' },
];

const FULL_VIEW_CASES: RawCase[] = [
  { id: 'P700840',     name: 'Jen Millward',    pid: 'j milward',         lab: 'MLC LAB',             doc: 'MLC LAB',             type: 'IOS Case',    date: '24/02/2026', status: 'submitted', mode: 'doctor' },
  { id: 'P700843',     name: 'Mlc Test Lizzie', pid: 'Elizabeth Cousins', lab: 'MLC LAB',             doc: 'MLC LAB',             type: 'IOS Case',    date: '23/02/2026', status: 'submitted', mode: 'doctor' },
  { id: 'P700842',     name: 'Mlc Test Lizzie', pid: 'Elizabeth Cousins', lab: 'MLC LAB',             doc: 'MLC LAB',             type: 'IOS Case',    date: '23/02/2026', status: 'submitted', mode: 'doctor' },
  { id: 'P700841',     name: 'Mlc Test Lizzie', pid: 'Elizabeth Cousins', lab: 'MLC LAB',             doc: 'MLC LAB',             type: 'IOS Case',    date: '23/02/2026', status: 'submitted', mode: 'doctor' },
  { id: 'MLCLS700831', name: 'GLENN MARVEL',    pid: 'PID894',            lab: 'MLC LAB',             doc: 'Bedford Demo Doctor', type: 'Analog Case', date: '20/02/2026', status: 'submitted', mode: 'doctor' },
  { id: 'P700839',     name: 'Jen Millward',    pid: 'j milward',         lab: 'MLC LAB',             doc: 'MLC LAB',             type: 'IOS Case',    date: '20/02/2026', status: 'submitted', mode: 'doctor' },
  { id: 'MLCLS700830', name: 'WILLIAM EDWARD',  pid: 'pid896',            lab: 'MLC LAB',             doc: 'Bedford Demo Doctor', type: 'Analog Case', date: '19/02/2026', status: 'submitted', mode: 'doctor' },
  { id: 'DILS700590',  name: 'NEIL DAVIS',      pid: 'pid45225',          lab: 'Dental Infinity Lab', doc: 'Bedford Demo Doctor', type: 'Analog Case', date: '29/12/2025', status: 'submitted', mode: 'doctor' },
  { id: 'DILS700564',  name: 'SHALOM GRIFFIN',  pid: 'pid8945',           lab: 'Dental Infinity Lab', doc: 'Bedford Demo Doctor', type: 'Analog Case', date: '26/12/2025', status: 'submitted', mode: 'doctor' },
  { id: 'DILS700562',  name: 'SHIRLEY WILL',    pid: 'pid89345',          lab: 'Dental Infinity Lab', doc: 'Bedford Demo Doctor', type: 'Analog Case', date: '26/12/2025', status: 'submitted', mode: 'doctor' },
];

// ─────────────────────────────────────────────────────────────
// View Configuration
// ─────────────────────────────────────────────────────────────

interface ViewConfig {
  key: ViewKey;
  label: string;
  tabLabel: string;
  tabClass: string;
  statusItems: StatusItem[];
  cases: RawCase[];
  showPrescription: boolean;
  showPickup: boolean;
}

const VIEWS: ViewConfig[] = [
  {
    key: 'lab',
    label: 'Lab View — Case on Hold',
    tabLabel: '🏥 Lab View',
    tabClass: 'tab-lab',
    statusItems: [
      { key: 'hold',       label: 'Case on Hold',  count: 10, active: true },
      { key: 'transit',    label: 'In Transit',     count: 0 },
      { key: 'production', label: 'In Production',  count: 48 },
      { key: 'submitted',  label: 'Submitted',      count: 77 },
      { key: 'recent',     label: 'Recent',         count: 2 },
    ],
    cases: LAB_CASES,
    showPrescription: false,
    showPickup: false,
  },
  {
    key: 'doctor',
    label: 'Doctor View — Case on Hold',
    tabLabel: '👨‍⚕️ Doctor',
    tabClass: 'tab-doctor',
    statusItems: [
      { key: 'submitted',  label: 'Submitted',      count: 0 },
      { key: 'production', label: 'In Production',  count: 39 },
      { key: 'hold',       label: 'Case on Hold',   count: 6, active: true },
      { key: 'rejected',   label: 'Scan Rejected',  count: 0 },
      { key: 'transit',    label: 'In Transit',     count: 0 },
      { key: 'recent',     label: 'Recent',         count: 2 },
    ],
    cases: DOCTOR_CASES,
    showPrescription: false,
    showPickup: false,
  },
  {
    key: 'submitted',
    label: 'Submitted Cases View',
    tabLabel: '🔬 Submitted',
    tabClass: 'tab-submitted',
    statusItems: [
      { key: 'rejected',   label: 'Scan Rejected',  count: 0 },
      { key: 'hold',       label: 'Case on Hold',   count: 0 },
      { key: 'transit',    label: 'In Transit',     count: 0 },
      { key: 'production', label: 'In Production',  count: 0 },
      { key: 'submitted',  label: 'Submitted',      count: 54, active: true },
      { key: 'recent',     label: 'Recent',         count: 0 },
    ],
    cases: SUBMITTED_CASES,
    showPrescription: true,
    showPickup: true,
  },
  {
    key: 'full',
    label: 'Full Submitted View',
    tabLabel: '📋 Full View',
    tabClass: 'tab-full',
    statusItems: [
      { key: 'rejected',   label: 'Scan Rejected',  count: 0 },
      { key: 'hold',       label: 'Case on Hold',   count: 0 },
      { key: 'transit',    label: 'In Transit',     count: 0 },
      { key: 'production', label: 'In Production',  count: 0 },
      { key: 'submitted',  label: 'Submitted',      count: 10, active: true },
      { key: 'recent',     label: 'Recent',         count: 0 },
    ],
    cases: FULL_VIEW_CASES,
    showPrescription: false,
    showPickup: true,
  },
];

// ─────────────────────────────────────────────────────────────
// CaseDashboard Component
// ─────────────────────────────────────────────────────────────

const CaseDashboard: React.FC<CaseDashboardProps> = () => {
  const [activeView, _setActiveView] = useState<ViewKey>('lab');
  const [searchQuery, _setSearchQuery] = useState('');
  const [gridTransitioning, _setGridTransitioning] = useState(false);

  const currentView = VIEWS.find((v) => v.key === activeView) ?? VIEWS[0];

  // const switchView = useCallback((key: ViewKey) => {
  //   if (key === activeView) return;
  //   setGridTransitioning(true);
  //   setTimeout(() => {
  //     setActiveView(key);
  //     setGridTransitioning(false);
  //   }, 150);
  // }, [activeView]);

  const filteredCases = searchQuery.length >= 5
    ? currentView.cases.filter((c) =>
        [c.name, c.id, c.pid ?? '', c.doc, c.lab, c.type]
          .join(' ')
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : currentView.cases;

  return (
    <main className="dash-page-body">
      <StatusBar
        items={currentView.statusItems}
        onSelect={(key: StatusKey) => {
          console.log('Status selected:', key);
        }}
      />

      <div className="dash-label-bar">
        <span className="dash-view-label">{currentView.label}</span>
        <div className="dash-label-actions">
          <span className="dash-case-count">{filteredCases.length} cases</span>
          {currentView.showPrescription && (
            <button className="dash-action-btn dash-action-btn--primary">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }}>
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              Prescription
            </button>
          )}
          {currentView.showPickup && (
            <button className="dash-action-btn dash-action-btn--info">
              Pickup
            </button>
          )}
        </div>
      </div>

      <div className="dash-cards-area">
        <div className={`dash-cards-grid${gridTransitioning ? ' transitioning' : ''}`}>
          {filteredCases.length === 0 ? (
            <div className="dash-empty">
              <p>No cases found</p>
            </div>
          ) : (
            filteredCases.map((c, i) => (
              <CaseCard
                key={`${c.id}-${i}`}
                patientName={c.name}
                patientId={c.pid}
                caseId={c.id}
                caseType={c.type}
                doctorName={c.doc}
                labName={c.lab}
                date={c.date}
                status={c.status}
                isRush={c.isRush}
                mode={c.mode}
                animationDelay={i * 0.045}
                onClick={() => console.log('Open case:', c.id, c.name)}
                onStatusClick={() => console.log('Status:', c.id)}
                onSupportClick={() => console.log('Support:', c.id)}
                onSendMessage={async (text) => console.log('Message for', c.id, ':', text)}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default CaseDashboard;