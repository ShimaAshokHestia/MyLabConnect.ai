import React from "react";
import type { ViewField } from "../../../../KIDU_COMPONENTS/KiduViewModal";
import KiduViewModal from "../../../../KIDU_COMPONENTS/KiduViewModal";
import UserService from "../../../Services/User Management/User.services";

interface Props {
  show:     boolean;
  onHide:   () => void;
  recordId: string | number;
}

const authenticationTypeLabels: Record<number, string> = {
  0: "Standard",
  1: "OAuth",
  2: "LDAP",
  3: "SSO",
};

const fields: ViewField[] = [
  { name: "userName",           label: "User Name",           colWidth: 6 },
  { name: "userEmail",          label: "Email",               colWidth: 6 },
  { name: "phoneNumber",        label: "Phone Number",        colWidth: 6 },
  { name: "address",            label: "Address",             colWidth: 6 },
  { name: "userTypeName",       label: "User Type",           colWidth: 6 },
  { name: "companyName",        label: "Company",             colWidth: 6 },
  { name: "userTypeId",         label: "User Type ID",        colWidth: 6 },
  { name: "companyId",          label: "Company ID",          colWidth: 6 },
  { name: "authenticationType", label: "Authentication Type", colWidth: 6, formatter: (value) => authenticationTypeLabels[Number(value)] ?? "Unknown" },
  { name: "isActive",           label: "Active",              colWidth: 4, isToggle: true },
  { name: "islocked",           label: "Locked",              colWidth: 4, isToggle: true },
  { name: "isDeleted",          label: "Deleted",             colWidth: 4, isToggle: true },
  { name: "createdAt",          label: "Created At",          colWidth: 6, isDate: true },
  { name: "updatedAt",          label: "Updated At",          colWidth: 6, isDate: true },
];

const UserViewModal: React.FC<Props> = ({ show, onHide, recordId }) => {
  return (
    <KiduViewModal
      show={show}
      onHide={onHide}
      title="View User"
      subtitle="User details"
      fields={fields}
      recordId={recordId}
      onFetch={(id) => UserService.getById(Number(id))}
      showBadge={true}
      badgeText="Read Only"
    />
  );
};

export default UserViewModal;
