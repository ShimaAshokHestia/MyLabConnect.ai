// src/DOCTOR_CONNECT/Pages/CasePickup/List.tsx

import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
import CasePickupCreate from "./Create";
import CasePickupEdit from "./Edit";
import CasePickupView from "./View";
import type { KiduColumn } from "../../../KIDU_COMPONENTS/KiduServerTable";
import CasePickupService from "../../Service/Pickup/Pickup.services";
import KiduServerTableList from "../../../KIDU_COMPONENTS/KiduServerTableList";
import type { CasePickUpDetailItem } from "../../Types/Pickup.type";

// ─── Helper ───────────────────────────────────────────────────────────────────

const formatTime = (value: string): string => {
  if (!value) return "—";
  const timePart = value.includes("T") ? value.split("T")[1] : value;
  const [h, m] = timePart.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return value;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
};

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
      const formatted = formatTime(value);
      if (formatted === "—") return <span className="kidu-cell-empty">—</span>;
      return <span>{formatted}</span>;
    },
  },
  {
    key: "pickUpLateTime",
    label: "Latest Time",
    enableSorting: false,
    enableFiltering: false,
    render: (value: string) => {
      const formatted = formatTime(value);
      if (formatted === "—") return <span className="kidu-cell-empty">—</span>;
      return <span>{formatted}</span>;
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
    // ✅ FIX: key changed from "casePickUpDetails" to "cases"
    // backend paginated now returns `cases` array
    key: "cases",
    label: "Cases",
    enableSorting: false,
    enableFiltering: false,
    render: (details: CasePickUpDetailItem[], row: any) => {
      // ✅ FIX: fallback to casePickUpDetails if cases not present
      const items = details ?? row?.casePickUpDetails ?? [];

      if (!items?.length && !row?.caseCount) {
        return <span className="kidu-cell-empty">—</span>;
      }

      if (items?.length) {
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {items.map((d: CasePickUpDetailItem, i: number) => (
              <span key={d.id ?? i} style={{ fontSize: 12 }}>
                {d.patientName ? (
                  <>
                    <strong>{d.patientName}</strong>
                    {d.caseNo && (
                      <span
                        style={{
                          color: "var(--color-text-secondary)",
                          marginLeft: 4,
                        }}
                      >
                        ({d.caseNo})
                      </span>
                    )}
                  </>
                ) : (
                  <span style={{ color: "var(--color-text-secondary)" }}>
                    Case #{d.caseRegistrationMasterId}
                  </span>
                )}
              </span>
            ))}
          </div>
        );
      }

      return (
        <span className="kidu-badge kidu-badge--info">
          {row.caseCount} {row.caseCount === 1 ? "case" : "cases"}
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
    filterOptions: ["Inactive", "Active"],
    render: (value: boolean) => (
      <span
        className={`kidu-badge kidu-badge--${value ? "active" : "inactive"}`}
      >
        {value ? "Active" : "Inactive"}
      </span>
    ),
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const CasePickupList: React.FC = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit]     = useState(false);
  const [showView, setShowView]     = useState(false);
  const [recordId, setRecordId]     = useState<number | string>("");

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

      <CasePickupCreate
        show={showCreate}
        onHide={() => setShowCreate(false)}
        onSuccess={() => {
          setShowCreate(false);
          refreshTable();
        }}
      />

      {recordId && (
        <>
          <CasePickupEdit
            show={showEdit}
            onHide={() => setShowEdit(false)}
            onSuccess={() => {
              setShowEdit(false);
              refreshTable();
            }}
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