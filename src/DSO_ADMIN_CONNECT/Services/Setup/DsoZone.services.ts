import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/Common/HttpService";
import type { DSOZone } from "../../Types/Setup/DsoZone.types";

export default class DSOZoneService {

  static async getAll(): Promise<DSOZone[]> {
    const response = await HttpService.callApi<any>(API_ENDPOINTS.DSO_ZONE.GET_ALL, "GET");
    if (Array.isArray(response))        return response;
    if (Array.isArray(response?.value)) return response.value;
    if (Array.isArray(response?.data))  return response.data;
    return [];
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
    const payload = { id, ...data };
    return await HttpService.callApi<any>(API_ENDPOINTS.DSO_ZONE.UPDATE(id), "PUT", payload);
  }

  static async delete(id: number): Promise<void> {
    await HttpService.callApi<void>(API_ENDPOINTS.DSO_ZONE.DELETE(id), "DELETE");
  }

  static async getPaginated(payload: Partial<DSOZone>): Promise<{
    data: DSOZone[];
    totalCount: number;
    totalPages?: number;
    currentPage?: number;
  }> {
    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.DSO_ZONE.UPDATE_PAGINATION,
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
