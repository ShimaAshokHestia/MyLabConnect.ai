import React from "react";
import KiduCreateModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import DSOProductGroupService from "../../../Services/Masters/DsoProductGroup.services";
import type { DSOProductGroup } from "../../../Types/Masters/DsoProductGroup.types";

interface Props {
  show:      boolean;
  onHide:    () => void;
  onSuccess: () => void;
}

const DsoProductGroupCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {

  // ── Fields ────────────────────────────────────────────────────
  const fields: Field[] = [
    { name: "code",        rules: { type: "text",   label: "Code",       required: true, maxLength: 20,  colWidth: 6 } },
    { name: "name",        rules: { type: "text",   label: "Name",       required: true, maxLength: 100, colWidth: 6 } },
    { name: "dsoMasterId", rules: { type: "number", label: "DSO Master", required: true,                 colWidth: 6 } },
    { name: "isActive",    rules: { type: "toggle", label: "Active",                                     colWidth: 6 } },
  ];

  // ── Submit ────────────────────────────────────────────────────
 const handleSubmit = async (formData: Record<string, any>) => {
  console.log("formData:", formData);  // ✅ add this
  
  const payload: DSOProductGroup = {
    code:        formData.code,
    name:        formData.name,
    dsoMasterId: Number(formData.dsoMasterId),
    isActive:    formData.isActive ?? true,
  };

  console.log("payload:", payload);  // ✅ add this
  
  await DSOProductGroupService.create(payload);
};

  // ── Render ────────────────────────────────────────────────────
  return (
    <KiduCreateModal
      show={show}
      onHide={onHide}
      title="Create Product Group"
      subtitle="Add new DSO Product Group"
      fields={fields}
      onSubmit={handleSubmit}
      successMessage="Product group created successfully"
      onSuccess={onSuccess}
    />
  );
};

export default DsoProductGroupCreateModal;
