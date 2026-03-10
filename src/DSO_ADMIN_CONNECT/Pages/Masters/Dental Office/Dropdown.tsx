// ─────────────────────────────────────────────────────────────────────────────
// DSODentalOfficeSelectPopup.tsx
// Popup selector for DSO Dental Office — used in other masters that reference dental offices
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import KiduSelectPopup from "../../../../KIDU_COMPONENTS/KiduSelectPopup";
import type { KiduSelectColumn } from "../../../../KIDU_COMPONENTS/KiduSelectPopup";
import { API_ENDPOINTS } from "../../../../CONSTANTS/API_ENDPOINTS";
import type { DSODentalOffice } from "../../../Types/Masters/DsoDentalOffice.types";

const columns: KiduSelectColumn<DSODentalOffice>[] = [
  {
    key: "officeCode",
    label: "Office Code",
    filterType: "text",
  },
  {
    key: "officeName",
    label: "Office Name",
    filterType: "text",
  },
  {
    key: "dsoName",
    label: "DSO Master",
    filterType: "text",
    render: (value: string, row: DSODentalOffice) => (
      <span>{value || `DSO #${row.dsoMasterId}`}</span>
    ),
  },
  {
    key: "info",
    label: "Info",
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
  onSelect: (office: DSODentalOffice) => void;
  showAddButton?: boolean;
  multiSelect?: boolean;
  selectedIds?: (string | number)[];
}

const DSODentalOfficeSelectPopup: React.FC<Props> = ({
  show,
  onClose,
  onSelect,
  showAddButton = false,
  multiSelect = false,
 // selectedIds = [],
}) => {
  
  // If you have a create modal component for DSO Dental Office, import and use it here
  // import DSODentalOfficeCreateModal from "./Create";
  
  return (
    <KiduSelectPopup<DSODentalOffice>
      show={show}
      onClose={onClose}
      title="Select DSO Dental Office"
      subtitle="Search and pick a dental office"
      fetchEndpoint={API_ENDPOINTS.DSO_DENTAL_OFFICE.GET_ALL}
      columns={columns}
      onSelect={onSelect}
      idKey="id"
      labelKey="officeName"
      searchKeys={["officeCode", "officeName", "dsoName", "info"]}
      rowsPerPage={10}
      rowsPerPageOptions={[5, 10, 20, 50]}
      themeColor="#ef0d50"
      multiSelect={multiSelect}
      showAddButton={showAddButton}
      addButtonLabel="Add Dental Office"
      // Uncomment this if you have a create modal component
      // AddModalComponent={DSODentalOfficeCreateModal}
    />
  );
};

export default DSODentalOfficeSelectPopup;