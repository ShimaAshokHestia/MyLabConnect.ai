import React from "react";
import type { ViewField } from "../../../KIDU_COMPONENTS/KiduViewModal";
import UserTypeService from "../../Services/UserType/UserType.services";
import KiduViewModal from "../../../KIDU_COMPONENTS/KiduViewModal";

interface Props {
  show:     boolean;
  onHide:   () => void;
  recordId: string | number;
}

const fields: ViewField[] = [
  { name: "userTypeName", label: "User Type Name", colWidth: 6 },
  { name: "isActive", label: "Status", colWidth: 6, isToggle: true },
  { name: "isDeleted", label: "Deleted", colWidth: 6, isToggle: true },
  // Permissions
  { name: "isAdminAdable", label: "Admin Addable", colWidth: 4, isToggle: true },
  { name: "isDSOAddable", label: "DSO Addable", colWidth: 4, isToggle: true },
  { name: "isLabAddable", label: "Lab Addable", colWidth: 4, isToggle: true },
  { name: "isDoctorAddable", label: "Doctor Addable", colWidth: 4, isToggle: true },
  { name: "isPMAddable", label: "PM Addable", colWidth: 4, isToggle: true },
  // Audit
  { name: "createdAt", label: "Created At", colWidth: 6, isDate: true },
  { name: "updatedAt", label: "Updated At", colWidth: 6, isDate: true },
];

const UserTypeViewModal: React.FC<Props> = ({ show, onHide, recordId }) => {

  const handleFetch = async (id: string | number) => {
    const response = await UserTypeService.getById(Number(id));
    return response;
  };

  return (
    <KiduViewModal
      show={show}
      onHide={onHide}
      title="View User Type"
      subtitle="User Type details"
      size="lg"
      centered={true}
      recordId={recordId}
      fields={fields}
      onFetch={handleFetch}
      showBadge={true}
      badgeText="Read Only"
    />
  );
};

export default UserTypeViewModal;