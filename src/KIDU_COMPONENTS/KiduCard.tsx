import React from "react";
import { Card } from "react-bootstrap";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

interface KiduCardProps {
  title: string;
  value: number;
  change: number;
  color: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

const KiduCard: React.FC<KiduCardProps> = ({
  title,
  value,
  change,
  color,
  onClick,
  icon,
}) => {
  return (
    <Card
      onClick={onClick}
      className="shadow-sm w-100 me-3 overview-card"
      style={{
        backgroundColor: color,
        color: "white",
        height: "110px",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      <Card.Body className="p-3 d-flex flex-column justify-content-between">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <p
            className="mb-0 fw-bold text-start head-font"
            style={{ fontSize: "0.9rem" }}
          >
            {title}
          </p>
          {icon && (
            <div
              style={{
                fontSize: "1.5rem",
                opacity: 0.9,
              }}
            >
              {icon}
            </div>
          )}
        </div>

        <div className="d-flex justify-content-between align-items-end">
          <p className="mb-0 fw-bold sub-font" style={{ fontSize: "1.5rem" }}>
            {value.toLocaleString()}
          </p>

          <div
            className="d-flex align-items-center gap-1"
            style={{
              fontSize: "0.8rem",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              padding: "4px 8px",
              borderRadius: "12px",
            }}
          >
            {change > 0 ? (
              <FaArrowTrendUp size={12} />
            ) : (
              <FaArrowTrendDown size={12} />
            )}
            <span className="fw-semibold">
              {change > 0 ? `+${change}` : change}%
            </span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default KiduCard;