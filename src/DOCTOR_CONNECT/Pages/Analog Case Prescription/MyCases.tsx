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
  Calendar,
  Building2,
  FlaskConical,
  Eye,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../Services/AuthServices/Auth.services";
import CaseService from "../../Service/Prescription/Case.services";
import type { CaseRegistrationDTO } from "../../Types/Case.types";
import type { StatCardProps } from "../../../Types/KiduTypes/StatCard.types";
import type { TabItem } from "../../../Types/Dashboards.types";
import KiduStatsCardsGrid from "../../../KIDU_COMPONENTS/KiduStatsCardsGrid";
import CaseTabs from "../../../KIDU_COMPONENTS/KiduCaseTabs";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_MAP: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: "Submitted",     color: "#0d6efd", bg: "#e7f1ff" },
  2: { label: "In Production", color: "#fd7e14", bg: "#fff3e0" },
  3: { label: "In Transit",    color: "#6f42c1", bg: "#f3edff" },
  4: { label: "Completed",     color: "#198754", bg: "#e8f5e9" },
  5: { label: "Case on Hold",  color: "#dc3545", bg: "#fde8ef" },
  6: { label: "Scan Rejected", color: "#dc3545", bg: "#fde8ef" },
};

const getStatus = (id: number) =>
  STATUS_MAP[id] ?? { label: "Unknown", color: "#6c757d", bg: "#f0f0f0" };

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
  const due  = new Date(dateStr).toDateString();
  const today = new Date().toDateString();
  return due === today;
};

const isDueOverdue = (dateStr?: string) => {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date() && !isDueToday(dateStr);
};

// ─────────────────────────────────────────────────────────────────────────────
// Tab filter logic
// ─────────────────────────────────────────────────────────────────────────────

const filterByTab = (cases: CaseRegistrationDTO[], tab: string): CaseRegistrationDTO[] => {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  switch (tab) {
    case "active":
      // All cases except completed (statusId !== 4)
      return cases.filter((c) => c.caseStatusMasterId !== 4);
    case "progress":
      // In Production or In Transit
      return cases.filter((c) =>
        c.caseStatusMasterId === 2 || c.caseStatusMasterId === 3
      );
    case "completed":
      return cases.filter((c) => c.caseStatusMasterId === 4);
    case "recent":
      // Created in the last 7 days
      return cases.filter((c) =>
        c.createdAt && new Date(c.createdAt) >= sevenDaysAgo
      );
    default:
      return cases;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Case Card
// ─────────────────────────────────────────────────────────────────────────────

interface CaseCardProps {
  caseItem: CaseRegistrationDTO;
  onView: (id: number) => void;
}

const CaseCard: React.FC<CaseCardProps> = ({ caseItem, onView }) => {
  const status   = getStatus(caseItem.caseStatusMasterId);
  const overdue  = isDueOverdue(caseItem.dueDate);
  const dueToday = isDueToday(caseItem.dueDate);

  return (
    <div
      className="case-card"
      style={{
        background: "#fff",
        borderRadius: 14,
        border: "1.5px solid #f0f0f5",
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        transition: "box-shadow 0.2s, transform 0.2s",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 24px rgba(0,0,0,0.10)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      {/* Left accent bar */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0,
        width: 4, borderRadius: "14px 0 0 14px",
        background: status.color,
      }} />

      {/* Top row: Patient name + status badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingLeft: 8 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: "0.97rem", color: "#1a1a2e", lineHeight: 1.3 }}>
            {caseItem.patientFirstName} {caseItem.patientLastName}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#888", marginTop: 2 }}>
            ({caseItem.patientId})
          </div>
        </div>
        <span style={{
          fontSize: "0.7rem", fontWeight: 600, padding: "3px 10px",
          borderRadius: 20, background: status.bg, color: status.color,
          whiteSpace: "nowrap",
        }}>
          {status.label}
        </span>
      </div>

      {/* Case number */}
      <div style={{ paddingLeft: 8 }}>
        <span style={{
          fontSize: "0.72rem", fontWeight: 600, color: "#ef0d50",
          letterSpacing: "0.04em",
        }}>
          #{caseItem.caseNo}
        </span>
      </div>

      {/* Info rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingLeft: 8 }}>

        {/* Lab */}
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "0.78rem", color: "#555" }}>
          <FlaskConical size={13} color="#ef0d50" />
          <span style={{ fontWeight: 500 }}>Lab:</span>
          <span>{caseItem.labMasterId ? `Lab #${caseItem.labMasterId}` : "—"}</span>
        </div>

        {/* Office */}
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "0.78rem", color: "#555" }}>
          <Building2 size={13} color="#6f42c1" />
          <span style={{ fontWeight: 500 }}>Office:</span>
          <span>{caseItem.officeName || "—"}</span>
        </div>

        {/* Due Date */}
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "0.78rem" }}>
          <Calendar size={13} color={overdue ? "#dc3545" : dueToday ? "#fd7e14" : "#198754"} />
          <span style={{ fontWeight: 500, color: "#555" }}>Due:</span>
          <span style={{
            color: overdue ? "#dc3545" : dueToday ? "#fd7e14" : "#555",
            fontWeight: overdue || dueToday ? 600 : 400,
          }}>
            {formatDate(caseItem.dueDate)}
            {dueToday && (
              <span style={{
                marginLeft: 6, fontSize: "0.65rem", background: "#fff3e0",
                color: "#fd7e14", borderRadius: 4, padding: "1px 6px", fontWeight: 700,
              }}>
                TODAY
              </span>
            )}
            {overdue && (
              <span style={{
                marginLeft: 6, fontSize: "0.65rem", background: "#fde8ef",
                color: "#dc3545", borderRadius: 4, padding: "1px 6px", fontWeight: 700,
              }}>
                OVERDUE
              </span>
            )}
          </span>
        </div>

      </div>

      {/* Footer: created date + view button */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        paddingLeft: 8, paddingTop: 4, borderTop: "1px solid #f5f5f5", marginTop: 2,
      }}>
        <span style={{ fontSize: "0.7rem", color: "#aaa" }}>
          Created {formatDate(caseItem.createdAt)}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onView(caseItem.id); }}
          style={{
            background: "transparent", border: "1.5px solid #ef0d50",
            borderRadius: 8, padding: "4px 12px", fontSize: "0.72rem",
            color: "#ef0d50", fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 5,
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#ef0d50";
            (e.currentTarget as HTMLButtonElement).style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "#ef0d50";
          }}
        >
          <Eye size={12} /> View
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

