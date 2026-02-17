import React from "react";
import KiduEditModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduEditModal";
import DSOProductGroupService from "../../../Services/Masters/DsoProductGroup.services";
import type { DSOProductGroup } from "../../../Types/Masters/DsoProductGroup.types";

interface Props {
  show:  boolean;
  onHide: () => void;
  onSuccess: () => void;
  recordId: string | number;
}

const DsoProductGroupEditModal: React.FC<Props> = ({
  show,
  onHide,
  onSuccess,
  recordId,
}) => {

  const fields: Field[] = [
    { name: "code", rules: { type: "text", label: "Code", required: true, maxLength: 20, colWidth: 6 } },
    { name: "name", rules: { type: "text", label: "Name", required: true, maxLength: 100, colWidth: 6 } },
    { name: "dsoMasterId", rules: { type: "number", label: "DSO Master", required: true, colWidth: 6 } },
    { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 6 } },
  ];

 const handleFetch = async (id: string | number) => {
  const response = await DSOProductGroupService.getById(Number(id));
  console.log("getById response:", response);
  return response;
};

const handleUpdate = async (
  id:       string | number,
  formData: Record<string, any>,
) => {
  const payload: DSOProductGroup = {
    id: Number(id),            
    code: formData.code,
    name: formData.name,
    dsoMasterId: Number(formData.dsoMasterId),
    isActive: formData.isActive ?? true,
  };

  const response = await DSOProductGroupService.update(Number(id), payload);
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
      title="Edit Product Group"
      subtitle="Update DSO Product Group details"
      size="lg"
      centered={true}
      recordId={recordId}
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      submitButtonText="Update"
      cancelButtonText="Cancel"
      successMessage="Product group updated successfully!"
      onSuccess={onSuccess}
    />
  );
};

export default DsoProductGroupEditModal;
