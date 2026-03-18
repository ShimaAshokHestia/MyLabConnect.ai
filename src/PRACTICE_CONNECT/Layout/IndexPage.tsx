// src/PRACTICE_CONNECT/Pages/Home/PracticeIndexPage.tsx
//
// Practice dashboard — shows ONLY cases belonging to the logged-in practice
// (dental office). Scoped via dSODentalOfficeId read from JWT.

import React from "react";
import CaseDashboard from "../../KIDU_COMPONENTS/KiduCaseDashboard";
import AuthService from "../../Services/AuthServices/Auth.services";
import { useDashboardCases } from "../../DOCTOR_CONNECT/Types/Common/UseDashBoard.types";

const PracticeIndexPage: React.FC = () => {
  const user = AuthService.getUser();

  // dSODentalOfficeId identifies which practice/dental office this user manages.
  // Try all casing variants the JWT might use.
  const dSODentalOfficeId =
    user?.dSODentalOfficeId ??
    user?.dsoDentalOfficeId ??
    user?.dentalOfficeId    ??
    null;

  const { data, loading, error, refresh } = useDashboardCases({
    role:             "practice",
    dSODentalOfficeId: dSODentalOfficeId,   // ← only this practice's cases
    // also pass dSOMasterId for API-level index optimization
    dSOMasterId:      user?.dsoMasterId ?? null,
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

  return <CaseDashboard role="practice" data={data} loading={loading} />;
};

export default PracticeIndexPage;