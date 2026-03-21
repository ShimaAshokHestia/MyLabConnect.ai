// src/Pages/PipelineMonitor/PipelineMonitorDashboard.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import PipelineMonitorService from "../../Services/PipelineMonitor/PipelineMonitor.service";
import type { PipelineDashboard, PipelineAlert, PipelineRunLog, StuckCase, ErrorGroup, PerLabStats, TokenHealth } from "../../../Types/PipelineMonitor/PipelineMonitor.types";

const REFRESH_INTERVAL_MS = 30_000; // auto-refresh every 30s

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmt(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}
function fmtSince(iso: string | null | undefined) {
  if (!iso) return "—";
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diff < 1)  return "just now";
  if (diff < 60) return `${diff}m ago`;
  return `${Math.floor(diff / 60)}h ${diff % 60}m ago`;
}

// ─── Shared Summary Card ──────────────────────────────────────────────────────
function Card({ label, value, sub, accent, icon }: {
  label: string; value: string | number; sub?: string; accent: string; icon: string;
}) {
  return (
    <div style={{
      background: "#fff", borderRadius: 12, padding: "18px 22px",
      boxShadow: "0 1px 8px rgba(0,0,0,0.08)", borderLeft: `4px solid ${accent}`,
      flex: "1 1 170px", minWidth: 155,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: "0.7rem", color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>{label}</div>
          <div style={{ fontSize: "1.85rem", fontWeight: 700, color: "#1a1a2e", lineHeight: 1.1 }}>{value}</div>
          {sub && <div style={{ fontSize: "0.72rem", color: "#aaa", marginTop: 4 }}>{sub}</div>}
        </div>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: `${accent}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }}>{icon}</div>
      </div>
    </div>
  );
}

// ─── System Health Banner ─────────────────────────────────────────────────────
function HealthBanner({ health }: { health: PipelineDashboard["systemHealth"] }) {
  const cfg = {
    Healthy:  { bg: "#f0fdf4", border: "#22c55e", text: "#15803d", dot: "#22c55e", icon: "✅" },
    Degraded: { bg: "#fffbeb", border: "#f59e0b", text: "#b45309", dot: "#f59e0b", icon: "⚠️" },
    Failed:   { bg: "#fef2f2", border: "#ef4444", text: "#b91c1c", dot: "#ef4444", icon: "🔴" },
  }[health.overallStatus];

  return (
    <div style={{
      background: cfg.bg, border: `1.5px solid ${cfg.border}`, borderRadius: 12,
      padding: "14px 22px", marginBottom: 20,
      display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: "1.3rem" }}>{cfg.icon}</span>
        <span style={{ fontWeight: 700, fontSize: "1rem", color: cfg.text }}>
          System {health.overallStatus}
        </span>
        <span style={{
          padding: "2px 10px", borderRadius: 20, fontSize: "0.73rem", fontWeight: 600,
          background: cfg.border + "22", color: cfg.text, border: `1px solid ${cfg.border}`,
        }}>
          <span style={{ marginRight: 5, fontSize: 8 }}>●</span>
          {health.currentCycleStatus}
        </span>
      </div>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <Stat label="Last Success"   value={fmtSince(health.lastSuccessfulRun)} />
        <Stat label="Active Alerts"  value={health.activeAlertCount}  red={health.activeAlertCount > 0} />
        <Stat label="Critical"       value={health.criticalAlertCount} red={health.criticalAlertCount > 0} />
      </div>
    </div>
  );
}
function Stat({ label, value, red }: { label: string; value: string | number; red?: boolean }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "0.68rem", color: "#888", fontWeight: 600, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: "1.1rem", fontWeight: 700, color: red ? "#ef4444" : "#1a1a2e" }}>{value}</div>
    </div>
  );
}

// ─── Pipeline Funnel ──────────────────────────────────────────────────────────
function PipelineFunnelView({ funnel }: { funnel: PipelineDashboard["funnel"] }) {
  const stages = [
    { label: "Raw Fetch",    count: funnel.totalCasesInRaw,      failed: funnel.rawFailedCount,       icon: "📥", color: "#3b82f6" },
    { label: "Processing",  count: funnel.totalCasesProcessed,  failed: funnel.processingFailed,     icon: "⚙️", color: "#8b5cf6" },
    { label: "Resolution",  count: funnel.totalResolved,         failed: funnel.resolutionFailed,     icon: "🔍", color: "#f59e0b" },
    { label: "Registered",  count: funnel.totalRegistered,       failed: funnel.registrationFailed,   icon: "✅", color: "#22c55e" },
  ];
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 8px rgba(0,0,0,0.08)" }}>
      <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#333", marginBottom: 16 }}>Pipeline Funnel — Today</div>
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        {stages.map((s, i) => (
          <React.Fragment key={s.label}>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: "1.4rem", marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: "1.7rem", fontWeight: 700, color: s.color }}>{s.count}</div>
              <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#555", marginTop: 2 }}>{s.label}</div>
              {s.failed > 0 && (
                <div style={{ fontSize: "0.68rem", color: "#ef4444", marginTop: 3 }}>
                  {s.failed} failed
                </div>
              )}
            </div>
            {i < stages.length - 1 && (
              <div style={{ color: "#ccc", fontSize: "1.4rem", padding: "0 4px", marginBottom: 16 }}>›</div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
        <PillStat label="Pending Resolution"   value={funnel.pendingResolution}   color="#f59e0b" />
        <PillStat label="Pending Registration" value={funnel.pendingRegistration} color="#3b82f6" />
      </div>
    </div>
  );
}
function PillStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <span style={{
      padding: "4px 12px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 600,
      background: color + "15", color, border: `1px solid ${color}40`,
    }}>
      {label}: {value}
    </span>
  );
}

// ─── Alerts Panel ─────────────────────────────────────────────────────────────
function AlertsPanel({ alerts, onResolve }: { alerts: PipelineAlert[]; onResolve: (id: number) => void }) {
  const cfg = { Critical: { bg: "#fef2f2", color: "#b91c1c", dot: "#ef4444" }, Warning: { bg: "#fffbeb", color: "#b45309", dot: "#f59e0b" }, Info: { bg: "#eff6ff", color: "#1d4ed8", dot: "#3b82f6" } };
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 8px rgba(0,0,0,0.08)", height: "100%" }}>
      <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#333", marginBottom: 12, display: "flex", justifyContent: "space-between" }}>
        <span>Active Alerts</span>
        <span style={{ background: alerts.length > 0 ? "#fef2f2" : "#f0fdf4", color: alerts.length > 0 ? "#ef4444" : "#22c55e", padding: "2px 10px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 700 }}>
          {alerts.length}
        </span>
      </div>
      {alerts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "30px 0", color: "#22c55e", fontSize: "0.85rem" }}>✅ No active alerts</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 280, overflowY: "auto" }}>
          {alerts.map(a => {
            const c = cfg[a.severity];
            return (
              <div key={a.id} style={{ background: c.bg, borderRadius: 8, padding: "10px 12px", border: `1px solid ${c.dot}30` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "0.72rem", fontWeight: 700, color: c.color, textTransform: "uppercase" }}>
                      <span style={{ color: c.dot, fontSize: 8 }}>●</span>{a.severity}
                      {a.labCode && <span style={{ background: "#fff", padding: "1px 6px", borderRadius: 4, marginLeft: 4, fontSize: "0.68rem" }}>{a.labCode}</span>}
                    </span>
                    <div style={{ fontSize: "0.78rem", color: "#444", marginTop: 3, lineHeight: 1.4 }}>{a.message}</div>
                    <div style={{ fontSize: "0.68rem", color: "#aaa", marginTop: 4 }}>{fmtSince(a.triggeredAt)}</div>
                  </div>
                  <button onClick={() => onResolve(a.id)} style={{
                    background: "none", border: `1px solid ${c.dot}60`, borderRadius: 6,
                    padding: "3px 8px", fontSize: "0.68rem", color: c.color, cursor: "pointer", whiteSpace: "nowrap", marginLeft: 8,
                  }}>Resolve</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Token Health Table ───────────────────────────────────────────────────────
function TokenHealthTable({ tokens }: { tokens: TokenHealth[] }) {
  const statusCfg = { Fresh: { bg: "#f0fdf4", color: "#15803d" }, Stale: { bg: "#fffbeb", color: "#b45309" }, Expired: { bg: "#fef2f2", color: "#b91c1c" } };
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 8px rgba(0,0,0,0.08)" }}>
      <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#333", marginBottom: 14 }}>🔑 Token Health</div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
          <thead>
            <tr style={{ background: "#f8f9fa" }}>
              {["Lab Code", "Company ID", "Last Refreshed", "Hours Since", "Status", "Active"].map(h => (
                <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#555", fontSize: "0.72rem", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tokens.map(t => {
              const c = statusCfg[t.status];
              return (
                <tr key={t.labCode} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 600 }}>{t.labCode}</td>
                  <td style={{ padding: "10px 12px", color: "#666" }}>{t.companyId}</td>
                  <td style={{ padding: "10px 12px", color: "#666" }}>{fmt(t.lastRefreshed)}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{ fontWeight: 600, color: t.hoursSinceRefresh > 6 ? "#ef4444" : "#22c55e" }}>
                      {t.hoursSinceRefresh === 999 ? "Never" : `${t.hoursSinceRefresh}h`}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 600, background: c.bg, color: c.color }}>{t.status}</span>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{ fontSize: "1rem" }}>{t.isActive ? "✅" : "❌"}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Error Groups ─────────────────────────────────────────────────────────────
function ErrorGroupsTable({ groups }: { groups: ErrorGroup[] }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 8px rgba(0,0,0,0.08)" }}>
      <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#333", marginBottom: 14 }}>❗ Error Groups</div>
      {groups.length === 0
        ? <div style={{ textAlign: "center", padding: "20px 0", color: "#22c55e", fontSize: "0.85rem" }}>✅ No errors</div>
        : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ background: "#f8f9fa" }}>
                  {["Stage", "Reason", "Count", "Example Case", "Last Occurred"].map(h => (
                    <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#555", fontSize: "0.72rem", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groups.map((g, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ padding: "2px 8px", borderRadius: 4, background: "#eff6ff", color: "#1d4ed8", fontSize: "0.72rem", fontWeight: 600 }}>{g.stage}</span>
                    </td>
                    <td style={{ padding: "10px 12px", color: "#444", maxWidth: 260 }}>{g.errorReason}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ fontWeight: 700, color: g.count > 5 ? "#ef4444" : "#f59e0b" }}>{g.count}</span>
                    </td>
                    <td style={{ padding: "10px 12px", color: "#888", fontSize: "0.75rem", fontFamily: "monospace" }}>{g.exampleCaseId.slice(0, 18)}…</td>
                    <td style={{ padding: "10px 12px", color: "#888" }}>{fmtSince(g.lastOccurred)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
    </div>
  );
}

// ─── Stuck Cases ──────────────────────────────────────────────────────────────
function StuckCasesTable({ cases }: { cases: StuckCase[] }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 8px rgba(0,0,0,0.08)" }}>
      <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#333", marginBottom: 14 }}>
        ⏳ Stuck Cases
        {cases.length > 0 && (
          <span style={{ marginLeft: 8, background: "#fef2f2", color: "#ef4444", padding: "2px 8px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 700 }}>
            {cases.length}
          </span>
        )}
      </div>
      {cases.length === 0
        ? <div style={{ textAlign: "center", padding: "20px 0", color: "#22c55e", fontSize: "0.85rem" }}>✅ No stuck cases</div>
        : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ background: "#f8f9fa" }}>
                  {["Case ID", "Patient", "Lab", "Stuck At", "Hours Stuck", "Last Error"].map(h => (
                    <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#555", fontSize: "0.72rem", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cases.map(c => (
                  <tr key={c.shapeCaseId} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: "0.75rem", color: "#666" }}>{c.caseId.slice(0, 16)}…</td>
                    <td style={{ padding: "10px 12px" }}>{c.patientName || "—"}</td>
                    <td style={{ padding: "10px 12px" }}><span style={{ fontWeight: 600 }}>{c.labCode}</span></td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ padding: "2px 8px", borderRadius: 4, background: "#fffbeb", color: "#b45309", fontSize: "0.72rem", fontWeight: 600 }}>{c.stuckAt}</span>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ fontWeight: 700, color: c.hoursStuck > 4 ? "#ef4444" : "#f59e0b" }}>{c.hoursStuck}h</span>
                    </td>
                    <td style={{ padding: "10px 12px", color: "#999", fontSize: "0.75rem", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {c.lastError ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
    </div>
  );
}

// ─── Recent Runs Table ────────────────────────────────────────────────────────
function RecentRunsTable({ runs }: { runs: PipelineRunLog[] }) {
  const statusCfg = {
    Completed: { bg: "#f0fdf4", color: "#15803d" },
    Failed:    { bg: "#fef2f2", color: "#b91c1c" },
    Running:   { bg: "#eff6ff", color: "#1d4ed8" },
  };
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 8px rgba(0,0,0,0.08)" }}>
      <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#333", marginBottom: 14 }}>🕐 Recent Pipeline Runs</div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
          <thead>
            <tr style={{ background: "#f8f9fa" }}>
              {["Stage", "Status", "Started", "Duration", "Fetched", "Resolved", "Registered", "Errors"].map(h => (
                <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#555", fontSize: "0.7rem", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {runs.map(r => {
              const c = statusCfg[r.status] ?? statusCfg.Running;
              return (
                <tr key={r.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "9px 12px" }}>
                    <span style={{ padding: "2px 8px", borderRadius: 4, background: "#eff6ff", color: "#1d4ed8", fontSize: "0.72rem", fontWeight: 600 }}>{r.stage}</span>
                  </td>
                  <td style={{ padding: "9px 12px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: "0.7rem", fontWeight: 600, background: c.bg, color: c.color }}>{r.status}</span>
                  </td>
                  <td style={{ padding: "9px 12px", color: "#888" }}>{fmtSince(r.cycleStart)}</td>
                  <td style={{ padding: "9px 12px", fontWeight: 600 }}>{r.durationSeconds > 0 ? `${r.durationSeconds}s` : "—"}</td>
                  <td style={{ padding: "9px 12px" }}>{r.casesFetched}</td>
                  <td style={{ padding: "9px 12px" }}>{r.casesResolved}</td>
                  <td style={{ padding: "9px 12px" }}>{r.casesRegistered}</td>
                  <td style={{ padding: "9px 12px" }}>
                    {r.errorCount > 0
                      ? <span style={{ color: "#ef4444", fontWeight: 700 }}>{r.errorCount}</span>
                      : <span style={{ color: "#22c55e" }}>0</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Per-Lab Chart ────────────────────────────────────────────────────────────
function LabChart({ labs }: { labs: PerLabStats[] }) {
  const data = labs.map(l => ({
    lab: l.labCode, registered: l.casesRegisteredToday,
    stuck: l.stuckCasesCount, failed: l.failedCasesCount,
  }));
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 8px rgba(0,0,0,0.08)" }}>
      <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#333", marginBottom: 16 }}>Per-Lab Activity — Today</div>
      <ResponsiveContainer width="100%" height={210}>
        <BarChart data={data} barCategoryGap="40%" barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="lab" tick={{ fontSize: 11, fill: "#666" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#666" }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.12)" }} cursor={{ fill: "#f9f9f9" }} />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
          <Bar dataKey="registered" name="Registered" fill="#4ade80" radius={[4, 4, 0, 0]} />
          <Bar dataKey="stuck"      name="Stuck"      fill="#fb923c" radius={[4, 4, 0, 0]} />
          <Bar dataKey="failed"     name="Failed"     fill="#f87171" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Dead Letter Panel ────────────────────────────────────────────────────────
function DeadLetterPanel({ dl }: { dl: PipelineDashboard["deadLetter"] }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 8px rgba(0,0,0,0.08)" }}>
      <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#333", marginBottom: 14 }}>☠️ Dead Letter Queue</div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {[
          { label: "Pending",   value: dl.pendingCount,   color: "#f59e0b" },
          { label: "Retrying",  value: dl.retryingCount,  color: "#3b82f6" },
          { label: "Abandoned", value: dl.abandonedCount, color: "#ef4444" },
          { label: "Resolved",  value: dl.resolvedCount,  color: "#22c55e" },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, minWidth: 90, textAlign: "center", padding: "12px 8px", background: s.color + "10", borderRadius: 10, border: `1px solid ${s.color}30` }}>
            <div style={{ fontSize: "1.6rem", fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: "0.7rem", color: "#666", marginTop: 3, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>
      {dl.casesExceededRetry > 0 && (
        <div style={{ marginTop: 12, padding: "8px 12px", background: "#fef2f2", borderRadius: 8, fontSize: "0.78rem", color: "#b91c1c", fontWeight: 600 }}>
          ⚠️ {dl.casesExceededRetry} case(s) exceeded retry limit — manual intervention needed
        </div>
      )}
      {dl.oldestPending && (
        <div style={{ marginTop: 8, fontSize: "0.73rem", color: "#aaa" }}>
          Oldest pending: {fmt(dl.oldestPending)}
        </div>
      )}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const PipelineMonitorDashboard: React.FC = () => {
  const [data, setData]         = useState<PipelineDashboard | null>(null);
  const [loading, setLoading]   = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [resolving, setResolving]     = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => {
    try {
      const result = await PipelineMonitorService.getDashboard();
      setData(result);
      setLastRefresh(new Date());
    } catch (err) {
      console.error("Dashboard load failed", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    intervalRef.current = setInterval(load, REFRESH_INTERVAL_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [load]);

  const handleResolve = async (id: number) => {
    setResolving(id);
    try {
      await PipelineMonitorService.resolveAlert(id);
      await load();
    } finally {
      setResolving(null);
    }
  };

  const summaryStats = useMemo(() => {
    if (!data) return null;
    const f = data.funnel;
    return {
      totalToday:    f.totalCasesInRaw,
      registered:   f.totalRegistered,
      pending:      f.pendingResolution + f.pendingRegistration,
      failed:       f.rawFailedCount + f.processingFailed + f.resolutionFailed + f.registrationFailed,
      tokens:       data.tokens.length,
      stale:        data.tokens.filter(t => t.status !== "Fresh").length,
    };
  }, [data]);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: 12 }}>⚙️</div>
          <div style={{ color: "#888", fontSize: "0.9rem" }}>Loading pipeline monitor…</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: 24, textAlign: "center", color: "#ef4444" }}>
        Failed to load dashboard. Check API connection.
      </div>
    );
  }

  return (
    <div style={{ padding: 24, background: "#f8f9fb", minHeight: "100vh" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1a1a2e" }}>⚙️ Pipeline Monitor</div>
          <div style={{ fontSize: "0.75rem", color: "#aaa", marginTop: 2 }}>
            Auto-refreshes every 30s
            {lastRefresh && ` · Last updated ${fmtSince(lastRefresh.toISOString())}`}
          </div>
        </div>
        <button onClick={load} style={{
          padding: "8px 18px", borderRadius: 8, border: "1.5px solid #3b82f6",
          background: "#eff6ff", color: "#1d4ed8", fontWeight: 600,
          fontSize: "0.82rem", cursor: "pointer",
        }}>
          🔄 Refresh
        </button>
      </div>

      {/* ── Health Banner ── */}
      <HealthBanner health={data.systemHealth} />

      {/* ── Summary Cards ── */}
      {summaryStats && (
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 20 }}>
          <Card label="Cases Today"      value={summaryStats.totalToday}  sub="Fetched from 3Shape"    accent="#3b82f6" icon="📥" />
          <Card label="Registered"       value={summaryStats.registered}  sub="Into case_registration" accent="#22c55e" icon="✅" />
          <Card label="Pending"          value={summaryStats.pending}     sub="Resolution + Register"  accent="#f59e0b" icon="⏳" />
          <Card label="Total Errors"     value={summaryStats.failed}      sub="Across all stages"      accent="#ef4444" icon="❗" />
          <Card label="Tokens"           value={summaryStats.tokens}      sub={`${summaryStats.stale} stale/expired`} accent="#8b5cf6" icon="🔑" />
          <Card label="Active Alerts"    value={data.activeAlerts.length} sub={`${data.systemHealth.criticalAlertCount} critical`} accent="#ec4899" icon="🚨" />
        </div>
      )}

      {/* ── Funnel + Alerts ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 16, marginBottom: 16 }}>
        <PipelineFunnelView funnel={data.funnel} />
        <AlertsPanel alerts={data.activeAlerts} onResolve={handleResolve} />
      </div>

      {/* ── Charts Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <LabChart labs={data.labBreakdown} />
        <DeadLetterPanel dl={data.deadLetter} />
      </div>

      {/* ── Token Health ── */}
      <div style={{ marginBottom: 16 }}>
        <TokenHealthTable tokens={data.tokens} />
      </div>

      {/* ── Error Groups + Stuck Cases ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <ErrorGroupsTable groups={data.errorGroups} />
        <StuckCasesTable  cases={data.stuckCases}   />
      </div>

      {/* ── Recent Runs ── */}
      <RecentRunsTable runs={data.recentRuns} />

    </div>
  );
};

export default PipelineMonitorDashboard;
