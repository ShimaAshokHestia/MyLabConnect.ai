import React from "react";
import KiduCreateModal, {
  type Field,
} from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import DSOAdditionalServiceService from "../../../Services/Masters/DsoAdditionalService.services";
import type { DSOAdditionalService } from "../../../Types/Masters/DsoAdditionalService.types";
import { useCurrentUser } from "../../../../Services/AuthServices/CurrentUser.services";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";

// ── Field definitions ─────────────────────────────────────────────────────────
//
// dsoMasterId is taken from the session token via requireDSOMasterId(),
// so it is not shown as a form field.
//
const fields: Field[] = [
  {
    name: "serviceName",
    rules: {
      type: "text",
      label: "Service Name",
      required: true,
      minLength: 3,
      maxLength: 200,
      colWidth: 12,
    },
  },
  {
    name: "serviceNotes",
    rules: {
      type: "textarea",
      label: "Service Notes",
      required: false,
      maxLength: 500,
      colWidth: 12,
    },
  },
  {
    name: "isActive",
    rules: {
      type: "toggle",
      label: "Active",
      colWidth: 6,
    },
  },
];

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
const DSOAdditionalServiceCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {
  const { requireDSOMasterId } = useCurrentUser();
  const { handleApiError, assertApiSuccess } = useApiErrorHandler();

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (formData: Record<string, any>) => {
    console.log("Form Data received:", formData);

    try {
      // 1. Get DSOMasterId from token
      let dsoMasterId: number;
      try {
        dsoMasterId = requireDSOMasterId();
        console.log("DSO Master ID:", dsoMasterId);
      } catch (err) {
        console.error("Failed to get DSO Master ID:", err);
        await handleApiError(err, "session");
        return;
      }

      // 2. Build payload
      const payload: Partial<DSOAdditionalService> = {
        serviceName: formData.serviceName,
        serviceNotes: formData.serviceNotes ?? "",
        dsoMasterId: dsoMasterId,
        isActive: formData.isActive ?? true,
      };

      console.log("Submitting payload:", payload);

      // 3. Call API
      const result = await DSOAdditionalServiceService.create(payload);
      console.log("API Response:", result);

      // 4. Assert success
      if (result && result.isSucess) {
        await assertApiSuccess(result, "Failed to create Additional Service.");
      } else {
        console.error("Full error details:", result);
        throw new Error(result?.customMessage || result?.error || "Failed to create additional service");
      }

    } catch (err: any) {
      console.error("Error in handleSubmit:", err);
      await handleApiError(err, "network");
      throw err;
    }
  };

  // ── Handle successful creation ────────────────────────────────────────────
  const handleSuccess = () => {
    console.log("Creation successful, calling onSuccess");
    onSuccess();
  };

  return (
    <KiduCreateModal
      show={show}
      onHide={onHide}
      title="Create Additional Service"
      subtitle="Add a new DSO Additional Service"
      fields={fields}
      onSubmit={handleSubmit}
      successMessage="Additional Service created successfully!"
      onSuccess={handleSuccess}
      themeColor="#ef0d50"
    />
  );
};

export default DSOAdditionalServiceCreateModal;