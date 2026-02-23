import React from "react";
import KiduViewModal, { type ViewField } from "../../../../KIDU_COMPONENTS/KiduViewModal";
import LabMasterService from "../../../Services/Masters/Lab.services";

interface Props {
  show:     boolean;
  onHide:   () => void;
  recordId: string | number;
}

const fields: ViewField[] = [
  { name: "labCode",            label: "Lab Code",            colWidth: 6 },
  { name: "labName",            label: "Lab Name",            colWidth: 6 },
  { name: "displayName",        label: "Display Name",        colWidth: 6 },
  { name: "email",              label: "Email",               colWidth: 6 },
  { name: "authenticationType", label: "Authentication Type", colWidth: 6 },
  { name: "lmsSystem",          label: "LMS System",          colWidth: 6 },
  { name: "labGroupId",         label: "Lab Group",           colWidth: 6 },
  { name: "logoforRX",          label: "Logo for RX",         colWidth: 6 },
  { name: "isActive",           label: "Status",              colWidth: 6,  isToggle: true },
  { name: "createdAt",          label: "Created At",          colWidth: 6,  isDate: true },
  { name: "updatedAt",          label: "Updated At",          colWidth: 6,  isDate: true },
];

const LabMasterViewModal: React.FC<Props> = ({ show, onHide, recordId }) => {
  return (
    <KiduViewModal
      show={show}
      onHide={onHide}
      title="View Lab"
      subtitle="Lab Master details"
      fields={fields}
      recordId={recordId}
      onFetch={(id) => LabMasterService.getById(Number(id))}
      showBadge={true}
      badgeText="Read Only"
    />
  );
};

export default LabMasterViewModal;