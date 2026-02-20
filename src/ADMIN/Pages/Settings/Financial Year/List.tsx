import React, { useState, useRef } from "react";
import KiduServerTableList from "../../../../KIDU_COMPONENTS/KiduServerTableList";
import type { KiduColumn } from "../../../../KIDU_COMPONENTS/KiduServerTable";
import Swal from "sweetalert2";
import FinancialYearCreateModal from "./Create";
import FinancialYearEditModal from "./Edit";
import FinancialYearViewModal from "./View";
import FinancialYearService from "../../../Services/Settings/FinancialYear.services";

const columns: KiduColumn[] = [
  { key: "finacialYearCode", label: "Year Code",    enableSorting: true, enableFiltering: true },
  { key: "startDate",        label: "Start Date",   enableSorting: true, render: (value) => value ? new Date(value).toLocaleDateString() : "-" },
  { key: "endDate",          label: "End Date",     enableSorting: true, render: (value) => value ? new Date(value).toLocaleDateString() : "-" },
  { key: "isCurrent",        label: "Current Year", render: (value) => <span className={`kidu-badge kidu-badge--${value ? "active" : "inactive"}`}>{value ? "Yes" : "No"}</span> },
  { key: "isClosed",         label: "Closed",       render: (value) => <span className={`kidu-badge kidu-badge--${value ? "inactive" : "active"}`}>{value ? "Yes" : "No"}</span> },
];

const FinancialYearList: React.FC = () => {
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
    setRecordId(row.financialYearId);
    setShowEdit(true);
  };

  const handleViewClick = (row: any) => {
    setRecordId(row.financialYearId);
    setShowView(true);
  };

  const handleDeleteClick = async (row: any) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This Financial Year will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef0d50",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await FinancialYearService.delete(row.financialYearId);
      refreshTable();
      Swal.fire("Deleted!", "Financial Year has been deleted.", "success");
    }
  };

  return (
    <>
      <KiduServerTableList
        key={tableKey}
        title="Financial Years"
        subtitle="Manage Financial Year data"
        columns={columns}
        fetchService={() => FinancialYearService.getAll()}
        rowKey="financialYearId"
        showAddButton={true}
        addButtonLabel="Add Financial Year"
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

      <FinancialYearCreateModal
        show={showCreate}
        onHide={() => setShowCreate(false)}
        onSuccess={() => { setShowCreate(false); refreshTable(); }}
      />

      {recordId && (
        <>
          <FinancialYearEditModal
            show={showEdit}
            onHide={() => setShowEdit(false)}
            onSuccess={() => { setShowEdit(false); refreshTable(); }}
            recordId={recordId}
          />
          <FinancialYearViewModal
            show={showView}
            onHide={() => setShowView(false)}
            recordId={recordId}
          />
        </>
      )}
    </>
  );
};

export default FinancialYearList;
