import React, { useState, useRef } from "react";
import KiduServerTableList from "../../../../KIDU_COMPONENTS/KiduServerTableList";
import type { KiduColumn } from "../../../../KIDU_COMPONENTS/KiduServerTable";
import Swal from "sweetalert2";
import DSODoctorService from "../../../Services/Masters/DsoDoctor.services";
import DSODoctorCreateModal from "./Create";
import DSODoctorEditModal from "./Edit";
import DSODoctorViewModal from "./View";

const columns: KiduColumn[] = [
  {
    key: "doctorCode",
    label: "Doctor Code",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
  },
  {
    key: "fullName",
    label: "Doctor Name",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
    // sent as firstName to backend
  },
  {
    key: "email",
    label: "Email",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
    // now supported by backend ✅
  },
  {
    key: "phoneNumber",
    label: "Phone",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
    // now supported by backend ✅
  },
  {
    key: "licenseNo",
    label: "License No",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
  },
  {
    key: "dsoName",
    label: "DSO Master",
    enableSorting: true,
    enableFiltering: false, // still int-based (dsoMasterId), not filterable by name
  },
  {
    key: "isActive",
    label: "Status",
    type: "badge",
    enableSorting: false,
    enableFiltering: true,
    filterType: "select",
    filterOptions: ["Inactive", "Active"], // mapped to showInactive in service ✅
    render: (value) => (
      <span className={`kidu-badge kidu-badge--${value ? "active" : "inactive"}`}>
        {value ? "Active" : "Inactive"}
      </span>
    ),
  },
];

const DSODoctorList: React.FC = () => {
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
      text: "This doctor will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef0d50",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      await DSODoctorService.delete(row.id);
      refreshTable();
      Swal.fire("Deleted!", "Doctor has been deleted.", "success");
    }
  };

  return (
    <>
      <KiduServerTableList
        key={tableKey}
        title="DSO Doctors"
        subtitle="Manage doctor master data"
        columns={columns}
        paginatedFetchService={DSODoctorService.getPaginatedList}
        rowKey="id"
        showAddButton={true}
        addButtonLabel="Add Doctor"
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
        auditLogTableName="dso_doctor"
      />

      <DSODoctorCreateModal
        show={showCreate}
        onHide={() => setShowCreate(false)}
        onSuccess={() => { setShowCreate(false); refreshTable(); }}
      />

      {recordId && (
        <>
          <DSODoctorEditModal
            show={showEdit}
            onHide={() => setShowEdit(false)}
            onSuccess={() => { setShowEdit(false); refreshTable(); }}
            recordId={recordId}
          />
          <DSODoctorViewModal
            show={showView}
            onHide={() => setShowView(false)}
            recordId={recordId}
          />
        </>
      )}
    </>
  );
};

export default DSODoctorList;