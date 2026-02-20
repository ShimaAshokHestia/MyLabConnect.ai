import React, { useState, useRef } from "react";
import Swal from "sweetalert2";
import DSOProsthesisTypeCreateModal from "./Create";
import DSOProsthesisTypeEditModal from "./Edit";
import DSOProsthesisTypeViewModal from "./View";
import type { KiduColumn } from "../../../KIDU_COMPONENTS/KiduServerTable";
import DSOProsthesisTypeService from "../../Services/Prosthesis/Prosthesis.services";
import KiduServerTableList from "../../../KIDU_COMPONENTS/KiduServerTableList";

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
    label: "Prosthesis Type",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
  },
  {
    key: "dsoName",
    label: "DSO Master",
    enableSorting: true,
    enableFiltering: false, // Not filterable by name (uses dsoMasterId)
  },
  {
    key: "isActive",
    label: "Status",
    type: "badge",
    enableSorting: false,
    enableFiltering: true,
    filterType: "select",
    filterOptions: ["Inactive", "Active"], // Mapped to showInactive in service
    render: (value) => (
      <span className={`kidu-badge kidu-badge--${value ? "active" : "inactive"}`}>
        {value ? "Active" : "Inactive"}
      </span>
    ),
  },
];

const DSOProsthesisTypeList: React.FC = () => {
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
      text: "This prosthesis type will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef0d50",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await DSOProsthesisTypeService.delete(row.id);
      refreshTable();
      Swal.fire("Deleted!", "Prosthesis Type has been deleted.", "success");
    }
  };

  return (
    <>
      <KiduServerTableList
        key={tableKey}
        title="DSO Prosthesis Types"
        subtitle="Manage prosthesis type master data"
        columns={columns}
        paginatedFetchService={DSOProsthesisTypeService.getPaginatedList}
        rowKey="id"
        showAddButton={true}
        addButtonLabel="Add Prosthesis Type"
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
      />

      <DSOProsthesisTypeCreateModal
        show={showCreate}
        onHide={() => setShowCreate(false)}
        onSuccess={() => { setShowCreate(false); refreshTable(); }}
      />

      {recordId && (
        <>
          <DSOProsthesisTypeEditModal
            show={showEdit}
            onHide={() => setShowEdit(false)}
            onSuccess={() => { setShowEdit(false); refreshTable(); }}
            recordId={recordId}
          />
          <DSOProsthesisTypeViewModal
            show={showView}
            onHide={() => setShowView(false)}
            recordId={recordId}
          />
        </>
      )}
    </>
  );
};

export default DSOProsthesisTypeList;