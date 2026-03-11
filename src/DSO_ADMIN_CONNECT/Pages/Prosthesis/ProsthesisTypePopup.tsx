import React from "react";
import KiduSelectPopup from "../../../KIDU_COMPONENTS/KiduSelectPopup";
import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { DSOProsthesisType } from "../../Types/Prosthesis/Prosthesis.types";
import ProsthesisTypeCreateModal from "./ProsthesisTypeCreateModal";

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  show:          boolean;
  onClose:       () => void;
  onSelect:      (item: DSOProsthesisType) => void;
  showAddButton?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

const DSOProsthesisTypePopup: React.FC<Props> = ({
  show,
  onClose,
  onSelect,
  showAddButton = false,
}) => {
  return (
    <KiduSelectPopup<DSOProsthesisType>
      show={show}
      onClose={onClose}
      title="Select Prosthesis Type"
      subtitle="Search and pick a prosthesis type"
      fetchEndpoint={API_ENDPOINTS.DSO_PROTHESIS_TYPE.GET_ALL}
      columns={[
        {
          key:   "id",
          label: "ID",
        },
        {
          key:   "name",
          label: "Prosthesis Type",
        },
        {
          key:    "dsoName",
          label:  "DSO Master",
        },
        {
          key:   "isActive",
          label: "Status",
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
      searchKeys={["name", "dsoName"]}
      rowsPerPage={10}
      showAddButton={showAddButton}
      AddModalComponent={ProsthesisTypeCreateModal}
      addButtonLabel="Add Prosthesis Type"
    />
  );
};

export default DSOProsthesisTypePopup;