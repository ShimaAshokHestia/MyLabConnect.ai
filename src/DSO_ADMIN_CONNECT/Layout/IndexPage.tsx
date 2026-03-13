// src/DSO_ADMIN_CONNECT/Pages/DsoIndexPage.tsx
//
// DSO dashboard — shows all cases under the logged-in DSO's master ID.
// Scoped via dSOMasterId (read from JWT, no extra API call).

import React from "react";
import CaseDashboard from "../../KIDU_COMPONENTS/KiduCaseDashboard";
import AuthService from "../../Services/AuthServices/Auth.services";
import { useDashboardCases } from "../../DOCTOR_CONNECT/Types/Common/UseDashBoard.types";

const DsoIndexPage: React.FC = () => {
  const user = AuthService.getUser();

  const { data, loading, error, refresh } = useDashboardCases({
    role:        "dso",
    // DSO sees ALL cases under their master ID — no doctor filter
    dSOMasterId: user?.dsoMasterId ?? null,
  });

  if (error) {
    return (
      <div
        style={{
          padding: 40,
          textAlign: "center",
          color: "#ef4444",
          fontFamily: "Outfit, sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span>{error}</span>
        <button
          onClick={refresh}
          style={{
            padding: "8px 20px",
            borderRadius: 8,
            border: "1.5px solid #ef4444",
            background: "transparent",
            color: "#ef4444",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "0.85rem",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return <CaseDashboard role="dso" data={data} loading={loading} />;
};

export default DsoIndexPage;