// src/DOCTOR_CONNECT/Pages/MyCases/MyCases.tsx

import React, { useState, useEffect, useCallback } from "react";
import { Container, Button, Spinner } from "react-bootstrap";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  FileText,
  Package,
  TrendingUp,
  AlertCircle,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../Services/AuthServices/Auth.services";
import CaseService from "../../Service/AnalogCase/Case.services";
import type { CaseRegistrationDTO } from "../../Types/Case.types";
import type { StatCardProps } from "../../../Types/KiduTypes/StatCard.types";
import type { TabItem } from "../../../Types/Dashboards.types";
import KiduStatsCardsGrid from "../../../KIDU_COMPONENTS/KiduStatsCardsGrid";
import CaseTabs from "../../../KIDU_COMPONENTS/KiduCaseTabs";
import CaseCard from "../../../KIDU_COMPONENTS/KiduCaseCards";
import type { CaseStatus } from "../../../KIDU_COMPONENTS/KiduCaseCards";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const isDueToday = (dateStr?: string) => {
  if (!dateStr) return false;
  const due   = new Date(dateStr).toDateString();
  const today = new Date().toDateString();
  return due === today;
};

const isDueOverdue = (dateStr?: string) => {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date() && !isDueToday(dateStr);
};

// Map caseStatusMasterId → KiduCaseCards CaseStatus
const mapStatus = (id: number): CaseStatus => {
  switch (id) {
    case 1: return "submitted";
    case 2: return "production";
    case 3: return "transit";
    case 4: return "recent";    // completed
    case 5: return "hold";
    case 6: return "rejected";
    default: return "submitted";
  }
};

// Helper: resolve the practice name from whichever field the API returns
const resolvePracticeName = (c: CaseRegistrationDTO): string | undefined =>
  c.practiceName ??
  c.dSODentalOfficeName ??
  c.dentalOfficeName ??
  c.officeName ??
  c.practiceNameStr ??
  (c.dSODentalOfficeId ? `Office #${c.dSODentalOfficeId}` : undefined);

// ─────────────────────────────────────────────────────────────────────────────
// Tab filter logic
// ─────────────────────────────────────────────────────────────────────────────

