// src/DSO/Pages/CaseStatusMaster/Create.tsx

import React from "react";
import KiduCreateModal, {
  type Field,
} from "../../../../KIDU_COMPONENTS/KiduCreateModal";

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
}


// ── Component ─────────────────────────────────────────────────────────────────

const CaseStatusCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {

  const { handleApiError, assertApiSuccess } = useApiErrorHandler();


  // ── Submit handler ────────────────────────────────────────────────────────

  const handleSubmit = async (formData: Record<string, any>) => {
    console.log("Form Data received:", formData);

    try {
      const payload: Partial<CaseStatus> = {
        caseStatusName: formData.caseStatusName,
        isActive: formData.isActive ?? true,
      };

      console.log("Submitting payload:", payload);

      const result = await CaseStatusService.create(payload);
      console.log("API Response:", result);

      if (result && result.isSucess) {
        await assertApiSuccess(result, "Failed to create Case Status.");
      } else {
        console.error("Full error details:", result);
        throw new Error(
          result?.customMessage || result?.error || "Failed to create Case Status"
        );
      }
    } catch (err: any) {
      console.error("Error in handleSubmit:", err);
      await handleApiError(err, "network");
      throw err;
    }
  };


  return (
    <KiduCreateModal
      show={show}
      onHide={onHide}
      title="Create Case Status"
      subtitle="Add a new Case Status"
      fields={fields}
      onSubmit={handleSubmit}
      successMessage="Case Status created successfully!"
      onSuccess={onSuccess}
    />
  );
};

export default CaseStatusCreateModal;