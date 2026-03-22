// src/PRACTICE_CONNECT/Pages/Home/PracticeIndexPage.tsx

import React from "react";
import CaseDashboard from "../../KIDU_COMPONENTS/KiduCaseDashboard";
import AuthService from "../../Services/AuthServices/Auth.services";
import { useDashboardCases } from "../../DOCTOR_CONNECT/Types/Common/UseDashBoard.types";

const PracticeIndexPage: React.FC = () => {
  const user = AuthService.getUser();

  const dSODentalOfficeId =
    user?.dentalOfficeId ??
    null;

  const { data, loading, error, refresh } = useDashboardCases({
    role:             "practice",
    dSODentalOfficeId, // CHANGED: now valid — filters to this practice's cases only
    dSOMasterId:      user?.dsoMasterId ?? null,
  });

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#ef4444", fontFamily: "Outfit, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <span>{error}</span>
        <button onClick={refresh} style={{ padding: "8px 20px", borderRadius: 8, border: "1.5px solid #ef4444", background: "transparent", color: "#ef4444", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <CaseDashboard
      role="practice"
      data={data}
      loading={loading}
      hideDsoName={true}      // practice doesn't need to see DSO name
      hideLabName={false}     // practice does want to see which lab
    />
  );
};

export default PracticeIndexPage;