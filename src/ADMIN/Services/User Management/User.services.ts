import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { TableRequestParams, TableResponse } from "../../../KIDU_COMPONENTS/KiduServerTable";
import HttpService from "../../../Services/Common/HttpService";
import type { User } from "../../Types/User Mangement/User.types";

// Map label strings to backend int values
const authTypeLabelToNumber: Record<string, number> = {
  Normal: 1,
  SSO:    2,
  Basic:  3,
};

export default class UserService {

  static async getPaginatedList(params: TableRequestParams): Promise<TableResponse<User>> {

    // isActive: "Active" → true, "Inactive" → false, undefined → not sent
    let isActive: boolean | undefined = undefined;
    const statusFilter = params["isActive"];
    if (statusFilter === "Active")   isActive = true;
    if (statusFilter === "Inactive") isActive = false;

    // authenticationType: map label string → number
    let authenticationType: number | undefined = undefined;
    const authFilter = params["authenticationType"];
    if (authFilter && authTypeLabelToNumber[authFilter] !== undefined) {
      authenticationType = authTypeLabelToNumber[authFilter];
    }

    const payload = {
      pageNumber:          params.pageNumber,
      pageSize:            params.pageSize,
      searchTerm:          params.searchTerm     ?? "",
      sortBy:              params.sortBy         ?? "",
      sortDescending:      params.sortDescending  ?? false,

      // Specific filters matching backend UserPaginationParams
      userId:              params["userId"]       ? Number(params["userId"]) : undefined,
      userName:            params["userName"]     ?? "",
      userEmail:           params["userEmail"]    ?? "",
      phoneNumber:         params["phoneNumber"]  ?? "",
      userTypeId:          params["userTypeId"]   ? Number(params["userTypeId"])  : undefined,
      companyId:           params["companyId"]    ? Number(params["companyId"])   : undefined,
      isActive:            isActive,
      authenticationType:  authenticationType,
    };

    console.log("User pagination payload:", payload);

    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.USER.UPDATE_PAGINATION,
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

  static async getAll(): Promise<User[]> {
    const response = await HttpService.callApi<any>(API_ENDPOINTS.USER.GET_ALL, "GET");
    const result = response?.value ?? response?.data ?? response;
    if (Array.isArray(result)) return result;
    console.warn("Unexpected getAll response format:", response);
    return [];
  }

  static async getById(id: number): Promise<any> {
    return await HttpService.callApi<any>(API_ENDPOINTS.USER.GET_BY_ID(id), "GET");
  }

  static async create(data: Partial<User>): Promise<any> {
    const payload = {
      ...data,
      authenticationType: data.authenticationType ?? 1,
      islocked:           data.islocked           ?? false,
      isActive:           data.isActive           ?? true,
      isDeleted:          data.isDeleted          ?? false,
    };
    return await HttpService.callApi<any>(API_ENDPOINTS.USER.CREATE, "POST", payload);
  }

  static async update(id: number, data: Partial<User>): Promise<any> {
    const payload = { id, ...data };
    return await HttpService.callApi<any>(API_ENDPOINTS.USER.UPDATE(id), "PUT", payload);
  }

  static async delete(id: number): Promise<void> {
    await HttpService.callApi<void>(API_ENDPOINTS.USER.DELETE(id), "DELETE");
  }
}