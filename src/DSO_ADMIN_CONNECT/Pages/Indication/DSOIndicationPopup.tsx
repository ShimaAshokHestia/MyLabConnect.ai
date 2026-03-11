import React from "react";
import KiduSelectPopup from "../../../KIDU_COMPONENTS/KiduSelectPopup";
import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { DSOIndication } from "../../Types/Setup/DSOIndication.types";
import IndicationCreateModal from "../Indication/DSOIndicationCreateModal";

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  show:          boolean;
  onClose:       () => void;
  onSelect:      (item: DSOIndication) => void;
  showAddButton?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────
const DSOIndicationPopup: React.FC<Props> = ({
  show,
  onClose,
  onSelect,
  showAddButton = false,
}) => {
  return (
    <KiduSelectPopup<DSOIndication>
      show={show}
      onClose={onClose}
      title="Select Indication"
      subtitle="Search and pick an indication"
      fetchEndpoint={API_ENDPOINTS.DSO_INDICATION.GET_ALL}
      columns={[
        {
          key: "id",
          label: "ID",
        },
        {
          key: "name",
          label: "Indication Name",
        },
        {
          key: "dsoProthesisname",
          label: "Prosthesis Type",
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
      searchKeys={["name", "dsoProthesisname"]}
      rowsPerPage={10}
      rowsPerPageOptions={[5, 10, 20, 50]}
      themeColor="#ef0d50"
      multiSelect={false}
      showAddButton={showAddButton}
      AddModalComponent={IndicationCreateModal}
      addButtonLabel="Add Indication"
    />
  );
};

export default DSOIndicationPopup;