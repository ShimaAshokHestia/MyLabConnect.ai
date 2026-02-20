import React, { useRef } from "react";
import type { Field } from "../../../KIDU_COMPONENTS/KiduCreateModal";
import type { DSOmaster } from "../../Types/Master/Master.types";
import DSOmasterService from "../../Services/Master/Master.services";
import KiduCreateModal from "../../../KIDU_COMPONENTS/KiduCreateModal";

interface Props {
  show: boolean;
  handleClose: () => void;
  onAdded: (newMaster: DSOmaster) => void;
}

const fields: Field[] = [
  { name: "name", rules: { type: "text", label: "Name", required: true, maxLength: 100, colWidth: 12 } },
  { name: "description", rules: { type: "textarea", label: "Description", required: false, maxLength: 500, colWidth: 12 } },
  { name: "rowbreak1", rules: { type: "rowbreak", label: "" } },
  { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 6 } },
  { name: "isDeleted", rules: { type: "toggle", label: "Deleted", colWidth: 6 } },
];

const MasterCreateModal: React.FC<Props> = ({ show, handleClose, onAdded }) => {
  // Store the created data to use in onSuccess
  const createdDataRef = useRef<any>(null);

  const handleSubmit = async (formData: Record<string, any>) => {
    const payload: Partial<DSOmaster> = {
      name:        formData.name,
      description: formData.description,
      isActive:    formData.isActive  ?? true,
      isDeleted:   formData.isDeleted ?? false,
    };

    const response = await DSOmasterService.create(payload);
    
    // Store the response for onSuccess to use
    createdDataRef.current = response;
    
    // Don't return anything - just let the submission complete
    // The onSuccess callback will handle the created data
  };

  const handleSuccess = () => {
    // Get the stored response
    const response = createdDataRef.current;
    
    // Extract the master from the response
    const newMaster = response?.value || response?.data || response;
    
    // If we have the master data, pass it back
    if (newMaster && newMaster.id) {
      onAdded(newMaster);
    } else {
      // If we don't have the full data, log warning
      console.warn("Could not get created master data", response);
    }
    
    // Clear the ref
    createdDataRef.current = null;
    
    // Close the modal
    handleClose();
  };

  return (
    <KiduCreateModal
      show={show}
      onHide={handleClose}
      title="Add Master"
      subtitle="Create a new Master"
      size="lg"
      centered={true}
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create"
      cancelButtonText="Cancel"
      successMessage="Master created successfully!"
      onSuccess={handleSuccess}
    />
  );
};

export default MasterCreateModal;