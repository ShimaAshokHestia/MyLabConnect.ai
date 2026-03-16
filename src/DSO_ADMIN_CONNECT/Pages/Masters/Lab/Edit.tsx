// src/Pages/Masters/Lab/Edit.tsx

import React from "react";
import KiduEditModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduEditModal";
import LabGroupService from "../../../Services/Masters/Labgroup.services";
import LabMasterService from "../../../Services/Masters/Lab.services";
import type { LabMaster } from "../../../Types/Masters/Lab.types";
import type { DropdownHandlers } from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services"; // Removed useCurrentUser

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
      colWidth: 6,
      disabled: true
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
const dropdownHandlers: DropdownHandlers = {
  labGroupId: {
    paginatedFetch: async (params) => {
      const result = await LabGroupService.getPaginatedList({
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
        searchTerm: params.searchTerm,
        sortBy: "",
        sortDescending: false,
      });
      return { data: result.data, total: result.total };
    },
    mapOption: (row) => ({ 
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
  recordId: string | number;
}

// ── Component ─────────────────────────────────────────────────────────────────
const LabMasterEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {
  const { handleApiError, assertApiSuccess } = useApiErrorHandler(); // Removed useCurrentUser

  // ── Fetch handler ─────────────────────────────────────────────────────────
  const handleFetch = async (id: string | number) => {
    return await LabMasterService.getById(Number(id));
  };

  // ── Update handler ────────────────────────────────────────────────────────
  const handleUpdate = async (id: string | number, formData: Record<string, any>) => {
    // Build payload - NO dsoMasterId
    const payload: Partial<LabMaster> = {
      id: Number(id),
      labCode: formData.labCode,
      labName: formData.labName,
      displayName: formData.displayName || undefined,
      email: formData.email || undefined,
      labGroupId: formData.labGroupId ? Number(formData.labGroupId) : undefined,
      authenticationType: formData.authenticationType ? Number(formData.authenticationType) : 1,
      logoforRX: formData.logoforRX || undefined,
      lmsSystem: formData.lmsSystem || undefined,
      isActive: formData.isActive ?? true,
    };

    console.log("Update payload:", payload);

    // Call API
    let result: any;
    try {
      result = await LabMasterService.update(Number(id), payload);
      console.log("Update result:", result);
    } catch (err) {
      console.error("Update error:", err);
      await handleApiError(err, "network");
      return;
    }

    // Assert success
    await assertApiSuccess(result, "Failed to update Lab Master.");

    return result;
  };

  return (
    <KiduEditModal
      show={show}
      onHide={onHide}
      title="Edit Lab"
      subtitle="Update Lab Master details"
      fields={fields}
      recordId={recordId}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      dropdownHandlers={dropdownHandlers}
      successMessage="Lab updated successfully!"
      onSuccess={onSuccess}
      submitButtonText="Update Lab"
    />
  );
};

export default LabMasterEditModal;