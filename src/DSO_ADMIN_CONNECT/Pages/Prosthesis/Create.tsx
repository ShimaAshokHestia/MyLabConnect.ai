import React, { useState } from "react";
import type { Field } from "../../../KIDU_COMPONENTS/KiduCreateModal";
import type { DSOmaster } from "../../../ADMIN/Types/Master/Master.types";
import type { DSOProsthesisType } from "../../Types/Prosthesis/Prosthesis.types";
import DSOProsthesisTypeService from "../../Services/Prosthesis/Prosthesis.services";
import KiduCreateModal from "../../../KIDU_COMPONENTS/KiduCreateModal";
import MasterPopup from "../../../ADMIN/Pages/Master/MasterPopup";


interface Props {
  show:      boolean;
  onHide:    () => void;
  onSuccess: () => void;
}

const fields: Field[] = [
  { 
    name: "name", 
    rules: { 
      type: "text", 
      label: "Prosthesis Type Name", 
      required: true, 
      maxLength: 100, 
      colWidth: 12 
    } 
  },
  { 
    name: "dsoMasterId", 
    rules: { 
      type: "popup", 
      label: "DSO Master", 
      required: true, 
      colWidth: 6 
    } 
  },
  { 
    name: "isActive", 
    rules: { 
      type: "toggle", 
      label: "Active", 
      colWidth: 6 
    } 
  },
];

const DSOProsthesisTypeCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {
  const [showMasterPopup, setShowMasterPopup] = useState(false);
  const [selectedMaster, setSelectedMaster] = useState<DSOmaster | null>(null);

  const handleSubmit = async (formData: Record<string, any>) => {
    // Validate selection
    if (!selectedMaster) {
      throw new Error("Please select a DSO Master");
    }

    const payload: Partial<DSOProsthesisType> = {
      name: formData.name,
      dsoMasterId: selectedMaster.id,
      isActive: formData.isActive ?? true,
    };

    console.log("Create payload:", payload); // Debug log
    await DSOProsthesisTypeService.create(payload);
  };

  const popupHandlers = {
    dsoMasterId: {
      value: selectedMaster?.name || "",
      actualValue: selectedMaster?.id,
      onOpen: () => setShowMasterPopup(true)
    }
  };

  return (
    <>
      <KiduCreateModal
        show={show}
        onHide={onHide}
        title="Create Prosthesis Type"
        subtitle="Add new DSO Prosthesis Type"
        fields={fields}
        onSubmit={handleSubmit}
        successMessage="Prosthesis Type created successfully!"
        onSuccess={onSuccess}
        popupHandlers={popupHandlers}
      />
      
      <MasterPopup
        show={showMasterPopup}
        handleClose={() => setShowMasterPopup(false)}
        onSelect={(master) => {
          setSelectedMaster(master);
          setShowMasterPopup(false);
        }}
        showAddButton={true}
      />
    </>
  );
};

export default DSOProsthesisTypeCreateModal;