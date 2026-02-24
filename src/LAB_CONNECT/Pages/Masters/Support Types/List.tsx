import React, { useState, useRef } from "react";
import KiduServerTableList from "../../../../KIDU_COMPONENTS/KiduServerTableList";
import type { KiduColumn } from "../../../../KIDU_COMPONENTS/KiduServerTable";
import { FaEdit } from "react-icons/fa";
import LabSupportTypeService from "../../../Services/Masters/SupportTypes.services";
import LabSupportTypeCreateModal from "./Create";
import LabSupportTypeEditModal from "./Edit";

// ── Columns ───────────────────────────────────────────────────────────────────

const getColumns = (onEditClick: (row: any) => void): KiduColumn[] => [
  {
    key: "labSupportTypeName",
    label: "Support Type",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
  },
  {
    key: "labMasterId",
    label: "Lab",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
    render: (value, row) => <span>{row.labMasterName || `Lab #${value}`}</span>,
  },
  {
    key: "escalationDays",
    label: "Escalation Days",
    enableSorting: true,
    enableFiltering: true,
    filterType: "number",
    render: (value) => <span>{value} days</span>,
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
  {
    key: "createdAt",
    label: "Created Date",
    type: "date",
    enableSorting: true,
    enableFiltering: false,
  },
  {
    key: "actions",
    label: "Actions",
    enableSorting: false,
    enableFiltering: false,
    width: 80,
    render: (_value, row) => (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEditClick(row);
        }}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#0d9488",
          fontSize: "1rem",
          padding: "4px 8px",
          borderRadius: "6px",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(13,148,136,0.08)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        title="Edit"
      >
        <FaEdit />
      </button>
    ),
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

const LabSupportTypeList: React.FC = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit,   setShowEdit]   = useState(false);
  const [recordId,   setRecordId]   = useState<number>(0);
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

  const columns = getColumns(handleEditClick);

  return (
    <>
      <KiduServerTableList
        key={tableKey}
        title="Lab Support Types"
        subtitle="Manage support type master data"
        columns={columns}
        paginatedFetchService={LabSupportTypeService.getPaginatedList}
        rowKey="id"
        showAddButton={true}
        addButtonLabel="Add Support Type"
        onAddClick={() => setShowCreate(true)}
        showActions={false}        // ← disable built-in dropdown actions
        showSearch={true}
        showFilters={true}
        showExport={true}
        showColumnToggle={true}
        defaultRowsPerPage={10}
        highlightOnHover={true}
        auditLogTableName="lab_support_type"
      />

      <LabSupportTypeCreateModal
        show={showCreate}
        onHide={() => setShowCreate(false)}
        onSuccess={() => {
          setShowCreate(false);
          refreshTable();
        }}
      />

      {recordId > 0 && (
        <LabSupportTypeEditModal
          show={showEdit}
          onHide={() => setShowEdit(false)}
          onSuccess={() => {
            setShowEdit(false);
            refreshTable();
          }}
          recordId={recordId}
        />
      )}
    </>
  );
};

export default LabSupportTypeList;
