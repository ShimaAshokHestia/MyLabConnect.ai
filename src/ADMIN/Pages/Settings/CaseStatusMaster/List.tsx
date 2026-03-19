// src/DSO/Pages/CaseStatusMaster/List.tsx

import React, { useState, useRef } from "react";
import KiduServerTableList from "../../../../KIDU_COMPONENTS/KiduServerTableList";
import type { KiduColumn } from "../../../../KIDU_COMPONENTS/KiduServerTable";
import Swal from "sweetalert2";

import CaseStatusCreateModal from "./Create";
import CaseStatusEditModal from "./Edit";
import CaseStatusViewModal from "./View";
import CaseStatusService from "../../../Services/CaseStatus/CaseStatus.services";

const columns: KiduColumn[] = [
  
  {
    key: "caseStatusName",
    label: "Case Status Name",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
  },
  {
    key: "createdAt",
    label: "Created At",
    enableSorting: true,
    enableFiltering: false,
    render: (value) => {
      if (!value) return <span>—</span>;
      const date = new Date(value);
      return (
        <span>
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      );
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

const CaseStatusList: React.FC = () => {
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
      text: "This case status will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef0d50",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await CaseStatusService.delete(row.id);
        refreshTable();
        Swal.fire("Deleted!", "Case status has been deleted.", "success");
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire("Error!", "Failed to delete case status.", "error");
      }
    }
  };

  return (
    <>
      <KiduServerTableList
        key={tableKey}
        title="Case Status"
        subtitle="Manage case status data"
        columns={columns}
        paginatedFetchService={CaseStatusService.getPaginatedList}
        rowKey="id"
        showAddButton={true}
        addButtonLabel="Add Case Status"
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
        auditLogTableName="case_status_master"
      />

      <CaseStatusCreateModal
        show={showCreate}
        onHide={() => setShowCreate(false)}
        onSuccess={() => {
          setShowCreate(false);
          refreshTable();
        }}
      />

      {recordId > 0 && (
        <>
          <CaseStatusEditModal
            show={showEdit}
            onHide={() => setShowEdit(false)}
            onSuccess={() => {
              setShowEdit(false);
              refreshTable();
            }}
            recordId={recordId}
          />

          <CaseStatusViewModal
            show={showView}
            onHide={() => setShowView(false)}
            recordId={recordId}
          />
        </>
      )}
    </>
  );
};

export default CaseStatusList;