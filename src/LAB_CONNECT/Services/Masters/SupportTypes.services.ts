import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { TableRequestParams, TableResponse } from "../../../KIDU_COMPONENTS/KiduServerTable";
import HttpService from "../../../Services/Common/HttpService";
import type { LabSupportType } from "../../Types/Masters/SupportTypes.types";

export default class LabSupportTypeService {

  static async getPaginatedList(params: TableRequestParams): Promise<TableResponse<LabSupportType>> {
    
    // Map "Active"/"Inactive" select filter to showInactive boolean
    let showInactive: boolean | undefined = undefined;
    const statusFilter = params["isActive"];
    if (statusFilter === "Active") showInactive = true;
    if (statusFilter === "Inactive") showInactive = false;

    const payload = {
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
      searchTerm: params.searchTerm ?? "",
      sortBy: params.sortBy ?? "",
      sortDescending: params.sortDescending ?? false,
      showDeleted: false,
      showInactive: showInactive,

      // Column filters
      labSupportTypeName: params["labSupportTypeName"] ?? "",
      labMasterId: params["labMasterId"] ? Number(params["labMasterId"]) : undefined,
    };

    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.LAB_SUPPORT_TYPE.GET_PAGINATION,
      "POST",
      payload
    );

    const result = response?.value ?? response;

    return {
      data: result.data ?? result.items ?? [],
      total: result.totalRecords ?? result.total ?? 0,
      totalPages: result.totalPages,
    };
  }

  static async getById(id: number): Promise<any> {
    return await HttpService.callApi<any>(
      API_ENDPOINTS.LAB_SUPPORT_TYPE.GET_BY_ID(id), 
      "GET"
    );
  }

  static async create(data: Partial<LabSupportType>): Promise<any> {
    const payload = {
      labSupportTypeName: data.labSupportTypeName,
      escalationDays: data.escalationDays,
      labMasterId: data.labMasterId,
      isActive: data.isActive ?? true,
      isDeleted: false,
    };
    
    return await HttpService.callApi<any>(
      API_ENDPOINTS.LAB_SUPPORT_TYPE.CREATE, 
      "POST", 
      payload
    );
  }

  static async update(id: number, data: Partial<LabSupportType>): Promise<any> {
    const payload = {
      id,
      labSupportTypeName: data.labSupportTypeName,
      escalationDays: data.escalationDays,
      labMasterId: data.labMasterId,
      isActive: data.isActive ?? true,
    };
    
    return await HttpService.callApi<any>(
      API_ENDPOINTS.LAB_SUPPORT_TYPE.UPDATE(id), 
      "PUT", 
      payload
    );
  }

  static async delete(id: number): Promise<void> {
    await HttpService.callApi<void>(
      API_ENDPOINTS.LAB_SUPPORT_TYPE.DELETE(id), 
      "DELETE"
    );
  }
}