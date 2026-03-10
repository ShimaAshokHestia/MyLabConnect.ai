import React from "react";
import KiduCreateModal, {
  type Field,
} from "../../../KIDU_COMPONENTS/KiduCreateModal";
import DSOProsthesisTypeService from "../../Services/Prosthesis/Prosthesis.services";
import type { DSOProsthesisType } from "../../Types/Prosthesis/Prosthesis.types";
import { useCurrentUser } from "../../../Services/AuthServices/CurrentUser.services";
import { useApiErrorHandler } from "../../../Services/AuthServices/APIErrorHandler.services";

// ── Field definitions ─────────────────────────────────────────────────────────
//
// dsoMasterId is taken from the session token via requireDSOMasterId(),
// so it is not shown as a form field.
//
const fields: Field[] = [
  { name: "name",     rules: { type: "text",   label: "Prosthesis Type Name", required: true, minLength: 3, maxLength: 100, colWidth: 12 } },
  { name: "isActive", rules: { type: "toggle", label: "Active",               colWidth: 6 } },
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

const DSOProsthesisTypeCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {
  const { requireDSOMasterId }               = useCurrentUser();
  const { handleApiError, assertApiSuccess } = useApiErrorHandler();

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (formData: Record<string, any>) => {
    // 1. Get DSOMasterId from token
    let dsOMasterId: number;
    try {
      dsOMasterId = requireDSOMasterId();
    } catch (err) {
      await handleApiError(err, "session");
      return;
    }

    // 2. Build payload
    const payload: Partial<DSOProsthesisType> = {
      name:        formData.name,
      dsoMasterId: dsOMasterId,
      isActive:    formData.isActive ?? true,
    };

    // 3. Call API
    let result: any;
    try {
      result = await DSOProsthesisTypeService.create(payload);
    } catch (err) {
      await handleApiError(err, "network");
      return;
    }

    // 4. Assert success
    await assertApiSuccess(result, "Failed to create Prosthesis Type.");
  };

  return (
    <KiduCreateModal
      show={show}
      onHide={onHide}
      title="Create Prosthesis Type"
      subtitle="Add a new DSO Prosthesis Type"
      fields={fields}
      onSubmit={handleSubmit}
      successMessage="Prosthesis Type created successfully!"
      onSuccess={onSuccess}
    />
  );
};

export default DSOProsthesisTypeCreateModal;