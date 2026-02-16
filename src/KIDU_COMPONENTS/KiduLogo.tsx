// src/components/MYDLogo.tsx

import React from "react";
import "../Styles/KiduStyles/Logo.css";

interface KiduLogoLogoProps {
  collapsed?: boolean;
  className?: string;
}

const KiduLogo: React.FC<KiduLogoLogoProps> = ({
  collapsed = false,
  className = "",
}) => {
  return (
    <div className={`myd-logo d-flex align-items-center ${className}`}>
      
      {/* ================= ICON ================= */}
      <div className="logo-icon position-relative flex-shrink-0">
        <svg
          viewBox="0 0 40 40"
          className="tooth-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Tooth Shape */}
          <path
            d="M20 4C14 4 10 8 10 14C10 18 8 24 9 30C10 34 12 36 14 36C16 36 17 34 17 30C17 26 18 24 20 24C22 24 23 26 23 30C23 34 24 36 26 36C28 36 30 34 31 30C32 24 30 18 30 14C30 8 26 4 20 4Z"
            fill="var(--theme-primary)"
          />

          {/* Shine */}
          <path
            d="M15 10C15 10 16 8 20 8C22 8 23 9 24 10"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>

        {/* Glow Effect */}
        <div className="logo-glow" />
      </div>

      {/* ================= TEXT ================= */}
      <div
        className={`logo-text ${
          collapsed ? "collapsed" : "expanded"
        }`}
      >
        <span className="logo-main">
          <span className="text-muted-brace">{"{"}</span>
          my
          <span className="text-muted-brace">{"}"}</span>
          labconnect
          <span className="text-primary-dot">.ai</span>
        </span>

        <span className="logo-subtitle">
          dental care platform
        </span>
      </div>
    </div>
  );
};

export default KiduLogo;
