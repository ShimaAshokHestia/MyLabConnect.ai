import React from "react";
import KiduTabbedFormViewModal, {
  type ViewHeaderField,
  type ViewTabConfig,
} from "../../../../KIDU_COMPONENTS/KiduTabbedFormViewModal";
import DSODoctorService from "../../../Services/Masters/DsoDoctor.services";

// ── Header fields ─────────────────────────────────────────────────────────────
// Matching the create/edit page field structure
const headerFields: ViewHeaderField[] = [
  { name: "doctorCode", label: "Doctor Code", colWidth: 3 },
  { name: "firstName", label: "First Name", colWidth: 4 },
  { name: "lastName", label: "Last Name", colWidth: 4 },
  { name: "email", label: "Email", colWidth: 4 },
  { name: "phoneNumber", label: "Phone Number", colWidth: 4 },
  { name: "licenseNo", label: "License No", colWidth: 3 },
  { name: "info", label: "Specialty / Info", colWidth: 4 },
  { name: "address", label: "Address", colWidth: 6 },
  // isActive is handled in the header toggle, so we don't need it here
];

// ── Tab definitions ───────────────────────────────────────────────────────────
const tabs: ViewTabConfig[] = [
  {
    key: "practices",
    label: "Practices",
    columns: [
      { key: "practiceId", label: "Practice ID" },
      { key: "practiceName", label: "Practice Name", displayKey: "practiceDisplay" },
      { key: "isPrimary", label: "Primary", formatter: (value) => value ? "Yes" : "No" },
      { key: "isActive", label: "Status", formatter: (value) => value ? "Active" : "Inactive" },
    ],
  },
];

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  show: boolean;
  onHide: () => void;
  recordId: string | number;
}

// ── Component ─────────────────────────────────────────────────────────────────
const DSODoctorViewModal: React.FC<Props> = ({ show, onHide, recordId }) => {
  return (
    <KiduTabbedFormViewModal
      show={show}
      onHide={onHide}
      title="View Doctor"
      subtitle="DSO Doctor details"
      headerFields={headerFields}
      tabs={tabs}
      recordId={recordId}
      onFetch={(id) => DSODoctorService.getById(Number(id))}
      showBadge={true}
      badgeText="Read Only"
      themeColor="#ef0d50"
      mapTabData={(data) => {
        console.log("Mapping data for view:", data); // Debug log
        
        // Map practices from dsoDentalDoctors array
        const practices = Array.isArray(data.dsoDentalDoctors) && data.dsoDentalDoctors.length > 0
          ? data.dsoDentalDoctors.map((p: any) => ({
              practiceId: p.dSODentalOfficeId ?? "",
              practiceDisplay: p.dentalOfficeName || p.officeName || `Practice #${p.dSODentalOfficeId}`,
              practiceName: p.dentalOfficeName || p.officeName || "",
              isPrimary: p.isPrimary ?? false,
              isActive: p.isActive ?? true,
            }))
          : [];

        return {
          practices: practices,
        };
      }}
      // Add a custom formatter or ensure isActive is passed correctly
      // The view modal already handles isActive through the header toggle
    />
  );
};

export default DSODoctorViewModal;