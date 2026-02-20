import React from "react";
import KiduViewModal, { type ViewField } from "../../../../KIDU_COMPONENTS/KiduViewModal";
import DSOProductGroupService from "../../../Services/Masters/DsoProductGroup.services";

interface Props {
  show:     boolean;
  onHide:   () => void;
  recordId: string | number;
}

const fields: ViewField[] = [
  { name: "code",      label: "Code",       colWidth: 6 },
  { name: "name",      label: "Name",       colWidth: 6 },
  { name: "dsoName",   label: "DSO Master", colWidth: 6 },
  { name: "isActive",  label: "Status",     colWidth: 6, isToggle: true },
  { name: "createdAt", label: "Created At", colWidth: 6, isDate: true },
  { name: "updatedAt", label: "Updated At", colWidth: 6, isDate: true },
];

const DsoProductGroupViewModal: React.FC<Props> = ({ show, onHide, recordId }) => {
  return (
    <KiduViewModal
      show={show}
      onHide={onHide}
      title="View Product Group"
      subtitle="DSO Product Group details"
      fields={fields}
      recordId={recordId}
      onFetch={(id) => DSOProductGroupService.getById(Number(id))}
      showBadge={true}
      badgeText="Read Only"
    />
  );
};

export default DsoProductGroupViewModal;
