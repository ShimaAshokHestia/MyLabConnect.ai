import React from "react";
import KiduCreateModal, {
  type Field,
} from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import DSOZoneService from "../../../Services/Setup/DsoZone.services";
import type { DSOZone } from "../../../Types/Setup/DsoZone.types";
import { useCurrentUser } from "../../../../Services/AuthServices/CurrentUser.services";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";

// ── Field definitions ─────────────────────────────────────────────────────────
//
// dsoMasterId is no longer a popup field — it is taken from the session token
// via useCurrentUser().requireDSOMasterId(), exactly like DSODoctor does.
//
const fields: Field[] = [
  {
    name: "name",
    rules: { type: "text", label: "Zone Name", required: true, maxLength: 100, colWidth: 12 },
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

const DSOZoneCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {
  const { requireDSOMasterId }               = useCurrentUser();
  const { handleApiError, assertApiSuccess } = useApiErrorHandler();

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (formData: Record<string, any>) => {
    // 1. Get DSOMasterId from token (throws + shows error if missing)
    let dsOMasterId: number;
    try {
      dsOMasterId = requireDSOMasterId();
    } catch (err) {
      await handleApiError(err, "session");
      return;
    }

    // 2. Build payload
    const payload: Partial<DSOZone> = {
      name:        formData.name,
      dsoMasterId: dsOMasterId,
      isActive:    formData.isActive ?? true,
    };

    // 3. Call API
    let result: any;
    try {
      result = await DSOZoneService.create(payload);
    } catch (err) {
      await handleApiError(err, "network");
      return;
    }

    // 4. Assert success (shows toast + Swal and throws on failure)
    await assertApiSuccess(result, "Failed to create DSO Zone.");
  };

  return (
    <KiduCreateModal
      show={show}
      onHide={onHide}
      title="Create Zone"
      subtitle="Add a new DSO Zone"
      fields={fields}
      onSubmit={handleSubmit}
      successMessage="Zone created successfully!"
      onSuccess={onSuccess}
    />
  );
};

export default DSOZoneCreateModal;