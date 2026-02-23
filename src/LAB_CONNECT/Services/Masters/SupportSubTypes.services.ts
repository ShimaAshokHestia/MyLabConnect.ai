import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { TableRequestParams, TableResponse } from "../../../KIDU_COMPONENTS/KiduServerTable";
import HttpService from "../../../Services/Common/HttpService";
import type { LabSupportSubType } from "../../Types/Masters/SupportSubTypes";

export default class LabSupportSubTypeService {

  static async getPaginatedList(params: TableRequestParams): Promise<TableResponse<LabSupportSubType>> {
    
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
      labSupportSubTypeName: params["labSupportSubTypeName"] ?? "",
      labSupportTypeId: params["labSupportTypeId"] ? Number(params["labSupportTypeId"]) : undefined,
    };

    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.LAB_SUPPORT_SUB_TYPE.GET_PAGINATION,
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
      API_ENDPOINTS.LAB_SUPPORT_SUB_TYPE.GET_BY_ID(id), 
      "GET"
    );
  }

  static async create(data: Partial<LabSupportSubType>): Promise<any> {
    const payload = {
      labSupportSubTypeName: data.labSupportSubTypeName,
      labSupportTypeId: data.labSupportTypeId,
      isActive: data.isActive ?? true,
      isDeleted: false,
    };
    
    return await HttpService.callApi<any>(
      API_ENDPOINTS.LAB_SUPPORT_SUB_TYPE.CREATE, 
      "POST", 
      payload
    );
  }

  static async update(id: number, data: Partial<LabSupportSubType>): Promise<any> {
    const payload = {
      id,
      labSupportSubTypeName: data.labSupportSubTypeName,
      labSupportTypeId: data.labSupportTypeId,
      isActive: data.isActive ?? true,
    };
    
    return await HttpService.callApi<any>(
      API_ENDPOINTS.LAB_SUPPORT_SUB_TYPE.UPDATE(id), 
      "PUT", 
      payload
    );
  }

  static async delete(id: number): Promise<void> {
    await HttpService.callApi<void>(
      API_ENDPOINTS.LAB_SUPPORT_SUB_TYPE.DELETE(id), 
      "DELETE"
    );
  }
}