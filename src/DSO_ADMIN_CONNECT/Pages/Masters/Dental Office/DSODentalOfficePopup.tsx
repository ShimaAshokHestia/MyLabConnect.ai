// src/Pages/Masters/DentalOffice/Popup.tsx

import React from "react";
import KiduSelectPopup from "../../../../KIDU_COMPONENTS/KiduSelectPopup";
import { API_ENDPOINTS } from "../../../../CONSTANTS/API_ENDPOINTS";
import type { DentalOffice } from "../../../Types/Masters/DsoDentalOffice.types";
import DentalOfficeCreateModal from "./Create";

interface Props {
  show: boolean;
  onClose: () => void;
  onSelect: (item: DentalOffice) => void;
  showAddButton?: boolean;
  dsoZoneOptions?: Array<{ value: number; label: string }>;
  dsoMasterOptions?: Array<{ value: number; label: string }>;
}

const DentalOfficePopup: React.FC<Props> = ({
  show,
  onClose,
  onSelect,
  showAddButton = false,
  dsoZoneOptions = [],
  dsoMasterOptions = []
}) => {
  return (
    <KiduSelectPopup<DentalOffice>
      show={show}
      onClose={onClose}
      title="Select Dental Office"
      subtitle="Search and pick a dental office"
      fetchEndpoint={API_ENDPOINTS.DSO_DENTAL_OFFICE.GET_ALL}
      columns={[
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
          key: "city",
          label: "City",
          filterType: "text",
        },
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
      labelKey="officeName" // This ensures the selected item shows the office name
      searchKeys={["officeCode", "officeName", "city", "country"]} // Search by multiple fields
      rowsPerPage={10}
      rowsPerPageOptions={[5, 10, 20, 50]}
      themeColor="#ef0d50"
      multiSelect={false}
      showAddButton={showAddButton}
      AddModalComponent={(props: any) => (
        <DentalOfficeCreateModal
          {...props}
          dsoZoneOptions={dsoZoneOptions}
          dsoMasterOptions={dsoMasterOptions}
        />
      )}
      addButtonLabel="Add Dental Office"
    />
  );
};

export default DentalOfficePopup;