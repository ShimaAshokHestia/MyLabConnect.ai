import React from "react";
import KiduTabbedFormViewModal, {
  type ViewHeaderField,
  type ViewTabConfig,
} from "../../../../KIDU_COMPONENTS/KiduTabbedFormViewModal";
import DSODoctorService from "../../../Services/Masters/DsoDoctor.services";

// ── Header fields (top read-only section) ─────────────────────────────────────
const headerFields: ViewHeaderField[] = [
  { name: "fullName", label: "Full Name", colWidth: 6 },
  { name: "doctorCode", label: "Doctor Code", colWidth: 6 },
  { name: "licenseNo", label: "License No", colWidth: 6 },
  { name: "firstName", label: "First Name", colWidth: 6 },
  { name: "lastName", label: "Last Name", colWidth: 6 },
  { name: "email", label: "Email", colWidth: 6 },
  { name: "phoneNumber", label: "Phone Number", colWidth: 6 },
  { name: "dsoName", label: "DSO Master", colWidth: 6 },
  { name: "address", label: "Address", colWidth: 6, isTextarea: true },
  { name: "info", label: "Specialty/Info", colWidth: 6, isTextarea: true },
  { name: "isActive", label: "Status", colWidth: 6, isToggle: true },
];

// ── Tab definitions ───────────────────────────────────────────────────────────
const tabs: ViewTabConfig[] = [
  {
    key: "practices",
    label: "Practices",
    columns: [
      { key: "practiceId", label: "Practice ID" },
      { key: "practiceName", label: "Practice Name" },
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
      // mapTabData lets you reshape the API response into tab rows.
      // Adjust the property names to match what your API actually returns.
      mapTabData={(data) => ({
        practices: Array.isArray(data.practices) && data.practices.length > 0
          ? data.practices.map((p: any) => ({
            practiceId: p.practiceId ?? p.id ?? "",
            practiceName: p.practiceName ?? p.name ?? "",
          }))
          : [],
      })}
    />
  );
};

export default DSODoctorViewModal;
