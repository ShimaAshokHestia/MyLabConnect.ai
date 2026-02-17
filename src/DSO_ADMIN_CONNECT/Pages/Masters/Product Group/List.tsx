import React, { useCallback } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import KiduServerTableList from "../../../../KIDU_COMPONENTS/KiduServerTableList";
import type { KiduColumn, TableRequestParams, TableResponse } from "../../../../KIDU_COMPONENTS/KiduServerTable";
import type { DSOProductGroup } from "../../../Types/Masters/DsoProductGroup.types";
import DSOProductGroupService from "../../../Services/Masters/DsoProductGroup.services";

const columns: KiduColumn[] = [
  { key: "code", label: "Code", enableSorting: true, enableFiltering: true, minWidth: 120 },
  { key: "name", label: "Name", enableSorting: true, enableFiltering: true, minWidth: 200 },
  { key: "dsoName", label: "DSO Name", enableSorting: true, enableFiltering: true, minWidth: 200 },
  { key: "isActive", label: "Active", enableSorting: true, enableFiltering: true, type: "checkbox", width: 100 },
  { key: "createdAt", label: "Created Date", enableSorting: true, enableFiltering: true, type: "date", filterType: "date", minWidth: 150 },
];

const DsoProductGroupList: React.FC = () => {
  const navigate = useNavigate();

  const fetchProductGroups = useCallback(
    async (params: TableRequestParams): Promise<TableResponse<DSOProductGroup>> => {

      const payload: DSOProductGroup = {
        pageNumber:     params.pageNumber,
        pageSize:       params.pageSize,
        searchTerm:     params.searchTerm ?? "",
        sortBy:         params.sortBy ?? "",
        sortDescending: params.sortDescending ?? false,
        showDeleted:    false,
        showInactive:   true,
        code: params.code as string | undefined,
        name: params.name as string | undefined,
        dsoName: params.dsoName as string | undefined,
        dsoMasterId: params.dsoMasterId as number | undefined,
      };

      const response = await DSOProductGroupService.getPaginated(payload);

      return {
        data: response.data,
        total: response.totalCount,
        totalPages: Math.ceil(response.totalCount / params.pageSize),
      };
    },
    []
  );

  const handleDelete = useCallback(async (group: DSOProductGroup) => {
    if (!window.confirm(`Delete "${group.name}" (${group.code})?`)) return;
    await DSOProductGroupService.delete(group.id!);
    navigate(0);
  }, [navigate]);

  return (
    <Container fluid className="py-4">
      <KiduServerTableList<DSOProductGroup>
        title="DSO Product Groups"
        subtitle="Manage product groups associated with DSO Masters"
        columns={columns}
        paginatedFetchService={fetchProductGroups}
        rowKey="id"
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
        addButtonLabel="Add Product Group"
        onAddClick={() => navigate("/dso-product-groups/add")}
        onViewClick={(row) => navigate(`/dso-product-groups/view/${row.id}`)}
        onEditClick={(row) => navigate(`/dso-product-groups/edit/${row.id}`)}
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

export default DsoProductGroupList;
