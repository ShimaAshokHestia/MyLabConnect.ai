import React, { useState, useEffect } from "react";
import KiduEditModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduEditModal";
import DSOMaterialService from "../../../Services/Masters/DsoMaterial.services";
import type { DSOMaterial } from "../../../Types/Masters/DsoMaterial.types";
import type { DSORestoration } from "../../../Types/Restoration/Restoration.types";
import DSORestorationTypePopup from "../../Restoration/DSORestorationTypePopup";
import { useCurrentUser } from "../../../../Services/AuthServices/CurrentUser.services";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";
import toast from "react-hot-toast";

interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
  recordId: number;
}

const fields: Field[] = [
  { name: "name", rules: { type: "text", label: "Material Name", required: true, minLength: 3, maxLength: 100, colWidth: 6 } },
  { name: "dsoRestorationTypeId", rules: { type: "popup", label: "Restoration Type", required: true, colWidth: 6 } },
  { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 6 } },
];

const DSOMaterialEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {
  const { requireDSOMasterId } = useCurrentUser();
  const { handleApiError, assertApiSuccess } = useApiErrorHandler();

  const [selectedRestorationType, setSelectedRestorationType] = useState<DSORestoration | null>(null);
  const [restorationTypeOpen, setRestorationTypeOpen] = useState(false);

  useEffect(() => {
    if (!show) {
      setSelectedRestorationType(null);
    }
  }, [show]);

  const handleFetch = async (id: string | number) => {
    try {
      const response = await DSOMaterialService.getById(Number(id));
      console.log("Fetch Response:", response);
      
      const data = response?.value || response;
      
      // Set the selected restoration type from the fetched data
      if (data?.dsoRestorationTypeId) {
        setSelectedRestorationType({
          id: data.dsoRestorationTypeId,
          name: data.restorationTypeName || `Restoration Type #${data.dsoRestorationTypeId}`,
        } as DSORestoration);
      }
      
      return response;
    } catch (error) {
      console.error("Error in handleFetch:", error);
      throw error;
    }
  };

  const handleUpdate = async (id: string | number, formData: Record<string, any>) => {
    console.log("Update formData:", formData);
    console.log("Selected Restoration Type:", selectedRestorationType);

    if (!selectedRestorationType?.id) {
      toast.error("Please select a restoration type");
      throw new Error("No restoration type selected");
    }

    try {
      // Get DSOMasterId from session
      let dsoMasterId: number;
      try {
        dsoMasterId = requireDSOMasterId();
        console.log("DSO Master ID:", dsoMasterId);
      } catch (err) {
        console.error("Failed to get DSO Master ID:", err);
        await handleApiError(err, "session");
        throw err;
      }

      // Build payload with all required fields
      const payload: Partial<DSOMaterial> = {
        id: Number(id),
        name: formData.name,
        dsoRestorationTypeId: Number(selectedRestorationType.id), // Use selectedRestorationType.id
        dsoMasterId: dsoMasterId,
        isActive: formData.isActive ?? true,
      };

      console.log("Update payload:", payload);

      const result = await DSOMaterialService.update(Number(id), payload);
      console.log("Update response:", result);

      if (result && result.isSucess) {
        await assertApiSuccess(result, "Failed to update Material.");
        return { isSucess: true, value: payload };
      } else {
        console.error("Full error details:", result);
        throw new Error(result?.customMessage || result?.error || "Failed to update material");
      }
    } catch (err: any) {
      console.error("Error in handleUpdate:", err);
      await handleApiError(err, "network");
      throw err;
    }
  };

  const popupHandlers = {
    dsoRestorationTypeId: {
      value: selectedRestorationType?.name ?? "",
      actualValue: selectedRestorationType?.id,
      onOpen: () => setRestorationTypeOpen(true),
      onClear: () => setSelectedRestorationType(null),
    },
  };

  return (
    <>
      <KiduEditModal
        show={show}
        onHide={onHide}
        title="Edit Material"
        subtitle="Update material details"
        fields={fields}
        recordId={recordId}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        popupHandlers={popupHandlers}
        successMessage="Material updated successfully!"
        onSuccess={onSuccess}
        submitButtonText="Update Material"
        themeColor="#ef0d50"
      />

      <DSORestorationTypePopup
        show={restorationTypeOpen}
        onClose={() => setRestorationTypeOpen(false)}
        onSelect={(type) => {
          console.log("Selected restoration type:", type);
          setSelectedRestorationType(type);
          setRestorationTypeOpen(false);
        }}
      />
    </>
  );
};

export default DSOMaterialEditModal;