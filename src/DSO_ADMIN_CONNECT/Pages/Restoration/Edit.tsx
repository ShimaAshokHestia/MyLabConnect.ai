import React, { useState, useEffect } from "react";
import KiduEditModal, { type Field } from "../../../KIDU_COMPONENTS/KiduEditModal";
import type { DSOProsthesisType } from "../../Types/Prosthesis/Prosthesis.types";
import type { DSORestoration } from "../../Types/Restoration/Restoration.types";
import DSORestorationTypeService from "../../Services/Restoration/Restoration.services";
import DSOProsthesisTypePopup from "../Prosthesis/ProsthesisTypePopup";
import { useApiErrorHandler } from "../../../Services/AuthServices/APIErrorHandler.services";
import { useCurrentUser } from "../../../Services/AuthServices/CurrentUser.services";
import toast from "react-hot-toast";

// ── Field definitions ─────────────────────────────────────────────────────────
const fields: Field[] = [
  { name: "name", rules: { type: "text", label: "Restoration Name", required: true, minLength: 3, maxLength: 100, colWidth: 12 } },
  { name: "dsoProthesisTypeId", rules: { type: "popup", label: "Prosthesis Type", required: true, colWidth: 6 } },
  { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 6 } },
];

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
  recordId: string | number;
}

// ── Component ─────────────────────────────────────────────────────────────────
const DSORestorationTypeEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {
  const [selectedProsthesis, setSelectedProsthesis] = useState<DSOProsthesisType | null>(null);
  const [prosthesisOpen, setProsthesisOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { handleApiError, assertApiSuccess } = useApiErrorHandler();
  const { requireDSOMasterId } = useCurrentUser(); // This gives us the DSO Master ID from auth

  useEffect(() => {
    if (!show) {
      setSelectedProsthesis(null);
    }
  }, [show]);

  // ── Fetch handler — pre-fills the popup pill ──────────────────────────────
  const handleFetch = async (id: string | number) => {
    try {
      const response = await DSORestorationTypeService.getById(Number(id));
      console.log("Fetch response:", response);
      
      const data = response?.value ?? response?.data ?? response;

      if (data?.dsoProthesisTypeId) {
        // Create a prosthesis object from the fetched data
        setSelectedProsthesis({
          id: data.dsoProthesisTypeId,
          name: data.dsoProthesisname || `Prosthesis #${data.dsoProthesisTypeId}`,
        } as DSOProsthesisType);
      }

      return response;
    } catch (error) {
      console.error("Error in handleFetch:", error);
      throw error;
    }
  };

  // ── Update handler ────────────────────────────────────────────────────────
  const handleUpdate = async (id: string | number, formData: Record<string, any>) => {
    console.log("Update formData:", formData);
    console.log("Selected Prosthesis:", selectedProsthesis);

    if (!selectedProsthesis?.id) {
      toast.error("Please select a prosthesis type");
      throw new Error("No prosthesis selected");
    }

    setIsSubmitting(true);

    try {
      // Get DSO Master ID from user session using the auth service
      let dsoMasterId: number;
      try {
        dsoMasterId = requireDSOMasterId(); // This comes from useCurrentUser hook
        console.log("DSO Master ID from auth:", dsoMasterId);
      } catch (err) {
        console.error("Failed to get DSO Master ID:", err);
        await handleApiError(err, "session");
        setIsSubmitting(false);
        throw err;
      }

      // Build payload with all required fields including dsoMasterId from auth
      const payload: Partial<DSORestoration> = {
        id: Number(id),
        name: formData.name,
        dsoProthesisTypeId: Number(selectedProsthesis.id),
        isActive: formData.isActive ?? true,
        dsoMasterId: dsoMasterId,
      };

      console.log("Update payload with DSO Master ID:", payload);

      const result = await DSORestorationTypeService.update(Number(id), payload);
      console.log("Update response:", result);

      // Check if the response indicates success
      if (result && result.isSucess) {
        await assertApiSuccess(result, "Failed to update Restoration Type.");
        return result;
      } else {
        console.error("Full error details:", result);
        throw new Error(result?.customMessage || result?.error || "Failed to update restoration type");
      }
    } catch (err: any) {
      console.error("Error in handleUpdate:", err);
      throw err; // Re-throw to let the modal show the error once
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Popup handlers ────────────────────────────────────────────────────────
  const popupHandlers = {
    dsoProthesisTypeId: {
      value: selectedProsthesis?.name ?? "",
      actualValue: selectedProsthesis?.id,
      onOpen: () => setProsthesisOpen(true),
      onClear: () => setSelectedProsthesis(null),
    },
  };

  return (
    <>
      <KiduEditModal
        show={show}
        onHide={onHide}
        title="Edit Restoration Type"
        subtitle="Update DSO Restoration Type details"
        fields={fields}
        recordId={recordId}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        popupHandlers={popupHandlers}
        successMessage="Restoration Type updated successfully!"
        onSuccess={onSuccess}
        submitButtonText="Update Restoration Type"
        themeColor="#ef0d50"
      />

      <DSOProsthesisTypePopup
        show={prosthesisOpen}
        onClose={() => setProsthesisOpen(false)}
        onSelect={(prosthesis) => {
          console.log("Selected prosthesis for edit:", prosthesis);
          setSelectedProsthesis(prosthesis);
          setProsthesisOpen(false);
        }}
      />
    </>
  );
};

export default DSORestorationTypeEditModal;