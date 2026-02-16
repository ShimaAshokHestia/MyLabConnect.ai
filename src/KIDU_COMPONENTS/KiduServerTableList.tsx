import React from "react";
import type { KiduColumn, TableRequestParams, TableResponse } from "./KiduServerTable";
import KiduServerTable from "./KiduServerTable";

interface KiduServerTableListProps<T> {
  // Service function - supports both paginated and non-paginated
  fetchService?: () => Promise<T[]>;
  paginatedFetchService?: (params: TableRequestParams) => Promise<TableResponse<T>>;
  transformData?: (data: T[]) => T[];

  // Pass through all KiduServerTable props
  columns: KiduColumn[];
  title?: string;
  subtitle?: string;
  rowKey?: keyof T;
  
  // Feature flags
  showSearch?: boolean;
  showFilters?: boolean;
  showColumnToggle?: boolean;
  showDensityToggle?: boolean;
  showExport?: boolean;
  showAddButton?: boolean;
  showActions?: boolean;
  showPagination?: boolean;
  showRowsPerPage?: boolean;

  // Actions
  addRoute?: string;
  editRoute?: string;
  viewRoute?: string;
  deleteRoute?: string;
  onAddClick?: () => void;
  onEditClick?: (row: T) => void;
  onViewClick?: (row: T) => void;
  onDeleteClick?: (row: T) => void;
  onRowClick?: (row: T) => void;

  // Customization
  addButtonLabel?: string;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  defaultDensity?: "compact" | "comfortable" | "spacious";
  customFilters?: React.ReactNode;
  additionalButtons?: React.ReactNode;

  // Advanced
  enableMultiSort?: boolean;
  enableRowSelection?: boolean;
  stickyHeader?: boolean;
  highlightOnHover?: boolean;
  striped?: boolean;
}

/**
 * KiduServerTableList - Wrapper component for KiduServerTable
 * 
 * Provides backwards compatibility with existing KiduServerTable implementations
 * while offering the new advanced features.
 * 
 * @example
 * ```tsx
 * <KiduServerTableList
 *   title="Doctors"
 *   columns={[
 *     { key: 'firstName', label: 'First Name' },
 *     { key: 'lastName', label: 'Last Name' },
 *     { key: 'licenseNo', label: 'License' }
 *   ]}
 *   paginatedFetchService={doctorService.getPaginated}
 *   editRoute="/doctors/edit"
 *   viewRoute="/doctors/view"
 *   showAddButton
 *   addRoute="/doctors/add"
 * />
 * ```
 */
function KiduServerTableList<T extends Record<string, any>>({
  fetchService,
  paginatedFetchService,
  transformData,
  ...props
}: KiduServerTableListProps<T>) {
  // Cache for non-paginated services
  let cachedData: T[] | null = null;

  /**
   * Unified fetch function that works with both paginated and non-paginated services
   */
  const fetchData = async (params: TableRequestParams): Promise<TableResponse<T>> => {
    try {
      // If paginated service is provided, use it directly
      if (paginatedFetchService) {
        const result = await paginatedFetchService(params);

        // Apply transformation if provided
        if (transformData && result.data) {
          result.data = transformData(result.data);
        }

        return result;
      }

      // Otherwise, use the non-paginated service with client-side pagination
      if (!fetchService) {
        throw new Error("Either fetchService or paginatedFetchService must be provided");
      }

      // Fetch all data only once (on first call or when cache is empty)
      if (!cachedData) {
        let allData = await fetchService();

        // Apply transformation if provided
        if (transformData) {
          allData = transformData(allData);
        }

        // Reverse to show latest records first
        allData.reverse();

        cachedData = allData;
      }

      // Work with cached data
      let filteredData = cachedData;

      // Filter by search term
      if (params.searchTerm) {
        const searchLower = params.searchTerm.toLowerCase();
        filteredData = cachedData.filter((item) =>
          props.columns.some((col) => {
            const value = item[col.key];
            if (value === null || value === undefined) return false;
            return String(value).toLowerCase().includes(searchLower);
          })
        );
      }

      // Apply column filters
      Object.entries(params).forEach(([key, value]) => {
        if (
          value &&
          key !== "pageNumber" &&
          key !== "pageSize" &&
          key !== "searchTerm" &&
          key !== "sortBy" &&
          key !== "sortDescending"
        ) {
          filteredData = filteredData.filter((item) => {
            const itemValue = item[key];
            if (itemValue === null || itemValue === undefined) return false;
            return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
          });
        }
      });

      // Sort if needed
      if (params.sortBy) {
        filteredData = [...filteredData].sort((a, b) => {
          const aVal = a[params.sortBy!];
          const bVal = b[params.sortBy!];
          
          if (aVal === null || aVal === undefined) return 1;
          if (bVal === null || bVal === undefined) return -1;

          const comparison = String(aVal).localeCompare(String(bVal), undefined, {
            numeric: true,
          });

          return params.sortDescending ? -comparison : comparison;
        });
      }

      // Return paginated slice
      const start = (params.pageNumber - 1) * params.pageSize;
      const end = start + params.pageSize;

      return {
        data: filteredData.slice(start, end),
        total: filteredData.length,
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
        totalPages: Math.ceil(filteredData.length / params.pageSize),
      };
    } catch (error: any) {
      console.error(`Error fetching ${props.title || "data"}:`, error);
      cachedData = null; // Clear cache on error
      throw new Error(error.message || `Failed to fetch ${props.title || "data"}`);
    }
  };

  return <KiduServerTable<T> {...props} fetchData={fetchData} />;
}

export default KiduServerTableList;