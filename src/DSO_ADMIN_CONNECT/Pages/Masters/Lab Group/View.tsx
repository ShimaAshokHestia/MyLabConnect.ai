import React from "react";
import KiduViewModal, { type ViewField } from "../../../../KIDU_COMPONENTS/KiduViewModal";
import LabGroupService from "../../../Services/Masters/Labgroup.services";

interface Props {
  show: boolean;
  onHide: () => void;
  recordId: string | number;
}

const fields: ViewField[] = [
  { name: "code", label: "Code", colWidth: 6 },
  { name: "name", label: "Lab Group Name", colWidth: 6 },
  { name: "isActive", label: "Status", colWidth: 6, isToggle: true },
];

const LabGroupViewModal: React.FC<Props> = ({ show, onHide, recordId }) => {
  return (
    <KiduViewModal
      show={show}
      onHide={onHide}
      title="View Lab Group"
      subtitle="Lab Group details"
      fields={fields}
      recordId={recordId}
      onFetch={(id) => LabGroupService.getById(Number(id))}
      showBadge={true}
      badgeText="Read Only"
    />
  );
};

export default LabGroupViewModal;