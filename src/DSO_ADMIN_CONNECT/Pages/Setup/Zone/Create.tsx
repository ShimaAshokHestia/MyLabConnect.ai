import React from "react";
import KiduCreateModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import type { DSOZone } from "../../../Types/Setup/DsoZone.types";
import DSOZoneService from "../../../Services/Setup/DsoZone.services";

interface Props {
  show:      boolean;
  onHide:    () => void;
  onSuccess: () => void;
}

const DSOZoneCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {

  // ── Fields ────────────────────────────────────────────────────
  const fields: Field[] = [
    { name: "name",        rules: { type: "text",   label: "Zone Name",    required: true, maxLength: 100, colWidth: 12 } },
    { name: "dsoMasterId", rules: { type: "number", label: "DSO Master ID", required: true,                 colWidth: 6 } },
    { name: "isActive",    rules: { type: "toggle", label: "Active",                                       colWidth: 6 } },
  ];

  // ── Submit ────────────────────────────────────────────────────
  const handleSubmit = async (formData: Record<string, any>) => {
    console.log("formData:", formData);
    
    const payload: Partial<DSOZone> = {
      name:         formData.name,
      dsoMasterId:  Number(formData.dsoMasterId),
      isActive:     formData.isActive ?? true,
    };

    console.log("payload:", payload);
    
    await DSOZoneService.create(payload);
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <KiduCreateModal
      show={show}
      onHide={onHide}
      title="Create Zone"
      subtitle="Add new DSO Zone"
      fields={fields}
      onSubmit={handleSubmit}
      successMessage="Zone created successfully"
      onSuccess={onSuccess}
    />
  );
};

export default DSOZoneCreateModal;