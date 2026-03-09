import React from "react";
import KiduTabbedFormViewModal, {
  type ViewHeaderField,
  type ViewTabConfig,
} from "../../../../KIDU_COMPONENTS/KiduTabbedFormViewModal";
import DSODoctorService from "../../../Services/Masters/DsoDoctor.services";

// ── Header fields ─────────────────────────────────────────────────────────────
// colWidth maps to flex basis: 3=25%, 4=33.33%, 6=50%(default), 12=100%
const headerFields: ViewHeaderField[] = [
  { name: "doctorCode",   label: "Doctor Code",     colWidth: 4  },
  { name: "licenseNo",    label: "License No",      colWidth: 4  },
  { name: "firstName",    label: "First Name",      colWidth: 4  },
  { name: "lastName",     label: "Last Name",       colWidth: 4  },
  { name: "email",        label: "Email",           colWidth: 4  },
  { name: "phoneNumber",  label: "Phone Number",    colWidth: 4  },
  { name: "address",      label: "Address",         colWidth: 4, isTextarea: true },
  { name: "info",         label: "Specialty / Info",colWidth: 4, isTextarea: true },
  { name: "isActive",     label: "Status",          colWidth: 12, isToggle: true  },
];

// ── Tab definitions ───────────────────────────────────────────────────────────
const tabs: ViewTabConfig[] = [
  {
    key: "practices",
    label: "Practices",
    columns: [
      { key: "practiceId",   label: "Practice ID"   },
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
      mapTabData={(data) => ({
        practices:
          Array.isArray(data.practices) && data.practices.length > 0
            ? data.practices.map((p: any) => ({
                practiceId:   p.practiceId   ?? p.id   ?? "",
                practiceName: p.practiceName ?? p.name ?? "",
              }))
            : [],
      })}
    />
  );
};

export default DSODoctorViewModal;