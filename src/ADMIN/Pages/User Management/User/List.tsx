import React, { useState, useRef } from "react";
import Swal from "sweetalert2";
import UserCreateModal from "./Create";
import UserEditModal from "./Edit";
import UserViewModal from "./View";
import type { KiduColumn } from "../../../../KIDU_COMPONENTS/KiduServerTable";
import UserService from "../../../Services/User Management/User.services";
import KiduServerTableList from "../../../../KIDU_COMPONENTS/KiduServerTableList";

const authTypeLabels: Record<number, string> = { 
  1: "Normal", 
  2: "SSO", 
  3: "Basic" 
};

const columns: KiduColumn[] = [
  { 
    key: "userName",     
    label: "User Name",   
    enableSorting: true, 
    enableFiltering: true,
    filterType: "text",
  },
  { 
    key: "userEmail",    
    label: "Email",        
    enableSorting: true, 
    enableFiltering: true,
    filterType: "text",
  },
  { 
    key: "phoneNumber",  
    label: "Phone Number", 
    enableSorting: true, 
    enableFiltering: true,
    filterType: "text",
  },
  { 
    key: "companyName",  
    label: "Company",      
    enableSorting: true, 
    enableFiltering: false, // Not filterable by name (uses companyId)
  },
  { 
    key: "userTypeName", 
    label: "User Type",    
    enableSorting: true, 
    enableFiltering: false, // Not filterable by name (uses userTypeId)
  },
  {
    key: "authenticationType",
    label: "Auth Type",
    enableSorting: true,
    enableFiltering: true,
    filterType: "select",
    filterOptions: ["Normal", "SSO", "Basic"], // Match your auth type values
    render: (value) => {
      const label = typeof value === 'number' ? authTypeLabels[value] : value;
      return <span>{label ?? "Unknown"}</span>;
    },
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

const UserList: React.FC = () => {
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
      text: "This User will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef0d50",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      await UserService.delete(row.id);
      refreshTable();
      Swal.fire("Deleted!", "User has been deleted.", "success");
    }
  };

  return (
    <>
      <KiduServerTableList
        key={tableKey}
        title="Users"
        subtitle="Manage User data"
        columns={columns}
        paginatedFetchService={UserService.getPaginatedList}
        rowKey="id"
        showAddButton={true}
        addButtonLabel="Add User"
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
        auditLogTableName="user"
      />

      <UserCreateModal
        show={showCreate}
        onHide={() => setShowCreate(false)}
        onSuccess={() => { setShowCreate(false); refreshTable(); }}
      />

      {recordId && (
        <>
          <UserEditModal
            show={showEdit}
            onHide={() => setShowEdit(false)}
            onSuccess={() => { setShowEdit(false); refreshTable(); }}
            recordId={recordId}
          />
          <UserViewModal
            show={showView}
            onHide={() => setShowView(false)}
            recordId={recordId}
          />
        </>
      )}
    </>
  );
};

export default UserList;