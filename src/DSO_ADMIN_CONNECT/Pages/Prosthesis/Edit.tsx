import React, {  } from "react";
import KiduEditModal, { type Field } from "../../../KIDU_COMPONENTS/KiduEditModal";
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
  recordId: string | number;
}

// ── Component ─────────────────────────────────────────────────────────────────

const DSOProsthesisTypeEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {
  const { requireDSOMasterId }               = useCurrentUser();
  const { handleApiError, assertApiSuccess } = useApiErrorHandler();

  // ── Fetch handler ─────────────────────────────────────────────────────────
  const handleFetch = async (id: string | number) => {
    return await DSOProsthesisTypeService.getById(Number(id));
  };

  // ── Update handler ────────────────────────────────────────────────────────
  const handleUpdate = async (id: string | number, formData: Record<string, any>) => {
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
      id:          Number(id),
      name:        formData.name,
      dsoMasterId: dsOMasterId,
      isActive:    formData.isActive ?? true,
    };

    // 3. Call API
    let result: any;
    try {
      result = await DSOProsthesisTypeService.update(Number(id), payload);
    } catch (err) {
      await handleApiError(err, "network");
      return;
    }

    // 4. Assert success
    await assertApiSuccess(result, "Failed to update Prosthesis Type.");

    return result;
  };

  return (
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
      submitButtonText="Update Prosthesis Type"
    />
  );
};

export default DSOProsthesisTypeEditModal;