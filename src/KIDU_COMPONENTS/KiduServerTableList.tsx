import  { useRef } from "react";
import KiduServerTable, { type KiduServerTableProps, type TableRequestParams, type TableResponse } from "./KiduServerTable";

/**
 * All KiduServerTable props are supported EXCEPT `fetchData`
 * (which is built internally from fetchService / paginatedFetchService).
 *
 * Additionally exposes:
 *   • fetchService          – () => Promise<T[]>           (non-paginated)
 *   • paginatedFetchService – (params) => Promise<TableResponse<T>>  (paginated)
 *   • transformData         – optional post-fetch transform
 */
export interface KiduServerTableListProps<T>
  extends Omit<KiduServerTableProps<T>, "fetchData"> {
  fetchService?: () => Promise<T[]>;
  paginatedFetchService?: (params: TableRequestParams) => Promise<TableResponse<T>>;
  transformData?: (data: T[]) => T[];
}

function KiduServerTableList<T extends Record<string, any>>({
  fetchService,
  paginatedFetchService,
  transformData,
  ...tableProps
}: KiduServerTableListProps<T>) {

  const cachedDataRef = useRef<T[] | null>(null);

  const fetchData = async (params: TableRequestParams): Promise<TableResponse<T>> => {
    try {
      // ── Paginated path ─────────────────────────
      if (paginatedFetchService) {
        const result = await paginatedFetchService(params);
        if (transformData && result.data) {
          result.data = transformData(result.data);
        }
        return result;
      }

      // ── Non-paginated path (client-side pagination) ────────────
      if (!fetchService) {
        throw new Error("Either fetchService or paginatedFetchService must be provided.");
      }

      // Fetch once; reuse the cache for subsequent page / sort changes
      if (!cachedDataRef.current) {
        let allData = await fetchService();
        if (transformData) allData = transformData(allData);
        // Reverse so the latest records appear first
        allData.reverse();
        cachedDataRef.current = allData;
      }

      let filteredData = cachedDataRef.current;

      // Global search
      if (params.searchTerm) {
        const q = params.searchTerm.toLowerCase();
        filteredData = filteredData.filter((item) =>
          tableProps.columns.some((col) => {
            const val = item[col.key];
            return val !== null && val !== undefined && String(val).toLowerCase().includes(q);
          })
        );
      }

      // Column-level filters (extra keys beyond the standard pagination params)
      const SKIP_KEYS = new Set(["pageNumber", "pageSize", "searchTerm", "sortBy", "sortDescending"]);
      Object.entries(params).forEach(([key, value]) => {
        if (!SKIP_KEYS.has(key) && value !== undefined && value !== null && value !== "") {
          filteredData = filteredData.filter((item) => {
            const itemVal = item[key];
            return itemVal !== null
              && itemVal !== undefined
              && String(itemVal).toLowerCase().includes(String(value).toLowerCase());
          });
        }
      });

      // Sorting
      if (params.sortBy) {
        const key = params.sortBy;
        filteredData = [...filteredData].sort((a, b) => {
          const av = a[key];
          const bv = b[key];
          if (av === null || av === undefined) return 1;
          if (bv === null || bv === undefined) return -1;
          const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
          return params.sortDescending ? -cmp : cmp;
        });
      }

      // Client-side pagination slice
      const start = (params.pageNumber - 1) * params.pageSize;
      const end   = start + params.pageSize;

      return {
        data: filteredData.slice(start, end),
        total: filteredData.length,
        totalPages: Math.ceil(filteredData.length / params.pageSize),
      };

    } catch (error: any) {
      cachedDataRef.current = null; // clear cache on error so next call re-fetches
      throw new Error(error.message ?? `Failed to fetch ${tableProps.title ?? "data"}`);
    }
  };

  return <KiduServerTable<T> {...tableProps} fetchData={fetchData} />;
}

export default KiduServerTableList;