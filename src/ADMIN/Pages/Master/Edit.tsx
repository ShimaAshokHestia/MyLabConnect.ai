import React from "react";
import type { Field } from "../../../KIDU_COMPONENTS/KiduEditModal";
import DSOmasterService from "../../Services/Master/Master.services";
import type { DSOmaster } from "../../Types/Master/Master.types";
import KiduEditModal from "../../../KIDU_COMPONENTS/KiduEditModal";

interface Props {
  show:      boolean;
  onHide:    () => void;
  onSuccess: () => void;
  recordId:  string | number;
}

const fields: Field[] = [
  { name: "name", rules: { type: "text", label: "Name", required: true, maxLength: 100, colWidth: 6 } },
  { name: "description", rules: { type: "textarea", label: "Description", required: false, maxLength: 500, colWidth: 12 } },
  { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 6 } },
  { name: "isDeleted", rules: { type: "toggle", label: "Deleted", colWidth: 6 } },
];

const DSOmasterEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {

  const handleFetch = async (id: string | number) => {
    const response = await DSOmasterService.getById(Number(id));
    console.log("getById response:", response);
    return response;
  };

  const handleUpdate = async (id: string | number, formData: Record<string, any>) => {
    const payload: Partial<DSOmaster> = {
      id:          Number(id),
      name:        formData.name,
      description: formData.description,
      isActive:    formData.isActive  ?? true,
      isDeleted:   formData.isDeleted ?? false,
    };

    await DSOmasterService.update(Number(id), payload);

    return {
      isSucess: true,
      value:    payload,
    };
  };

  return (
    <KiduEditModal
      show={show}
      onHide={onHide}
      title="Edit DSO Master"
      subtitle="Update DSO Master details"
      size="lg"
      centered={true}
      recordId={recordId}
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      submitButtonText="Update"
      cancelButtonText="Cancel"
      successMessage="DSO Master updated successfully!"
      onSuccess={onSuccess}
    />
  );
};

export default DSOmasterEditModal;