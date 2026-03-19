import React from "react";
import KiduTabbedFormViewModal, {
  type ViewHeaderField,
  type ViewTabConfig,
} from "../../../../KIDU_COMPONENTS/KiduTabbedFormViewModal";
import DSODoctorService from "../../../Services/Masters/DsoDoctor.services";

// ── Header fields ─────────────────────────────────────────────────────────────
const headerFields: ViewHeaderField[] = [
  { name: "doctorCode", label: "Doctor Code", colWidth: 3 },
  { name: "firstName", label: "First Name", colWidth: 4 },
  { name: "lastName", label: "Last Name", colWidth: 4 },
  { name: "email", label: "Email", colWidth: 4 },
  { name: "phoneNumber", label: "Phone Number", colWidth: 4 },
  { name: "licenseNo", label: "License No", colWidth: 3 },
  { name: "info", label: "Specialty / Info", colWidth: 4 },
  { name: "address", label: "Address", colWidth: 6 },
];

// ── Tab definitions ───────────────────────────────────────────────────────────
const tabs: ViewTabConfig[] = [
  {
    key: "practices",           // must match the key returned by mapTabData
    label: "Practices",
    columns: [
      { key: "practiceName", label: "Practice" },
    ],
  },
  {
    key: "lab",                 // lowercase — must match the key returned by mapTabData
    label: "Lab",
    columns: [
      { key: "labName", label: "Lab" },
      { key: "labDescription", label: "Description" },
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
      headerFields={headerFields}
      tabs={tabs}
      recordId={recordId}
      onFetch={(id) => DSODoctorService.getById(Number(id))}
      showBadge={true}
      badgeText="Read Only"
      themeColor="#ef0d50"
      mapTabData={(data) => {
        // ── Practices ─────────────────────────────────────────────────────
        const practices = Array.isArray(data.dsoDentalDoctors)
          ? data.dsoDentalDoctors
            .filter((p: any) => !p.isDeleted)
            .map((p: any) => ({
              practiceName:
                p.dentalOfficeName ??
                p.officeName ??
                p.dsoDentalOfficeName ??
                `Practice #${p.dsoDentalOfficeId ?? p.dSODentalOfficeId}`,
            }))
          : [];

        // ── Labs ──────────────────────────────────────────────────────────
        const lab = Array.isArray(data.labMappings)
          ? data.labMappings
            .filter((l: any) => !l.isDeleted)
            .map((l: any) => ({
              labName: l.labName ?? `Lab #${l.labMasterId}`,
              labDescription: l.labDescription ?? "",
            }))
          : [];

        return { practices, lab };
      }}
    />
  );
};

export default DSODoctorViewModal;
