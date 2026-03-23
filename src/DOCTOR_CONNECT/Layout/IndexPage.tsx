// src/DOCTOR_CONNECT/Pages/DoctorIndexPage.tsx
//
// Doctor dashboard — shows only cases created by the logged-in doctor.
// Scoped via dSODoctorId (read from JWT, no extra API call).

import React from "react";
import CaseDashboard from "../../KIDU_COMPONENTS/KiduCaseDashboard";
import AuthService from "../../Services/AuthServices/Auth.services";
import { useDashboardCases } from "../Types/Common/UseDashBoard.types";

const DoctorIndexPage: React.FC = () => {
  const user = AuthService.getUser();

  // Resolve doctor ID — unchanged
  const dSODoctorId = user?.doctorId ?? user?.dsoDoctorId ?? user?.doctorID ?? null;
  const dSOMasterId = user?.dsoMasterId ?? null;

  const { data, loading, error, refresh } = useDashboardCases({
    role: "doctor",
    dSODoctorId,
    dSOMasterId,
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

  return (
    <>
      <CaseDashboard role="doctor" data={data} loading={loading} hideDoctorName={true} hideDsoName={true}
        dSODoctorId={dSODoctorId}
        dSOMasterId={dSOMasterId} />

    </>
  )
};

export default DoctorIndexPage;