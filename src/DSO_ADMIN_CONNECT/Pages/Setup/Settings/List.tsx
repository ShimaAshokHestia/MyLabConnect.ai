import React, { useState, useRef } from "react";
import KiduServerTableList from "../../../../KIDU_COMPONENTS/KiduServerTableList";
import type { KiduColumn } from "../../../../KIDU_COMPONENTS/KiduServerTable";
import Swal from "sweetalert2";
import DSOSettingCreateModal from "./Create";
import DSOSettingEditModal from "./Edit";
import DSOSettingViewModal from "./View";
import DSOSettingService from "../../../Services/Setup/DSOSetting.services";

const columns: KiduColumn[] = [
  {
    key: "settingType",
    label: "Setting Type",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
  },
  {
    key: "key",
    label: "Key",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
  },
  {
    key: "value",
    label: "Value",
    enableSorting: true,
    enableFiltering: false,
    filterType: "text",
  },
  {
    key: "dsoName",
    label: "DSO Master",
    enableSorting: true,
    enableFiltering: false,
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
];

const DSOSettingList: React.FC = () => {
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
      text: "This setting will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef0d50",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      await DSOSettingService.delete(row.id);
      refreshTable();
      Swal.fire("Deleted!", "Setting has been deleted.", "success");
    }
  };

  return (
    <>
      <KiduServerTableList
        key={tableKey}
        title="DSO Settings"
        subtitle="Manage DSO setting configurations"
        columns={columns}
        paginatedFetchService={DSOSettingService.getPaginatedList}
        rowKey="id"
        showAddButton={true}
        addButtonLabel="Add Setting"
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
        auditLogTableName="dso_setting"
      />

      <DSOSettingCreateModal
        show={showCreate}
        onHide={() => setShowCreate(false)}
        onSuccess={() => { setShowCreate(false); refreshTable(); }}
      />

      {recordId && (
        <>
          <DSOSettingEditModal
            show={showEdit}
            onHide={() => setShowEdit(false)}
            onSuccess={() => { setShowEdit(false); refreshTable(); }}
            recordId={recordId}
          />
          <DSOSettingViewModal
            show={showView}
            onHide={() => setShowView(false)}
            recordId={recordId}
          />
        </>
      )}
    </>
  );
};

export default DSOSettingList;