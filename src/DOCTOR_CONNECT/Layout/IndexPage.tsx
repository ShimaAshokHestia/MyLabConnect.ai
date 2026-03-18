// src/DOCTOR_CONNECT/Pages/DoctorIndexPage.tsx
//
// Doctor dashboard — shows only cases created by the logged-in doctor.
// Scoped via dSODoctorId (read from JWT, no extra API call).

import React, { useState } from "react";
import CaseDashboard from "../../KIDU_COMPONENTS/KiduCaseDashboard";
import AuthService from "../../Services/AuthServices/Auth.services";
import { useDashboardCases } from "../Types/Common/UseDashBoard.types";
import ProfileModal from "../Components/ProfileModal";

const DoctorIndexPage: React.FC = () => {
  const user = AuthService.getUser();
 const [showProfile, setShowProfile] = useState(false);
  const { data, loading, error, refresh } = useDashboardCases({
    role:        "doctor",
    dSODoctorId: user?.dsoDoctorId ?? null,
    // also pass dSOMasterId so the API can use the most selective index
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

  return (
  <>
  <CaseDashboard role="doctor" data={data} loading={loading}  onProfileClick={() => setShowProfile(true)}/>

   <ProfileModal
        show={showProfile}
        onClose={() => setShowProfile(false)}
      />
  
  </>
  )
};

export default DoctorIndexPage;