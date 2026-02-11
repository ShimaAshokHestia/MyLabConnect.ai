import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp, PieChart as PieIcon, BarChart3 } from "lucide-react";
import KiduLoader from "../../Components/KiduLoader";

/* -------------------- Types -------------------- */
interface MonthlyData {
  month: string;
  contributions: number;
  claims: number;
}

interface ClaimDistribution {
  name: string;
  value: number;
  color: string;
  [key: string]: any;
}

interface StateWiseData {
  state: string;
  members: number;
  fill: string;
}

/* -------------------- Colors -------------------- */
const NAVY = "#0f2a55";
const GREEN = "#22c55e";
const RED = "#ef4444";
const ORANGE = "#f97316";
const BLUE = "#3b82f6";

/* -------------------- Data (UNCHANGED) -------------------- */
const dummyMonthlyData: MonthlyData[] = [
  { month: "Jan", contributions: 45000, claims: 12000 },
  { month: "Feb", contributions: 52000, claims: 15000 },
  { month: "Mar", contributions: 58000, claims: 18000 },
  { month: "Apr", contributions: 55000, claims: 14000 },
  { month: "May", contributions: 62000, claims: 16000 },
  { month: "Jun", contributions: 68000, claims: 19000 },
  { month: "Jul", contributions: 72000, claims: 22000 },
  { month: "Aug", contributions: 69000, claims: 20000 },
  { month: "Sep", contributions: 63000, claims: 17000 },
  { month: "Oct", contributions: 66000, claims: 18000 },
  { month: "Nov", contributions: 75000, claims: 21000 },
  { month: "Dec", contributions: 82000, claims: 25000 },
];

const dummyClaimDistribution: ClaimDistribution[] = [
  { name: "Death Claims", value: 45, color: NAVY },
  { name: "Medical Claims", value: 25, color: "#0d9488" },
  { name: "Others", value: 20, color: ORANGE },
  { name: "Refund Claims", value: 10, color: BLUE },
];

const dummyStateWiseData: StateWiseData[] = [
  { state: "Karnataka", members: 1500, fill: GREEN },
  { state: "Maharashtra", members: 1200, fill: GREEN },
  { state: "Tamil Nadu", members: 1000, fill: ORANGE },
  { state: "Kerala", members: 800, fill: GREEN },
  { state: "Andhra Pradesh", members: 600, fill: NAVY },
];

/* -------------------- Helpers -------------------- */
const yAxisFormatter = (v: number) => `₹${(v / 1000).toFixed(0)}k`;

const CardWrapper = ({ title, icon, children }: any) => (
  <div className="bg-white rounded-3 shadow-sm p-3 h-100">
    <div className="d-flex align-items-center gap-2 mb-3">
      {icon}
      <h6 className="mb-0 fw-semibold" style={{ color: NAVY }}>
        {title}
      </h6>
    </div>
    {children}
  </div>
);

/* -------------------- Component -------------------- */
const Charts: React.FC = () => {
  const [loading] = useState(false);

  if (loading) {
    return <KiduLoader />;
  }

  return (
    <div className="mt-3">
      {/* ---------- ROW 1 ---------- */}
      <Row className="g-4">
        {/* Monthly Contributions vs Claims */}
        <Col xs={12} lg={4}>
          <CardWrapper
            title="Monthly Contributions vs Claims"
            icon={<TrendingUp size={16} color="#f59e0b" />}
          >
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={dummyMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="contributions"
                  stroke={GREEN}
                  fill={GREEN}
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="claims"
                  stroke={RED}
                  fill={RED}
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardWrapper>
        </Col>

        {/* Claim Type Distribution */}
        <Col xs={12} lg={4}>
          <CardWrapper
            title="Claim Type Distribution"
            icon={<PieIcon size={16} color="#f59e0b" />}
          >
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={dummyClaimDistribution}
                  innerRadius={45}
                  outerRadius={70}
                  dataKey="value"
                >
                  {dummyClaimDistribution.map((item, i) => (
                    <Cell key={i} fill={item.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="d-flex flex-wrap justify-content-center gap-3 mt-2 text-xs">
              {dummyClaimDistribution.map((item, i) => (
                <div key={i} className="d-flex align-items-center gap-1">
                  <span
                    className="rounded-circle"
                    style={{
                      width: 8,
                      height: 8,
                      backgroundColor: item.color,
                    }}
                  />
                  <small className="text-muted">{item.name}</small>
                </div>
              ))}
            </div>
          </CardWrapper>
        </Col>

        {/* State-wise Membership */}
        <Col xs={12} lg={4}>
          <CardWrapper
            title="State-wise Membership"
            icon={<BarChart3 size={16} color="#f59e0b" />}
          >
            <div className="d-flex flex-column gap-3">
              {dummyStateWiseData.map((s, i) => (
                <div key={i}>
                  <div className="d-flex justify-content-between small mb-1">
                    <span className="text-muted">{s.state}</span>
                    <span className="fw-medium">
                      {s.members.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-light rounded-pill" style={{ height: 6 }}>
                    <div
                      className="rounded-pill"
                      style={{
                        width: `${(s.members / 1500) * 100}%`,
                        height: 6,
                        backgroundColor: s.fill,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardWrapper>
        </Col>
      </Row>

      {/* ---------- ROW 2 ---------- */}
      <Row className="g-4 mt-1">
        {/* Monthly Financial Comparison */}
        <Col xs={12} lg={6}>
          <CardWrapper
            title="Monthly Financial Comparison"
            icon={<BarChart3 size={16} color="#f59e0b" />}
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={dummyMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={yAxisFormatter} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="contributions" fill={GREEN} radius={[4, 4, 0, 0]} />
                <Bar dataKey="claims" fill={RED} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardWrapper>
        </Col>

        {/* Contribution Trends */}
        <Col xs={12} lg={6}>
          <CardWrapper
            title="Contribution Trends"
            icon={<TrendingUp size={16} color="#f59e0b" />}
          >
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={dummyMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={yAxisFormatter} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="contributions"
                  stroke={NAVY}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5, fill: "#f59e0b" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardWrapper>
        </Col>
      </Row>
    </div>
  );
};

export default Charts;
