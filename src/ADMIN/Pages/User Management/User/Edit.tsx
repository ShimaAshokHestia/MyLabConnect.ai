import React from "react";
import type { Field } from "../../../../KIDU_COMPONENTS/KiduEditModal";
import UserService from "../../../Services/User Management/User.services";
import type { User } from "../../../Types/User Mangement/User.types";
import KiduEditModal from "../../../../KIDU_COMPONENTS/KiduEditModal";

interface Props {
  show:      boolean;
  onHide:    () => void;
  onSuccess: () => void;
  recordId:  string | number;
}

const fields: Field[] = [
  { name: "userName",           rules: { type: "text",     label: "User Name",           required: true,  maxLength: 100, colWidth: 6 } },
  { name: "userEmail",          rules: { type: "email",    label: "Email",               required: true,  maxLength: 100, colWidth: 6 } },
  { name: "phoneNumber",        rules: { type: "text",     label: "Phone Number",        required: true,  maxLength: 20,  colWidth: 6 } },
  { name: "address",            rules: { type: "text",     label: "Address",             required: false, maxLength: 200, colWidth: 6 } },
  { name: "userTypeId",         rules: { type: "number",   label: "User Type ID",        required: true,                 colWidth: 6 } },
  { name: "companyId",          rules: { type: "number",   label: "Company ID",          required: true,                 colWidth: 6 } },
  { name: "authenticationType", rules: { type: "select",   label: "Authentication Type", required: true,                 colWidth: 6 } },
  { name: "rowbreak1",          rules: { type: "rowbreak", label: "" } },
  { name: "isActive",           rules: { type: "toggle",   label: "Active",                                              colWidth: 4 } },
  { name: "islocked",           rules: { type: "toggle",   label: "Locked",                                              colWidth: 4 } },
  { name: "isDeleted",          rules: { type: "toggle",   label: "Deleted",                                             colWidth: 4 } },
];

const authenticationTypeOptions = [
  { value: 1, label: "Normal" },
  { value: 2, label: "SSO"    },
  { value: 3, label: "Basic"  },
];

const UserEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {

  const handleFetch = async (id: string | number) => {
    return await UserService.getById(Number(id));
  };

  const handleUpdate = async (id: string | number, formData: Record<string, any>) => {
    const payload: Partial<User> = {
      id:                 Number(id),
      userName:           formData.userName,
      userEmail:          formData.userEmail,
      phoneNumber:        formData.phoneNumber,
      address:            formData.address,
      userTypeId:         Number(formData.userTypeId),
      companyId:          Number(formData.companyId),
      authenticationType: Number(formData.authenticationType),
      isActive:           formData.isActive  ?? true,
      islocked:           formData.islocked  ?? false,
      isDeleted:          formData.isDeleted ?? false,
    };
    await UserService.update(Number(id), payload);
    return { isSucess: true, value: payload };
  };

  return (
    <KiduEditModal
      show={show}
      onHide={onHide}
      title="Edit User"
      subtitle="Update User details"
      fields={fields}
      recordId={recordId}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      successMessage="User updated successfully!"
      onSuccess={onSuccess}
      options={{ authenticationType: authenticationTypeOptions }}
    />
  );
};

export default UserEditModal;
