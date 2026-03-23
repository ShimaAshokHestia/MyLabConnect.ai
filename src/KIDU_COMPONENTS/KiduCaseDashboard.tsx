/* ============================================================
   components/CaseDashboard.tsx
   Role-aware dashboard shell.
   Receives data from the parent index page (API result).
   Handles tab switching — cards update without page navigation.
   ============================================================ */

import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/KiduStyles/CaseDashboard.css';
import StatusBar from './KiduCaseStatusbar';
import CaseCard from './KiduCaseCards';
import type { StatusItem } from './KiduCaseStatusbar';
import type { DashboardPageData, LoginRole, StatusKey } from '../Types/IndexPage.types';
import { ROLE_CONFIG, TAB_ICONS, TAB_LABELS } from '../Configs/RoleConfig';
import type { ProductionStage } from '../LAB_CONNECT/Components/ProductionStatusTabs';
import ProductionStageTabs from '../LAB_CONNECT/Components/ProductionStatusTabs';
import type { KiduColumn, TableRequestParams } from './KiduServerTable';
import type { CaseStatusUpdatePayload } from './KiduCaseStatusUpdateModal';
import CaseService from '../DOCTOR_CONNECT/Service/AnalogCase/Case.services';
import CaseStatusUpdateModal from './KiduCaseStatusUpdateModal';
import KiduServerTable from './KiduServerTable';

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────

export interface CaseDashboardProps {
  role: LoginRole;
  data: DashboardPageData;
  /** Loading state while API is in-flight */
  loading?: boolean;
  onProfileClick?: () => void;
  // CHANGED: added hide props — passed straight through to each CaseCard
  hideDoctorName?: boolean;
  hidePracticeName?: boolean;
  hideDsoName?: boolean;
  hideLabName?: boolean;
  // ADDED: optional scoping IDs passed down from parent index pages
  // so the list view can apply the same filters as the card view
  dSODoctorId?: number | null;
  dSOMasterId?: number | null;
  labMasterId?: number | null;
  dSODentalOfficeId?: number | null;
}

// ─────────────────────────────────────────────────────────────
// Role → StatusBar button visibility
//
//   Prescription : doctor only
//   Pickup       : doctor + practice
// ─────────────────────────────────────────────────────────────

const ROLE_STATUSBAR: Record<LoginRole, { prescription: boolean; pickup: boolean }> = {
  admin: { prescription: false, pickup: false },
  dso: { prescription: false, pickup: false },
  lab: { prescription: false, pickup: false },
  doctor: { prescription: true, pickup: true },
  practice: { prescription: false, pickup: true },
  // include integrator to satisfy the LoginRole union
  integrator: { prescription: false, pickup: false },
};

// ─────────────────────────────────────────────────────────────
// ADDED: Map StatusKey → caseStatusMasterId(s) for API filter
// Mirrors STATUS_TO_TAB in useDashboardCases but in reverse
// ─────────────────────────────────────────────────────────────
const TAB_TO_STATUS_IDS: Record<StatusKey, number[]> = {
  submitted: [1, 2],
  production: [3],
  transit: [4],
  hold: [5],
  rejected: [6],
  recent: [],   // "recent" is a time-based virtual tab — no single status ID
};

// ─────────────────────────────────────────────────────────────
// ADDED: Column definitions for the list view table
// ─────────────────────────────────────────────────────────────
const LIST_VIEW_COLUMNS: KiduColumn[] = [
  { key: 'caseNo', label: 'Case No', enableSorting: true, type: 'text' },
  { key: 'patientName', label: 'Patient', enableSorting: true, type: 'text' },
  { key: 'patientId', label: 'Patient ID', enableSorting: false, type: 'text' },
  { key: 'doctorName', label: 'Doctor', enableSorting: true, type: 'text' },
  { key: 'officeName', label: 'Practice', enableSorting: true, type: 'text' },
  { key: 'labName', label: 'Lab', enableSorting: true, type: 'text' },
  { key: 'dueDate', label: 'Due Date', enableSorting: true, type: 'date' },
  { key: 'caseStatusName', label: 'Status', enableSorting: true, type: 'badge' },
];

// ─────────────────────────────────────────────────────────────
// ADDED: Inline styles for the "Update Status" button that sits
// inside KiduServerTable's selection bar. Inline styles are used
// deliberately so the button renders correctly without requiring
// any CSS file edits.
// ─────────────────────────────────────────────────────────────
const UPDATE_BTN_BASE: React.CSSProperties = {
  display:       'inline-flex',
  alignItems:    'center',
  gap:           6,
  padding:       '5px 13px',
  borderRadius:  6,
  border:        'none',
  background:    'linear-gradient(135deg, #ef0d50 0%, #c0003c 100%)',
  color:         '#fff',
  fontFamily:    'inherit',
  fontSize:      '0.775rem',
  fontWeight:    600,
  letterSpacing: '0.025em',
  cursor:        'pointer',
  boxShadow:     '0 2px 8px rgba(239,13,80,0.32)',
  transition:    'opacity 0.15s ease, transform 0.1s ease',
  whiteSpace:    'nowrap',
};
 
