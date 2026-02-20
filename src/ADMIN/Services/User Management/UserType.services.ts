import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { TableRequestParams, TableResponse } from "../../../KIDU_COMPONENTS/KiduServerTable";
import HttpService from "../../../Services/Common/HttpService";
import type { UserType } from "../../Types/User Mangement/UserTypes.types";

export default class UserTypeService {

  static async getPaginatedList(params: TableRequestParams): Promise<TableResponse<UserType>> {
    
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
      showInactive:   showInactive,

      // Column filters — matching UserType interface fields
      id:               params["id"]               ? Number(params["id"]) : undefined,
      userTypeName:     params["userTypeName"]     ?? "",
      isAdminAdable:    params["isAdminAdable"]    === "true" ? true : params["isAdminAdable"] === "false" ? false : undefined,
      isDSOAddable:     params["isDSOAddable"]     === "true" ? true : params["isDSOAddable"] === "false" ? false : undefined,
      isLabAddable:     params["isLabAddable"]     === "true" ? true : params["isLabAddable"] === "false" ? false : undefined,
      isDoctorAddable:  params["isDoctorAddable"]  === "true" ? true : params["isDoctorAddable"] === "false" ? false : undefined,
      isPMAddable:      params["isPMAddable"]      === "true" ? true : params["isPMAddable"] === "false" ? false : undefined,
    };

    console.log("UserType pagination payload:", payload);

    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.USER_TYPE.UPDATE_PAGINATION,
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

  static async getAll(): Promise<UserType[]> {
    const response = await HttpService.callApi<any>(API_ENDPOINTS.USER_TYPE.GET_ALL, "GET");
    
    // Handle different response structures
    const result = response?.value ?? response?.data ?? response;
    
    if (Array.isArray(result)) return result;
    
    console.warn("Unexpected getAll response format:", response);
    return [];
  }

  static async getById(id: number): Promise<any> {
    return await HttpService.callApi<any>(API_ENDPOINTS.USER_TYPE.GET_BY_ID(id), "GET");
  }

  static async create(data: Partial<UserType>): Promise<any> {
    const payload = {
      ...data,
      isAdminAdable:   data.isAdminAdable   ?? false,
      isDSOAddable:    data.isDSOAddable    ?? false,
      isLabAddable:    data.isLabAddable    ?? false,
      isDoctorAddable: data.isDoctorAddable ?? false,
      isPMAddable:     data.isPMAddable     ?? false,
      isActive:        data.isActive        ?? true,
      isDeleted:       data.isDeleted       ?? false,
    };
    return await HttpService.callApi<any>(API_ENDPOINTS.USER_TYPE.CREATE, "POST", payload);
  }

  static async update(id: number, data: Partial<UserType>): Promise<any> {
    const payload = { 
      id, 
      ...data 
    };
    return await HttpService.callApi<any>(API_ENDPOINTS.USER_TYPE.UPDATE(id), "PUT", payload);
  }

  static async delete(id: number): Promise<void> {
    await HttpService.callApi<void>(API_ENDPOINTS.USER_TYPE.DELETE(id), "DELETE");
  }
}