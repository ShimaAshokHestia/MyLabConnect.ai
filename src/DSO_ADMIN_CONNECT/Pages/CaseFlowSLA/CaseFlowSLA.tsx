import React, { useMemo } from "react";
import KiduServerTableList from "../../../KIDU_COMPONENTS/KiduServerTableList";
import type { KiduColumn } from "../../../KIDU_COMPONENTS/KiduServerTable";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SLARecord {
  id: number;
  labCode: string;
  labName: string;
  caseNo: string;
  caseDate: string;
  acknowledgeDigitalCase: number | "Breached";
  scanFeedback: number | "Breached";
  practiceMsgResponse: number | "Breached";
}

// ─── Demo Data — 50 records across 8 labs ────────────────────────────────────

const dummyData: SLARecord[] = [
  // ALSD — Alpha Dental Studio
  { id: 1,  labCode: "ALSD", labName: "Alpha Dental Studio",    caseNo: "ALSDS700032", caseDate: "2026-01-03T08:10:00", acknowledgeDigitalCase: 21188.62, scanFeedback: 0,        practiceMsgResponse: 0 },
  { id: 2,  labCode: "ALSD", labName: "Alpha Dental Studio",    caseNo: "ALSDS700034", caseDate: "2026-01-05T09:22:00", acknowledgeDigitalCase: "Breached", scanFeedback: 0,      practiceMsgResponse: 0 },
  { id: 3,  labCode: "ALSD", labName: "Alpha Dental Studio",    caseNo: "ALSDS700406", caseDate: "2026-01-10T11:05:00", acknowledgeDigitalCase: 93.17,    scanFeedback: 45.2,     practiceMsgResponse: 0 },
  { id: 4,  labCode: "ALSD", labName: "Alpha Dental Studio",    caseNo: "ALSDS700408", caseDate: "2026-01-14T07:44:00", acknowledgeDigitalCase: 1.98,     scanFeedback: 0,        practiceMsgResponse: 0 },
  { id: 5,  labCode: "ALSD", labName: "Alpha Dental Studio",    caseNo: "ALSDS700410", caseDate: "2026-01-20T08:26:00", acknowledgeDigitalCase: "Breached", scanFeedback: "Breached", practiceMsgResponse: 0 },
  { id: 6,  labCode: "ALSD", labName: "Alpha Dental Studio",    caseNo: "ALSDS700412", caseDate: "2026-01-22T08:27:00", acknowledgeDigitalCase: 12.5,     scanFeedback: 0,        practiceMsgResponse: 3.1 },
  { id: 7,  labCode: "ALSD", labName: "Alpha Dental Studio",    caseNo: "ALSDS700414", caseDate: "2026-02-01T10:00:00", acknowledgeDigitalCase: "Breached", scanFeedback: 0,      practiceMsgResponse: 0 },

  // CTMP — Crown Temple Lab
  { id: 8,  labCode: "CTMP", labName: "Crown Temple Lab",       caseNo: "CTMPS700727", caseDate: "2026-01-06T14:27:00", acknowledgeDigitalCase: 7079.1,   scanFeedback: 0,        practiceMsgResponse: 0 },
  { id: 9,  labCode: "CTMP", labName: "Crown Temple Lab",       caseNo: "CTMPS700747", caseDate: "2026-01-12T10:50:00", acknowledgeDigitalCase: 17.3,     scanFeedback: 0,        practiceMsgResponse: 0 },
  { id: 10, labCode: "CTMP", labName: "Crown Temple Lab",       caseNo: "CTMPS700748", caseDate: "2026-01-18T11:14:00", acknowledgeDigitalCase: 40.33,    scanFeedback: 0,        practiceMsgResponse: 0 },
  { id: 11, labCode: "CTMP", labName: "Crown Temple Lab",       caseNo: "CTMPS700752", caseDate: "2026-01-25T09:30:00", acknowledgeDigitalCase: 5.8,      scanFeedback: 8.4,      practiceMsgResponse: 0 },
  { id: 12, labCode: "CTMP", labName: "Crown Temple Lab",       caseNo: "CTMPS700758", caseDate: "2026-02-03T13:15:00", acknowledgeDigitalCase: "Breached", scanFeedback: 0,      practiceMsgResponse: 0 },
  { id: 13, labCode: "CTMP", labName: "Crown Temple Lab",       caseNo: "CTMPS700760", caseDate: "2026-02-10T08:45:00", acknowledgeDigitalCase: 22.1,     scanFeedback: 0,        practiceMsgResponse: 0 },

  // DIL — Diamond Implants Lab
  { id: 14, labCode: "DIL",  labName: "Diamond Implants Lab",   caseNo: "DIL2500002",  caseDate: "2026-01-04T12:31:00", acknowledgeDigitalCase: "Breached", scanFeedback: 0,      practiceMsgResponse: 0 },
  { id: 15, labCode: "DIL",  labName: "Diamond Implants Lab",   caseNo: "DIL2500003",  caseDate: "2026-01-08T12:32:00", acknowledgeDigitalCase: 76.97,    scanFeedback: 0,        practiceMsgResponse: 0 },
  { id: 16, labCode: "DIL",  labName: "Diamond Implants Lab",   caseNo: "DIL2500019",  caseDate: "2026-01-14T10:41:00", acknowledgeDigitalCase: "Breached", scanFeedback: "Breached", practiceMsgResponse: "Breached" },
  { id: 17, labCode: "DIL",  labName: "Diamond Implants Lab",   caseNo: "DIL2500025",  caseDate: "2026-01-21T09:05:00", acknowledgeDigitalCase: 3.4,      scanFeedback: 0,        practiceMsgResponse: 0 },
  { id: 18, labCode: "DIL",  labName: "Diamond Implants Lab",   caseNo: "DIL2500031",  caseDate: "2026-02-05T11:20:00", acknowledgeDigitalCase: 55.8,     scanFeedback: 12.3,     practiceMsgResponse: 0 },
  { id: 19, labCode: "DIL",  labName: "Diamond Implants Lab",   caseNo: "DIL2500038",  caseDate: "2026-02-12T14:00:00", acknowledgeDigitalCase: 8.2,      scanFeedback: 0,        practiceMsgResponse: 0 },

  // NLAB — NorthStar Dental Lab
  { id: 20, labCode: "NLAB", labName: "NorthStar Dental Lab",   caseNo: "NLABS700101", caseDate: "2026-01-07T09:15:00", acknowledgeDigitalCase: 55.4,     scanFeedback: 12.1,     practiceMsgResponse: 0 },
  { id: 21, labCode: "NLAB", labName: "NorthStar Dental Lab",   caseNo: "NLABS700102", caseDate: "2026-01-11T11:20:00", acknowledgeDigitalCase: 2.5,      scanFeedback: 0,        practiceMsgResponse: 5.3 },
  { id: 22, labCode: "NLAB", labName: "NorthStar Dental Lab",   caseNo: "NLABS700103", caseDate: "2026-01-16T08:05:00", acknowledgeDigitalCase: "Breached", scanFeedback: "Breached", practiceMsgResponse: 0 },
  { id: 23, labCode: "NLAB", labName: "NorthStar Dental Lab",   caseNo: "NLABS700108", caseDate: "2026-01-23T10:45:00", acknowledgeDigitalCase: 18.7,     scanFeedback: 0,        practiceMsgResponse: 0 },
  { id: 24, labCode: "NLAB", labName: "NorthStar Dental Lab",   caseNo: "NLABS700115", caseDate: "2026-02-02T09:00:00", acknowledgeDigitalCase: 0.8,      scanFeedback: 0,        practiceMsgResponse: 0 },
  { id: 25, labCode: "NLAB", labName: "NorthStar Dental Lab",   caseNo: "NLABS700120", caseDate: "2026-02-08T13:30:00", acknowledgeDigitalCase: "Breached", scanFeedback: 0,      practiceMsgResponse: "Breached" },

  // WLAB — Westside Prosthetics Lab
  { id: 26, labCode: "WLAB", labName: "Westside Prosthetics",   caseNo: "WLABS700201", caseDate: "2026-01-05T13:45:00", acknowledgeDigitalCase: 8.9,      scanFeedback: 0,        practiceMsgResponse: 0 },
  { id: 27, labCode: "WLAB", labName: "Westside Prosthetics",   caseNo: "WLABS700202", caseDate: "2026-01-09T10:30:00", acknowledgeDigitalCase: 312.6,    scanFeedback: 0,        practiceMsgResponse: 22.7 },
  { id: 28, labCode: "WLAB", labName: "Westside Prosthetics",   caseNo: "WLABS700203", caseDate: "2026-01-15T09:00:00", acknowledgeDigitalCase: "Breached", scanFeedback: 0,      practiceMsgResponse: "Breached" },
  { id: 29, labCode: "WLAB", labName: "Westside Prosthetics",   caseNo: "WLABS700210", caseDate: "2026-01-20T14:10:00", acknowledgeDigitalCase: 6.1,      scanFeedback: 4.9,      practiceMsgResponse: 0 },
  { id: 30, labCode: "WLAB", labName: "Westside Prosthetics",   caseNo: "WLABS700215", caseDate: "2026-01-28T11:00:00", acknowledgeDigitalCase: 45.0,     scanFeedback: 0,        practiceMsgResponse: 0 },
  { id: 31, labCode: "WLAB", labName: "Westside Prosthetics",   caseNo: "WLABS700222", caseDate: "2026-02-06T08:20:00", acknowledgeDigitalCase: 1.2,      scanFeedback: 0,        practiceMsgResponse: 0 },

  // PLAB — Premier Dental Lab
  { id: 32, labCode: "PLAB", labName: "Premier Dental Lab",     caseNo: "PLABS700301", caseDate: "2026-01-06T14:00:00", acknowledgeDigitalCase: 0.5,      scanFeedback: 0,        practiceMsgResponse: 0 },
  { id: 33, labCode: "PLAB", labName: "Premier Dental Lab",     caseNo: "PLABS700302", caseDate: "2026-01-10T08:45:00", acknowledgeDigitalCase: 4450.0,   scanFeedback: 0,        practiceMsgResponse: 0 },
  { id: 34, labCode: "PLAB", labName: "Premier Dental Lab",     caseNo: "PLABS700310", caseDate: "2026-01-17T10:30:00", acknowledgeDigitalCase: 12.3,     scanFeedback: 0,        practiceMsgResponse: 6.8 },
  { id: 35, labCode: "PLAB", labName: "Premier Dental Lab",     caseNo: "PLABS700318", caseDate: "2026-01-24T09:15:00", acknowledgeDigitalCase: "Breached", scanFeedback: 35.6,   practiceMsgResponse: 0 },
  { id: 36, labCode: "PLAB", labName: "Premier Dental Lab",     caseNo: "PLABS700325", caseDate: "2026-02-04T11:00:00", acknowledgeDigitalCase: 3.7,      scanFeedback: 0,        practiceMsgResponse: 0 },
  { id: 37, labCode: "PLAB", labName: "Premier Dental Lab",     caseNo: "PLABS700330", caseDate: "2026-02-11T13:45:00", acknowledgeDigitalCase: 28.9,     scanFeedback: 0,        practiceMsgResponse: 0 },

  // SLAB — Smile Craft Lab
  { id: 38, labCode: "SLAB", labName: "Smile Craft Lab",        caseNo: "SLABS800101", caseDate: "2026-01-08T09:00:00", acknowledgeDigitalCase: 14.2,     scanFeedback: 0,        practiceMsgResponse: 0 },
  { id: 39, labCode: "SLAB", labName: "Smile Craft Lab",        caseNo: "SLABS800105", caseDate: "2026-01-13T10:15:00", acknowledgeDigitalCase: 0.9,      scanFeedback: 0,        practiceMsgResponse: 2.1 },
  { id: 40, labCode: "SLAB", labName: "Smile Craft Lab",        caseNo: "SLABS800112", caseDate: "2026-01-19T08:30:00", acknowledgeDigitalCase: "Breached", scanFeedback: 0,      practiceMsgResponse: 0 },
  { id: 41, labCode: "SLAB", labName: "Smile Craft Lab",        caseNo: "SLABS800118", caseDate: "2026-01-26T14:00:00", acknowledgeDigitalCase: 67.4,     scanFeedback: 22.8,     practiceMsgResponse: 0 },
  { id: 42, labCode: "SLAB", labName: "Smile Craft Lab",        caseNo: "SLABS800124", caseDate: "2026-02-03T09:45:00", acknowledgeDigitalCase: 4.5,      scanFeedback: 0,        practiceMsgResponse: 0 },
  { id: 43, labCode: "SLAB", labName: "Smile Craft Lab",        caseNo: "SLABS800130", caseDate: "2026-02-09T11:30:00", acknowledgeDigitalCase: 120.3,    scanFeedback: "Breached", practiceMsgResponse: 0 },

  // ELAB — Elite Oral Lab
  { id: 44, labCode: "ELAB", labName: "Elite Oral Lab",         caseNo: "ELABS900201", caseDate: "2026-01-07T10:00:00", acknowledgeDigitalCase: 2.1,      scanFeedback: 0,        practiceMsgResponse: 0 },
  { id: 45, labCode: "ELAB", labName: "Elite Oral Lab",         caseNo: "ELABS900205", caseDate: "2026-01-14T11:30:00", acknowledgeDigitalCase: 38.6,     scanFeedback: 0,        practiceMsgResponse: 0 },
  { id: 46, labCode: "ELAB", labName: "Elite Oral Lab",         caseNo: "ELABS900210", caseDate: "2026-01-20T08:15:00", acknowledgeDigitalCase: 0.4,      scanFeedback: 0,        practiceMsgResponse: 1.8 },
  { id: 47, labCode: "ELAB", labName: "Elite Oral Lab",         caseNo: "ELABS900215", caseDate: "2026-01-27T13:00:00", acknowledgeDigitalCase: "Breached", scanFeedback: "Breached", practiceMsgResponse: 0 },
  { id: 48, labCode: "ELAB", labName: "Elite Oral Lab",         caseNo: "ELABS900220", caseDate: "2026-02-05T09:30:00", acknowledgeDigitalCase: 15.7,     scanFeedback: 0,        practiceMsgResponse: 0 },
  { id: 49, labCode: "ELAB", labName: "Elite Oral Lab",         caseNo: "ELABS900225", caseDate: "2026-02-11T10:45:00", acknowledgeDigitalCase: 5.3,      scanFeedback: 0,        practiceMsgResponse: 4.2 },
  { id: 50, labCode: "ELAB", labName: "Elite Oral Lab",         caseNo: "ELABS900230", caseDate: "2026-02-14T14:20:00", acknowledgeDigitalCase: 89.1,     scanFeedback: 0,        practiceMsgResponse: 0 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isBreachedRow(r: SLARecord) {
  return (
    r.acknowledgeDigitalCase === "Breached" ||
    r.scanFeedback === "Breached" ||
    r.practiceMsgResponse === "Breached"
  );
}

// ─── SLA Badge ────────────────────────────────────────────────────────────────

function SLABadge({ value }: { value: number | "Breached" }) {
  if (value === "Breached") {
    return (
      <span style={{
        display: "inline-block", padding: "3px 12px", borderRadius: 20,
        background: "#fff3e0", color: "#e65100", border: "1px solid #ffcc80",
        fontWeight: 600, fontSize: "0.78rem", whiteSpace: "nowrap",
      }}>Breached</span>
    );
  }
  if (value === 0) {
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 28, height: 28, borderRadius: "50%",
        background: "#e3f2fd", color: "#1565c0", border: "1.5px solid #90caf9",
        fontWeight: 700, fontSize: "0.8rem",
      }}>0</span>
    );
  }
  const isHigh = value > 90;
  return (
    <span style={{
      display: "inline-block", padding: "3px 12px", borderRadius: 20,
      background: isHigh ? "#fff3e0" : "#e3f2fd",
      color: isHigh ? "#e65100" : "#1565c0",
      border: `1px solid ${isHigh ? "#ffcc80" : "#90caf9"}`,
      fontWeight: 600, fontSize: "0.78rem", whiteSpace: "nowrap",
    }}>{value}</span>
  );
}

