import React from "react";
import type { Field } from "../../../KIDU_COMPONENTS/KiduCreateModal";
import type { DSOmaster } from "../../Types/Master/Master.types";
import DSOmasterService from "../../Services/Master/Master.services";
import KiduCreateModal from "../../../KIDU_COMPONENTS/KiduCreateModal";

interface Props {
  show:      boolean;
  onHide:    () => void;
  onSuccess: () => void;
}

const fields: Field[] = [
  { name: "name", rules: { type: "text", label: "Name", required: true, maxLength: 200, colWidth: 6 } },
  { name: "description", rules: { type: "text", label: "Description", required: false, maxLength: 500, colWidth: 12 } },
  { name: "email", rules: { type: "text", label: "Email", required: false, maxLength: 500, colWidth: 12 } },
  { name: "phoneNumber", rules: { type: "number", label: "Phone Number", required: false, maxLength: 500, colWidth: 12 } },
  { name: "address", rules: { type: "textarea", label: "Description", required: false, maxLength: 500, colWidth: 12 } },
  { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 6 } },
  { name: "isDeleted", rules: { type: "toggle", label: "Deleted", colWidth: 6 } },
];

const DSOmasterCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {

  const handleSubmit = async (formData: Record<string, any>) => {
    const payload: Partial<DSOmaster> = {
      name:        formData.name,
      description: formData.description,
      email:        formData.email,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      isActive:    formData.isActive  ?? true,
      isDeleted:   formData.isDeleted ?? false,
    };

    await DSOmasterService.create(payload);
  };

  return (
    <KiduCreateModal
      show={show}
      onHide={onHide}
      title="Add DSO Master"
      subtitle="Create a new DSO Master"
      size="lg"
      centered={true}
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create"
      cancelButtonText="Cancel"
      successMessage="DSO Master created successfully!"
      onSuccess={onSuccess}
    />
  );
};

export default DSOmasterCreateModal;