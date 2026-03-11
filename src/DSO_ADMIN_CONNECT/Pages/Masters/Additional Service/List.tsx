import React, { useState, useRef } from "react";
import KiduServerTableList from "../../../../KIDU_COMPONENTS/KiduServerTableList";
import type { KiduColumn } from "../../../../KIDU_COMPONENTS/KiduServerTable";
import Swal from "sweetalert2";
import DSOAdditionalServiceService from "../../../Services/Masters/DsoAdditionalService.services";
import DSOAdditionalServiceCreateModal from "./Create";
import DSOAdditionalServiceEditModal from "./Edit";
import DSOAdditionalServiceViewModal from "./View";

const columns: KiduColumn[] = [
//   {
//     key: "id",
//     label: "ID",
//     enableSorting: true,
//     enableFiltering: true,
//     filterType: "number",
//     width: 80,
//   },
  {
    key: "serviceName",
    label: "Service Name",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
  },
  {
    key: "serviceNotes",
    label: "Service Notes",
    enableSorting: false,
    enableFiltering: true,
    filterType: "text",
    render: (value) => {
      if (!value) return <span className="kidu-cell-empty">—</span>;
      return <span>{value.length > 50 ? `${value.substring(0, 50)}...` : value}</span>;
    },
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
];

const DSOAdditionalServiceList: React.FC = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [recordId, setRecordId] = useState<number>(0);
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
      text: "This additional service will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef0d50",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await DSOAdditionalServiceService.delete(row.id);
        refreshTable();
        Swal.fire("Deleted!", "Additional service has been deleted.", "success");
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire("Error!", "Failed to delete additional service.", "error");
      }
    }
  };

  return (
    <>
      <KiduServerTableList
        key={tableKey}
        title="DSO Additional Services"
        subtitle="Manage additional service master data"
        columns={columns}
        paginatedFetchService={DSOAdditionalServiceService.getPaginatedList}
        rowKey="id"
        showAddButton={true}
        addButtonLabel="Add Additional Service"
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
        auditLogTableName="dso_AdditionalService"
      />

      <DSOAdditionalServiceCreateModal
        show={showCreate}
        onHide={() => setShowCreate(false)}
        onSuccess={() => {
          setShowCreate(false);
          refreshTable();
        }}
      />

      {recordId > 0 && (
        <>
          <DSOAdditionalServiceEditModal
            show={showEdit}
            onHide={() => setShowEdit(false)}
            onSuccess={() => {
              setShowEdit(false);
              refreshTable();
            }}
            recordId={recordId}
          />
          <DSOAdditionalServiceViewModal
            show={showView}
            onHide={() => setShowView(false)}
            recordId={recordId}
          />
        </>
      )}
    </>
  );
};

export default DSOAdditionalServiceList;