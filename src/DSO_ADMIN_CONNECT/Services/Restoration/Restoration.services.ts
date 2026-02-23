import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { TableRequestParams, TableResponse } from "../../../KIDU_COMPONENTS/KiduServerTable";
import HttpService from "../../../Services/Common/HttpService";
import type { DSORestoration } from "../../Types/Restoration/Restoration.types";

export default class DSORestorationTypeService {

  static async getPaginatedList(params: TableRequestParams): Promise<TableResponse<DSORestoration>> {

    // Map "Active"/"Inactive" select filter to showInactive boolean
    let showInactive: boolean | undefined = undefined;
    const statusFilter = params["isActive"];
    if (statusFilter === "Active")   showInactive = true;
    if (statusFilter === "Inactive") showInactive = false;

    const payload = {
      pageNumber:     params.pageNumber,
      pageSize:       params.pageSize,
      searchTerm:     params.searchTerm      ?? "",
      sortBy:         params.sortBy          ?? "",
      sortDescending: params.sortDescending  ?? false,
      showDeleted:    false,
      showInactive,

      // Column filters
      id:                 params["id"]                 ? Number(params["id"]) : undefined,
      name:               params["name"]               ?? "",
      dsoProthesisTypeId: params["dsoProthesisTypeId"] ? Number(params["dsoProthesisTypeId"]) : undefined,
    };

    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.DSO_RESTORATION_TYPE.UPDATE_PAGINATION,
      "POST",
      payload
    );

    const result = response?.value ?? response;

    return {
      data:       result.data        ?? result.items ?? [],
      total:      result.totalRecords ?? result.total ?? 0,
      totalPages: result.totalPages,
    };
  }

  static async getById(id: number): Promise<any> {
    return await HttpService.callApi<any>(
      API_ENDPOINTS.DSO_RESTORATION_TYPE.GET_BY_ID(id),
      "GET"
    );
  }

  static async create(data: Partial<DSORestoration>): Promise<any> {
    const payload = {
      ...data,
      isActive:  data.isActive ?? true,
      isDeleted: false,
    };
    return await HttpService.callApi<any>(
      API_ENDPOINTS.DSO_RESTORATION_TYPE.CREATE,
      "POST",
      payload
    );
  }

  static async update(id: number, data: Partial<DSORestoration>): Promise<any> {
    const payload = { id, ...data };
    return await HttpService.callApi<any>(
      API_ENDPOINTS.DSO_RESTORATION_TYPE.UPDATE(id),
      "PUT",
      payload
    );
  }

  static async delete(id: number): Promise<void> {
    await HttpService.callApi<void>(
      API_ENDPOINTS.DSO_RESTORATION_TYPE.DELETE(id),
      "DELETE"
    );
  }

  static async getAll(): Promise<DSORestoration[]> {
    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.DSO_RESTORATION_TYPE.GET_ALL,
      "GET"
    );
    const result = response?.value ?? response?.data ?? response;
    return Array.isArray(result) ? result : [];
  }
}