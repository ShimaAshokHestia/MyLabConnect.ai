// src/DOCTOR_CONNECT/Pages/Analog Case Prescription/DentalOfficePopup.tsx

import React from "react";
import KiduSelectPopup from "../../../KIDU_COMPONENTS/KiduSelectPopup";
import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { PracticeLookupItem } from "../../../Types/Auth/Lookup.types";

export type DentalOfficeItem = PracticeLookupItem;

interface Props {
  show: boolean;
  onClose: () => void;
  onSelect: (item: DentalOfficeItem) => void;
  /**
   * When provided: MODE 1 — uses pre-loaded doctor-filtered offices.
   * When omitted:  MODE 2 — fetches all practices from lookup endpoint.
   */
  offices?: DentalOfficeItem[];
  loading?: boolean;
}

const DentalOfficePopup: React.FC<Props> = ({
  show,
  onClose,
  onSelect,
  offices,
  loading = false,
}) => {
   if (!show) return null; // ← ADD THIS
   return (
  <KiduSelectPopup<DentalOfficeItem>
    show={show}
    onClose={onClose}
    title="Select Practice"
    subtitle="Choose the practice / dental office for this case"
    // If doctor-filtered offices are pre-loaded, use them (MODE 1).
    // Otherwise fall back to full lookup (MODE 2).
    {...(offices !== undefined
      ? { data: offices, loading }
      : { fetchEndpoint: API_ENDPOINTS.LOOKUP.GET("practice", 0) }
    )}
    columns={[
      { key: "officeName", label: "Office Name", filterType: "text" },
      { key: "officeCode", label: "Code",        filterType: "text" },
      { key: "address",    label: "Address",     filterType: "text" },
      { key: "city",       label: "City",        filterType: "text" },
      { key: "postCode",   label: "Post Code",   filterType: "text" },
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
    labelKey="officeName"
    searchKeys={["officeName", "officeCode", "address", "city", "postCode"]}
    rowsPerPage={10}
    rowsPerPageOptions={[5, 10, 20]}
    themeColor="#ef0d50"
    multiSelect={false}
    showAddButton={false}
  />
)};

export default DentalOfficePopup;