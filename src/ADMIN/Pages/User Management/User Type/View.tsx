import React from "react";
import type { ViewField } from "../../../../KIDU_COMPONENTS/KiduViewModal";
import KiduViewModal from "../../../../KIDU_COMPONENTS/KiduViewModal";
import UserTypeService from "../../../Services/User Management/UserType.services";

interface Props {
  show:     boolean;
  onHide:   () => void;
  recordId: string | number;
}

const fields: ViewField[] = [
  { name: "userTypeName",   label: "User Type Name", colWidth: 6 },
  { name: "isActive",       label: "Status",         colWidth: 6, isToggle: true },
  { name: "isDeleted",      label: "Deleted",        colWidth: 6, isToggle: true },
  { name: "isAdminAdable",  label: "Admin Addable",  colWidth: 4, isToggle: true },
  { name: "isDSOAddable",   label: "DSO Addable",    colWidth: 4, isToggle: true },
  { name: "isLabAddable",   label: "Lab Addable",    colWidth: 4, isToggle: true },
  { name: "isDoctorAddable",label: "Doctor Addable", colWidth: 4, isToggle: true },
  { name: "isPMAddable",    label: "PM Addable",     colWidth: 4, isToggle: true },
  { name: "createdAt",      label: "Created At",     colWidth: 6, isDate: true },
  { name: "updatedAt",      label: "Updated At",     colWidth: 6, isDate: true },
];

const UserTypeViewModal: React.FC<Props> = ({ show, onHide, recordId }) => {
  return (
    <KiduViewModal
      show={show}
      onHide={onHide}
      title="View User Type"
      subtitle="User Type details"
      fields={fields}
      recordId={recordId}
      onFetch={(id) => UserTypeService.getById(Number(id))}
      showBadge={true}
      badgeText="Read Only"
    />
  );
};

export default UserTypeViewModal;
