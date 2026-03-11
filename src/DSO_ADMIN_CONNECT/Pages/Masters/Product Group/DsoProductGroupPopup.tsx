import React from "react";
import KiduSelectPopup from "../../../../KIDU_COMPONENTS/KiduSelectPopup";
import { API_ENDPOINTS } from "../../../../CONSTANTS/API_ENDPOINTS";
import type { DSOProductGroup } from "../../../Types/Masters/DsoProductGroup.types";
import ProductGroupCreateModal from "../Product Group/DsoProductGroupCreateModal";

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  show:          boolean;
  onClose:       () => void;
  onSelect:      (item: DSOProductGroup) => void;
  showAddButton?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────
const DSOProductGroupPopup: React.FC<Props> = ({
  show,
  onClose,
  onSelect,
  showAddButton = false,
}) => {
  return (
    <KiduSelectPopup<DSOProductGroup>
      show={show}
      onClose={onClose}
      title="Select Product Group"
      subtitle="Search and pick a product group"
      fetchEndpoint={API_ENDPOINTS.DSO_PRODUCT_GROUP.GET_ALL}
      columns={[
        {
          key: "code",
          label: "Code",
          filterType: "text",
        },
        {
          key: "name",
          label: "Product Group Name",
          filterType: "text",
        },
        {
          key: "dsoName",
          label: "DSO Master",
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
      labelKey="name"
      searchKeys={["code", "name", "dsoName"]}
      rowsPerPage={10}
      rowsPerPageOptions={[5, 10, 20, 50]}
      themeColor="#ef0d50"
      multiSelect={false}
      showAddButton={showAddButton}
      AddModalComponent={ProductGroupCreateModal}
      addButtonLabel="Add Product Group"
    />
  );
};

export default DSOProductGroupPopup;