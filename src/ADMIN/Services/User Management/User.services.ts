import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/Common/HttpService";
import type { User } from "../../Types/User Mangement/User.types";

export default class UserService {

  static async getAll(): Promise<User[]> {
    const response = await HttpService.callApi<any>(API_ENDPOINTS.USER.GET_ALL, "GET");
    if (Array.isArray(response))        return response;
    if (Array.isArray(response?.value)) return response.value;
    if (Array.isArray(response?.data))  return response.data;
    return [];
  }

  static async getById(id: number): Promise<any> {
    return await HttpService.callApi<any>(API_ENDPOINTS.USER.GET_BY_ID(id), "GET");
  }

  static async create(data: Partial<User>): Promise<any> {
    const payload = {
      ...data,
      authenticationType: data.authenticationType ?? 0,
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

  static async getPaginated(payload: Partial<User>): Promise<{
    data: User[];
    totalCount: number;
    totalPages?: number;
    currentPage?: number;
  }> {
    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.USER.UPDATE_PAGINATION,
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
