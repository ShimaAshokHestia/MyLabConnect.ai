// src/Pages/DSODoctor/DsoDoctorList.tsx

import React from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import KiduServerTable, {
    type KiduColumn,
    type TableRequestParams,
    type TableResponse,
} from "../../../../KIDU_COMPONENTS/KiduServerTable";
import type { DSODoctor, DSODoctorPaginatedRequest } from "../../../Types/Masters/DsoDoctor.types";
import DSODoctorService from "../../../Services/Masters/DsoDoctor.servics";

const columns: KiduColumn[] = [
    { key: "code",      label: "Code",         enableSorting: true, enableFiltering: true, minWidth: 120 },
    { key: "name",      label: "Name",         enableSorting: true, enableFiltering: true, minWidth: 200 },
    { key: "dsoName",   label: "DSO Name",     enableSorting: true, enableFiltering: true, minWidth: 200 },
    { key: "isActive",  label: "Active",       enableSorting: true, enableFiltering: true, type: "checkbox", width: 100 },
    { key: "createdAt", label: "Created Date", enableSorting: true, enableFiltering: true, type: "date", filterType: "date", minWidth: 150 },
];

const DsoDoctorList: React.FC = () => {
    const navigate = useNavigate();

    const fetchDoctors = async (params: TableRequestParams): Promise<TableResponse<DSODoctor>> => {
        const requestParams: DSODoctorPaginatedRequest = {
            pageNumber:      params.pageNumber,
            pageSize:        params.pageSize,
            searchTerm:      params.searchTerm     || "",
            sortBy:          params.sortBy         || "",
            sortDescending:  params.sortDescending || false,
            showDeleted:     false,
            showInactive:    true,
            code:            params.code     as string,
            name:            params.name     as string,
            dsoMasterId:     params.dsoMasterId as number,
            dsoName:         params.dsoName   as string,
        };

        const response = await DSODoctorService.getDoctorsPaginated(requestParams);

        return {
            data:       response.data,
            total:      response.total,
            pageNumber: response.pageNumber,
            pageSize:   response.pageSize,
            totalPages: response.totalPages,
        };
    };

    const handleDelete = async (doctor: DSODoctor) => {
        if (!window.confirm(`Delete "${doctor.name}" (${doctor.code})?`)) return;
        await DSODoctorService.deleteDoctor(doctor.id);
        window.location.reload();
    };

    return (
        <Container fluid className="py-4">
            <KiduServerTable<DSODoctor>
                title="DSO Doctors"
                subtitle="Manage and view all doctors associated with DSO Masters"
                columns={columns}
                fetchData={fetchDoctors}
                rowKey="id"
                showSearch
                showFilters
                showColumnToggle
                showDensityToggle
                showExport
                showAddButton
                showActions
                showPagination
                showRowsPerPage
                addButtonLabel="Add Doctor"
                onAddClick={() => navigate("/dso-doctors/add")}
                onViewClick={(doctor) => navigate(`/dso-doctors/view/${doctor.id}`)}
                onEditClick={(doctor) => navigate(`/dso-doctors/edit/${doctor.id}`)}
                onDeleteClick={handleDelete}
                rowsPerPageOptions={[10, 25, 50, 100]}
                defaultRowsPerPage={25}
                defaultDensity="comfortable"
                stickyHeader
                highlightOnHover
                striped
            />
        </Container>
    );
};

export default DsoDoctorList;