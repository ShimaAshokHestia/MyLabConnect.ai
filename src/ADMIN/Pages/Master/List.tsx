import React, { useState, useRef } from "react";
import KiduServerTableList from "../../../KIDU_COMPONENTS/KiduServerTableList";
import type { KiduColumn } from "../../../KIDU_COMPONENTS/KiduServerTable";
import Swal from "sweetalert2";
import DSOmasterService from "../../Services/Master/Master.services";
import DSOmasterCreateModal from "./Create";
import DSOmasterEditModal from "./Edit";
import DSOmasterViewModal from "./View";

const columns: KiduColumn[] = [
  {
    key: "name",
    label: "Name",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
  },
  {
    key: "description",
    label: "Description",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
  },
  {
    key: "isActive",
    label: "Status",
    type: "badge",
    enableSorting: false,
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
    enableFiltering: false,
  },
];

const DSOmasterList: React.FC = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [recordId, setRecordId] = useState<string | number>("");
  const tableKeyRef = useRef(0);
  const [tableKey, setTableKey] = useState(0);

  const refreshTable = () => {
    tableKeyRef.current += 1;
    setTableKey(tableKeyRef.current);
  };

  const handleEditClick = (row: any) => {
    setRecordId(row.id);
    setShowEdit(true);
  };

  const handleViewClick = (row: any) => {
    setRecordId(row.id);
    setShowView(true);
  };

  const handleDeleteClick = async (row: any) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This DSO Master will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef0d50",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await DSOmasterService.delete(row.id);
        refreshTable();
        Swal.fire("Deleted!", "DSO Master has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to delete DSO Master.", "error");
      }
    }
  };

  return (
    <>
      <KiduServerTableList
        key={tableKey}
        title="DSO Masters"
        subtitle="Manage DSO Master data"
        columns={columns}
        paginatedFetchService={DSOmasterService.getPaginatedList} // Changed from fetchService to paginatedFetchService
        rowKey="id"
        showAddButton={true}
        addButtonLabel="Add DSO Master"
        onAddClick={() => setShowCreate(true)}
        onEditClick={handleEditClick}
        onViewClick={handleViewClick}
        onDeleteClick={handleDeleteClick}
        showActions={true}
        showSearch={true}
        showFilters={true}
        showExport={true}
        showColumnToggle={true}
        defaultRowsPerPage={10}
        highlightOnHover={true}
        auditLogTableName="DSO_Master"
      />

      <DSOmasterCreateModal
        show={showCreate}
        onHide={() => setShowCreate(false)}
        onSuccess={() => {
          setShowCreate(false);
          refreshTable();
        }}
      />

      {recordId && (
        <>
          <DSOmasterEditModal
            show={showEdit}
            onHide={() => setShowEdit(false)}
            onSuccess={() => {
              setShowEdit(false);
              refreshTable();
            }}
            recordId={recordId}
          />
          <DSOmasterViewModal
            show={showView}
            onHide={() => setShowView(false)}
            recordId={recordId}
          />
        </>
      )}
    </>
  );
};

export default DSOmasterList;