import React, { useState, useRef } from "react";
import KiduServerTableList from "../../../../KIDU_COMPONENTS/KiduServerTableList";
import type { KiduColumn } from "../../../../KIDU_COMPONENTS/KiduServerTable";
import Swal from "sweetalert2";
import LabSupportTypeService from "../../../Services/Masters/SupportTypes.services";
import LabSupportTypeCreateModal from "./Create";
import LabSupportTypeEditModal from "./Edit";

const columns: KiduColumn[] = [
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
];

const LabSupportTypeList: React.FC = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
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

  const handleDeleteClick = async (row: any) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This support type will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef0d50",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await LabSupportTypeService.delete(row.id);
        refreshTable();
        Swal.fire("Deleted!", "Support type has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to delete support type.", "error");
      }
    }
  };

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
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        showActions={true}
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