import React from "react";
import KiduSelectPopup from "../../../../KIDU_COMPONENTS/KiduSelectPopup";
import { API_ENDPOINTS } from "../../../../CONSTANTS/API_ENDPOINTS";
import type { DSOZone } from "../../../Types/Setup/DsoZone.types";
import ZoneCreateModal from "../Zone/DSOZoneCreateModal";

interface Props {
  show: boolean;
  onClose: () => void;
  onSelect: (item: DSOZone) => void;
  showAddButton?: boolean;
}

const DSOZonePopup: React.FC<Props> = ({
  show,
  onClose,
  onSelect,
  showAddButton = false,
}) => {
  return (
    <KiduSelectPopup<DSOZone>
      show={show}
      onClose={onClose}
      title="Select Zone"
      subtitle="Search and pick a zone"
      fetchEndpoint={API_ENDPOINTS.DSO_ZONE.GET_ALL}
      columns={[
        {
          key: "name", // Only show name column, not ID
          label: "Zone Name",
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
      labelKey="name" // This ensures the selected item shows only the name
      searchKeys={["name"]} // Search only by name
      rowsPerPage={10}
      rowsPerPageOptions={[5, 10, 20, 50]}
      themeColor="#ef0d50"
      multiSelect={false}
      showAddButton={showAddButton}
      AddModalComponent={ZoneCreateModal}
      addButtonLabel="Add Zone"
    />
  );
};

export default DSOZonePopup;