import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { TableRequestParams, TableResponse } from "../../../KIDU_COMPONENTS/KiduServerTable";
import HttpService from "../../../Services/Common/HttpService";
import type { DSOIndication } from "../../Types/Setup/DSOIndication.types";


export default class DSOIndicationService {

  static async getPaginatedList(params: TableRequestParams): Promise<TableResponse<DSOIndication>> {

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

      // Column Filters
      name: params["name"] ?? "",
     dsoProthesisTypeId: params["dsoProthesisTypeId"] ? Number(params["dsoProthesisTypeId"]) : undefined,
    };

    console.log("Paginated Request Payload:", payload);

    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.DSO_INDICATION.UPDATE_PAGINATION,
      "POST",
      payload
    );

    console.log("Paginated Response:", response);

    const result = response?.value ?? response;

    return {
      data: result.data ?? result.items ?? [],
      total: result.totalRecords ?? result.total ?? 0,
      totalPages: result.totalPages
    };
  }

  static async getById(id: number): Promise<any> {

    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.DSO_INDICATION.GET_BY_ID(id),
      "GET"
    );

    console.log("GetById Response:", response);
    return response;
  }

  static async create(data: Partial<DSOIndication>): Promise<any> {

    const payload = {
      name: data.name,
      isActive: data.isActive ?? true,
      isDeleted: false
    };

    console.log("Create Payload:", payload);

    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.DSO_INDICATION.CREATE,
      "POST",
      payload
    );

    console.log("Create Response:", response);
    return response;
  }

  static async update(id: number, data: Partial<DSOIndication>): Promise<any> {

    const payload = {
      id,
      name: data.name,
      isActive: data.isActive ?? true
    };

    console.log("Update Payload:", payload);

    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.DSO_INDICATION.UPDATE(id),
      "PUT",
      payload
    );

    console.log("Update Response:", response);
    return response;
  }

  static async delete(id: number): Promise<void> {

    await HttpService.callApi<void>(
      API_ENDPOINTS.DSO_INDICATION.DELETE(id),
      "DELETE"
    );

    console.log(`Deleted Indication with id ${id}`);
  }
}