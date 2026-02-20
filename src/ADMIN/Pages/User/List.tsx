import React, { useState, useRef } from "react";
import UserCreateModal from "./Create";
import UserEditModal from "./Edit";
import Swal from "sweetalert2";
import type { KiduColumn } from "../../../KIDU_COMPONENTS/KiduServerTable";
import UserService from "../../Services/User/User.services";
import KiduServerTableList from "../../../KIDU_COMPONENTS/KiduServerTableList";
import UserViewModal from "./View";

const columns: KiduColumn[] = [
  { key: "userName", label: "User Name", enableSorting: true, enableFiltering: true },
  { key: "userEmail", label: "Email", enableSorting: true, enableFiltering: true },
  { key: "phoneNumber", label: "Phone Number", enableSorting: true, enableFiltering: true },
  { key: "companyName", label: "Company", enableSorting: true, enableFiltering: true },
  { key: "userTypeName", label: "User Type", enableSorting: true, enableFiltering: true },
  { key: "authenticationType", label: "Auth Type", render: (value) => { const labels: Record<number, string> = { 0: "Standard", 1: "OAuth", 2: "LDAP", 3: "SSO" }; return <span>{labels[value] ?? "Unknown"}</span>; } },
  { key: "isActive", label: "Status", enableFiltering: true, filterType: "select", filterOptions: ["Active", "Inactive"], render: (value) => <span className={`kidu-badge kidu-badge--${value ? "active" : "inactive"}`}>{value ? "Active" : "Inactive"}</span> },
];

const UserList: React.FC = () => {

  const [showCreateModal, setShowCreateModal] = useState(false);
  const tableKeyRef = useRef(0);
  const [tableKey,   setTableKey]   = useState(0);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editRecordId,  setEditRecordId]  = useState<string | number>("");

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewRecordId,  setViewRecordId]  = useState<string | number>("");

  const refreshTable = () => {
    tableKeyRef.current += 1;
    setTableKey(tableKeyRef.current);
  };

  const handleAddClick    = () => setShowCreateModal(true);

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    refreshTable();
  };

  const handleEditClick = (row: any) => {
    setEditRecordId(row.id);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    refreshTable();
  };

  const handleViewClick = (row: any) => {
    setViewRecordId(row.id);
    setShowViewModal(true);
  };

  const handleDeleteClick = async (row: any) => {
    const result = await Swal.fire({
      title:              "Are you sure?",
      text:               "This User will be permanently deleted.",
      icon:               "warning",
      showCancelButton:   true,
      confirmButtonColor: "#ef0d50",
      cancelButtonColor:  "#6c757d",
      confirmButtonText:  "Yes, delete it!",
      cancelButtonText:   "Cancel",
    });

    if (result.isConfirmed) {
      await UserService.delete(row.id);
      refreshTable();
      Swal.fire("Deleted!", "User has been deleted.", "success");
    }
  };

  return (
    <>
      <KiduServerTableList
        key={tableKey}
        title="Users"
        subtitle="Manage User data"
        columns={columns}
        fetchService={() => UserService.getAll()}
        showAddButton={true}
        addButtonLabel="Add User"
        onAddClick={handleAddClick}
        onEditClick={handleEditClick}
        onViewClick={handleViewClick}
        onDeleteClick={handleDeleteClick}
        showActions={true}
        rowKey="id"
        showSearch={true}
        showFilters={true}
        showExport={true}
        showColumnToggle={true}
        defaultRowsPerPage={10}
        highlightOnHover={true}
        striped={false}
      />

      {/* Create Modal */}
      <UserCreateModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Edit Modal */}
      {editRecordId && (
        <UserEditModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
          recordId={editRecordId}
        />
      )}

      {/* View Modal */}
      {viewRecordId && (
        <UserViewModal
          show={showViewModal}
          onHide={() => setShowViewModal(false)}
          recordId={viewRecordId}
        />
      )}
    </>
  );
};

export default UserList;