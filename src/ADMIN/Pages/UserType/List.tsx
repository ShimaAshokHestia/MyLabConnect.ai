import React, { useState, useRef } from "react";
import UserTypeCreateModal from "./Create";
import UserTypeEditModal from "./Edit";
import UserTypeViewModal from "./View";
import Swal from "sweetalert2";
import type { KiduColumn } from "../../../KIDU_COMPONENTS/KiduServerTable";
import UserTypeService from "../../Services/UserType/UserType.services";
import KiduServerTableList from "../../../KIDU_COMPONENTS/KiduServerTableList";

const columns: KiduColumn[] = [
  { key: "userTypeName", label: "User Type Name", enableSorting: true, enableFiltering: true },
  { key: "isAdminAdable", label: "Admin Addable", render: (value) => <span className={`kidu-badge kidu-badge--${value ? "active" : "inactive"}`}>{value ? "Yes" : "No"}</span> },
  { key: "isDSOAddable", label: "DSO Addable", render: (value) => <span className={`kidu-badge kidu-badge--${value ? "active" : "inactive"}`}>{value ? "Yes" : "No"}</span> },
  { key: "isLabAddable", label: "Lab Addable", render: (value) => <span className={`kidu-badge kidu-badge--${value ? "active" : "inactive"}`}>{value ? "Yes" : "No"}</span> },
  { key: "isDoctorAddable", label: "Doctor Addable", render: (value) => <span className={`kidu-badge kidu-badge--${value ? "active" : "inactive"}`}>{value ? "Yes" : "No"}</span> },
  { key: "isPMAddable", label: "PM Addable", render: (value) => <span className={`kidu-badge kidu-badge--${value ? "active" : "inactive"}`}>{value ? "Yes" : "No"}</span> },
  { key: "isActive", label: "Status", enableFiltering: true, filterType: "select", filterOptions: ["Active", "Inactive"], render: (value) => <span className={`kidu-badge kidu-badge--${value ? "active" : "inactive"}`}>{value ? "Active" : "Inactive"}</span> },
];

const UserTypeList: React.FC = () => {

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

  const handleAddClick = () => setShowCreateModal(true);

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
      text:               "This User Type will be permanently deleted.",
      icon:               "warning",
      showCancelButton:   true,
      confirmButtonColor: "#ef0d50",
      cancelButtonColor:  "#6c757d",
      confirmButtonText:  "Yes, delete it!",
      cancelButtonText:   "Cancel",
    });

    if (result.isConfirmed) {
      await UserTypeService.delete(row.id);
      refreshTable();
      Swal.fire("Deleted!", "User Type has been deleted.", "success");
    }
  };

  return (
    <>
      <KiduServerTableList
        key={tableKey}
        title="User Types"
        subtitle="Manage User Type data"
        columns={columns}
        fetchService={() => UserTypeService.getAll()}
        showAddButton={true}
        addButtonLabel="Add User Type"
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
      <UserTypeCreateModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Edit Modal */}
      {editRecordId && (
        <UserTypeEditModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
          recordId={editRecordId}
        />
      )}

      {/* View Modal */}
      {viewRecordId && (
        <UserTypeViewModal
          show={showViewModal}
          onHide={() => setShowViewModal(false)}
          recordId={viewRecordId}
        />
      )}
    </>
  );
};

export default UserTypeList;