// ─── Summary Card ─────────────────────────────────────────────────────────────

function SummaryCard({ label, value, sub, accent, icon }: {
  label: string; value: string | number; sub?: string; accent: string; icon: string;
}) {
  return (
    <div style={{
      background: "#fff", borderRadius: 12, padding: "18px 22px",
      boxShadow: "0 1px 8px rgba(0,0,0,0.08)", borderLeft: `4px solid ${accent}`,
      flex: "1 1 180px", minWidth: 160,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{
            fontSize: "0.72rem", color: "#888", fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6,
          }}>{label}</div>
          <div style={{ fontSize: "1.9rem", fontWeight: 700, color: "#1a1a2e", lineHeight: 1.1 }}>{value}</div>
          {sub && <div style={{ fontSize: "0.73rem", color: "#aaa", marginTop: 5 }}>{sub}</div>}
        </div>
        <div style={{
          width: 42, height: 42, borderRadius: 10,
          background: `${accent}18`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.4rem",
        }}>{icon}</div>
      </div>
    </div>
  );
}

// ─── Breach Chart ─────────────────────────────────────────────────────────────

function SLABreachChart({ data }: { data: SLARecord[] }) {
  const chartData = useMemo(() => {
    const labMap: Record<string, { lab: string; onTime: number; breached: number }> = {};
    data.forEach((r) => {
      if (!labMap[r.labCode]) labMap[r.labCode] = { lab: r.labCode, onTime: 0, breached: 0 };
      if (isBreachedRow(r)) labMap[r.labCode].breached++;
      else                  labMap[r.labCode].onTime++;
    });
    return Object.values(labMap);
  }, [data]);

  return (
    <div style={{
      background: "#fff", borderRadius: 12, padding: "20px 24px",
      boxShadow: "0 1px 8px rgba(0,0,0,0.08)", marginBottom: 24,
    }}>
      <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#333", marginBottom: 16 }}>
        SLA Compliance by Lab — On Time vs Breached
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} barCategoryGap="40%" barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="lab" tick={{ fontSize: 12, fill: "#666" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: "#666" }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{ borderRadius: 8, fontSize: 13, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.12)" }}
            cursor={{ fill: "#f9f9f9" }}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          <Bar dataKey="onTime"   name="On Time"  fill="#4ade80" radius={[5, 5, 0, 0]} />
          <Bar dataKey="breached" name="Breached" fill="#fb923c" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Columns ──────────────────────────────────────────────────────────────────

const columns: KiduColumn[] = [
  { key: "labCode",  label: "Lab Code",  enableSorting: true, enableFiltering: true, minWidth: 90 },
  { key: "labName",  label: "Lab Name",  enableSorting: true, enableFiltering: true, minWidth: 180 },
  { key: "caseNo",   label: "Case No",   enableSorting: true, enableFiltering: true, minWidth: 150 },
  { key: "caseDate", label: "Case Date", enableSorting: true, type: "date",          minWidth: 140 },
  {
    key: "acknowledgeDigitalCase", label: "Acknowledge Digital Case (90 min)",
    enableSorting: true, minWidth: 220,
    render: (v) => <SLABadge value={v} />,
  },
  {
    key: "scanFeedback", label: "Scan Feedback (90 min)",
    enableSorting: true, minWidth: 180,
    render: (v) => <SLABadge value={v} />,
  },
  {
    key: "practiceMsgResponse", label: "Practice Message Response (90 min)",
    enableSorting: true, minWidth: 240,
    render: (v) => <SLABadge value={v} />,
  },
  {
    key: "_status", label: "Status",
    enableSorting: false, minWidth: 110,
    render: (_v, row: SLARecord) => {
      const breached = isBreachedRow(row);
      return (
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "4px 10px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 600,
          background: breached ? "#fef2f2" : "#f0fdf4",
          color: breached ? "#dc2626" : "#16a34a",
          border: `1px solid ${breached ? "#fecaca" : "#bbf7d0"}`,
        }}>
          <span style={{ fontSize: 8 }}>●</span>
          {breached ? "Breached" : "On Time"}
        </span>
      );
    },
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

const CaseFlowSLA: React.FC = () => {

  const stats = useMemo(() => {
    const total      = dummyData.length;
    const breached   = dummyData.filter(isBreachedRow).length;
    const onTime     = total - breached;
    const compliance = Math.round((onTime / total) * 100);
    const numericVals = dummyData
      .map(r => r.acknowledgeDigitalCase)
      .filter((v): v is number => typeof v === "number" && v > 0);
    const avgResponse = numericVals.length
      ? Math.round(numericVals.reduce((a, b) => a + b, 0) / numericVals.length)
      : 0;
    const labs = new Set(dummyData.map(r => r.labCode)).size;
    return { total, breached, compliance, avgResponse, labs };
  }, []);

  return (
    <div style={{ padding: "24px" }}>

      {/* ── Summary Cards ── */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
        <SummaryCard label="Total Cases"     value={stats.total}               sub={`Across ${stats.labs} labs`}     accent="#3b82f6" icon="📋" />
        <SummaryCard label="Breached"        value={stats.breached}            sub="SLA violations"                  accent="#f97316" icon="⚠️" />
        <SummaryCard label="Compliance Rate" value={`${stats.compliance}%`}    sub="On-time delivery"                accent="#22c55e" icon="✅" />
        <SummaryCard label="Avg Response"    value={`${stats.avgResponse} min`} sub="Acknowledge Digital"            accent="#8b5cf6" icon="⏱️" />
        <SummaryCard label="Labs Monitored"  value={stats.labs}                sub="Active this period"              accent="#ec4899" icon="🏥" />
      </div>

      {/* ── Chart ── */}
      <SLABreachChart data={dummyData} />

      {/* ── Table ── */}
      <KiduServerTableList<SLARecord>
        title="SLA Report"
        subtitle="Case Flow SLA tracking across all labs"
        columns={columns}
        fetchService={async () => dummyData}
        rowKey="id"
        showSearch={true}
        showFilters={true}
        showExport={true}
        showColumnToggle={true}
        showDensityToggle={true}
        showAddButton={false}
        showActions={false}
        defaultRowsPerPage={10}
        stickyHeader={true}
        highlightOnHover={true}
      />
    </div>
  );
};

export default CaseFlowSLA;