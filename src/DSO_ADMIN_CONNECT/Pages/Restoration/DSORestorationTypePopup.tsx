import React from "react";
import KiduSelectPopup from "../../../KIDU_COMPONENTS/KiduSelectPopup";
import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { DSORestoration } from "../../Types/Restoration/Restoration.types";
import RestorationTypeCreateModal from "./DSORestorationTypeCreateModal";

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  show:          boolean;
  onClose:       () => void;
  onSelect:      (item: DSORestoration) => void;
  showAddButton?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

const DSORestorationTypePopup: React.FC<Props> = ({
  show,
  onClose,
  onSelect,
  showAddButton = false,
}) => {
  return (
    <KiduSelectPopup<DSORestoration>
      show={show}
      onClose={onClose}
      title="Select Restoration Type"
      subtitle="Search and pick a restoration type"
      fetchEndpoint={API_ENDPOINTS.DSO_RESTORATION_TYPE.GET_ALL}
      columns={[
        {
          key:   "id",
          label: "ID",
        },
        {
          key:   "name",
          label: "Restoration Name",
        },
        {
          key:    "dsoProthesisname",
          label:  "Prosthesis Type",
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
      searchKeys={["name", "dsoProthesisname"]}
      rowsPerPage={10}
      showAddButton={showAddButton}
      AddModalComponent={RestorationTypeCreateModal}
      addButtonLabel="Add Restoration Type"
    />
  );
};

export default DSORestorationTypePopup;