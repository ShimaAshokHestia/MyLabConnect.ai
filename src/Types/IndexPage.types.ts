/* ============================================================
   types/index.ts
   Shared TypeScript types for MyLab Connect Dashboard
   ============================================================ */

import type { CaseDetailData } from "../KIDU_COMPONENTS/KiduCaseDetailModal";

// ── Login / Role types ──────────────────────────────────────
export type LoginRole =
  | 'doctor'
  | 'practice'
  | 'dso'
  | 'lab'
  | 'admin'
  | 'integrator';

// ── Status tab keys ─────────────────────────────────────────
export type StatusKey =
  | 'rejected'
  | 'hold'
  | 'transit'
  | 'production'
  | 'submitted'
  | 'recent';

// ── Case status (used on cards) ──────────────────────────────
export type CaseStatus = StatusKey;

// ── Card mode — controls which action buttons appear ─────────
// doctor    → chat + status + help
// practice  → chat + support + rush badge
// dso       → view-only (no buttons)
// lab       → update-status + help
// admin     → view-only (no buttons)
// integrator→ view-only (no buttons)
export type CardMode =
  | 'doctor'
  | 'practice'
  | 'dso'
  | 'lab'
  | 'admin'
  | 'integrator';

// ── Tab configuration per role ───────────────────────────────
export interface TabConfig {
  key: StatusKey;
  label: string;
  count: number;     // comes from API; default 0
  active?: boolean;  // which tab is highlighted on load
  visible: boolean;  // whether this tab is shown for the role
}

// ── Raw case record (from API / dummy data) ───────────────────
export interface CaseRecord {
  id: string;
  patientName: string;
  patientId?: string;
  caseType: string;
  doctorName: string;
  labName: string;
  dsoName?: string;
  practiceName?: string;
  date: string;
  status: CaseStatus;
  isRush?: boolean;
  // ── New: enriches the detail modal ──
  caseDetailData?: Partial<CaseDetailData>;
}

// ── Dashboard page API response shape ────────────────────────
// Each index page fetches this; for now filled with dummy data
export interface DashboardPageData {
  role: LoginRole;
  tabCounts: Record<StatusKey, number>;
  cases: Record<StatusKey, CaseRecord[]>;
}