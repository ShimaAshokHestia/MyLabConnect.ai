import React from "react";
import KiduCreateModal, {
  type Field,
} from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import type { LabGroup } from "../../../Types/Masters/Labgroup.types";
import LabGroupService from "../../../Services/Masters/Labgroup.services";

const fields: Field[] = [
  { name: "code", rules: { type: "text", label: "Code", required: true,minLength:3, maxLength: 50, colWidth: 6 }, },
  { name: "name", rules: { type: "text", label: "Lab Group Name", required: true,minLength:3, maxLength: 100, colWidth: 6 }, },
  { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 6 }, },
];

interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

const LabGroupCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {

  const handleSubmit = async (formData: Record<string, any>) => {
    const payload: Partial<LabGroup> = {
      code:     formData.code,
      name:     formData.name,
      isActive: formData.isActive ?? true,
    };
    await LabGroupService.create(payload);
  };

  return (
    <KiduCreateModal
      show={show}
      onHide={onHide}
      title="Create Lab Group"
      subtitle="Add a new Lab Group"
      fields={fields}
      onSubmit={handleSubmit}
      successMessage="Lab group created successfully!"
      onSuccess={onSuccess}
    />
  );
};

export default LabGroupCreateModal;