const filterByTab = (cases: CaseRegistrationDTO[], tab: string): CaseRegistrationDTO[] => {
  const now         = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  switch (tab) {
    case "active":
      return cases.filter((c) => c.caseStatusMasterId !== 4);
    case "progress":
      return cases.filter((c) =>
        c.caseStatusMasterId === 2 || c.caseStatusMasterId === 3
      );
    case "completed":
      return cases.filter((c) => c.caseStatusMasterId === 4);
    case "recent":
      return cases.filter((c) =>
        c.createdAt && new Date(c.createdAt) >= sevenDaysAgo
      );
    default:
      return cases;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

const MyCases: React.FC = () => {
  const navigate = useNavigate();
  const user     = AuthService.getUser();

  const [allCases, setAllCases]   = useState<CaseRegistrationDTO[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("active");

  // ── Fetch all cases for this doctor ───────────────────────────────────────────────
  const fetchCases = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await CaseService.getPaginatedList({
        pageNumber:  1,
        pageSize:    200,
        getAll:      true,
        showDeleted: false,
        dSODoctorId: user?.dsoDoctorId ?? undefined,
        dSOMasterId: user?.dsoMasterId ?? undefined,
      });
      setAllCases(result.data ?? []);
    } catch (err: any) {
      setError("Failed to load cases. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user?.dsoDoctorId, user?.dsoMasterId]);

  useEffect(() => { fetchCases(); }, [fetchCases]);

  // ── Derived counts for tabs + stats ─────────────────────────────────────────────
  const activeCases  = allCases.filter((c) => c.caseStatusMasterId !== 4);
  const inProgress   = allCases.filter((c) => c.caseStatusMasterId === 2 || c.caseStatusMasterId === 3);
  const completed    = allCases.filter((c) => c.caseStatusMasterId === 4);
  const now          = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const recentCases  = allCases.filter((c) => c.createdAt && new Date(c.createdAt) >= sevenDaysAgo);
  const overdueCases = allCases.filter((c) => isDueOverdue(c.dueDate) && c.caseStatusMasterId !== 4);

  // ── Tab config (dynamic counts) ────────────────────────────────────────────────
  const tabs: TabItem[] = [
    { id: "active",    label: "Active Cases", icon: ClipboardList, count: activeCases.length  },
    { id: "progress",  label: "In Progress",  icon: Clock,         count: inProgress.length   },
    { id: "completed", label: "Completed",    icon: CheckCircle2,  count: completed.length    },
    { id: "recent",    label: "Recent",       icon: FileText,      count: recentCases.length  },
  ];

  // ── Stats cards (dynamic values) ───────────────────────────────────────────────
  const statsCards: StatCardProps[] = [
    {
      title:      "My Active Cases",
      value:      loading ? "—" : activeCases.length,
      change:     loading ? "" : `${recentCases.length} added this week`,
      changeType: "positive",
      icon:       Package,
      loading,
    },
    {
      title:      "In Progress",
      value:      loading ? "—" : inProgress.length,
      change:     loading ? "" : inProgress.filter((c) => isDueToday(c.dueDate)).length > 0
        ? `${inProgress.filter((c) => isDueToday(c.dueDate)).length} due today`
        : "No cases due today",
      changeType: "neutral",
      icon:       Clock,
      variant:    "info",
      loading,
    },
    {
      title:      "Overdue",
      value:      loading ? "—" : overdueCases.length,
      change:     loading ? "" : overdueCases.length > 0 ? "Needs attention" : "All on track",
      changeType: overdueCases.length > 0 ? "negative" : "positive",
      icon:       AlertCircle,
      variant:    overdueCases.length > 0 ? "danger" : "success",
      loading,
    },
    {
      title:      "Completed",
      value:      loading ? "—" : completed.length,
      change:     loading ? "" : `${allCases.length} total cases`,
      changeType: "positive",
      icon:       TrendingUp,
      variant:    "success",
      loading,
    },
  ];

  // ── Current tab's cases ───────────────────────────────────────────────────────────────────────
  const visibleCases = filterByTab(allCases, activeTab);

  // ── View handler ─────────────────────────────────────────────────────────────────────────────
  const handleView = (id: number) => {
    navigate(`/doctor-connect/cases/${id}`);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <Container fluid className="dashboard-page py-4">

      {/* ── Page Header ─────────────────────────────────────────────────────────────────────── */}
      <div className="page-header mb-4 d-flex justify-content-between align-items-start flex-wrap gap-3">
        <div>
          <h4 className="page-title mb-1">My Cases</h4>
          <p className="page-description mb-0">
            Welcome back, <strong>Dr. {user?.userName ?? "Doctor"}</strong>! You have{" "}
            <strong>{loading ? "..." : activeCases.length}</strong> active cases.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={fetchCases}
            disabled={loading}
            style={{
              background: "transparent", border: "1.5px solid var(--theme-border, #e0e0e0)",
              borderRadius: 10, padding: "8px 16px", fontSize: "0.82rem",
              color: "var(--theme-text-secondary, #666)", cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <RefreshCw size={14} className={loading ? "spin" : ""} />
            Refresh
          </button>
          <Button
            variant="primary"
            className="d-flex align-items-center gap-2 px-3"
            style={{
              backgroundColor: "var(--theme-primary, #ef0d50)",
              borderColor: "var(--theme-primary, #ef0d50)",
              borderRadius: "0.75rem",
              fontWeight: 500,
            }}
            onClick={() => navigate("/doctor-connect/add-new-case")}
          >
            <Plus size={16} />
            New Case
          </Button>
        </div>
      </div>

      {/* ── Stats Cards ─────────────────────────────────────────────────────────────────────── */}
      <KiduStatsCardsGrid cards={statsCards} columns={4} />

      {/* ── Tabs ────────────────────────────────────────────────────────────────────────────────── */}
      <CaseTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-4"
      />

      {/* ── Error banner ──────────────────────────────────────────────────────────────────────── */}
      {error && (
        <div style={{
          background: "#fde8ef", border: "1px solid #ef0d50", borderRadius: 10,
          padding: "10px 16px", marginBottom: 16, fontSize: "0.83rem", color: "#8b0029",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      {/* ── Loading ───────────────────────────────────────────────────────────────────────────── */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--theme-text-secondary, #888)" }}>
          <Spinner animation="border" size="sm" style={{ color: "#ef0d50" }} />
          <p style={{ marginTop: 12, fontSize: "0.85rem" }}>Loading your cases...</p>
        </div>
      )}

      {/* ── Empty state ───────────────────────────────────────────────────────────────────────────── */}
      {!loading && !error && visibleCases.length === 0 && (
        <div className="my-cases-empty-state">
          <ClipboardList size={40} className="my-cases-empty-icon" style={{ marginBottom: 12 }} />
          <p className="my-cases-empty-title">
            No cases found in this category.
          </p>
          <p className="my-cases-empty-subtitle">
            Click "New Case" to create your first case.
          </p>
        </div>
      )}

      {/* ── Case Cards Grid ────────────────────────────────────────────────────────────────────────────── */}
      {!loading && !error && visibleCases.length > 0 && (
        <>
          {/* Result count */}
          <div style={{
            fontSize: "0.78rem", color: "var(--theme-text-secondary, #888)",
            marginBottom: 14, fontWeight: 500,
          }}>
            Showing {visibleCases.length} case{visibleCases.length !== 1 ? "s" : ""}
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}>
            {visibleCases.map((c, idx) => (
              <CaseCard
                key={c.id}
                mode="doctor"
                patientName={`${c.patientFirstName ?? ""} ${c.patientLastName ?? ""}`.trim() || "—"}
                patientId={c.patientId}
                caseId={c.caseNo ?? String(c.id)}
                caseType="Analog Case"
                doctorName={user?.userName ?? ""}
                hideDoctorName={true}
                labName={
                  c.labName ??
                  (c.labMasterId ? `Lab #${c.labMasterId}` : "—")
                }
                practiceName={resolvePracticeName(c)}
                date={formatDate(c.dueDate)}
                status={mapStatus(c.caseStatusMasterId)}
                animationDelay={idx * 0.04}
                onClick={() => handleView(c.id)}
              />
            ))}
          </div>
        </>
      )}

      {/* ── Styles ────────────────────────────────────────────────────────────────────────────────── */}
       <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .spin { animation: spin 1s linear infinite; }

        /* Empty state — uses CSS variables so it adapts to dark mode automatically */
        .my-cases-empty-state {
          text-align: center;
          padding: 60px 20px;
          background: var(--theme-bg-paper);
          border-radius: 14px;
          border: 1.5px dashed var(--theme-border, #e0e0e0);
        }
        .my-cases-empty-icon {
          color: var(--theme-text-disabled, #ccc);
        }
        .my-cases-empty-title {
          font-size: 0.95rem;
          color: var(--theme-text-secondary, #aaa);
          margin: 0;
          font-weight: 500;
        }
        .my-cases-empty-subtitle {
          font-size: 0.82rem;
          color: var(--theme-text-disabled, #ccc);
          margin-top: 4px;
        }
      `}</style>

    </Container>
  );
};

export default MyCases;