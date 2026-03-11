import React from "react";
import KiduViewModal, { type ViewField } from "../../../../KIDU_COMPONENTS/KiduViewModal";
import DSOAdditionalServiceService from "../../../Services/Masters/DsoAdditionalService.services";

// ── Field definitions ─────────────────────────────────────────────────────────
const fields: ViewField[] = [
  {
    name: "serviceName",
    label: "Service Name",
    colWidth: 12,
  },
  {
    name: "serviceNotes",
    label: "Service Notes",
    colWidth: 12,
    isTextarea: true,
  },
  {
    name: "isActive",
    label: "Status",
    colWidth: 6,
    isToggle: true,
  },
];

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  show: boolean;
  onHide: () => void;
  recordId: string | number;
}

// ── Component ─────────────────────────────────────────────────────────────────
const DSOAdditionalServiceViewModal: React.FC<Props> = ({ show, onHide, recordId }) => {
  return (
    <KiduViewModal
      show={show}
      onHide={onHide}
      title="View Additional Service"
      subtitle="DSO Additional Service details"
      fields={fields}
      recordId={recordId}
      onFetch={(id) => DSOAdditionalServiceService.getById(Number(id))}
      showBadge={true}
      badgeText="Read Only"
      themeColor="#ef0d50"
    />
  );
};

export default DSOAdditionalServiceViewModal;