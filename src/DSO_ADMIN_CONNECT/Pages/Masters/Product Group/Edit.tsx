import React, { useState, useEffect } from "react";
import KiduEditModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduEditModal";
import DSOProductGroupService from "../../../Services/Masters/DsoProductGroup.services";
import type { DSOProductGroup } from "../../../Types/Masters/DsoProductGroup.types";

interface Props {
  show:      boolean;
  onHide:    () => void;
  onSuccess: () => void;
  recordId:  string | number; 
}

const DsoProductGroupEditModal: React.FC<Props> = ({
  show,
  onHide,
  onSuccess,
  recordId,
}) => {

  const [selectedMaster, setSelectedMaster] = useState<{
    id:   number;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (!show) {
      setSelectedMaster(null);
    }
  }, [show]);

  const fields: Field[] = [
    { name:  "code", rules: { type: "text", label: "Code", required: true, maxLength: 20, colWidth: 6 }, },
    { name:  "name", rules: { type: "text", label: "Name", required: true, maxLength: 100, colWidth: 6 }, },
    { name:  "dsoMasterId", rules: { type: "popup", label: "DSO Master", required: true, colWidth: 6 }, },
    { name:  "isActive", rules: { type: "toggle", label: "Active", colWidth: 6 }, },
  ];

const handleFetch = async (id: string | number) => {
  const response = await DSOProductGroupService.getById(Number(id));  // ✅ cast to number — fixes id error

  // ✅ Service returns DSOProductGroup directly, not { isSucess, value }
  // Wrap it into the shape KiduEditModal expects
  if (response) {
    if (response.dsoMasterId && response.dsoName) {
      setSelectedMaster({
        id:   response.dsoMasterId,
        name: response.dsoName,
      });
    }
  }

  // KiduEditModal expects { isSucess: true, value: data }
  return {
    isSucess: true,
    value:    response,
  };
};

const handleUpdate = async (
  id:       string | number,
  formData: Record<string, any>,
) => {
  const payload: DSOProductGroup = {
    code:        formData.code,
    name:        formData.name,
    dsoMasterId: formData.dsoMasterId,
    isActive:    formData.isActive ?? true,
  };

  await DSOProductGroupService.update(Number(id), payload);  // ✅ cast to number — fixes id error

  return {
    isSucess: true,
    value:    payload,
  };
};

  const openMasterPopup = () => {
    const name = window.prompt("Enter DSO Master name (replace with real lookup):");
    if (name) {
      setSelectedMaster({ id: Date.now(), name }); 
    }
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
      popupHandlers={{
        dsoMasterId: {
          value:       selectedMaster?.name || "",
          onOpen:      openMasterPopup,
          actualValue: selectedMaster?.id ?? undefined,
        },
      }}
    />
  );
};

export default DsoProductGroupEditModal;
