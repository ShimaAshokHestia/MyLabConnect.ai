import React from "react";
import KiduCreateModal, {
    type DropdownHandlers,
  type Field,
} from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import LabGroupService from "../../../Services/Masters/Labgroup.services";
import type { LabMaster } from "../../../Types/Masters/Lab.types";
import LabMasterService from "../../../Services/Masters/Lab.services";

// ── Authentication type static options ────────────────────────────────────────
const AUTHENTICATION_TYPE_OPTIONS = [
  { value: 1, label: "Normal" },
  { value: 2, label: "SSO" },
  { value: 3, label: "Basic" },
];

// ── Field definitions ─────────────────────────────────────────────────────────

const fields: Field[] = [
  { name: "labCode",            rules: { type: "text",          label: "Lab Code",            required: true,  maxLength: 50,  colWidth: 6 } },
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
}

// ── Component ─────────────────────────────────────────────────────────────────

const LabMasterCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {

  // ── Dropdown handlers ─────────────────────────────────────────────────────
  // labGroupId  → paginated fetch from LabGroup API
  // authenticationType → static options (no API call needed)
  const dropdownHandlers: DropdownHandlers = {
    labGroupId: {
      paginatedFetch: async (params) => {
        const result = await LabGroupService.getPaginatedList({
          pageNumber:    params.pageNumber,
          pageSize:      params.pageSize,
          searchTerm:    params.searchTerm,
          sortBy:        "",
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

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (formData: Record<string, any>) => {
    const payload: Partial<LabMaster> = {
      labCode:            formData.labCode,
      labName:            formData.labName,
      displayName:        formData.displayName,
      email:              formData.email,
      labGroupId:         formData.labGroupId ? Number(formData.labGroupId) : undefined,
      authenticationType: formData.authenticationType ? Number(formData.authenticationType) : undefined,
      logoforRX:          formData.logoforRX,
      lmsSystem:          formData.lmsSystem,
      isActive:           formData.isActive ?? true,
    };

    await LabMasterService.create(payload);
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