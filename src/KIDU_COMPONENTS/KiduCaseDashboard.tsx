/* ============================================================
   components/CaseDashboard.tsx
   Role-aware dashboard shell.
   Receives data from the parent index page (API result).
   Handles tab switching — cards update without page navigation.
   ============================================================ */

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/KiduStyles/CaseDashboard.css';
import StatusBar from './KiduCaseStatusbar';
import CaseCard from './KiduCaseCards';
import type { StatusItem } from './KiduCaseStatusbar';
import type { DashboardPageData, LoginRole, StatusKey } from '../Types/IndexPage.types';
import { ROLE_CONFIG, TAB_ICONS, TAB_LABELS } from '../Configs/RoleConfig';
import type { ProductionStage } from '../LAB_CONNECT/Components/ProductionStatusTabs';
import ProductionStageTabs from '../LAB_CONNECT/Components/ProductionStatusTabs';

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────

export interface CaseDashboardProps {
  role: LoginRole;
  data: DashboardPageData;
  /** Loading state while API is in-flight */
  loading?: boolean;
  onProfileClick?: () => void;
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

const CaseDashboard: React.FC<CaseDashboardProps> = ({ role, data, loading = false }) => {
  const config = ROLE_CONFIG[role];
  const barButtons = ROLE_STATUSBAR[role];
  const navigate = useNavigate();

  // Initialise with role's default tab
  const [activeTab, setActiveTab] = useState<StatusKey>(config.defaultTab);
  const [gridTransitioning, setGridTransitioning] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // ADDED: production sub-stage state — only meaningful when role=lab & tab=production
  const [productionStage, setProductionStage] = useState<ProductionStage>('model');

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

      {/* ── Cards grid ── */}
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
                  date={c.date}
                  status={c.status}
                  isRush={c.isRush}
                  mode={config.cardMode}
                  animationDelay={i * 0.04}
                  // ── Pass through the enriched modal data ──
                  caseDetailData={c.caseDetailData}   // ← ADD THIS LINE
                  onClick={() => console.log('Open case:', c.id)}
                  onStatusClick={() => console.log('Status:', c.id)}
                  onSupportClick={() => console.log('Support:', c.id)}
                  onSendMessage={async (text) => console.log('Message:', c.id, text)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default CaseDashboard;