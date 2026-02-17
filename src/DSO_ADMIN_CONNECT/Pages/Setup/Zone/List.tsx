import React, { useState, useRef } from "react";
import KiduServerTableList from "../../../../KIDU_COMPONENTS/KiduServerTableList";
import type { KiduColumn } from "../../../../KIDU_COMPONENTS/KiduServerTable";
import DSOZoneCreateModal from "./Create";
import DSOZoneEditModal from "./Edit";
import DSOZoneViewModal from "./View";
import Swal from "sweetalert2";
import DSOZoneService from "../../../Services/Setup/DsoZone.services";

const columns: KiduColumn[] = [
    { 
        key: "name", 
        label: "Zone Name", 
        enableSorting: true, 
        enableFiltering: true 
    },
    { 
        key: "dsoName", 
        label: "DSO Master", 
        enableSorting: true, 
        enableFiltering: true 
    },
    {
        key: "isActive", 
        label: "Status", 
        type: "badge", 
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

const DSOZoneList: React.FC = () => {
    // Create Modal State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const tableKeyRef = useRef(0);
    const [tableKey, setTableKey] = useState(0);

    // Edit Modal State
    const [showEditModal, setShowEditModal] = useState(false);
    const [editRecordId, setEditRecordId] = useState<string | number>("");

    // View Modal State
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewRecordId, setViewRecordId] = useState<string | number>("");

    // Handlers
    const handleAddClick = () => {
        setShowCreateModal(true);
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

    const handleEditSuccess = () => {
        setShowEditModal(false);
        tableKeyRef.current += 1;
        setTableKey(tableKeyRef.current);
    };

    const handleViewClick = (row: any) => {
        setViewRecordId(row.id);
        setShowViewModal(true);
    };

    const handleDeleteClick = async (row: any) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This zone will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef0d50",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            await DSOZoneService.delete(row.id);
            tableKeyRef.current += 1;
            setTableKey(tableKeyRef.current);
            Swal.fire("Deleted!", "Zone has been deleted.", "success");
        }
    };

    return (
        <>
            <KiduServerTableList
                key={tableKey}
                title="DSO Zones"
                subtitle="Manage zone master data"
                columns={columns}
                fetchService={() => DSOZoneService.getAll()}
                showAddButton={true}
                addButtonLabel="Add Zone"
                onAddClick={handleAddClick}
                onEditClick={handleEditClick}
                onViewClick={handleViewClick}
                onDeleteClick={handleDeleteClick}
                showActions={true}
                rowKey="id"
                showSearch={true}
                showFilters={true}
                showExport={true}
                showColumnToggle={true}
                defaultRowsPerPage={10}
                highlightOnHover={true}
                striped={false}
            />

            {/* Create Modal */}
            <DSOZoneCreateModal
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                onSuccess={handleCreateSuccess}
            />

            {/* Edit Modal */}
            {editRecordId && (
                <DSOZoneEditModal
                    show={showEditModal}
                    onHide={() => setShowEditModal(false)}
                    onSuccess={handleEditSuccess}
                    recordId={editRecordId}
                />
            )}

            {/* View Modal */}
            {viewRecordId && (
                <DSOZoneViewModal
                    show={showViewModal}
                    onHide={() => setShowViewModal(false)}
                    recordId={viewRecordId}
                />
            )}
        </>
    );
};

export default DSOZoneList;