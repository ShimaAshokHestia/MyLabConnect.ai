// src/Hooks/useDashboardCases.ts
//
// Status IDs from dbo.case_status_master:
//   1 = Pending       → "submitted"
//   2 = Submitted     → "submitted"
//   3 = In Production → "production"
//   4 = In Transit    → "transit"
//   5 = Case on Hold  → "hold"
//   6 = Scan Rejected → "rejected"
//   7 = Completed     → null (excluded)
//   8 = Cancelled     → null (excluded)

import { useState, useEffect, useCallback } from "react";
import type {
  CaseRecord,
  CaseStatus,
  DashboardPageData,
  LoginRole,
} from "../../../Types/IndexPage.types";
import type { CaseRegistrationDTO } from "../Case.types";
import CaseService from "../../Service/AnalogCase/Case.services";

const STATUS_TO_TAB: Record<number, CaseStatus | null> = {
  1: "submitted",
  2: "submitted",
  3: "production",
  4: "transit",
  5: "hold",
  6: "rejected",
  7: null,
  8: null,
};

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function isRecent(createdAt?: string): boolean {
  if (!createdAt) return false;
  return Date.now() - new Date(createdAt).getTime() <= SEVEN_DAYS_MS;
}

// ── Extract labMasterId from a raw API row regardless of casing ──────────────
// DB column = LabMasterId  →  JSON may come back as any of these variants
function getLabMasterId(c: any): number | null {
  const val =
    c?.labMasterId   ??   // camelCase  (most .NET JSON serializers)
    c?.LabMasterId   ??   // PascalCase (some legacy endpoints)
    c?.labMasterID   ??   // mixed case
    c?.LABMasterId   ??   // all-caps prefix
    null;
  return val !== null ? Number(val) : null;
}

function toCard(c: CaseRegistrationDTO, tab: CaseStatus): CaseRecord {
  return {
    id:          c.caseNo || String(c.id),
    patientName: `${c.patientFirstName ?? ""} ${c.patientLastName ?? ""}`.trim(),
    patientId:   c.patientId,
    caseType:    "Analog Case",
    doctorName:  c.doctorName?.trim() || `Doctor #${c.dSODoctorId}`,

    // ── Show PRACTICE name, not lab name ────────────────────────────
    labName:
      (c as any).practiceName?.trim()        ||
      (c as any).dentalOfficeName?.trim()    ||
      (c as any).officeName?.trim()          ||
      (c as any).dSODentalOfficeName?.trim() ||
      (c as any).practiceNameStr?.trim()     ||
      "—",

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
  labMasterId?: number | null;
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
  labMasterId,
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
        ...(labMasterId ? { labMasterId } : {}),
      });

      let all: CaseRegistrationDTO[] = result.data ?? [];

      // ── MANDATORY CLIENT-SIDE FILTER ─────────────────────────────────
      // The backend currently ignores labMasterId in the POST body and
      // returns ALL cases. We filter here to show only this lab's cases.
      // This is the authoritative filter — do NOT remove even if the API
      // is later fixed (it will simply be a no-op at that point).
      if (labMasterId) {
        const targetId = Number(labMasterId);
        all = all.filter((c) => {
          const id = getLabMasterId(c);
          if (id === null) {
            // Field missing entirely — log once so we can update getLabMasterId
            console.warn(
              "[useDashboardCases] labMasterId field not found on case row. " +
              "Check API response field name. Case id:", (c as any).id
            );
            return false; // exclude unknown cases from this lab's view
          }
          return id === targetId;
        });
      }

      // ── DSO-level doctor filter (already handled server-side but kept for safety) ──
      if (dSODoctorId) {
        const targetDoctorId = Number(dSODoctorId);
        all = all.filter((c) => {
          const id =
            (c as any).dSODoctorId ??
            (c as any).DSODoctorId ??
            (c as any).dsoDoctorId ??
            null;
          return id !== null ? Number(id) === targetDoctorId : true;
        });
      }

      const buckets: DashboardPageData["cases"] = {
        rejected:   [],
        hold:       [],
        transit:    [],
        production: [],
        submitted:  [],
        recent:     [],
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
  }, [role, dSODoctorId, dSOMasterId, labMasterId]);

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