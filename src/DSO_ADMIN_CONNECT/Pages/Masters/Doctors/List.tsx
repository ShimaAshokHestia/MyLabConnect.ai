import React, { useState, useRef } from "react";
import KiduServerTableList from "../../../../KIDU_COMPONENTS/KiduServerTableList";
import type { KiduColumn } from "../../../../KIDU_COMPONENTS/KiduServerTable";
import DSODoctorCreateModal from "./Create";
import DSODoctorEditModal from "./Edit";
import DSODoctorViewModal from "./View";
import Swal from "sweetalert2";
import DSODoctorService from "../../../Services/Masters/DsoDoctor.services";

const columns: KiduColumn[] = [
    { 
        key: "doctorCode", 
        label: "Doctor Code", 
        enableSorting: true, 
        enableFiltering: true 
    },
    { 
        key: "fullName", 
        label: "Doctor Name", 
        enableSorting: true, 
        enableFiltering: true 
    },
    { 
        key: "email", 
        label: "Email", 
        enableSorting: true, 
        enableFiltering: true 
    },
    { 
        key: "phoneNumber", 
        label: "Phone", 
        enableSorting: true, 
        enableFiltering: true 
    },
    { 
        key: "licenseNo", 
        label: "License No", 
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

const DSODoctorList: React.FC = () => {
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
            text: "This doctor will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef0d50",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            await DSODoctorService.delete(row.id);
            tableKeyRef.current += 1;
            setTableKey(tableKeyRef.current);
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
                fetchService={() => DSODoctorService.getAll()}
                showAddButton={true}
                addButtonLabel="Add Doctor"
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
            <DSODoctorCreateModal
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                onSuccess={handleCreateSuccess}
            />

            {/* Edit Modal */}
            {editRecordId && (
                <DSODoctorEditModal
                    show={showEditModal}
                    onHide={() => setShowEditModal(false)}
                    onSuccess={handleEditSuccess}
                    recordId={editRecordId}
                />
            )}

            {/* View Modal */}
            {viewRecordId && (
                <DSODoctorViewModal
                    show={showViewModal}
                    onHide={() => setShowViewModal(false)}
                    recordId={viewRecordId}
                />
            )}
        </>
    );
};

export default DSODoctorList;