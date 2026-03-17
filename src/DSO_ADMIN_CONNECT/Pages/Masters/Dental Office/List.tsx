// src/Pages/Masters/DentalOffice/List.tsx

import React, { useState, useRef } from "react";
import KiduServerTableList from "../../../../KIDU_COMPONENTS/KiduServerTableList";
import type { KiduColumn } from "../../../../KIDU_COMPONENTS/KiduServerTable";
import Swal from "sweetalert2";
import DentalOfficeService from "../../../Services/Masters/DsoDentalOffice.services";
import DentalOfficeCreateModal from "./Create";
import DentalOfficeEditModal from "./Edit";
import DentalOfficeViewModal from "./View";

const columns: KiduColumn[] = [
  {
    key: "officeCode",
    label: "Office Code",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
  },
  {
    key: "officeName",
    label: "Office Name",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
  },
  {
    key: "city",
    label: "City",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
  },
  {
    key: "country",
    label: "Country",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
  },
  {
    key: "dsoZoneName",
    label: "DSO Zone",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
    render: (value, row) => <span>{value || `Zone #${row.dsoZoneId}`}</span>,
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

const DentalOfficeList: React.FC = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);
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

  const handleViewClick = (row: any) => {
    setRecordId(row.id);
    setShowView(true);
  };

  const handleDeleteClick = async (row: any) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This dental office will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef0d50",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await DentalOfficeService.delete(row.id);
        refreshTable();
        Swal.fire("Deleted!", "Dental office has been deleted.", "success");
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire("Error!", "Failed to delete dental office.", "error");
      }
    }
  };

  return (
    <>
      <KiduServerTableList
        key={tableKey}
        title="Dental Offices"
        subtitle="Manage dental office master data"
        columns={columns}
        paginatedFetchService={DentalOfficeService.getPaginatedList}
        rowKey="id"
        showAddButton={true}
        addButtonLabel="Add Dental Office"
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
        auditLogTableName="dso_dental_office"
      />

      <DentalOfficeCreateModal
        show={showCreate}
        onHide={() => setShowCreate(false)}
        onSuccess={() => {
          setShowCreate(false);
          refreshTable();
        }}
      />

      {recordId > 0 && (
        <>
          <DentalOfficeEditModal
            show={showEdit}
            onHide={() => setShowEdit(false)}
            onSuccess={() => {
              setShowEdit(false);
              refreshTable();
            }}
            recordId={recordId}
          />
          <DentalOfficeViewModal
            show={showView}
            onHide={() => setShowView(false)}
            recordId={recordId}
          />
        </>
      )}
    </>
  );
};

export default DentalOfficeList;