// src/DSO/Pages/CaseStatusMaster/Edit.tsx
import React from "react";
import KiduEditModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduEditModal";
import type { CaseStatus } from "../../../Types/CaseStatusMaster/CaseStatus.types";
//import CaseStatusService from "../../Services/CaseStatusMaster/CaseStatus.services";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";
import CaseStatusService from "../../../Services/CaseStatus/CaseStatus.services";


// ── Field definitions ─────────────────────────────────────────────────────────

const fields: Field[] = [
  {
    name: "caseStatusName",
    rules: {
      type: "text",
      label: "Case Status Name",
      required: true,
      minLength: 2,
      maxLength: 200,
      colWidth: 6,
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

const CaseStatusEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {

  const { handleApiError, assertApiSuccess } = useApiErrorHandler();


  // ── Fetch handler — pre-fills the form ───────────────────────────────────

  const handleFetch = async (id: string | number) => {
    try {
      const response = await CaseStatusService.getById(Number(id));
      console.log("Fetch response:", response);
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
      const payload: Partial<CaseStatus> = {
        id: Number(id),
        caseStatusName: formData.caseStatusName,
        isActive: formData.isActive ?? true,
      };

      console.log("Update payload:", payload);

      const result = await CaseStatusService.update(Number(id), payload);
      console.log("Update response:", result);

      if (result && result.isSucess) {
        await assertApiSuccess(result, "Failed to update Case Status.");
        return result;
      } else {
        console.error("Full error details:", result);
        throw new Error(
          result?.customMessage || result?.error || "Failed to update Case Status"
        );
      }
    } catch (err: any) {
      console.error("Error in handleUpdate:", err);
      await handleApiError(err, "network");
      throw err;
    }
  };


  return (
    <KiduEditModal
      show={show}
      onHide={onHide}
      title="Edit Case Status"
      subtitle="Update Case Status details"
      fields={fields}
      recordId={recordId}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      successMessage="Case Status updated successfully!"
      onSuccess={onSuccess}
      submitButtonText="Update Case Status"
      themeColor="#ef0d50"
    />
  );
};

export default CaseStatusEditModal;