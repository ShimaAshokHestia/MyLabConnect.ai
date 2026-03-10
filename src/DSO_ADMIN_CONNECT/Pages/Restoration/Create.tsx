import React, { useState } from "react";
import KiduCreateModal, {
  type Field,
  type PopupHandlers,
} from "../../../KIDU_COMPONENTS/KiduCreateModal";
import type { DSOProsthesisType } from "../../Types/Prosthesis/Prosthesis.types";
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
}

// ── Component ─────────────────────────────────────────────────────────────────
const DSORestorationTypeCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {
  const [selectedProsthesis, setSelectedProsthesis] = useState<DSOProsthesisType | null>(null);
  const [prosthesisOpen, setProsthesisOpen] = useState(false);
  // Removed isSubmitting since KiduCreateModal handles its own submitting state

  const { handleApiError, assertApiSuccess } = useApiErrorHandler();
  const { requireDSOMasterId } = useCurrentUser();

  // ── Popup handlers ────────────────────────────────────────────────────────
  const popupHandlers: PopupHandlers = {
    dsoProthesisTypeId: {
      value: selectedProsthesis?.name ?? "",
      onOpen: () => setProsthesisOpen(true),
      onClear: () => {
        setSelectedProsthesis(null);
      },
    },
  };

  const extraValues = {
    dsoProthesisTypeId: selectedProsthesis?.id ?? null,
  };

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (formData: Record<string, any>) => {
    console.log("Form Data received:", formData);
    console.log("Selected Prosthesis:", selectedProsthesis);

    if (!selectedProsthesis?.id) {
      console.error("No prosthesis selected");
      toast.error("Please select a prosthesis type");
      return;
    }

    try {
      // Get DSO Master ID from user session
      let dsoMasterId: number;
      try {
        dsoMasterId = requireDSOMasterId();
        console.log("DSO Master ID:", dsoMasterId);
      } catch (err) {
        console.error("Failed to get DSO Master ID:", err);
        await handleApiError(err, "session");
        return;
      }

      // Build payload with all required fields
      const payload = {
        name: formData.name,
        dsoProthesisTypeId: Number(selectedProsthesis.id),
        isActive: formData.isActive ?? true,
        dsoMasterId: dsoMasterId,
      };

      console.log("Submitting payload:", payload);

      const result = await DSORestorationTypeService.create(payload);
      console.log("API Response:", result);

      if (result && result.isSucess) {
        await assertApiSuccess(result, "Failed to create Restoration Type.");
      } else {
        console.error("Full error details:", result);
        throw new Error(result?.customMessage || result?.error || "Failed to create restoration type");
      }

    } catch (err: any) {
      console.error("Error in handleSubmit:", err);
      await handleApiError(err, "network");
      throw err;
    }
  };

  // ── Reset on close ────────────────────────────────────────────────────────
  const handleHide = () => {
    setSelectedProsthesis(null);
    onHide();
  };

  // ── Handle successful creation ────────────────────────────────────────────
  const handleSuccess = () => {
    console.log("Creation successful, calling onSuccess");
    setSelectedProsthesis(null);
    onSuccess();
  };

  return (
    <>
      <KiduCreateModal
        show={show}
        onHide={handleHide}
        title="Create Restoration Type"
        subtitle="Add a new DSO Restoration Type"
        fields={fields}
        onSubmit={handleSubmit}
        popupHandlers={popupHandlers}
        extraValues={extraValues}
        successMessage="Restoration Type created successfully!"
        onSuccess={handleSuccess}
      />

      <DSOProsthesisTypePopup
        show={prosthesisOpen}
        onClose={() => setProsthesisOpen(false)}
        onSelect={(prosthesis) => {
          console.log("Selected prosthesis:", prosthesis);
          setSelectedProsthesis(prosthesis);
          setProsthesisOpen(false);
        }}
      />
    </>
  );
};

export default DSORestorationTypeCreateModal;