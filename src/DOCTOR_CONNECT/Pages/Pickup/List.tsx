// src/Pages/CasePickup/List.tsx

import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
import CasePickupCreate from "./Create";
import CasePickupEdit from "./Edit";
import CasePickupView from "./View";
import type { KiduColumn } from "../../../KIDU_COMPONENTS/KiduServerTable";
import CasePickupService from "../../Service/Pickup/Pickup.services";
import KiduServerTableList from "../../../KIDU_COMPONENTS/KiduServerTableList";

// ─── Table columns ────────────────────────────────────────────────────────────

const columns: KiduColumn[] = [
  {
    key: "labMasterName",
    label: "Lab",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
  },
  {
    key: "pickUpDate",
    label: "Pickup Date",
    type: "date",
    enableSorting: true,
    enableFiltering: false,
  },
  {
    key: "pickUpEarliestTime",
    label: "Earliest Time",
    enableSorting: false,
    enableFiltering: false,
    render: (value: string) => {
      if (!value) return <span className="kidu-cell-empty">—</span>;
      const [h, m] = value.split(":").map(Number);
      if (isNaN(h)) return <span>{value}</span>;
      return (
        <span>{`${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`}</span>
      );
    },
  },
  {
    key: "pickUpLateTime",
    label: "Latest Time",
    enableSorting: false,
    enableFiltering: false,
    render: (value: string) => {
      if (!value) return <span className="kidu-cell-empty">—</span>;
      const [h, m] = value.split(":").map(Number);
      if (isNaN(h)) return <span>{value}</span>;
      return (
        <span>{`${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`}</span>
      );
    },
  },
  {
    key: "pickUpAddress",
    label: "Pickup Address",
    enableSorting: false,
    enableFiltering: false,
  },
  {
    key: "trackingNum",
    label: "Tracking No.",
    enableSorting: false,
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
    filterOptions: ["Inactive", "Active"],
    render: (value: boolean) => (
      <span className={`kidu-badge kidu-badge--${value ? "active" : "inactive"}`}>
        {value ? "Active" : "Inactive"}
      </span>
    ),
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const CasePickupList: React.FC = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit,   setShowEdit]   = useState(false);
  const [showView,   setShowView]   = useState(false);
  const [recordId,   setRecordId]   = useState<number | string>("");

  const tableKeyRef = useRef(0);
  const [tableKey,   setTableKey]   = useState(0);

  const refreshTable = () => {
    tableKeyRef.current += 1;
    setTableKey(tableKeyRef.current);
  };

  const handleEditClick = (row: any) => { setRecordId(row.id); setShowEdit(true); };
  const handleViewClick = (row: any) => { setRecordId(row.id); setShowView(true); };

  const handleDeleteClick = async (row: any) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This pickup record will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef0d50",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      await CasePickupService.delete(row.id);
      refreshTable();
      Swal.fire("Deleted!", "Pickup record has been deleted.", "success");
    }
  };

  return (
    <>
      <KiduServerTableList
        key={tableKey}
        title="Pickup Schedules"
        subtitle="Manage lab pickup requests"
        columns={columns}
        paginatedFetchService={CasePickupService.getPaginatedList}
        rowKey="id"
        showAddButton={true}
        addButtonLabel="Schedule Pickup"
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
        auditLogTableName="CasePickUp"
      />

      {/* Create */}
      <CasePickupCreate
        show={showCreate}
        onHide={() => setShowCreate(false)}
        onSuccess={() => { setShowCreate(false); refreshTable(); }}
      />

      {/* Edit / View — only mount when a record is selected */}
      {recordId && (
        <>
          <CasePickupEdit
            show={showEdit}
            onHide={() => setShowEdit(false)}
            onSuccess={() => { setShowEdit(false); refreshTable(); }}
            recordId={recordId}
          />
          <CasePickupView
            show={showView}
            onHide={() => setShowView(false)}
            recordId={recordId}
          />
        </>
      )}
    </>
  );
};

export default CasePickupList;