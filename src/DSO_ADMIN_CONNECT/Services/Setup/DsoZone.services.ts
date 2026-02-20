import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { TableRequestParams, TableResponse } from "../../../KIDU_COMPONENTS/KiduServerTable";
import HttpService from "../../../Services/Common/HttpService";
import type { DSOZone } from "../../Types/Setup/DsoZone.types";

export default class DSOZoneService {

  static async getPaginatedList(params: TableRequestParams): Promise<TableResponse<DSOZone>> {
    
    // Map "Active"/"Inactive" select filter to showInactive boolean
    let showInactive: boolean | undefined = undefined;
    const statusFilter = params["isActive"];
    if (statusFilter === "Active")   showInactive = true;
    if (statusFilter === "Inactive") showInactive = false;

    const payload = {
      pageNumber:     params.pageNumber,
      pageSize:       params.pageSize,
      searchTerm:     params.searchTerm     ?? "",
      sortBy:         params.sortBy         ?? "",
      sortDescending: params.sortDescending  ?? false,
      showDeleted:    false,
      showInactive:   showInactive,          // undefined = backend default (show all)

      // Column filters — keys match DSOZonePaginationParams exactly
      zoneCode:     params["zoneCode"]     ?? "",
      zoneName:     params["zoneName"]     ?? "",
      description:  params["description"]  ?? "",
      dsoMasterId:  params["dsoMasterId"]  ? Number(params["dsoMasterId"]) : undefined,
    };

    console.log("DSOZone pagination payload:", payload);

    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.DSO_ZONE.UPDATE_PAGINATION,
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
    return await HttpService.callApi<any>(API_ENDPOINTS.DSO_ZONE.GET_BY_ID(id), "GET");
  }

  static async create(data: Partial<DSOZone>): Promise<any> {
    const payload = {
      ...data,
      isActive:  data.isActive ?? true,
      isDeleted: false,
    };
    return await HttpService.callApi<any>(API_ENDPOINTS.DSO_ZONE.CREATE, "POST", payload);
  }

  static async update(id: number, data: Partial<DSOZone>): Promise<any> {
    const payload = {
      id,
      ...data,
    };
    return await HttpService.callApi<any>(API_ENDPOINTS.DSO_ZONE.UPDATE(id), "PUT", payload);
  }

  static async delete(id: number): Promise<void> {
    await HttpService.callApi<void>(API_ENDPOINTS.DSO_ZONE.DELETE(id), "DELETE");
  }

  static async getAll(): Promise<DSOZone[]> {
    const response = await HttpService.callApi<any>(API_ENDPOINTS.DSO_ZONE.GET_ALL, "GET");
    const result = response?.value ?? response?.data ?? response;
    return Array.isArray(result) ? result : [];
  }
}