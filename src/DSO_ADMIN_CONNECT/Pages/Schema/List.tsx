import React, { useState, useRef } from "react";
import Swal from "sweetalert2";
import type { KiduColumn } from "../../../KIDU_COMPONENTS/KiduServerTable";
import DSOSchemaService from "../../Services/Schema/Schema.services";
import KiduServerTableList from "../../../KIDU_COMPONENTS/KiduServerTableList";
import DSOSchemaCreateModal from "./Create";
import DSOSchemaEditModal from "./Edit";
import DSOSchemaViewModal from "./View";


const columns: KiduColumn[] = [
  {
    key: "name",
    label: "Schema Name",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
  },
  // {
  //   key: "dsoName",
  //   label: "DSO Master",
  //   enableSorting: true,
  //   enableFiltering: false, // int-based (dsoMasterId), not filterable by name
  // },
  {
    key: "isActive",
    label: "Status",
    type: "badge",
    enableSorting: false,
    enableFiltering: true,
    filterType: "select",
    filterOptions: ["Inactive", "Active"],
    render: (value) => (
      <span className={`kidu-badge kidu-badge--${value ? "active" : "inactive"}`}>
        {value ? "Active" : "Inactive"}
      </span>
    ),
  },
];

const DSOSchemaList: React.FC = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit,   setShowEdit]   = useState(false);
  const [showView,   setShowView]   = useState(false);
  const [recordId,   setRecordId]   = useState<string | number>("");
  const tableKeyRef = useRef(0);
  const [tableKey,   setTableKey]   = useState(0);

  const refreshTable = () => {
    tableKeyRef.current += 1;
    setTableKey(tableKeyRef.current);
  };

  const handleEditClick  = (row: any) => { setRecordId(row.id); setShowEdit(true);  };
  const handleViewClick  = (row: any) => { setRecordId(row.id); setShowView(true);  };

  const handleDeleteClick = async (row: any) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This schema will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef0d50",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      await DSOSchemaService.delete(row.id);
      refreshTable();
      Swal.fire("Deleted!", "Schema has been deleted.", "success");
    }
  };

  return (
    <>
      <KiduServerTableList
        key={tableKey}
        title="DSO Schemas"
        subtitle="Manage schema master data"
        columns={columns}
        paginatedFetchService={DSOSchemaService.getPaginatedList}
        rowKey="id"
        showAddButton={true}
        addButtonLabel="Add Schema"
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
        auditLogTableName="dso_schema"
      />

      <DSOSchemaCreateModal
        show={showCreate}
        onHide={() => setShowCreate(false)}
        onSuccess={() => { setShowCreate(false); refreshTable(); }}
      />

      {recordId && (
        <>
          <DSOSchemaEditModal
            show={showEdit}
            onHide={() => setShowEdit(false)}
            onSuccess={() => { setShowEdit(false); refreshTable(); }}
            recordId={recordId}
          />
          <DSOSchemaViewModal
            show={showView}
            onHide={() => setShowView(false)}
            recordId={recordId}
          />
        </>
      )}
    </>
  );
};

export default DSOSchemaList;