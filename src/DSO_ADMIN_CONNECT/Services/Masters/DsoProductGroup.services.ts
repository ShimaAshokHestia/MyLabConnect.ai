import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { TableRequestParams, TableResponse } from "../../../KIDU_COMPONENTS/KiduServerTable";
import HttpService from "../../../Services/Common/HttpService";
import type { DSOProductGroup } from "../../Types/Masters/DsoProductGroup.types";

export default class DSOProductGroupService {

  static async getPaginatedList(params: TableRequestParams): Promise<TableResponse<DSOProductGroup>> {
    
    // Map "Active"/"Inactive" select filter to showInactive boolean
    let showInactive: boolean | undefined = undefined;
    const statusFilter = params["isActive"];
    if (statusFilter === "Active") showInactive = true;    // Active → showInactive = false (don't show inactive)
    if (statusFilter === "Inactive") showInactive = false;   // Inactive → showInactive = true (show only inactive)

    const payload = {
      pageNumber:     params.pageNumber,
      pageSize:       params.pageSize,
      searchTerm:     params.searchTerm     ?? "",
      sortBy:         params.sortBy         ?? "",
      sortDescending: params.sortDescending  ?? false,
      showDeleted:    false,
      showInactive:   showInactive,

      // Column filters — match API expected field names
      code:         params["code"]         ?? "",
      name:         params["name"]         ?? "",
      dsoMasterId:  params["dsoMasterId"]  ? Number(params["dsoMasterId"]) : undefined,
    };

    console.log("DSOProductGroup pagination payload:", payload); // Debug log

    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.DSO_PRODUCT_GROUP.UPDATE_PAGINATION,
      "POST",
      payload
    );

    const result = response?.value ?? response;

    return {
      data:       result.data         ?? result.items ?? [],
      total:      result.totalRecords  ?? result.total ?? 0,
      totalPages: result.totalPages,
    };
  }

  static async getById(id: number): Promise<any> {
    return await HttpService.callApi<any>(API_ENDPOINTS.DSO_PRODUCT_GROUP.GET_BY_ID(id), "GET");
  }

  static async create(data: Partial<DSOProductGroup>): Promise<any> {
    const payload = {
      ...data,
      isActive:  data.isActive ?? true,
      isDeleted: false,
    };
    return await HttpService.callApi<any>(API_ENDPOINTS.DSO_PRODUCT_GROUP.CREATE, "POST", payload);
  }

  static async update(id: number, data: Partial<DSOProductGroup>): Promise<any> {
    const payload = {
      id,
      ...data,
    };
    return await HttpService.callApi<any>(API_ENDPOINTS.DSO_PRODUCT_GROUP.UPDATE(id), "PUT", payload);
  }

  static async delete(id: number): Promise<void> {
    await HttpService.callApi<void>(API_ENDPOINTS.DSO_PRODUCT_GROUP.DELETE(id), "DELETE");
  }

  static async getAll(): Promise<DSOProductGroup[]> {
    const response = await HttpService.callApi<any>(API_ENDPOINTS.DSO_PRODUCT_GROUP.GET_ALL, "GET");
    const result = response?.value ?? response?.data ?? response;
    return Array.isArray(result) ? result : [];
  }
}