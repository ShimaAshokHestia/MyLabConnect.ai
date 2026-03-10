import React from "react";
import KiduCreateModal, {
  type Field,
} from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import type { DSODentalOffice } from "../../../Types/Masters/DsoDentalOffice.types";
import DSODentalOfficeService from "../../../Services/Masters/DsoDentalOffice.services";
import { useCurrentUser } from "../../../../Services/AuthServices/CurrentUser.services";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";

// ── Field definitions ─────────────────────────────────────────────────────────
//
// dsoMasterId is taken from the session token via requireDSOMasterId(),
// so it is not shown as a form field.
//
const fields: Field[] = [
  { name: "officeCode", rules: { type: "text",     label: "Office Code", required: true,  minLength: 3, maxLength: 50,  colWidth: 6  } },
  { name: "officeName", rules: { type: "text",     label: "Office Name", required: true,  minLength: 3, maxLength: 100, colWidth: 6  } },
  { name: "info",       rules: { type: "textarea", label: "Info",        required: true,  minLength: 5, maxLength: 500, colWidth: 12 } },
  { name: "isActive",   rules: { type: "toggle",   label: "Active",                                                     colWidth: 6  } },
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

const DSODentalOfficeCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {
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
    const payload: Partial<DSODentalOffice> = {
      officeCode:  formData.officeCode,
      officeName:  formData.officeName,
      info:        formData.info,
      dsoMasterId: dsOMasterId,
      isActive:    formData.isActive ?? true,
    };

    // 3. Call API
    let result: any;
    try {
      result = await DSODentalOfficeService.create(payload);
    } catch (err) {
      await handleApiError(err, "network");
      return;
    }

    // 4. Assert success
    await assertApiSuccess(result, "Failed to create Dental Office.");
  };

  return (
    <KiduCreateModal
      show={show}
      onHide={onHide}
      title="Create DSO Dental Office"
      subtitle="Add a new dental office"
      fields={fields}
      onSubmit={handleSubmit}
      successMessage="Dental office created successfully!"
      onSuccess={onSuccess}
    />
  );
};

export default DSODentalOfficeCreateModal;