// ─────────────────────────────────────────────────────────────
// ADDED: Update Status SVG icon (rotate arrows)
// ─────────────────────────────────────────────────────────────
const IconUpdateStatus = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);
 

// ─────────────────────────────────────────────────────────────
// Skeleton card for loading state
// ─────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="dash-skeleton-card" aria-hidden="true">
    <div className="skel-bar" />
    <div className="skel-line skel-line--title" />
    <div className="skel-divider" />
    <div className="skel-line" />
    <div className="skel-line skel-line--short" />
    <div className="skel-line skel-line--short" />
    <div className="skel-footer">
      <div className="skel-line skel-line--xs" />
      <div style={{ display: 'flex', gap: 6 }}>
        <div className="skel-circle" />
        <div className="skel-circle" />
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// CaseDashboard Component
// ─────────────────────────────────────────────────────────────

const CaseDashboard: React.FC<CaseDashboardProps> = ({ role, data, loading = false, hideDoctorName = false,
  hidePracticeName = false,
  hideDsoName = false,
  hideLabName = false,
  // ADDED: scoping IDs for list view API calls
  dSODoctorId,
  dSOMasterId,
  labMasterId,
  dSODentalOfficeId,
}) => {
  const config = ROLE_CONFIG[role];
  const barButtons = ROLE_STATUSBAR[role];
  const navigate = useNavigate();

  // Initialise with role's default tab
  const [activeTab, setActiveTab] = useState<StatusKey>(config.defaultTab);
  const [gridTransitioning, setGridTransitioning] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // ADDED: production sub-stage state — only meaningful when role=lab & tab=production
  const [productionStage, setProductionStage] = useState<ProductionStage>('model');

  // ADDED: view mode state — 'grid' is the default (existing behaviour)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // ADDED: selected rows for bulk status update in list view
  // Stores full raw API row objects
  const [selectedListRows, setSelectedListRows] = useState<any[]>([]);

  // ADDED: bulk status update modal state
  const [bulkStatusModalOpen, setBulkStatusModalOpen] = useState(false);

  // ADDED: stable ref so the additionalButtons onClick closure never goes stale
  const openBulkModalRef = useRef<() => void>(() => {});
  openBulkModalRef.current = () => setBulkStatusModalOpen(true);
  // ── Build StatusBar items from visible tabs + API counts ──
  const statusItems: StatusItem[] = config.visible.map((key) => ({
    key,
    label: TAB_LABELS[key],
    count: data.tabCounts[key] ?? 0,
    active: key === activeTab,
  }));

  // ── Tab switch with fade transition ──
  const switchTab = useCallback((key: StatusKey) => {
    if (key === activeTab) return;
    setGridTransitioning(true);
    // ADDED: clear selected rows when switching tabs
    setSelectedListRows([]);
    setTimeout(() => {
      setActiveTab(key as StatusKey);
      setGridTransitioning(false);
    }, 150);
  }, [activeTab]);

  // ── Search filter ──
  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  // ── Cases for current tab, filtered by search ──
  const allCases = data.cases[activeTab] ?? [];
  const currentCases = searchValue.trim()
    ? allCases.filter((c) => {
      const q = searchValue.toLowerCase();
      return (
        c.patientName?.toLowerCase().includes(q) ||
        c.id?.toLowerCase().includes(q) ||
        c.doctorName?.toLowerCase().includes(q) ||
        c.labName?.toLowerCase().includes(q)
      );
    })
    : allCases;

  // ── Tab label for heading ──
  const tabLabel = TAB_LABELS[activeTab];
  const tabIcon = TAB_ICONS[activeTab];

  // ADDED: derive production stage counts from tabCounts with safe fallbacks.
  // The parent API may expose these as sub-keys; if not available we default to 0.
  // No API call — reads from the same `data` prop already passed in.
  const productionCounts = {
    model: (data.tabCounts as any)?.productionModel ?? 0,
    design: (data.tabCounts as any)?.productionDesign ?? 0,
    manufacturing: (data.tabCounts as any)?.productionManufacturing ?? 0,
    qc: (data.tabCounts as any)?.productionQc ?? 0,
  };

  // ADDED: condition for showing production sub-tabs
  const showProductionTabs = role === 'lab' && activeTab === 'production';

  // ADDED: toggle between grid and list view
  const handleViewModeToggle = useCallback(() => {
    setViewMode((prev) => prev === 'grid' ? 'list' : 'grid');
    setSelectedListRows([]);
  }, []);

  // ADDED: fetchData function for KiduServerTable list view
  // Calls CaseService.getPaginatedList with the active tab's status filter
  const fetchListData = useCallback(async (params: TableRequestParams) => {
    const statusIds = TAB_TO_STATUS_IDS[activeTab];

    // Build filter payload — mirrors useDashboardCases scoping
    const apiParams: Record<string, any> = {
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
      searchTerm: params.searchTerm ?? '',
      sortBy: params.sortBy ?? '',
      sortDescending: params.sortDescending ?? false,
      showDeleted: false,
      getAll: false,
      // Pass scoping IDs so the same data scope as card view is maintained
      ...(dSODoctorId ? { dSODoctorId } : {}),
      ...(dSOMasterId ? { dSOMasterId } : {}),
      ...(labMasterId ? { labMasterId } : {}),
      ...(dSODentalOfficeId ? { dSODentalOfficeId } : {}),
      // Filter by the tab's status IDs (send first one; 'recent' has no status filter)
      ...(statusIds.length > 0 ? { caseStatusMasterId: statusIds[0] } : {}),
    };

    const result = await CaseService.getPaginatedList(apiParams);

    // Flatten for table display — map API fields to column keys
    const rows = (result.data ?? []).map((c: any) => ({
      ...c,
      caseNo: c.caseNo ?? String(c.id),
      patientName: `${c.patientFirstName ?? ''} ${c.patientLastName ?? ''}`.trim(),
      doctorName: c.doctorName ?? '',
      officeName: c.officeName ?? c.dentalOfficeName ?? c.practiceName ?? '—',
      labName: c.labName ?? '—',
      caseStatusName: c.caseStatusName ?? '',
    }));

    return {
      data: rows,
      total: result.total,
      totalPages: result.totalPages,
    };
  }, [activeTab, dSODoctorId, dSOMasterId, labMasterId, dSODentalOfficeId]);

   // ADDED: KiduServerTable calls onBulkDelete with the selected rows array.
  // We store them so the modal can display and iterate them.
  // We do NOT delete — the prop is repurposed solely as a selection callback.
  const handleBulkSelection = useCallback((rows: any[]) => {
    setSelectedListRows(rows);
    if (rows.length > 0) setBulkStatusModalOpen(true);
  }, []);
 
  // ADDED: "Update Status" button — rendered inside KiduServerTable's
  // selection bar via additionalButtons. The selection bar only renders
  // when KiduServerTable's internal selectedRows.size > 0, so this button
  // is automatically hidden when nothing is selected.
  // openBulkModalRef.current is used to avoid stale closures.
  const updateStatusBtn = (
    <button
      type="button"
      style={UPDATE_BTN_BASE}
      onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity  = '0.87')}
      onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity  = '1'   )}
      onMouseDown={(e)  => ((e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.96)')}
      onMouseUp={(e)    => ((e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'   )}
      onClick={() => openBulkModalRef.current()}
    >
      <IconUpdateStatus />
      Update Status
    </button>
  );
 
  // ADDED: submit handler — iterates all selected rows
  const handleBulkStatusSubmit = useCallback(async (payload: CaseStatusUpdatePayload) => {
    for (const row of selectedListRows) {
      const caseId = row.caseNo ?? String(row.id);
      console.log('[CaseDashboard] Bulk update:', { caseId, newStatus: payload.newStatus });
      // TODO: swap with real API:
      // await CaseService.changeStatus({ caseRegistrationMasterId: row.id, caseStatusMasterId: ... })
    }
    setSelectedListRows([]);
    setBulkStatusModalOpen(false);
  }, [selectedListRows]);
 
  // ─────────────────────────────────────────────────────────
  // Render
  // ──────
  return (
    <main className="dash-page-body">

      {/* ── Status / Tab bar ── */}
      <StatusBar
        items={statusItems}
        onSelect={(key) => switchTab(key)}
        showPrescription={barButtons.prescription}
        showPickup={barButtons.pickup}
        onPrescriptionClick={() => navigate('add-new-case')}
        onPickupClick={() => navigate('add-new-pickup')}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        viewMode={viewMode}
        onViewModeToggle={handleViewModeToggle}
      />

      {/*
        ADDED: Production pipeline sub-tabs.
        Renders only when: role === 'lab' AND activeTab === 'production'.
        Sits between the main StatusBar and the cards label bar.
      */}
      {showProductionTabs && (
        <ProductionStageTabs
          activeStage={productionStage}
          onStageSelect={setProductionStage}
          counts={productionCounts}
        />
      )}

      {/* ── Label bar ── */}
      <div className="dash-label-bar">
        <span className="dash-view-label">
          <span className="dash-view-icon" aria-hidden="true">{tabIcon}</span>
          {tabLabel}

          {/* ADDED: show active stage name in the label bar when in production view */}
          {showProductionTabs && (
            <span className="dash-production-stage-tag">
              {productionStage.charAt(0).toUpperCase() + productionStage.slice(1)}
            </span>
          )}
        </span>
        <div className="dash-label-actions">
          {!loading && (
            <span className="dash-case-count">{currentCases.length} cases</span>
          )}

        </div>
      </div>

      {/* ── Cards grid (unchanged — only shown when viewMode === 'grid') ── */}
      {viewMode === 'grid' && (
        <div className="dash-cards-area">
          {loading ? (
            <div className="dash-cards-grid">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className={`dash-cards-grid${gridTransitioning ? ' transitioning' : ''}`}>
              {currentCases.length === 0 ? (
                <div className="dash-empty">
                  <div className="dash-empty-icon" aria-hidden="true">{tabIcon}</div>
                  <p>
                    {searchValue.trim()
                      ? `No results for "${searchValue}"`
                      : `No ${tabLabel.toLowerCase()} cases`}
                  </p>
                </div>
              ) : (
                currentCases.map((c, i) => (
                  <CaseCard
                    key={`${c.id}-${i}`}
                    patientName={c.patientName}
                    patientId={c.patientId}
                    caseId={c.id}
                    caseType={c.caseType}
                    doctorName={c.doctorName}
                    labName={c.labName}
                    practiceName={c.practiceName}   // CHANGED: was missing
                    dsoName={c.dsoName}
                    date={c.date}
                    status={c.status}
                    isRush={c.isRush}
                    mode={config.cardMode}
                    animationDelay={i * 0.04}
                    // ── Pass through the enriched modal data ──
                    caseDetailData={c.caseDetailData}   // ← ADD THIS LINE
                    hideDoctorName={hideDoctorName}
                    hidePracticeName={hidePracticeName}
                    hideDsoName={hideDsoName}
                    hideLabName={hideLabName}
                    onClick={() => console.log('Open case:', c.id)}
                    onStatusClick={() => console.log('Status:', c.id)}
                    onSupportClick={() => console.log('Support:', c.id)}
                    onSendMessage={async (text) => console.log('Message:', c.id, text)}
                  />
                ))
              )}
            </div>
          )}
        </div>)}
       {/*
        ADDED: List view (KiduServerTable)
        ─────────────────────────────────────────────────────
        key={activeTab}           → remounts on tab change so fetchData re-runs
        showSelectionToggle=true  → shows the "Select" toggle in the toolbar
        onBulkDelete              → KiduServerTable fires this with the selected
                                    rows array when user clicks any button in the
                                    selection bar — we repurpose it to receive the
                                    actual selection (no deletion happens)
        additionalButtons         → our "Update Status" button is injected into
                                    the selection bar; it only appears when
                                    selectedRows.size > 0 inside the table
      */}
      {viewMode === 'list' && (
        <div className="dash-list-area">
          <KiduServerTable
            key={activeTab}
            title={`${tabLabel} Cases`}
            columns={LIST_VIEW_COLUMNS}
            fetchData={fetchListData}
            rowKey="id"
            showSearch={false}
            showFilters={true}
            showColumnToggle={true}
            showDensityToggle={false}
            showExport={true}
            showFullscreen={false}
            showAddButton={false}
            showActions={false}
            showPagination={true}
            showRowsPerPage={true}
            showSelectionToggle={true}
            defaultRowsPerPage={20}
            highlightOnHover={true}
            striped={false}
            onBulkDelete={handleBulkSelection}
            additionalButtons={updateStatusBtn}
          />
        </div>
      )}
 
      {/* ADDED: Bulk Status Update Modal */}
      {bulkStatusModalOpen && (
        <CaseStatusUpdateModal
          isOpen={bulkStatusModalOpen}
          onClose={() => setBulkStatusModalOpen(false)}
          caseId={
            selectedListRows.length === 1
              ? (selectedListRows[0]?.caseNo ?? String(selectedListRows[0]?.id ?? ''))
              : `${selectedListRows.length} cases selected`
          }
          submissionDate={selectedListRows[0]?.dueDate      ?? '—'}
          doctorName={selectedListRows[0]?.doctorName       ?? '—'}
          patientName={
            selectedListRows.length === 1
              ? (selectedListRows[0]?.patientName ?? '—')
              : `${selectedListRows.length} patients`
          }
          patientId={
            selectedListRows.length === 1
              ? selectedListRows[0]?.patientId
              : undefined
          }
          currentStatus={selectedListRows[0]?.caseStatusName ?? '—'}
          onSubmit={handleBulkStatusSubmit}
        />
      )}
    </main>
  );
};

export default CaseDashboard;