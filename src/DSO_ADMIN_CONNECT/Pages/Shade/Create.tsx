import React from "react";
import type { Field } from "../../../KIDU_COMPONENTS/KiduCreateModal";
import { useCurrentUser } from "../../../Services/AuthServices/CurrentUser.services";
import { useApiErrorHandler } from "../../../Services/AuthServices/APIErrorHandler.services";
import type { DSOShade } from "../../Types/Shade/Shade.types";
import DSOShadeService from "../../Services/Shade/Shade.services";
import KiduCreateModal from "../../../KIDU_COMPONENTS/KiduCreateModal";
// import KiduCreateModal, {
//   type Field,
// } from "../../../../KIDU_COMPONENTS/KiduCreateModal";
// import DSOShadeService from "../../../Services/Setup/DSOShade.services";
// import type { DSOShade } from "../../../Types/Setup/DSOShade.types";
// import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";
// import { useCurrentUser } from "../../../../Services/AuthServices/CurrentUser.services";

// ── Field definitions ─────────────────────────────────────────────────────────
const fields: Field[] = [
  { 
    name: "name", 
    rules: { 
      type: "text", 
      label: "Shade Name", 
      required: true, 
      minLength: 3, 
      maxLength: 100, 
      colWidth: 12 
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

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
const DSOShadeCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {
  const { requireDSOMasterId } = useCurrentUser();
  const { handleApiError, assertApiSuccess } = useApiErrorHandler();

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (formData: Record<string, any>) => {
    console.log("Form Data received:", formData);

    try {
      // Get DSO Master ID from session (automatically included)
      let dsoMasterId: number;
      try {
        dsoMasterId = requireDSOMasterId();
        console.log("DSO Master ID from session:", dsoMasterId);
      } catch (err) {
        console.error("Failed to get DSO Master ID:", err);
        await handleApiError(err, "session");
        return;
      }

      // Build payload with all required fields
      const payload: Partial<DSOShade> = {
        name: formData.name,
        dsoMasterId: dsoMasterId, // Automatically added from session
        isActive: formData.isActive ?? true,
      };

      console.log("Submitting payload:", payload);

      const result = await DSOShadeService.create(payload);
      console.log("API Response:", result);

      if (result && result.isSucess) {
        await assertApiSuccess(result, "Failed to create Shade.");
      } else {
        console.error("Full error details:", result);
        throw new Error(result?.customMessage || result?.error || "Failed to create shade");
      }

    } catch (err: any) {
      console.error("Error in handleSubmit:", err);
      await handleApiError(err, "network");
      throw err;
    }
  };

  // ── Reset on close ────────────────────────────────────────────────────────
  const handleHide = () => {
    onHide();
  };

  // ── Handle successful creation ────────────────────────────────────────────
  const handleSuccess = () => {
    console.log("Creation successful, calling onSuccess");
    onSuccess();
  };

  return (
    <KiduCreateModal
      show={show}
      onHide={handleHide}
      title="Create Shade"
      subtitle="Add a new DSO Shade"
      fields={fields}
      onSubmit={handleSubmit}
      successMessage="Shade created successfully!"
      onSuccess={handleSuccess}
    />
  );
};

export default DSOShadeCreateModal;