// src/DOCTOR_CONNECT/Pages/Analog Case Prescription/LabmasterPopup.tsx

import React from "react";
import KiduSelectPopup from "../../../KIDU_COMPONENTS/KiduSelectPopup";
import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { LabLookupItem } from "../../../Types/Auth/Lookup.types";

export type LabMasterItem = LabLookupItem;

interface Props {
  show: boolean;
  onClose: () => void;
  onSelect: (item: LabMasterItem) => void;
}

const LabMasterPopup: React.FC<Props> = ({ show, onClose, onSelect }) => {
    if (!show) return null; // ← ADD THIS
    return (
  <KiduSelectPopup<LabMasterItem>
    show={show}
    onClose={onClose}
    title="Select Lab"
    subtitle="Search and pick a lab (Order To)"
    fetchEndpoint={API_ENDPOINTS.LOOKUP.GET("lab", 0)}
    columns={[
      { key: "labCode",     label: "Lab Code",     filterType: "text" },
      { key: "labName",     label: "Lab Name",     filterType: "text" },
      { key: "displayName", label: "Display Name", filterType: "text" },
      { key: "lmsSystem",   label: "LMS System",   filterType: "text" },
      {
        key: "isActive",
        label: "Status",
        filterType: "select",
        filterOptions: ["true", "false"],
        render: (value: boolean) => (
          <span className={`kidu-badge kidu-badge--${value ? "active" : "inactive"}`}>
            {value ? "Active" : "Inactive"}
          </span>
        ),
      },
    ]}
    onSelect={onSelect}
    idKey="id"
    labelKey="labName"
    searchKeys={["labCode", "labName", "displayName", "email", "lmsSystem"]}
    rowsPerPage={10}
    rowsPerPageOptions={[5, 10, 20, 50]}
    themeColor="#ef0d50"
    multiSelect={false}
    showAddButton={false}
  />
)}

export default LabMasterPopup;