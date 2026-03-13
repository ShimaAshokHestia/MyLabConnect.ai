// src/Hooks/useDashboardCases.ts
//
// Status IDs from dbo.case_status_master:
//   1 = Pending       → "submitted"  ← newly created cases sit here
//   2 = Submitted     → "submitted"
//   3 = In Production → "production"
//   4 = In Transit    → "transit"
//   5 = Case on Hold  → "hold"
//   6 = Scan Rejected → "rejected"
//   7 = Completed     → null (excluded from dashboard)
//   8 = Cancelled     → null (excluded from dashboard)

import { useState, useEffect, useCallback } from "react";
import type { CaseRecord, CaseStatus, DashboardPageData, LoginRole } from "../../../Types/IndexPage.types";
import type { CaseRegistrationDTO } from "../Case.types";
import CaseService from "../../Service/AnalogCase/Case.services";


const STATUS_TO_TAB: Record<number, CaseStatus | null> = {
  1: "submitted",    // Pending   → shows under Submitted tab
  2: "submitted",    // Submitted
  3: "production",   // In Production
  4: "transit",      // In Transit
  5: "hold",         // Case on Hold
  6: "rejected",     // Scan Rejected
  7: null,           // Completed — excluded
  8: null,           // Cancelled — excluded
};

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function isRecent(createdAt?: string): boolean {
  if (!createdAt) return false;
  return Date.now() - new Date(createdAt).getTime() <= SEVEN_DAYS_MS;
}

function toCard(c: CaseRegistrationDTO, tab: CaseStatus): CaseRecord {
  return {
    id:          c.caseNo || String(c.id),
    patientName: `${c.patientFirstName ?? ""} ${c.patientLastName ?? ""}`.trim(),
    patientId:   c.patientId,
    caseType:    "Analog Case",
    doctorName:  c.doctorName?.trim() || `Doctor #${c.dSODoctorId}`,
    labName:     c.labName?.trim()    || `Lab #${c.labMasterId}`,
    date: c.dueDate
      ? new Date(c.dueDate).toLocaleDateString("en-GB", {
          day: "2-digit", month: "2-digit", year: "numeric",
        })
      : "—",
    status:  tab,
    isRush:  false,
  };
}

export interface UseDashboardCasesParams {
  role: LoginRole;
  dSODoctorId?: number | null;
  dSOMasterId?: number | null;
}

export interface UseDashboardCasesResult {
  data: DashboardPageData;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useDashboardCases({
  role,
  dSODoctorId,
  dSOMasterId,
}: UseDashboardCasesParams): UseDashboardCasesResult {

  const [data, setData]       = useState<DashboardPageData>(emptyData(role));
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await CaseService.getPaginatedList({
        pageNumber:  1,
        pageSize:    500,
        getAll:      true,
        showDeleted: false,
        ...(dSODoctorId ? { dSODoctorId } : {}),
        ...(dSOMasterId ? { dSOMasterId } : {}),
      });

      const all: CaseRegistrationDTO[] = result.data ?? [];
      const buckets: DashboardPageData["cases"] = {
        rejected: [], hold: [], transit: [],
        production: [], submitted: [], recent: [],
      };

      for (const c of all) {
        const tab = STATUS_TO_TAB[c.caseStatusMasterId] ?? null;
        if (tab) buckets[tab].push(toCard(c, tab));
        if (isRecent(c.createdAt)) buckets.recent.push(toCard(c, "recent"));
      }

      setData({
        role,
        tabCounts: {
          rejected:   buckets.rejected.length,
          hold:       buckets.hold.length,
          transit:    buckets.transit.length,
          production: buckets.production.length,
          submitted:  buckets.submitted.length,
          recent:     buckets.recent.length,
        },
        cases: buckets,
      });
    } catch (err: any) {
      setError(err?.message ?? "Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [role, dSODoctorId, dSOMasterId]);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, refresh: load };
}

function emptyData(role: LoginRole): DashboardPageData {
  return {
    role,
    tabCounts: { rejected: 0, hold: 0, transit: 0, production: 0, submitted: 0, recent: 0 },
    cases:     { rejected: [], hold: [], transit: [], production: [], submitted: [], recent: [] },
  };
}