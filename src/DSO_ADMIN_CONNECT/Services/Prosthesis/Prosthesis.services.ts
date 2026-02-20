import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { TableRequestParams, TableResponse } from "../../../KIDU_COMPONENTS/KiduServerTable";
import HttpService from "../../../Services/Common/HttpService";
import type { DSOProsthesisType } from "../../Types/Prosthesis/Prosthesis.types";

export default class DSOProsthesisTypeService {

  static async getPaginatedList(params: TableRequestParams): Promise<TableResponse<DSOProsthesisType>> {
    
    // Map "Active"/"Inactive" select filter to showInactive boolean
    let showInactive: boolean | undefined = undefined;
    const statusFilter = params["isActive"];
    if (statusFilter === "Active")   showInactive = false;  // Active → showInactive = false
    if (statusFilter === "Inactive") showInactive = true;   // Inactive → showInactive = true

    const payload = {
      pageNumber:     params.pageNumber,
      pageSize:       params.pageSize,
      searchTerm:     params.searchTerm     ?? "",
      sortBy:         params.sortBy         ?? "",
      sortDescending: params.sortDescending  ?? false,
      showDeleted:    false,
      showInactive:   showInactive,          // undefined = backend default (show all)

      // Column filters — match exactly with API expected field names
      id:           params["id"]           ? Number(params["id"]) : undefined,
      name:         params["name"]         ?? "",
      dsoMasterId:  params["dsoMasterId"]  ? Number(params["dsoMasterId"]) : undefined,
    };

    console.log("Sending payload:", payload);

    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.DSO_PROTHESIS_TYPE.UPDATE_PAGINATION,
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
    return await HttpService.callApi<any>(API_ENDPOINTS.DSO_PROTHESIS_TYPE.GET_BY_ID(id), "GET");
  }

  static async create(data: Partial<DSOProsthesisType>): Promise<any> {
    const payload = {
      ...data,
      isActive:  data.isActive ?? true,
      isDeleted: false,
    };
    return await HttpService.callApi<any>(API_ENDPOINTS.DSO_PROTHESIS_TYPE.CREATE, "POST", payload);
  }

  static async update(id: number, data: Partial<DSOProsthesisType>): Promise<any> {
    const payload = {
      id,
      ...data,
    };
    return await HttpService.callApi<any>(API_ENDPOINTS.DSO_PROTHESIS_TYPE.UPDATE(id), "PUT", payload);
  }

  static async delete(id: number): Promise<void> {
    await HttpService.callApi<void>(API_ENDPOINTS.DSO_PROTHESIS_TYPE.DELETE(id), "DELETE");
  }

  static async getAll(): Promise<DSOProsthesisType[]> {
    const response = await HttpService.callApi<any>(API_ENDPOINTS.DSO_PROTHESIS_TYPE.GET_ALL, "GET");
    const result = response?.value ?? response?.data ?? response;
    return Array.isArray(result) ? result : [];
  }
}