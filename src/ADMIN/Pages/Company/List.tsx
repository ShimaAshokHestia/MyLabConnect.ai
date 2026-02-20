import React, { useState, useRef } from "react";
import Swal from "sweetalert2";
import CompanyCreateModal from "./Create";
import CompanyEditModal from "./Edit";
import CompanyViewModal from "./View";
import type { KiduColumn } from "../../../KIDU_COMPONENTS/KiduServerTable";
import CompanyService from "../../Services/Company/Company.services";
import KiduServerTableList from "../../../KIDU_COMPONENTS/KiduServerTableList";

const columns: KiduColumn[] = [
  { key: "comapanyName",  label: "Company Name",   enableSorting: true, enableFiltering: true },
  { key: "email",         label: "Email",          enableSorting: true, enableFiltering: true },
  { key: "contactNumber", label: "Contact Number", enableSorting: true, enableFiltering: true },
  { key: "website",       label: "Website",        enableSorting: true, enableFiltering: true },
  { key: "city",          label: "City",           enableSorting: true, enableFiltering: true },
  { key: "country",       label: "Country",        enableSorting: true, enableFiltering: true },
  {
    key: "isActive",
    label: "Status",
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

const CompanyList: React.FC = () => {
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
    setRecordId(row.companyId);
    setShowEdit(true);
  };

  const handleViewClick = (row: any) => {
    setRecordId(row.companyId);
    setShowView(true);
  };

  const handleDeleteClick = async (row: any) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This company will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef0d50",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await CompanyService.delete(row.companyId);
      refreshTable();
      Swal.fire("Deleted!", "Company has been deleted.", "success");
    }
  };

  return (
    <>
      <KiduServerTableList
        key={tableKey}
        title="Companies"
        subtitle="Manage company data"
        columns={columns}
        fetchService={() => CompanyService.getAll()}
        rowKey="companyId"
        showAddButton={true}
        addButtonLabel="Add Company"
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

      <CompanyCreateModal
        show={showCreate}
        onHide={() => setShowCreate(false)}
        onSuccess={() => { setShowCreate(false); refreshTable(); }}
      />

      {recordId && (
        <>
          <CompanyEditModal
            show={showEdit}
            onHide={() => setShowEdit(false)}
            onSuccess={() => { setShowEdit(false); refreshTable(); }}
            recordId={recordId}
          />
          <CompanyViewModal
            show={showView}
            onHide={() => setShowView(false)}
            recordId={recordId}
          />
        </>
      )}
    </>
  );
};

export default CompanyList;
