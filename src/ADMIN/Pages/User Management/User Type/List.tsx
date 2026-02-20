import React, { useState, useRef } from "react";
import Swal from "sweetalert2";
import UserTypeCreateModal from "./Create";
import UserTypeEditModal from "./Edit";
import UserTypeViewModal from "./View";
import type { KiduColumn } from "../../../../KIDU_COMPONENTS/KiduServerTable";
import UserTypeService from "../../../Services/User Management/UserType.services";
import KiduServerTableList from "../../../../KIDU_COMPONENTS/KiduServerTableList";

const columns: KiduColumn[] = [
  { 
    key: "userTypeName",   
    label: "User Type Name", 
    enableSorting: true, 
    enableFiltering: true,
    filterType: "text",
  },
  { 
    key: "isAdminAdable",  
    label: "Admin Addable",  
    enableSorting: true,
    enableFiltering: true,
    filterType: "select",
    filterOptions: ["Yes", "No"],
    render: (value) => (
      <span className={`kidu-badge kidu-badge--${value ? "active" : "inactive"}`}>
        {value ? "Yes" : "No"}
      </span>
    ),
  },
  { 
    key: "isDSOAddable",   
    label: "DSO Addable",    
    enableSorting: true,
    enableFiltering: true,
    filterType: "select",
    filterOptions: ["Yes", "No"],
    render: (value) => (
      <span className={`kidu-badge kidu-badge--${value ? "active" : "inactive"}`}>
        {value ? "Yes" : "No"}
      </span>
    ),
  },
  { 
    key: "isLabAddable",   
    label: "Lab Addable",    
    enableSorting: true,
    enableFiltering: true,
    filterType: "select",
    filterOptions: ["Yes", "No"],
    render: (value) => (
      <span className={`kidu-badge kidu-badge--${value ? "active" : "inactive"}`}>
        {value ? "Yes" : "No"}
      </span>
    ),
  },
  { 
    key: "isDoctorAddable",
    label: "Doctor Addable", 
    enableSorting: true,
    enableFiltering: true,
    filterType: "select",
    filterOptions: ["Yes", "No"],
    render: (value) => (
      <span className={`kidu-badge kidu-badge--${value ? "active" : "inactive"}`}>
        {value ? "Yes" : "No"}
      </span>
    ),
  },
  { 
    key: "isPMAddable",    
    label: "PM Addable",     
    enableSorting: true,
    enableFiltering: true,
    filterType: "select",
    filterOptions: ["Yes", "No"],
    render: (value) => (
      <span className={`kidu-badge kidu-badge--${value ? "active" : "inactive"}`}>
        {value ? "Yes" : "No"}
      </span>
    ),
  },
  {
    key: "isActive",
    label: "Status",
    type: "badge",
    enableSorting: false,
    enableFiltering: true,
    filterType: "select",
    filterOptions: ["Inactive", "Active"], // Order matters for backend mapping
    render: (value) => (
      <span className={`kidu-badge kidu-badge--${value ? "active" : "inactive"}`}>
        {value ? "Active" : "Inactive"}
      </span>
    ),
  },
];

const UserTypeList: React.FC = () => {
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
      text: "This User Type will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef0d50",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      await UserTypeService.delete(row.id);
      refreshTable();
      Swal.fire("Deleted!", "User Type has been deleted.", "success");
    }
  };

  return (
    <>
      <KiduServerTableList
        key={tableKey}
        title="User Types"
        subtitle="Manage User Type data"
        columns={columns}
        paginatedFetchService={UserTypeService.getPaginatedList}
        rowKey="id"
        showAddButton={true}
        addButtonLabel="Add User Type"
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
        auditLogTableName="user_type"
      />

      <UserTypeCreateModal
        show={showCreate}
        onHide={() => setShowCreate(false)}
        onSuccess={() => { setShowCreate(false); refreshTable(); }}
      />

      {recordId && (
        <>
          <UserTypeEditModal
            show={showEdit}
            onHide={() => setShowEdit(false)}
            onSuccess={() => { setShowEdit(false); refreshTable(); }}
            recordId={recordId}
          />
          <UserTypeViewModal
            show={showView}
            onHide={() => setShowView(false)}
            recordId={recordId}
          />
        </>
      )}
    </>
  );
};

export default UserTypeList;