import React, { useState } from "react";
import KiduCreateModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import DSOProductGroupService from "../../../Services/Masters/DsoProductGroup.services";
import type { DSOProductGroup } from "../../../Types/Masters/DsoProductGroup.types";
import type { DSOmaster } from '../../../../ADMIN/Types/Master/Master.types';
import MasterPopup from "../../../../ADMIN/Pages/Master/MasterPopup";

interface Props {
  show:      boolean;
  onHide:    () => void;
  onSuccess: () => void;
}

const fields: Field[] = [
  { name: "code",        rules: { type: "text",   label: "Code",       required: true, maxLength: 20,  colWidth: 6 } },
  { name: "name",        rules: { type: "text",   label: "Name",       required: true, maxLength: 100, colWidth: 6 } },
  { name: "dsoMasterId", rules: { type: "popup",  label: "DSO Master", required: true, colWidth: 6 } },
  { name: "isActive",    rules: { type: "toggle", label: "Active",     colWidth: 6 } },
];

const DsoProductGroupCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {
  const [showMasterPopup, setShowMasterPopup] = useState(false);
  const [selectedMaster, setSelectedMaster] = useState<DSOmaster | null>(null);

  const handleSubmit = async (formData: Record<string, any>) => {
    if (!selectedMaster) {
      throw new Error("Please select a DSO Master");
    }
    
    const payload: Partial<DSOProductGroup> = {
      code:        formData.code,
      name:        formData.name,
      dsoMasterId: selectedMaster.id, // Use selectedMaster.id directly
      isActive:    formData.isActive ?? true,
    };
    
    await DSOProductGroupService.create(payload);
  };

  // Popup handlers must match the PopupFieldHandler interface
  const popupHandlers = {
    dsoMasterId: { // This must match the field name exactly
      value: selectedMaster?.name || "",
      onOpen: () => setShowMasterPopup(true),
      onClear: () => {
        setSelectedMaster(null);
      }
    }
  };

  // Extra values to be merged into formData at submit
  const extraValues = {
    dsoMasterId: selectedMaster?.id
  };

  return (
    <>
      <KiduCreateModal
        show={show}
        onHide={onHide}
        title="Create Product Group"
        subtitle="Add new DSO Product Group"
        fields={fields}
        onSubmit={handleSubmit}
        successMessage="Product group created successfully!"
        onSuccess={onSuccess}
        popupHandlers={popupHandlers}
        extraValues={extraValues}
      />
      
      <MasterPopup
        show={showMasterPopup}
        handleClose={() => setShowMasterPopup(false)}
        onSelect={(master: DSOmaster) => {
          setSelectedMaster(master);
          setShowMasterPopup(false);
        }}
        showAddButton={true}
      />
    </>
  );
};

export default DsoProductGroupCreateModal;