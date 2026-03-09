import React, { useState, useRef } from "react";
import Swal from "sweetalert2";
import DSORestorationTypeCreateModal from "./Create";
import DSORestorationTypeEditModal from "./Edit";
import DSORestorationTypeViewModal from "./View";
import type { KiduColumn } from "../../../KIDU_COMPONENTS/KiduServerTable";
import KiduServerTableList from "../../../KIDU_COMPONENTS/KiduServerTableList";
import DSORestorationTypeService from "../../Services/Restoration/Restoration.services";

// ── Column definitions ────────────────────────────────────────────────────────

const columns: KiduColumn[] = [
  {
    key: "id",
    label: "ID",
    enableSorting: true,
    enableFiltering: true,
    filterType: "number",
    width: 80,
  },
  {
    key: "name",
    label: "Restoration Name",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
  },
  {
    key: "dsoProthesisname",
    label: "Prosthesis Type",
    enableSorting: true,
    enableFiltering: false,
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

// ── Component ─────────────────────────────────────────────────────────────────

const DSORestorationTypeList: React.FC = () => {
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
      text: "This restoration type will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef0d50",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await DSORestorationTypeService.delete(row.id);
      refreshTable();
      Swal.fire("Deleted!", "Restoration Type has been deleted.", "success");
    }
  };

  return (
    <>
      <KiduServerTableList
        key={tableKey}
        title="DSO Restoration Types"
        subtitle="Manage restoration type master data"
        columns={columns}
        paginatedFetchService={DSORestorationTypeService.getPaginatedList}
        rowKey="id"
        showAddButton={true}
        addButtonLabel="Add Restoration Type"
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
        auditLogTableName="DSO_RestorationType"
      />

      <DSORestorationTypeCreateModal
        show={showCreate}
        onHide={() => setShowCreate(false)}
        onSuccess={() => { setShowCreate(false); refreshTable(); }}
      />

      {recordId && (
        <>
          <DSORestorationTypeEditModal
            show={showEdit}
            onHide={() => setShowEdit(false)}
            onSuccess={() => { setShowEdit(false); refreshTable(); }}
            recordId={recordId}
          />
          <DSORestorationTypeViewModal
            show={showView}
            onHide={() => setShowView(false)}
            recordId={recordId}
          />
        </>
      )}
    </>
  );
};

export default DSORestorationTypeList;