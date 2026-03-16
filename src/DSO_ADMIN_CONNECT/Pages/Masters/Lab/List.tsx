// src/Pages/Masters/Lab/List.tsx

import React, { useState, useRef } from "react";
import KiduServerTableList from "../../../../KIDU_COMPONENTS/KiduServerTableList";
import type { KiduColumn } from "../../../../KIDU_COMPONENTS/KiduServerTable";
import Swal from "sweetalert2";
import LabMasterService from "../../../Services/Masters/Lab.services";
import LabMasterCreateModal from "./Create";
import LabMasterEditModal from "./Edit";
import LabMasterViewModal from "./View";
import { useCurrentUser } from "../../../../Services/AuthServices/CurrentUser.services";

const columns: KiduColumn[] = [
  {
    key: "labCode",
    label: "Lab Code",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
  },
  {
    key: "labName",
    label: "Lab Name",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
  },
  {
    key: "displayName",
    label: "Display Name",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
  },
  {
    key: "email",
    label: "Email",
    enableSorting: true,
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
    filterOptions: ["Active", "Inactive"],
    render: (value) => (
      <span className={`kidu-badge kidu-badge--${value ? "active" : "inactive"}`}>
        {value ? "Active" : "Inactive"}
      </span>
    ),
  },
];

const LabMasterList: React.FC = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [recordId, setRecordId] = useState<string | number>("");
  const tableKeyRef = useRef(0);
  const [tableKey, setTableKey] = useState(0);
  
  // FIXED: Use only available properties from useCurrentUser
  const { isDSOUser, isAppAdmin } = useCurrentUser();

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
      text: "This lab will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef0d50",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await LabMasterService.delete(row.id);
        refreshTable();
        Swal.fire("Deleted!", "Lab has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to delete lab.", "error");
      }
    }
  };

  // Determine permissions based on user role
  // FIXED: Removed isLabUser
  const canAdd = isAppAdmin || isDSOUser;
  const canEdit = isAppAdmin || isDSOUser;
  const canDelete = isAppAdmin || isDSOUser;
  const canView = true; // Everyone can view

  return (
    <>
      <KiduServerTableList
        key={tableKey}
        title="Labs"
        subtitle="Manage Lab Master data"
        columns={columns}
        paginatedFetchService={LabMasterService.getPaginatedList}
        rowKey="id"
        showAddButton={canAdd}
        addButtonLabel="Add Lab"
        onAddClick={() => setShowCreate(true)}
        onEditClick={canEdit ? handleEditClick : undefined}
        onViewClick={canView ? handleViewClick : undefined}
        onDeleteClick={canDelete ? handleDeleteClick : undefined}
        showActions={true}
        showSearch={true}
        showFilters={true}
        showExport={true}
        showColumnToggle={true}
        defaultRowsPerPage={10}
        highlightOnHover={true}
        auditLogTableName="lab_master"
      />

      <LabMasterCreateModal
        show={showCreate}
        onHide={() => setShowCreate(false)}
        onSuccess={() => {
          setShowCreate(false);
          refreshTable();
        }}
      />

      {recordId && (
        <>
          <LabMasterEditModal
            show={showEdit}
            onHide={() => setShowEdit(false)}
            onSuccess={() => {
              setShowEdit(false);
              refreshTable();
            }}
            recordId={recordId}
          />
          <LabMasterViewModal
            show={showView}
            onHide={() => setShowView(false)}
            recordId={recordId}
          />
        </>
      )}
    </>
  );
};

export default LabMasterList;