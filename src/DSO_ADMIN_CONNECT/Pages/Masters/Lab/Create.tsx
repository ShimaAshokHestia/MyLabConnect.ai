// src/Pages/Masters/Lab/Create.tsx

import React from "react";
import KiduCreateModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import LabGroupService from "../../../Services/Masters/Labgroup.services";
import LabMasterService from "../../../Services/Masters/Lab.services";
import type { LabMaster } from "../../../Types/Masters/Lab.types";
import { useCurrentUser } from "../../../../Services/AuthServices/CurrentUser.services";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";

// ── Authentication type static options ────────────────────────────────────────
const AUTHENTICATION_TYPE_OPTIONS = [
  { value: 1, label: "Normal" },
  { value: 2, label: "SSO" },
  { value: 3, label: "Basic" },
];

// ── Field definitions ─────────────────────────────────────────────────────────
const fields: Field[] = [
  { 
    name: "labCode", 
    rules: { 
      type: "text", 
      label: "Lab Code", 
      required: true, 
      minLength: 3, 
      maxLength: 10,
      colWidth: 6 
    } 
  },
  { 
    name: "labName", 
    rules: { 
      type: "text", 
      label: "Lab Name", 
      required: true, 
      minLength: 3, 
      maxLength: 100, 
      colWidth: 6 
    } 
  },
  { 
    name: "displayName", 
    rules: { 
      type: "text", 
      label: "Display Name", 
      required: false, 
      minLength: 3, 
      maxLength: 100, 
      colWidth: 6 
    } 
  },
  { 
    name: "email", 
    rules: { 
      type: "email", 
      label: "Email", 
      required: false, 
      minLength: 3, 
      maxLength: 100, 
      colWidth: 6 
    } 
  },
  { 
    name: "labGroupId", 
    rules: { 
      type: "smartdropdown", 
      label: "Lab Group", 
      required: true, 
      colWidth: 6 
    } 
  },
  { 
    name: "authenticationType", 
    rules: { 
      type: "smartdropdown", 
      label: "Authentication Type", 
      required: true, 
      colWidth: 6 
    } 
  },
  { 
    name: "logoforRX", 
    rules: { 
      type: "text", 
      label: "Logo for RX", 
      required: false, 
      minLength: 3, 
      maxLength: 200, 
      colWidth: 6 
    } 
  },
  { 
    name: "lmsSystem", 
    rules: { 
      type: "text", 
      label: "LMS System", 
      required: false, 
      minLength: 3, 
      maxLength: 100, 
      colWidth: 6 
    } 
  },
  { 
    name: "isActive", 
    rules: { 
      type: "toggle", 
      label: "Active", 
      colWidth: 6 
    } 
  },
];

// ── Dropdown handlers ─────────────────────────────────────────────────────────
const dropdownHandlers = {
  labGroupId: {
    paginatedFetch: async (params: any) => {
      const result = await LabGroupService.getPaginatedList({
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
        searchTerm: params.searchTerm,
        sortBy: "",
        sortDescending: false,
      });
      return { data: result.data, total: result.total };
    },
    mapOption: (row: any) => ({ 
      value: row.id, 
      label: row.name ?? row.groupName ?? String(row.id) 
    }),
    pageSize: 10,
    placeholder: "Select Lab Group...",
  },

  authenticationType: {
    staticOptions: AUTHENTICATION_TYPE_OPTIONS,
    placeholder: "Select Authentication Type...",
  },
};

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
const LabMasterCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {
  const { requireDSOMasterId } = useCurrentUser();
  const { handleApiError, assertApiSuccess } = useApiErrorHandler();

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (formData: Record<string, any>) => {
    // 1. Get DSOMasterId from token
    let dsoMasterId: number;
    try {
      dsoMasterId = requireDSOMasterId();
    } catch (err) {
      await handleApiError(err, "session");
      return;
    }

    // 2. Build payload - WITH dsoMasterId UNCOMMENTED
    const payload: Partial<LabMaster> = {
      labCode: formData.labCode,
      labName: formData.labName,
      displayName: formData.displayName || undefined,
      email: formData.email || undefined,
      labGroupId: formData.labGroupId ? Number(formData.labGroupId) : undefined,
      authenticationType: formData.authenticationType ? Number(formData.authenticationType) : 1,
      logoforRX: formData.logoforRX || undefined,
      lmsSystem: formData.lmsSystem || undefined,
      isActive: formData.isActive ?? true,
      dsoMasterId: dsoMasterId, // UNCOMMENTED - This is critical!
    };

    console.log("Sending payload:", payload);

    // 3. Call API
    let result: any;
    try {
      result = await LabMasterService.create(payload);
      console.log("API Result:", result);
    } catch (err) {
      console.error("API Error:", err);
      await handleApiError(err, "network");
      return;
    }

    // 4. Assert success
    await assertApiSuccess(result, "Failed to create Lab Master.");
  };

  return (
    <KiduCreateModal
      show={show}
      onHide={onHide}
      title="Create Lab"
      subtitle="Add a new Lab Master"
      fields={fields}
      onSubmit={handleSubmit}
      dropdownHandlers={dropdownHandlers}
      successMessage="Lab created successfully!"
      onSuccess={onSuccess}
    />
  );
};

export default LabMasterCreateModal;