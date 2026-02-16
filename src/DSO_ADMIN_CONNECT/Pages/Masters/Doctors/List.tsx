// src/Pages/DSODoctor/DsoDoctorList.tsx

import React from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import type { KiduColumn, TableRequestParams, TableResponse } from "../../../../KIDU_COMPONENTS/KiduServerTable";
import type { DSODoctor, DSODoctorPaginatedRequest } from "../../../Types/Masters/DsoDoctor.types";
import DSODoctorService from "../../../Services/Masters/DsoDoctor.servics";
import KiduServerTable from "../../../../KIDU_COMPONENTS/KiduServerTable";

/**
 * DSO Doctor List Page
 * 
 * Features:
 * - Server-side pagination, sorting, and filtering
 * - Search by code, name, DSO name
 * - Export to Excel, CSV, PDF
 * - Add, Edit, View, Delete actions
 * - Responsive design
 */
const DsoDoctorList: React.FC = () => {
    const navigate = useNavigate();

    /**
     * Column definitions for the table
     */
    const columns: KiduColumn[] = [
        {
            key: "code",
            label: "Code",
            enableSorting: true,
            enableFiltering: true,
            minWidth: 120,
        },
        {
            key: "name",
            label: "Name",
            enableSorting: true,
            enableFiltering: true,
            minWidth: 200,
        },
        {
            key: "dsoName",
            label: "DSO Name",
            enableSorting: true,
            enableFiltering: true,
            minWidth: 200,
        },
        {
            key: "isActive",
            label: "Active",
            type: "checkbox",
            enableSorting: true,
            enableFiltering: true,
            width: 100,
        },
        {
            key: "createdAt",
            label: "Created Date",
            type: "date",
            enableSorting: true,
            enableFiltering: true,
            filterType: "date",
            minWidth: 150,
        },
    ];

    /**
     * Fetch data function for KiduServerTable
     * Transforms TableRequestParams to DSODoctorPaginatedRequest
     */
    const fetchDoctors = async (
        params: TableRequestParams
    ): Promise<TableResponse<DSODoctor>> => {
        try {
            // Transform generic params to DSO Doctor specific params
            const requestParams: DSODoctorPaginatedRequest = {
                pageNumber: params.pageNumber,
                pageSize: params.pageSize,
                searchTerm: params.searchTerm || "",
                sortBy: params.sortBy || "",
                sortDescending: params.sortDescending || false,
                showDeleted: false,
                showInactive: true,

                // Map column filters to specific fields
                code: params.code as string,
                name: params.name as string,
                dsoMasterId: params.dsoMasterId as number,
                dsoName: params.dsoName as string,
            };

            // Call service
            const response = await DSODoctorService.getDoctorsPaginated(requestParams);

            // Return in TableResponse format
            return {
                data: response.data,
                total: response.total,
                pageNumber: response.pageNumber,
                pageSize: response.pageSize,
                totalPages: response.totalPages,
            };
        } catch (error: any) {
            console.error("Error fetching DSO doctors:", error);
            throw new Error(error.message || "Failed to fetch DSO doctors");
        }
    };

    /**
     * Handle delete action
     */
    const handleDelete = async (doctor: DSODoctor) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${doctor.name}" (${doctor.code})?`
        );

        if (confirmed) {
            try {
                await DSODoctorService.deleteDoctor(doctor.id);

                // Show success message
                alert("Doctor deleted successfully!");

                // Refresh table (trigger re-fetch)
                window.location.reload();
            } catch (error: any) {
                console.error("Error deleting doctor:", error);
                alert(`Failed to delete doctor: ${error.message}`);
            }
        }
    };

    /**
     * Handle view action
     */
    const handleView = (doctor: DSODoctor) => {
        navigate(`/dso-doctors/view/${doctor.id}`);
    };

    /**
     * Handle edit action
     */
    const handleEdit = (doctor: DSODoctor) => {
        navigate(`/dso-doctors/edit/${doctor.id}`);
    };

    /**
     * Handle add action
     */
    const handleAdd = () => {
        navigate("/dso-doctors/add");
    };

    return (
        <Container fluid className="py-4">
            <KiduServerTable<DSODoctor>
                // Basic Configuration
                title="DSO Doctors"
                subtitle="Manage and view all doctors associated with DSO Masters"
                columns={columns}
                fetchData={fetchDoctors}
                rowKey="id"

                // Feature Toggles
                showSearch={true}
                showFilters={true}
                showColumnToggle={true}
                showDensityToggle={true}
                showExport={true}
                showAddButton={true}
                showActions={true}
                showPagination={true}
                showRowsPerPage={true}

                // Actions
                addButtonLabel="Add Doctor"
                onAddClick={handleAdd}
                onViewClick={handleView}
                onEditClick={handleEdit}
                onDeleteClick={handleDelete}

                // Customization
                rowsPerPageOptions={[10, 25, 50, 100]}
                defaultRowsPerPage={25}
                defaultDensity="comfortable"

                // Advanced Features
                stickyHeader={true}
                highlightOnHover={true}
                striped={true}
            />
        </Container>
    );
};

export default DsoDoctorList;