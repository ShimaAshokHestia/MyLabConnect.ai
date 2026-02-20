import React from "react";
import type { Field } from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import type { User } from "../../../Types/User Mangement/User.types";
import UserService from "../../../Services/User Management/User.services";
import KiduCreateModal from "../../../../KIDU_COMPONENTS/KiduCreateModal";

interface Props {
  show:      boolean;
  onHide:    () => void;
  onSuccess: () => void;
}

const fields: Field[] = [
  { name: "userName",           rules: { type: "text",     label: "User Name",           required: true,  maxLength: 100, colWidth: 6 } },
  { name: "userEmail",          rules: { type: "email",    label: "Email",               required: true,  maxLength: 100, colWidth: 6 } },
  { name: "phoneNumber",        rules: { type: "text",     label: "Phone Number",        required: true,  maxLength: 20,  colWidth: 6 } },
  { name: "address",            rules: { type: "text",     label: "Address",             required: false, maxLength: 200, colWidth: 6 } },
  { name: "passwordHash",       rules: { type: "password", label: "Password",            required: true,  maxLength: 100, colWidth: 6 } },
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

const UserCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {

  const handleSubmit = async (formData: Record<string, any>) => {
    const payload: Partial<User> = {
      userName:           formData.userName,
      userEmail:          formData.userEmail,
      phoneNumber:        formData.phoneNumber,
      address:            formData.address,
      passwordHash:       formData.passwordHash,
      userTypeId:         Number(formData.userTypeId),
      companyId:          Number(formData.companyId),
      authenticationType: Number(formData.authenticationType),
      isActive:           formData.isActive  ?? true,
      islocked:           formData.islocked  ?? false,
      isDeleted:          formData.isDeleted ?? false,
    };
    await UserService.create(payload);
  };

  return (
    <KiduCreateModal
      show={show}
      onHide={onHide}
      title="Add User"
      subtitle="Create a new User"
      fields={fields}
      onSubmit={handleSubmit}
      successMessage="User created successfully!"
      onSuccess={onSuccess}
      options={{ authenticationType: authenticationTypeOptions }}
    />
  );
};

export default UserCreateModal;
