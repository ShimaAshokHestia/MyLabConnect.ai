import React, { useState, useRef } from "react";
import KiduServerTableList from "../../../../KIDU_COMPONENTS/KiduServerTableList";
import type { KiduColumn } from "../../../../KIDU_COMPONENTS/KiduServerTable";
import Swal from "sweetalert2";
import DSORegionService from "../../../Services/Setup/DSORegion.services";
import DSORegionCreateModal from "./Create";
import DSORegionViewModal from "./View";
import DSORegionEditModal from "./Edit";

const columns: KiduColumn[] = [
  {
    key: "id",
    label: "Region Code",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
  },
  {
    key: "name",
    label: "Region Name",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
  },
  {
    key: "dsoName",
    label: "DSO Master",
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
    filterOptions: ["Inactive", "Active"],
    render: (value) => (
      <span className={`kidu-badge kidu-badge--${value ? "active" : "inactive"}`}>
        {value ? "Active" : "Inactive"}
      </span>
    ),
  },
];

const DSORegionList: React.FC = () => {
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
      text: "This region will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef0d50",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      await DSORegionService.delete(row.id);
      refreshTable();
      Swal.fire("Deleted!", "Region has been deleted.", "success");
    }
  };

  return (
    <>
      <KiduServerTableList
        key={tableKey}
        title="DSO Regions"
        subtitle="Manage region master data"
        columns={columns}
        paginatedFetchService={DSORegionService.getPaginatedList}
        rowKey="id"
        showAddButton={true}
        addButtonLabel="Add Region"
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
        auditLogTableName="dso_region"
      />

      <DSORegionCreateModal
        show={showCreate}
        onHide={() => setShowCreate(false)}
        onSuccess={() => { setShowCreate(false); refreshTable(); }}
      />

      {recordId && (
        <>
          <DSORegionEditModal
            show={showEdit}
            onHide={() => setShowEdit(false)}
            onSuccess={() => { setShowEdit(false); refreshTable(); }}
            recordId={recordId}
          />
          <DSORegionViewModal
            show={showView}
            onHide={() => setShowView(false)}
            recordId={recordId}
          />
        </>
      )}
    </>
  );
};

export default DSORegionList;