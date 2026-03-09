import React from "react";
import KiduCreateModal, {
  type Field,
} from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import DSORegionService from "../../../Services/Setup/DSORegion.services";
import type { DSORegion } from "../../../Types/Setup/DSORegion.types";
import { useCurrentUser } from "../../../../Services/AuthServices/CurrentUser.services";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";

// ── Field definitions ─────────────────────────────────────────────────────────
//
// dsoMasterId is taken from the session token via requireDSOMasterId(),
// so it is not shown as a form field.
//
const fields: Field[] = [
  {
    name: "name",
    rules: { type: "text", label: "Region Name", required: true, minLength: 3, maxLength: 100, colWidth: 12 },
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
}

// ── Component ─────────────────────────────────────────────────────────────────

const DSORegionCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {
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
    const payload: Partial<DSORegion> = {
      name:        formData.name,
      dsoMasterId: dsOMasterId,
      isActive:    formData.isActive ?? true,
    };

    // 3. Call API
    let result: any;
    try {
      result = await DSORegionService.create(payload);
    } catch (err) {
      await handleApiError(err, "network");
      return;
    }

    // 4. Assert success
    await assertApiSuccess(result, "Failed to create DSO Region.");
  };

  return (
    <KiduCreateModal
      show={show}
      onHide={onHide}
      title="Create Region"
      subtitle="Add a new DSO Region"
      fields={fields}
      onSubmit={handleSubmit}
      successMessage="Region created successfully!"
      onSuccess={onSuccess}
    />
  );
};

export default DSORegionCreateModal;