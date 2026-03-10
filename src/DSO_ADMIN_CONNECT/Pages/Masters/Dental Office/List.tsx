import React, { useState, useRef } from "react";
import KiduServerTableList from "../../../../KIDU_COMPONENTS/KiduServerTableList";
import type { KiduColumn } from "../../../../KIDU_COMPONENTS/KiduServerTable";
import Swal from "sweetalert2";
import DSOOfficeCreateModal from "./Create";
import DSOOfficeEditModal from "./Edit";
import DSOOfficeViewModal from "./View";
import DSODentalOfficeService from "../../../Services/Masters/DsoDentalOffice.services";

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
  // {
  //   key: "dsoMasterId",
  //   label: "DSO Master",
  //   enableSorting: true,
  //   enableFiltering: true,
  //   filterType: "text",
  //   render: (value, row) => <span>{row.dsoName || `DSO #${value}`}</span>,
  // },
  {
    key: "info",
    label: "Info",
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
    filterOptions: ["Active", "Inactive"],
    render: (value) => (
      <span className={`kidu-badge kidu-badge--${value ? "active" : "inactive"}`}>
        {value ? "Active" : "Inactive"}
      </span>
    ),
  },
  // {
  //   key: "createdAt",
  //   label: "Created Date",
  //   type: "date",
  //   enableSorting: true,
  //   enableFiltering: false,
  // },
];

const DSODentalOfficeList: React.FC = () => {
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
        await DSODentalOfficeService.delete(row.id);
        refreshTable();
        Swal.fire("Deleted!", "Dental office has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to delete dental office.", "error");
      }
    }
  };

  return (
    <>
      <KiduServerTableList
        key={tableKey}
        title="DSO Dental Offices"
        subtitle="Manage dental office master data"
        columns={columns}
        paginatedFetchService={DSODentalOfficeService.getPaginatedList}
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
        auditLogTableName="DSO_DentalOffice"
      />

      <DSOOfficeCreateModal
        show={showCreate}
        onHide={() => setShowCreate(false)}
        onSuccess={() => {
          setShowCreate(false);
          refreshTable();
        }}
      />

      {recordId > 0 && (
        <>
          <DSOOfficeEditModal
            show={showEdit}
            onHide={() => setShowEdit(false)}
            onSuccess={() => {
              setShowEdit(false);
              refreshTable();
            }}
            recordId={recordId}
          />
          <DSOOfficeViewModal
            show={showView}
            onHide={() => setShowView(false)}
            recordId={recordId}
          />
        </>
      )}
    </>
  );
};

export default DSODentalOfficeList;