const MyCases: React.FC = () => {
  const navigate  = useNavigate();
  const user      = AuthService.getUser();

  const [allCases, setAllCases]     = useState<CaseRegistrationDTO[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [activeTab, setActiveTab]   = useState("active");

  // ── Fetch all cases for this doctor ────────────────────────────────────────
  const fetchCases = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await CaseService.getPaginatedList({
        pageNumber:   1,
        pageSize:     200,
        getAll:       true,
        showDeleted:  false,
        dSODoctorId:  user?.dsoDoctorId  ?? undefined,
        dSOMasterId:  user?.dsoMasterId  ?? undefined,
      });
      setAllCases(result.data ?? []);
    } catch (err: any) {
      setError("Failed to load cases. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user?.dsoDoctorId, user?.dsoMasterId]);

  useEffect(() => { fetchCases(); }, [fetchCases]);

  // ── Derived counts for tabs + stats ────────────────────────────────────────
  const activeCases    = allCases.filter((c) => c.caseStatusMasterId !== 4);
  const inProgress     = allCases.filter((c) => c.caseStatusMasterId === 2 || c.caseStatusMasterId === 3);
  const completed      = allCases.filter((c) => c.caseStatusMasterId === 4);
  const now            = new Date();
  const sevenDaysAgo   = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const recentCases    = allCases.filter((c) => c.createdAt && new Date(c.createdAt) >= sevenDaysAgo);
  const overdueCases   = allCases.filter((c) => isDueOverdue(c.dueDate) && c.caseStatusMasterId !== 4);

  // ── Tab config (dynamic counts) ────────────────────────────────────────────
  const tabs: TabItem[] = [
    { id: "active",    label: "Active Cases", icon: ClipboardList, count: activeCases.length  },
    { id: "progress",  label: "In Progress",  icon: Clock,         count: inProgress.length   },
    { id: "completed", label: "Completed",    icon: CheckCircle2,  count: completed.length    },
    { id: "recent",    label: "Recent",       icon: FileText,      count: recentCases.length  },
  ];

  // ── Stats cards (dynamic values) ───────────────────────────────────────────
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

  // ── Current tab's cases ─────────────────────────────────────────────────────
  const visibleCases = filterByTab(allCases, activeTab);

  // ── View handler ────────────────────────────────────────────────────────────
  const handleView = (id: number) => {
    navigate(`/doctor-connect/cases/${id}`);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <Container fluid className="dashboard-page py-4">

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="page-header mb-4 d-flex justify-content-between align-items-start flex-wrap gap-3">
        <div>
          <h1 className="page-title mb-1">My Cases</h1>
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
              background: "transparent", border: "1.5px solid #e0e0e0",
              borderRadius: 10, padding: "8px 16px", fontSize: "0.82rem",
              color: "#666", cursor: loading ? "not-allowed" : "pointer",
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

      {/* ── Stats Cards ─────────────────────────────────────────────────────── */}
      <KiduStatsCardsGrid cards={statsCards} columns={4} />

      {/* ── Tabs ────────────────────────────────────────────────────────────── */}
      <CaseTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-4"
      />

      {/* ── Error banner ────────────────────────────────────────────────────── */}
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

      {/* ── Loading ─────────────────────────────────────────────────────────── */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#888" }}>
          <Spinner animation="border" size="sm" style={{ color: "#ef0d50" }} />
          <p style={{ marginTop: 12, fontSize: "0.85rem" }}>Loading your cases...</p>
        </div>
      )}

      {/* ── Empty state ─────────────────────────────────────────────────────── */}
      {!loading && !error && visibleCases.length === 0 && (
        <div style={{
          textAlign: "center", padding: "60px 20px",
          background: "#fff", borderRadius: 14,
          border: "1.5px dashed #e0e0e0",
        }}>
          <ClipboardList size={40} color="#ddd" style={{ marginBottom: 12 }} />
          <p style={{ fontSize: "0.95rem", color: "#aaa", margin: 0, fontWeight: 500 }}>
            No cases found in this category.
          </p>
          <p style={{ fontSize: "0.82rem", color: "#ccc", marginTop: 4 }}>
            Click "New Case" to create your first case.
          </p>
        </div>
      )}

      {/* ── Case Cards Grid ──────────────────────────────────────────────────── */}
      {!loading && !error && visibleCases.length > 0 && (
        <>
          {/* Result count */}
          <div style={{
            fontSize: "0.78rem", color: "#888", marginBottom: 14, fontWeight: 500,
          }}>
            Showing {visibleCases.length} case{visibleCases.length !== 1 ? "s" : ""}
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}>
            {visibleCases.map((c) => (
              <CaseCard key={c.id} caseItem={c} onView={handleView} />
            ))}
          </div>
        </>
      )}

      {/* ── Spin animation ──────────────────────────────────────────────────── */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .spin { animation: spin 1s linear infinite; }
      `}</style>

    </Container>
  );
};

export default MyCases;