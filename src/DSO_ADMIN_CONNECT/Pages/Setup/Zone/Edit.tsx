import React from "react";
import KiduEditModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduEditModal";
import DSOZoneService from "../../../Services/Setup/DsoZone.services";
import type { DSOZone } from "../../../Types/Setup/DsoZone.types";

interface Props {
  show:     boolean;
  onHide:   () => void;
  onSuccess: () => void;
  recordId: string | number;
}

const DSOZoneEditModal: React.FC<Props> = ({
  show,
  onHide,
  onSuccess,
  recordId,
}) => {

  const fields: Field[] = [
    { name: "name",        rules: { type: "text",   label: "Zone Name",    required: true, maxLength: 100, colWidth: 12 } },
    { name: "dsoMasterId", rules: { type: "number", label: "DSO Master ID", required: true,                 colWidth: 6 } },
    { name: "isActive",    rules: { type: "toggle", label: "Active",                                       colWidth: 6 } },
  ];

  const handleFetch = async (id: string | number) => {
    const response = await DSOZoneService.getById(Number(id));
    console.log("getById response:", response);
    return response;
  };

  const handleUpdate = async (
    id:       string | number,
    formData: Record<string, any>,
  ) => {
    const payload: Partial<DSOZone> = {
      id: Number(id),
      name:         formData.name,
      dsoMasterId:  Number(formData.dsoMasterId),
      isActive:     formData.isActive ?? true,
    };

    const response = await DSOZoneService.update(Number(id), payload);
    console.log("update response:", response);

    return {
      isSucess: true,
      value:    payload,
    };
  };

  return (
    <KiduEditModal
      show={show}
      onHide={onHide}
      title="Edit Zone"
      subtitle="Update DSO Zone details"
      size="lg"
      centered={true}
      recordId={recordId}
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      submitButtonText="Update"
      cancelButtonText="Cancel"
      successMessage="Zone updated successfully!"
      onSuccess={onSuccess}
    />
  );
};

export default DSOZoneEditModal;