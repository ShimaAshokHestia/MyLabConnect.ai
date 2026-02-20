import React from "react";
import KiduPopup from "../../../KIDU_COMPONENTS/KiduPopup";
import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { DSOmaster } from "../../Types/Master/Master.types";
import MasterCreateModal from "./MasterCreateModal";

interface MasterPopupProps {
  show: boolean;
  handleClose: () => void;
  onSelect: (master: DSOmaster) => void;
  showAddButton?: boolean;
  title?: string;
}

const MasterPopup: React.FC<MasterPopupProps> = ({
  show,
  handleClose,
  onSelect,
  showAddButton = true,
  title = "Select Master"
}) => {
  const columns = [
    { key: "id" as keyof DSOmaster, label: "ID" },
    { key: "name" as keyof DSOmaster, label: "Name" },
    { key: "description" as keyof DSOmaster, label: "Description" },
    { 
      key: "isActive" as keyof DSOmaster, 
      label: "Status",
      render: (value: boolean) => (
        <span style={{ 
          color: value ? '#28a745' : '#dc3545',
          fontWeight: 500,
          padding: '4px 8px',
          borderRadius: '4px',
          backgroundColor: value ? '#e8f5e9' : '#ffebee'
        }}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  // Define search keys for filtering
  const searchKeys: (keyof DSOmaster)[] = [
    "name",
    "description"
  ];

  return (
    <KiduPopup<DSOmaster>
      show={show}
      handleClose={handleClose}
      title={title}
      fetchEndpoint={API_ENDPOINTS.DSO_MASTER.GET_ALL} // Adjust this based on your actual endpoint
      columns={columns}
      onSelect={onSelect}
      AddModalComponent={MasterCreateModal}
      idKey="id"
      showAddButton={showAddButton}
      rowsPerPage={10}
      searchKeys={searchKeys}
    />
  );
};

export default MasterPopup;