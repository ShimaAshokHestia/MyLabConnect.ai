import React, { useState, useRef } from "react";
import KiduServerTableList from "../../../../KIDU_COMPONENTS/KiduServerTableList";
import DSOProductGroupService from "../../../Services/Masters/DsoProductGroup.services";
import type { KiduColumn } from "../../../../KIDU_COMPONENTS/KiduServerTable";
import DsoProductGroupCreateModal from "./Create";

const columns: KiduColumn[] = [
  { key: "code",       label: "Code",       enableSorting: true,  enableFiltering: true },
  { key: "name",       label: "Name",       enableSorting: true,  enableFiltering: true },
  { key: "dsoMaster",  label: "DSO Master", enableSorting: true,  enableFiltering: true },
  { key: "isActive",   label: "Status",     type: "badge",        enableFiltering: true,
    filterType: "select", filterOptions: ["Active", "Inactive"],
    render: (value) => (
      <span className={`kidu-badge kidu-badge--${value ? "active" : "inactive"}`}>
        {value ? "Active" : "Inactive"}
      </span>
    ),
  },
];

const DsoProductGroupList: React.FC = () => {

  const [showCreateModal, setShowCreateModal] = useState(false);

  const tableKeyRef = useRef(0);
  const [tableKey, setTableKey] = useState(0);

  const handleAddClick = () => {
    setShowCreateModal(true);
  };

  const handleModalHide = () => {
    setShowCreateModal(false);
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    tableKeyRef.current += 1;
    setTableKey(tableKeyRef.current);
  };

  return (
    <>
      <KiduServerTableList
        key={tableKey}                 
        title="DSO Product Groups"
        subtitle="Manage product group master data"
        columns={columns}
        fetchService={() => DSOProductGroupService.getAll()}
        showAddButton={true}
        addButtonLabel="Add Product Group"
        onAddClick={handleAddClick}
        showActions={true}
        onDeleteClick={(row) => {
          // replace with your delete service + confirmation
          console.log("Delete", row);
        }}
        rowKey="id"
        showSearch={true}
        showFilters={true}
        showExport={true}
        showColumnToggle={true}
        defaultRowsPerPage={10}
        highlightOnHover={true}
        striped={false}
      />
      <DsoProductGroupCreateModal
        show={showCreateModal}
        onHide={handleModalHide}
        onSuccess={handleCreateSuccess}
      />
    </>
  );
};

export default DsoProductGroupList;
