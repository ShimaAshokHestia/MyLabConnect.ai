import React from "react";
import KiduEditModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduEditModal";
import LabGroupService from "../../../Services/Masters/Labgroup.services";
import LabMasterService from "../../../Services/Masters/Lab.services";
import type { LabMaster } from "../../../Types/Masters/Lab.types";
import type { DropdownHandlers } from "../../../../KIDU_COMPONENTS/KiduCreateModal";


// ── Authentication type static options ────────────────────────────────────────
const AUTHENTICATION_TYPE_OPTIONS = [
  { value: 1, label: "Normal" },
  { value: 2, label: "SSO" },
  { value: 3, label: "Basic" },
];

// ── Field definitions ─────────────────────────────────────────────────────────

const fields: Field[] = [
  { name: "labCode",            rules: { type: "text",          label: "Lab Code",            required: true,  maxLength: 10,  colWidth: 6 } },
  { name: "labName",            rules: { type: "text",          label: "Lab Name",            required: true,  maxLength: 100, colWidth: 6 } },
  { name: "displayName",        rules: { type: "text",          label: "Display Name",        required: false, maxLength: 100, colWidth: 6 } },
  { name: "email",              rules: { type: "email",         label: "Email",               required: false, maxLength: 100, colWidth: 6 } },
  { name: "labGroupId",         rules: { type: "smartdropdown", label: "Lab Group",           required: true,                 colWidth: 6 } },
  { name: "authenticationType", rules: { type: "smartdropdown", label: "Authentication Type", required: true,                 colWidth: 6 } },
  { name: "logoforRX",          rules: { type: "text",          label: "Logo for RX",         required: false, maxLength: 200, colWidth: 6 } },
  { name: "lmsSystem",          rules: { type: "text",          label: "LMS System",          required: false, maxLength: 100, colWidth: 6 } },
  { name: "isActive",           rules: { type: "toggle",        label: "Active",                               colWidth: 6 } },
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  show:      boolean;
  onHide:    () => void;
  onSuccess: () => void;
  recordId:  string | number;
}

// ── Component ─────────────────────────────────────────────────────────────────

const LabMasterEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {

  // ── Dropdown handlers ─────────────────────────────────────────────────────
  // KiduEditModal pre-populates dropdownValues from the fetched record's
  // labGroupId / authenticationType so the correct item shows on open.
  const dropdownHandlers: DropdownHandlers = {
    labGroupId: {
      paginatedFetch: async (params) => {
        const result = await LabGroupService.getPaginatedList({
          pageNumber:     params.pageNumber,
          pageSize:       params.pageSize,
          searchTerm:     params.searchTerm,
          sortBy:         "",
          sortDescending: false,
        });
        return { data: result.data, total: result.total };
      },
      mapOption: (row) => ({ value: row.id, label: row.name ?? row.groupName ?? String(row.id) }),
      pageSize:  10,
      placeholder: "Select Lab Group...",
    },

    authenticationType: {
      staticOptions: AUTHENTICATION_TYPE_OPTIONS,
      placeholder: "Select Authentication Type...",
    },
  };

  // ── Fetch handler ─────────────────────────────────────────────────────────
  const handleFetch = async (id: string | number) => {
    return await LabMasterService.getById(Number(id));
  };

  // ── Update handler ────────────────────────────────────────────────────────
  const handleUpdate = async (id: string | number, formData: Record<string, any>) => {
    const payload: Partial<LabMaster> = {
      id:                 Number(id),
      labCode:            formData.labCode,
      labName:            formData.labName,
      displayName:        formData.displayName,
      email:              formData.email,
      labGroupId:         formData.labGroupId         ? Number(formData.labGroupId)         : undefined,
      authenticationType: formData.authenticationType ? Number(formData.authenticationType) : undefined,
      logoforRX:          formData.logoforRX,
      lmsSystem:          formData.lmsSystem,
      isActive:           formData.isActive ?? true,
    };

    await LabMasterService.update(Number(id), payload);
    return { isSucess: true, value: payload };
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