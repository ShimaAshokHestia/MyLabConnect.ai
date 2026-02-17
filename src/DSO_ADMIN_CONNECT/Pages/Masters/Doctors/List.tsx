// src/Pages/DSODoctor/DsoDoctorList.tsx

import React, { useCallback } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import KiduServerTableList from "../../../../KIDU_COMPONENTS/KiduServerTableList";
import type { KiduColumn, TableRequestParams, TableResponse } from "../../../../KIDU_COMPONENTS/KiduServerTable";
import type { DSODoctor, DSODoctorPaginatedRequest } from "../../../Types/Masters/DsoDoctor.types";
import DSODoctorService from "../../../Services/Masters/DsoDoctor.services";

// ─────────────────────────────────────────────────────────────────
// Column definitions
// ─────────────────────────────────────────────────────────────────

const columns: KiduColumn[] = [
  { key: "code",      label: "Code",         enableSorting: true, enableFiltering: true, minWidth: 120 },
  { key: "name",      label: "Name",         enableSorting: true, enableFiltering: true, minWidth: 200 },
  { key: "dsoName",   label: "DSO Name",     enableSorting: true, enableFiltering: true, minWidth: 200 },
  { key: "isActive",  label: "Active",       enableSorting: true, enableFiltering: true, type: "checkbox", width: 100 },
  { key: "createdAt", label: "Created Date", enableSorting: true, enableFiltering: true, type: "date", filterType: "date", minWidth: 150 },
];

// ─────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────

const DsoDoctorList: React.FC = () => {
  const navigate = useNavigate();

  /**
   * Adapts KiduServerTable's generic TableRequestParams into the
   * DSODoctor-specific paginated request shape, then normalises
   * the API response back to TableResponse<DSODoctor>.
   *
   * Wrapped in useCallback so the reference is stable and does not
   * cause KiduServerTableList to re-mount on every render.
   */
  const fetchDoctors = useCallback(
    async (params: TableRequestParams): Promise<TableResponse<DSODoctor>> => {
      const request: DSODoctorPaginatedRequest = {
        pageNumber:     params.pageNumber,
        pageSize:       params.pageSize,
        searchTerm:     params.searchTerm     ?? "",
        sortBy:         params.sortBy         ?? "",
        sortDescending: params.sortDescending ?? false,
        showDeleted:    false,
        showInactive:   true,
        // Column-level filter values (present only when the filter row is used)
        code:        params.code        as string | undefined,
        name:        params.name        as string | undefined,
        dsoName:     params.dsoName     as string | undefined,
        dsoMasterId: params.dsoMasterId as number | undefined,
      };

      const response = await DSODoctorService.getDoctorsPaginated(request);

      // Return only the fields KiduServerTable cares about.
      // Extra fields (pageNumber, pageSize) are fine too — TableResponse
      // accepts them via its index signature.
      return {
        data:       response.data,
        total:      response.total,
        totalPages: response.totalPages,
      };
    },
    [] // no external deps — DSODoctorService is a singleton
  );

  /**
   * Delete handler: confirms, calls the service, then lets the table
   * reload naturally on the next fetchData cycle by re-using the
   * table's own refresh mechanism via the `onSuccess` flow.
   *
   * NOTE: avoid window.location.reload() — it drops all React state.
   * Instead we navigate to the same page, which causes a clean remount.
   */
  const handleDelete = useCallback(async (doctor: DSODoctor) => {
    if (!window.confirm(`Delete "${doctor.name}" (${doctor.code})?`)) return;
    await DSODoctorService.deleteDoctor(doctor.id);
    // Soft-navigate to self to trigger a clean remount & fresh fetch
    navigate(0);
  }, [navigate]);

  // ─────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────

  return (
    <Container fluid className="py-4">
      <KiduServerTableList<DSODoctor>
        title="DSO Doctors"
        subtitle="Manage and view all doctors associated with DSO Masters"
        columns={columns}
        paginatedFetchService={fetchDoctors}
        rowKey="id"

        // ── Toolbar visibility ──────────────────────────────────
        showSearch
        showFilters
        showColumnToggle
        showDensityToggle
        showExport
        showFullscreen
        showAddButton
        showActions
        showPagination
        showRowsPerPage
        showCheckboxes
        showSelectionToggle

        // ── Actions ─────────────────────────────────────────────
        addButtonLabel="Add Doctor"
        onAddClick={() => navigate("/dso-doctors/add")}
        onViewClick={(doctor) => navigate(`/dso-doctors/view/${doctor.id}`)}
        onEditClick={(doctor) => navigate(`/dso-doctors/edit/${doctor.id}`)}
        onDeleteClick={handleDelete}

        // ── Layout ──────────────────────────────────────────────
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