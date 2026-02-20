import React from "react";
import KiduPopup from "../../../../KIDU_COMPONENTS/KiduPopup";
import { API_ENDPOINTS } from "../../../../CONSTANTS/API_ENDPOINTS";
import type { UserType } from "../../../Types/User Mangement/UserTypes.types";
import UserTypeCreateModal from "./UserTypeCreateModal";

interface UserTypePopupProps {
  show: boolean;
  handleClose: () => void;
  onSelect: (userType: UserType) => void;
  showAddButton?: boolean;
  title?: string;
}

const UserTypePopup: React.FC<UserTypePopupProps> = ({
  show,
  handleClose,
  onSelect,
  showAddButton = true,
  title = "Select User Type"
}) => {
  const columns = [
    { key: "id" as keyof UserType, label: "ID" },
    { key: "userTypeName" as keyof UserType, label: "User Type Name" },
    { 
      key: "isAdminAdable" as keyof UserType, 
      label: "Admin Addable",
      render: (value: boolean) => (
        <span style={{ 
          color: value ? '#28a745' : '#6c757d',
          fontWeight: 500
        }}>
          {value ? 'Yes' : 'No'}
        </span>
      )
    },
    { 
      key: "isDSOAddable" as keyof UserType, 
      label: "DSO Addable",
      render: (value: boolean) => (
        <span style={{ 
          color: value ? '#28a745' : '#6c757d',
          fontWeight: 500
        }}>
          {value ? 'Yes' : 'No'}
        </span>
      )
    },
    { 
      key: "isActive" as keyof UserType, 
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
  const searchKeys: (keyof UserType)[] = [
    "userTypeName",
    "isAdminAdable",
    "isDSOAddable",
    "isLabAddable",
    "isDoctorAddable",
    "isPMAddable"
  ];

  return (
    <KiduPopup<UserType>
      show={show}
      handleClose={handleClose}
      title={title}
      fetchEndpoint={API_ENDPOINTS.USER_TYPE.GET_ALL}
      columns={columns}
      onSelect={onSelect}
      AddModalComponent={UserTypeCreateModal}
      idKey="id"
      showAddButton={showAddButton}
      rowsPerPage={10}
      searchKeys={searchKeys}
    />
  );
};

export default UserTypePopup;