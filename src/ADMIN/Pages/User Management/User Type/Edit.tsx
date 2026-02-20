import React from "react";
import type { Field } from "../../../../KIDU_COMPONENTS/KiduEditModal";
import UserTypeService from "../../../Services/User Management/UserType.services";
import type { UserType } from "../../../Types/User Mangement/UserTypes.types";
import KiduEditModal from "../../../../KIDU_COMPONENTS/KiduEditModal";

interface Props {
  show:      boolean;
  onHide:    () => void;
  onSuccess: () => void;
  recordId:  string | number;
}

const fields: Field[] = [
  { name: "userTypeName",   rules: { type: "text",    label: "User Type Name", required: true, maxLength: 100, colWidth: 6 } },
  { name: "isActive",       rules: { type: "toggle",  label: "Active",                                         colWidth: 6 } },
  { name: "isDeleted",      rules: { type: "toggle",  label: "Deleted",                                        colWidth: 6 } },
  { name: "rowbreak1",      rules: { type: "rowbreak", label: "" } },
  { name: "isAdminAdable",  rules: { type: "toggle",  label: "Admin Addable",  colWidth: 4 } },
  { name: "isDSOAddable",   rules: { type: "toggle",  label: "DSO Addable",    colWidth: 4 } },
  { name: "isLabAddable",   rules: { type: "toggle",  label: "Lab Addable",    colWidth: 4 } },
  { name: "isDoctorAddable",rules: { type: "toggle",  label: "Doctor Addable", colWidth: 4 } },
  { name: "isPMAddable",    rules: { type: "toggle",  label: "PM Addable",     colWidth: 4 } },
];

const UserTypeEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {

  const handleFetch = async (id: string | number) => {
    return await UserTypeService.getById(Number(id));
  };

  const handleUpdate = async (id: string | number, formData: Record<string, any>) => {
    const payload: Partial<UserType> = {
      id:              Number(id),
      userTypeName:    formData.userTypeName,
      isAdminAdable:   formData.isAdminAdable   ?? false,
      isDSOAddable:    formData.isDSOAddable     ?? false,
      isLabAddable:    formData.isLabAddable     ?? false,
      isDoctorAddable: formData.isDoctorAddable  ?? false,
      isPMAddable:     formData.isPMAddable      ?? false,
      isActive:        formData.isActive         ?? true,
      isDeleted:       formData.isDeleted        ?? false,
    };
    await UserTypeService.update(Number(id), payload);
    return { isSucess: true, value: payload };
  };

  return (
    <KiduEditModal
      show={show}
      onHide={onHide}
      title="Edit User Type"
      subtitle="Update User Type details"
      fields={fields}
      recordId={recordId}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      successMessage="User Type updated successfully!"
      onSuccess={onSuccess}
    />
  );
};

export default UserTypeEditModal;
