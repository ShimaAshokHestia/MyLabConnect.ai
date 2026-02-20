// DSOmasterSelectPopup.tsx
// Entity wrapper — DSO Master picker
// Demonstrates: filterType on columns, showAddButton, rowsPerPageOptions
// Place in: src/DSO/Components/Master/DSOmaster/DSOmasterSelectPopup.tsx

import React from "react";
import type { DSOmaster } from "../../Types/Master/Master.types";
import type { KiduSelectColumn } from "../../../KIDU_COMPONENTS/KiduSelectPopup";
import KiduSelectPopup from "../../../KIDU_COMPONENTS/KiduSelectPopup";
import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
// Uncomment when you want the "+ Add" button inside the picker:
// import DSOmasterCreateModal from "./Create";

interface DSOmasterSelectPopupProps {
  show: boolean;
  onClose: () => void;
  onSelect: (master: DSOmaster) => void;
  /** Show "+ Add DSO Master" button inside the picker. Default: false */
  showAddButton?: boolean;
}

// ── Column definitions with per-column filter config ─────────────────────────
//
// filterType: "text"   → free-text input under that column
// filterType: "select" → dropdown; requires filterOptions array
// (no filterType)      → column is shown in the table but not filterable
//
const columns: KiduSelectColumn<DSOmaster>[] = [
  {
    key: "id",
    label: "ID",
    // no filterType → not filterable (ID is searched globally anyway)
  },
  {
    key: "name",
    label: "Name",
    filterType: "text",           // ← free-text filter for Name
  },
  {
    key: "description",
    label: "Description",
    filterType: "text",           // ← free-text filter for Description
  },
  {
    key: "isActive",
    label: "Status",
    filterType: "select",         // ← dropdown filter
    filterOptions: ["true", "false"],   // raw string values from the data
    render: (value: boolean) => (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: "2px 9px", borderRadius: 20,
        fontSize: "0.69rem", fontWeight: 700, letterSpacing: "0.2px",
        background: value ? "#10b98118" : "#ef444418",
        color:      value ? "#059669"   : "#dc2626",
      }}>
        <span style={{
          width: 5, height: 5, borderRadius: "50%",
          background: value ? "#10b981" : "#ef4444",
          display: "inline-block", flexShrink: 0,
        }} />
        {value ? "Active" : "Inactive"}
      </span>
    ),
  },
];

const DSOmasterSelectPopup: React.FC<DSOmasterSelectPopupProps> = ({
  show,
  onClose,
  onSelect,
  showAddButton = false,
}) => (
  <KiduSelectPopup<DSOmaster>
    show={show}
    onClose={onClose}
    title="Select DSO Master"
    subtitle="Search, filter and pick a master record"
    fetchEndpoint={API_ENDPOINTS.DSO_MASTER.GET_ALL}
    columns={columns}
    onSelect={onSelect}
    idKey="id"
    labelKey="name"                       // pill shows name only
    searchKeys={["name", "description"]}  // global search scope
    rowsPerPage={10}                      // default rows shown
    rowsPerPageOptions={[5, 10, 20, 50]}  // footer selector options
    themeColor="#ef0d50"
    multiSelect={false}                   // single-select; flip to true for multi
    showAddButton={showAddButton}
    addButtonLabel="Add DSO Master"
    // AddModalComponent={DSOmasterCreateModal}  ← uncomment to enable inline-add
  />
);

export default DSOmasterSelectPopup;