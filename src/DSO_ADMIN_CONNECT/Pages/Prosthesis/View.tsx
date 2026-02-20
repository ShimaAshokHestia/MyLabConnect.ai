import React from "react";
import type { ViewField } from "../../../KIDU_COMPONENTS/KiduViewModal";
import KiduViewModal from "../../../KIDU_COMPONENTS/KiduViewModal";
import DSOProsthesisTypeService from "../../Services/Prosthesis/Prosthesis.services";

interface Props {
  show:     boolean;
  onHide:   () => void;
  recordId: string | number;
}

const fields: ViewField[] = [
  { name: "id",         label: "ID",                 colWidth: 6 },
  { name: "name",       label: "Prosthesis Type",    colWidth: 6 },
  { name: "dsoName",    label: "DSO Master",         colWidth: 6 },
  { name: "isActive",   label: "Status",             colWidth: 6, isToggle: true },
  { name: "createdAt",  label: "Created At",         colWidth: 6, isDate: true },
  { name: "updatedAt",  label: "Updated At",         colWidth: 6, isDate: true },
];

const DSOProsthesisTypeViewModal: React.FC<Props> = ({ show, onHide, recordId }) => {
  return (
    <KiduViewModal
      show={show}
      onHide={onHide}
      title="View Prosthesis Type"
      subtitle="DSO Prosthesis Type details"
      fields={fields}
      recordId={recordId}
      onFetch={(id) => DSOProsthesisTypeService.getById(Number(id))}
      showBadge={true}
      badgeText="Read Only"
    />
  );
};

export default DSOProsthesisTypeViewModal;