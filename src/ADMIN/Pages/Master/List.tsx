import React, { useState, useRef } from "react";
import DSOmasterCreateModal from "./Create";
import DSOmasterEditModal from "./Edit";
import Swal from "sweetalert2";
import type { KiduColumn } from "../../../KIDU_COMPONENTS/KiduServerTable";
import DSOmasterService from "../../Services/Master/Master.services";
import KiduServerTableList from "../../../KIDU_COMPONENTS/KiduServerTableList";
import DSOmasterViewModal from "./View";

const columns: KiduColumn[] = [
  {
    key: "name",
    label: "Name",
    enableSorting: true,
    enableFiltering: true,
  },
  {
    key: "description",
    label: "Description",
    enableSorting: true,
    enableFiltering: true,
  },
  {
    key: "isActive",
    label: "Status",
    type: "badge",
    enableFiltering: true,
    filterType: "select",
    filterOptions: ["Active", "Inactive"],
    render: (value) => (
      <span className={`kidu-badge kidu-badge--${value ? "active" : "inactive"}`}>
        {value ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    key: "createdAt",
    label: "Created At",
    type: "date",
    enableSorting: true,
  },
];

const DSOmasterList: React.FC = () => {

  const [showCreateModal, setShowCreateModal] = useState(false);
  const tableKeyRef = useRef(0);
  const [tableKey, setTableKey] = useState(0);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editRecordId, setEditRecordId] = useState<string | number>("");

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewRecordId, setViewRecordId] = useState<string | number>("");

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
      title:             "Are you sure?",
      text:              "This DSO Master will be permanently deleted.",
      icon:              "warning",
      showCancelButton:  true,
      confirmButtonColor: "#ef0d50",
      cancelButtonColor:  "#6c757d",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText:  "Cancel",
    });

    if (result.isConfirmed) {
      await DSOmasterService.delete(row.id);
      refreshTable();
      Swal.fire("Deleted!", "DSO Master has been deleted.", "success");
    }
  };

  return (
    <>
      <KiduServerTableList
        key={tableKey}
        title="DSO Masters"
        subtitle="Manage DSO Master data"
        columns={columns}
        fetchService={() => DSOmasterService.getAll()}
        showAddButton={true}
        addButtonLabel="Add DSO Master"
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
      <DSOmasterCreateModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Edit Modal */}
      {editRecordId && (
        <DSOmasterEditModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
          recordId={editRecordId}
        />
      )}

      {/* View Modal */}
      {viewRecordId && (
        <DSOmasterViewModal
          show={showViewModal}
          onHide={() => setShowViewModal(false)}
          recordId={viewRecordId}
        />
      )}
    </>
  );
};

export default DSOmasterList;