import React from "react";
import KiduEditModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduEditModal";
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
  recordId: string | number;
}

// ── Component ─────────────────────────────────────────────────────────────────
const DSOAdditionalServiceEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {
  const { requireDSOMasterId } = useCurrentUser();
  const { handleApiError, assertApiSuccess } = useApiErrorHandler();

  // ── Fetch handler ─────────────────────────────────────────────────────────
  const handleFetch = async (id: string | number) => {
    try {
      console.log("Fetching additional service for ID:", id);
      const response = await DSOAdditionalServiceService.getById(Number(id));
      console.log("Fetch Response:", response);
      return response;
    } catch (error) {
      console.error("Error in handleFetch:", error);
      throw error;
    }
  };

  // ── Update handler ────────────────────────────────────────────────────────
  const handleUpdate = async (id: string | number, formData: Record<string, any>) => {
    console.log("Update formData:", formData);

    try {
      // 1. Get DSOMasterId from token
      let dsoMasterId: number;
      try {
        dsoMasterId = requireDSOMasterId();
        console.log("DSO Master ID:", dsoMasterId);
      } catch (err) {
        console.error("Failed to get DSO Master ID:", err);
        await handleApiError(err, "session");
        throw err;
      }

      // 2. Build payload
      const payload: Partial<DSOAdditionalService> = {
        id: Number(id),
        serviceName: formData.serviceName,
        serviceNotes: formData.serviceNotes ?? "",
        dsoMasterId: dsoMasterId,
        isActive: formData.isActive ?? true,
      };

      console.log("Update payload:", payload);

      // 3. Call API
      const result = await DSOAdditionalServiceService.update(Number(id), payload);
      console.log("Update response:", result);

      // 4. Assert success
      if (result && result.isSucess) {
        await assertApiSuccess(result, "Failed to update Additional Service.");
        return { isSucess: true, value: payload };
      } else {
        console.error("Full error details:", result);
        throw new Error(result?.customMessage || result?.error || "Failed to update additional service");
      }
    } catch (err: any) {
      console.error("Error in handleUpdate:", err);
      throw err;
    }
  };

  return (
    <KiduEditModal
      show={show}
      onHide={onHide}
      title="Edit Additional Service"
      subtitle="Update DSO Additional Service details"
      fields={fields}
      recordId={recordId}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      successMessage="Additional Service updated successfully!"
      onSuccess={onSuccess}
      submitButtonText="Update Service"
      themeColor="#ef0d50"
    />
  );
};

export default DSOAdditionalServiceEditModal;