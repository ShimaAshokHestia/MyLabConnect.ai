import React from "react";
import type { Field } from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import type { UserType } from "../../../Types/User Mangement/UserTypes.types";
import UserTypeService from "../../../Services/User Management/UserType.services";
import KiduCreateModal from "../../../../KIDU_COMPONENTS/KiduCreateModal";

interface Props {
  show:      boolean;
  onHide:    () => void;
  onSuccess: () => void;
}

const fields: Field[] = [
  { name: "userTypeName",   rules: { type: "text",   label: "User Type Name", required: true, maxLength: 100, colWidth: 6 } },
  { name: "isActive",       rules: { type: "toggle", label: "Active",                                         colWidth: 6 } },
  { name: "isDeleted",      rules: { type: "toggle", label: "Deleted",                                        colWidth: 6 } },
  { name: "rowbreak1",      rules: { type: "rowbreak", label: "" } },
  { name: "isAdminAdable",  rules: { type: "toggle", label: "Admin Addable",   colWidth: 4 } },
  { name: "isDSOAddable",   rules: { type: "toggle", label: "DSO Addable",     colWidth: 4 } },
  { name: "isLabAddable",   rules: { type: "toggle", label: "Lab Addable",     colWidth: 4 } },
  { name: "isDoctorAddable",rules: { type: "toggle", label: "Doctor Addable",  colWidth: 4 } },
  { name: "isPMAddable",    rules: { type: "toggle", label: "PM Addable",      colWidth: 4 } },
];

const UserTypeCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {

  const handleSubmit = async (formData: Record<string, any>) => {
    const payload: Partial<UserType> = {
      userTypeName:    formData.userTypeName,
      isAdminAdable:   formData.isAdminAdable   ?? false,
      isDSOAddable:    formData.isDSOAddable     ?? false,
      isLabAddable:    formData.isLabAddable     ?? false,
      isDoctorAddable: formData.isDoctorAddable  ?? false,
      isPMAddable:     formData.isPMAddable      ?? false,
      isActive:        formData.isActive         ?? true,
      isDeleted:       formData.isDeleted        ?? false,
    };
    await UserTypeService.create(payload);
  };

  return (
    <KiduCreateModal
      show={show}
      onHide={onHide}
      title="Add User Type"
      subtitle="Create a new User Type"
      fields={fields}
      onSubmit={handleSubmit}
      successMessage="User Type created successfully!"
      onSuccess={onSuccess}
    />
  );
};

export default UserTypeCreateModal;
