import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/Common/HttpService";
import type { UserType } from "../../Types/User Mangement/UserTypes.types";

export default class UserTypeService {

  static async getAll(): Promise<UserType[]> {
    const response = await HttpService.callApi<any>(API_ENDPOINTS.USER_TYPE.GET_ALL, "GET");
    if (Array.isArray(response))        return response;
    if (Array.isArray(response?.value)) return response.value;
    if (Array.isArray(response?.data))  return response.data;
    return [];
  }

  static async getById(id: number): Promise<any> {
    return await HttpService.callApi<any>(API_ENDPOINTS.USER_TYPE.GET_BY_ID(id), "GET");
  }

  static async create(data: Partial<UserType>): Promise<any> {
    const payload = {
      ...data,
      isAdminAdable:   data.isAdminAdable   ?? false,
      isDSOAddable:    data.isDSOAddable     ?? false,
      isLabAddable:    data.isLabAddable     ?? false,
      isDoctorAddable: data.isDoctorAddable  ?? false,
      isPMAddable:     data.isPMAddable      ?? false,
      isActive:        data.isActive         ?? true,
      isDeleted:       data.isDeleted        ?? false,
    };
    return await HttpService.callApi<any>(API_ENDPOINTS.USER_TYPE.CREATE, "POST", payload);
  }

  static async update(id: number, data: Partial<UserType>): Promise<any> {
    const payload = { id, ...data };
    return await HttpService.callApi<any>(API_ENDPOINTS.USER_TYPE.UPDATE(id), "PUT", payload);
  }

  static async delete(id: number): Promise<void> {
    await HttpService.callApi<void>(API_ENDPOINTS.USER_TYPE.DELETE(id), "DELETE");
  }

  static async getPaginated(payload: Partial<UserType>): Promise<{
    data: UserType[];
    totalCount: number;
    totalPages?: number;
    currentPage?: number;
  }> {
    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.USER_TYPE.UPDATE_PAGINATION,
      "POST",
      payload
    );
    return {
      data:        response.data        ?? response.items        ?? response.results ?? [],
      totalCount:  response.totalCount  ?? response.totalRecords ?? response.total   ?? 0,
      totalPages:  response.totalPages,
      currentPage: response.currentPage ?? response.pageNumber,
    };
  }
}
