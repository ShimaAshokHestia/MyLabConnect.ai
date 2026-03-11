import React from "react";
import KiduSelectPopup from "../../../KIDU_COMPONENTS/KiduSelectPopup";
import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { DSOSchema } from "../../Types/Schema/Schema.types";
import SchemaCreateModal from "../Schema/DSOSchemaCreateModal";

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  show:          boolean;
  onClose:       () => void;
  onSelect:      (item: DSOSchema) => void;
  showAddButton?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────
const DSOSchemaPopup: React.FC<Props> = ({
  show,
  onClose,
  onSelect,
  showAddButton = false,
}) => {
  return (
    <KiduSelectPopup<DSOSchema>
      show={show}
      onClose={onClose}
      title="Select Schema"
      subtitle="Search and pick a schema"
      fetchEndpoint={API_ENDPOINTS.DSO_SCHEMA.GET_ALL}
      columns={[
        {
          key: "id",
          label: "ID",
        },
        {
          key: "name",
          label: "Schema Name",
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
      labelKey="name"
      searchKeys={["name"]}
      rowsPerPage={10}
      rowsPerPageOptions={[5, 10, 20, 50]}
      themeColor="#ef0d50"
      multiSelect={false}
      showAddButton={showAddButton}
      AddModalComponent={SchemaCreateModal}
      addButtonLabel="Add Schema"
    />
  );
};

export default DSOSchemaPopup;