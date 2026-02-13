import React from "react";
import { Button } from "react-bootstrap";
import { FaFileExcel } from "react-icons/fa";
import { CSVLink } from "react-csv";

interface KiduDownloadProps {
  data: any[];
  filename: string;
  className?: string;
  style?: React.CSSProperties;
}

const KiduDownload: React.FC<KiduDownloadProps> = ({
  data,
  filename,
  className,
  style,
}) => {
  return (
    <CSVLink data={data} filename={filename} style={{ textDecoration: "none" }}>
      <Button
        className={`d-flex align-items-center justify-content-center p-0 ${className || ""}`}
        style={{
          background: "linear-gradient(90deg, #107C41 0%, #0F6C38 100%)", // Excel green
          color: "#fff",
          border: "1px solid #0F6C38",
          borderRadius: "6px",
          width: "36px",
          height: "36px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 2px 5px rgba(0, 128, 0, 0.25)",
          transition: "all 0.2s ease-in-out",
          ...style,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0 3px 8px rgba(0, 128, 0, 0.35)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 2px 5px rgba(0, 128, 0, 0.25)";
        }}
        title="Download as Excel"
      >
        <FaFileExcel size={16} />
      </Button>
    </CSVLink>
  );
};

export default KiduDownload;