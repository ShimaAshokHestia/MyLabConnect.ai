import React from "react";
import KiduEditModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduEditModal";
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
  { name: "info",       rules: { type: "textarea", label: "Info",        required: false, minLength: 5, maxLength: 500, colWidth: 12 } },
  { name: "isActive",   rules: { type: "toggle",   label: "Active",                                                     colWidth: 6  } },
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
  recordId: number;
}

// ── Component ─────────────────────────────────────────────────────────────────

const DSODentalOfficeEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {
  const { requireDSOMasterId }               = useCurrentUser();
  const { handleApiError, assertApiSuccess } = useApiErrorHandler();

  // ── Fetch handler ─────────────────────────────────────────────────────────
  const handleFetch = async (id: string | number) => {
    return await DSODentalOfficeService.getById(Number(id));
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
    const payload: Partial<DSODentalOffice> = {
      id:          Number(id),
      officeCode:  formData.officeCode,
      officeName:  formData.officeName,
      info:        formData.info,
      dsoMasterId: dsOMasterId,
      isActive:    formData.isActive ?? true,
    };

    // 3. Call API
    let result: any;
    try {
      result = await DSODentalOfficeService.update(Number(id), payload);
    } catch (err) {
      await handleApiError(err, "network");
      return;
    }

    // 4. Assert success
    await assertApiSuccess(result, "Failed to update Dental Office.");

    return result;
  };

  return (
    <KiduEditModal
      show={show}
      onHide={onHide}
      title="Edit DSO Dental Office"
      subtitle="Update dental office details"
      fields={fields}
      recordId={recordId}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      successMessage="Dental office updated successfully!"
      onSuccess={onSuccess}
      submitButtonText="Update Office"
    />
  );
};

export default DSODentalOfficeEditModal;