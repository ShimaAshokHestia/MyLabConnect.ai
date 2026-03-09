import React from "react";
import KiduEditModal, {
  type Field,
} from "../../../KIDU_COMPONENTS/KiduEditModal";
import DSOSchemaService from "../../Services/Schema/Schema.services";
import { useCurrentUser } from "../../../Services/AuthServices/CurrentUser.services";
import { useApiErrorHandler } from "../../../Services/AuthServices/APIErrorHandler.services";

// ── Field definitions ─────────────────────────────────────────────────────────
//
// dsoMasterId is taken from the session token via requireDSOMasterId(),
// so it is not shown as a form field.
//
const fields: Field[] = [
  {
    name: "name",
    rules: { type: "text", label: "Schema Name", required: true, maxLength: 100, colWidth: 12 },
  },
  {
    name: "isActive",
    rules: { type: "toggle", label: "Active", colWidth: 6 },
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

const DSOSchemaEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {
  const { requireDSOMasterId }               = useCurrentUser();
  const { handleApiError, assertApiSuccess } = useApiErrorHandler();

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const handleFetch = async (id: string | number) => {
    return await DSOSchemaService.getById(Number(id));
  };

  // ── Update ────────────────────────────────────────────────────────────────
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
    const payload = {
      ...formData,
      id:          Number(id),
      dsoMasterId: dsOMasterId,
      isActive:    formData.isActive ?? true,
    };

    // 3. Call API
    let result: any;
    try {
      result = await DSOSchemaService.update(Number(id), payload);
    } catch (err) {
      await handleApiError(err, "network");
      return;
    }

    // 4. Assert success
    await assertApiSuccess(result, "Failed to update DSO Schema.");

    return result;
  };

  return (
    <KiduEditModal
      show={show}
      onHide={onHide}
      title="Edit Schema"
      subtitle="Update DSO Schema details"
      fields={fields}
      recordId={recordId}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      successMessage="Schema updated successfully!"
      onSuccess={onSuccess}
    />
  );
};

export default DSOSchemaEditModal;