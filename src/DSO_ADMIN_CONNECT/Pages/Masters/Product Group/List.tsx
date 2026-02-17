import React, { useState, useRef } from "react";
import KiduServerTableList from "../../../../KIDU_COMPONENTS/KiduServerTableList";
import DSOProductGroupService from "../../../Services/Masters/DsoProductGroup.services";
import type { KiduColumn } from "../../../../KIDU_COMPONENTS/KiduServerTable";
import DsoProductGroupCreateModal from "./Create";
import DsoProductGroupEditModal from "./Edit";
import DsoProductGroupViewModal from "./View";
import Swal from "sweetalert2";

const columns: KiduColumn[] = [
    { key: "code", label: "Code", enableSorting: true, enableFiltering: true },
    { key: "name", label: "Name", enableSorting: true, enableFiltering: true },
    { key: "dsoName", label: "DSO Master", enableSorting: true, enableFiltering: true },
    {
        key: "isActive", label: "Status", type: "badge", enableFiltering: true,
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

    const [showEditModal, setShowEditModal] = useState(false);
    const [editRecordId, setEditRecordId] = useState<string | number>("");

    const [showViewModal, setShowViewModal] = useState(false);
    const [viewRecordId, setViewRecordId] = useState<string | number>("");

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
    const handleEditClick = (row: any) => {
        setEditRecordId(row.id);
        setShowEditModal(true);
    };

    const handleViewClick = (row: any) => {
        setViewRecordId(row.id);
        setShowViewModal(true);
    };

    const handleEditSuccess = () => {
        setShowEditModal(false);
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
                onEditClick={handleEditClick}
                onViewClick={handleViewClick}
                showActions={true}
                onDeleteClick={async (row: any) => {
                    const result = await Swal.fire({
                        title: "Are you sure?",
                        text: "This record will be permanently deleted.",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#ef0d50",
                        cancelButtonColor: "#6c757d",
                        confirmButtonText: "Yes, delete it!",
                        cancelButtonText: "Cancel",
                    });

                    if (result.isConfirmed) {
                        await DSOProductGroupService.delete(row.id);
                        tableKeyRef.current += 1;
                        setTableKey(tableKeyRef.current);
                    }
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
            {editRecordId && (
                <DsoProductGroupEditModal
                    show={showEditModal}
                    onHide={() => setShowEditModal(false)}
                    onSuccess={handleEditSuccess}
                    recordId={editRecordId}
                />
            )}

            {viewRecordId && (
                <DsoProductGroupViewModal
                    show={showViewModal}
                    onHide={() => setShowViewModal(false)}
                    recordId={viewRecordId}
                />
            )}
        </>
    );
};

export default DsoProductGroupList;
