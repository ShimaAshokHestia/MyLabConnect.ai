import React, { useState, useEffect } from "react";
import type { Field } from "../../../KIDU_COMPONENTS/KiduEditModal";
import type { DSOmaster } from "../../../ADMIN/Types/Master/Master.types";
import DSOProsthesisTypeService from "../../Services/Prosthesis/Prosthesis.services";
import DSOmasterService from "../../../ADMIN/Services/Master/Master.services";
import type { DSOProsthesisType } from "../../Types/Prosthesis/Prosthesis.types";
import KiduEditModal from "../../../KIDU_COMPONENTS/KiduEditModal";
import MasterPopup from "../../../ADMIN/Pages/Master/MasterPopup";

// Define the expected response type from services
interface ApiResponse<T> {
  isSucess?: boolean;
  isSuccess?: boolean;
  value?: T;
  data?: T;
  message?: string;
  error?: string;
  customMessage?: string;
}

interface Props {
  show:      boolean;
  onHide:    () => void;
  onSuccess: () => void;
  recordId:  string | number;
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

const DSOProsthesisTypeEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {
  const [showMasterPopup, setShowMasterPopup] = useState(false);
  const [selectedMaster, setSelectedMaster] = useState<DSOmaster | null>(null);

  // Reset selection when modal closes
  useEffect(() => {
    if (!show) {
      setSelectedMaster(null);
    }
  }, [show]);

  const handleFetch = async (id: string | number): Promise<ApiResponse<DSOProsthesisType>> => {
    try {
      const response = await DSOProsthesisTypeService.getById(Number(id)) as ApiResponse<DSOProsthesisType>;
      
      // Handle different response structures
      const prosthesisType = response?.value || response?.data || response as DSOProsthesisType;
      
      console.log("Fetched prosthesis type:", prosthesisType); // Debug log
      
      // Fetch related master data if dsoMasterId exists
      if (prosthesisType?.dsoMasterId) {
        try {
          const masterResponse = await DSOmasterService.getById(prosthesisType.dsoMasterId) as ApiResponse<DSOmaster>;
          const master = masterResponse?.value || masterResponse?.data || masterResponse as DSOmaster;
          setSelectedMaster(master);
          console.log("Fetched master:", master); // Debug log
        } catch (error) {
          console.error("Error fetching master:", error);
        }
      }
      
      // Return in the format expected by KiduEditModal
      return {
        isSucess: true,
        value: prosthesisType
      };
    } catch (error: any) {
      console.error("Error fetching prosthesis type:", error);
      return {
        isSucess: false,
        error: error.message || "Failed to fetch data"
      };
    }
  };

  const handleUpdate = async (id: string | number, formData: Record<string, any>): Promise<ApiResponse<DSOProsthesisType>> => {
    try {
      if (!selectedMaster) {
        throw new Error("Please select a DSO Master");
      }

      const payload: Partial<DSOProsthesisType> = {
        id: Number(id),
        name: formData.name,
        dsoMasterId: selectedMaster.id,
        isActive: formData.isActive ?? true,
      };

      console.log("Update payload:", payload); // Debug log
      
       await DSOProsthesisTypeService.update(Number(id), payload) as ApiResponse<DSOProsthesisType>;
      
      return {
        isSucess: true,
        value: payload as DSOProsthesisType
      };
    } catch (error: any) {
      console.error("Error updating prosthesis type:", error);
      return {
        isSucess: false,
        error: error.message || "Failed to update data"
      };
    }
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
      <KiduEditModal
        show={show}
        onHide={onHide}
        title="Edit Prosthesis Type"
        subtitle="Update DSO Prosthesis Type details"
        fields={fields}
        recordId={recordId}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        successMessage="Prosthesis Type updated successfully!"
        onSuccess={onSuccess}
        popupHandlers={popupHandlers}
        submitButtonText="Update Prosthesis Type"
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

export default DSOProsthesisTypeEditModal;