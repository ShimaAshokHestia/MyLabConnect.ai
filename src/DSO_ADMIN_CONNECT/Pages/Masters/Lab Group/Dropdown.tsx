// ─────────────────────────────────────────────────────────────────────────────
// LabGroupSelectPopup.tsx
// Popup selector for Lab Group — used in LabMaster Create/Edit
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import KiduSelectPopup from "../../../../KIDU_COMPONENTS/KiduSelectPopup";
import type { KiduSelectColumn } from "../../../../KIDU_COMPONENTS/KiduSelectPopup";
import { API_ENDPOINTS } from "../../../../CONSTANTS/API_ENDPOINTS";
import type { LabGroup } from "../../../Types/Masters/Labgroup.types";

const columns: KiduSelectColumn<LabGroup>[] = [
  {
    key: "code",
    label: "Code",
    filterType: "text",
  },
  {
    key: "name",
    label: "Lab Group Name",
    filterType: "text",
  },
  {
    key: "isActive",
    label: "Status",
    filterType: "select",
    filterOptions: ["true", "false"],
    render: (value: boolean) => (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: "2px 9px", borderRadius: 20,
        fontSize: "0.69rem", fontWeight: 700,
        background: value ? "#10b98118" : "#ef444418",
        color:      value ? "#059669"   : "#dc2626",
      }}>
        <span style={{
          width: 5, height: 5, borderRadius: "50%",
          background: value ? "#10b981" : "#ef4444",
          display: "inline-block",
        }} />
        {value ? "Active" : "Inactive"}
      </span>
    ),
  },
];

interface Props {
  show: boolean;
  onClose: () => void;
  onSelect: (group: LabGroup) => void;
  showAddButton?: boolean;
}

const LabGroupSelectPopup: React.FC<Props> = ({
  show,
  onClose,
  onSelect,
  showAddButton = false,
}) => (
  <KiduSelectPopup<LabGroup>
    show={show}
    onClose={onClose}
    title="Select Lab Group"
    subtitle="Search and pick a lab group"
    fetchEndpoint={API_ENDPOINTS.LAB_GROUP.GET_ALL}
    columns={columns}
    onSelect={onSelect}
    idKey="id"
    labelKey="name"
    searchKeys={["code", "name"]}
    rowsPerPage={10}
    rowsPerPageOptions={[5, 10, 20, 50]}
    themeColor="#ef0d50"
    multiSelect={false}
    showAddButton={showAddButton}
    addButtonLabel="Add Lab Group"
  />
);

export default LabGroupSelectPopup;