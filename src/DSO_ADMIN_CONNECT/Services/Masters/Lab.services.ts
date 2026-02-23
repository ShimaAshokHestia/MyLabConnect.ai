import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { TableRequestParams, TableResponse } from "../../../KIDU_COMPONENTS/KiduServerTable";
import HttpService from "../../../Services/Common/HttpService";
import type { LabMaster } from "../../Types/Masters/Lab.types";

export default class LabMasterService {

  static async getPaginatedList(params: TableRequestParams): Promise<TableResponse<LabMaster>> {

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
      showInactive,

      // Column filters
      labCode:         params["labCode"]       ?? "",
      labName:         params["labName"]       ?? "",
      displayName:     params["displayName"]   ?? "",
      email:           params["email"]         ?? "",
      labGroupId:      params["labGroupId"]    ? Number(params["labGroupId"]) : undefined,
      authenticationType: params["authenticationType"]
        ? Number(params["authenticationType"])
        : undefined,
    };

    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.LAB_MASTER.UPDATE_PAGINATION,
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
    return await HttpService.callApi<any>(API_ENDPOINTS.LAB_MASTER.GET_BY_ID(id), "GET");
  }

  static async create(data: Partial<LabMaster>): Promise<any> {
    const payload = {
      ...data,
      isActive:  data.isActive  ?? true,
      isDeleted: false,
    };
    return await HttpService.callApi<any>(API_ENDPOINTS.LAB_MASTER.CREATE, "POST", payload);
  }

  static async update(id: number, data: Partial<LabMaster>): Promise<any> {
    const payload = { id, ...data };
    return await HttpService.callApi<any>(API_ENDPOINTS.LAB_MASTER.UPDATE(id), "PUT", payload);
  }

  static async delete(id: number): Promise<void> {
    await HttpService.callApi<void>(API_ENDPOINTS.LAB_MASTER.DELETE(id), "DELETE");
  }
}