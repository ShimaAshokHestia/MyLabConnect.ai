import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/Common/HttpService";
import type { DSODoctor } from "../../Types/Masters/DsoDoctor.types";

export default class DSODoctorService {

  static async getAll(): Promise<DSODoctor[]> {
    const response = await HttpService.callApi<any>(API_ENDPOINTS.DSO_DOCTOR.GET_ALL, "GET");
    if (Array.isArray(response))        return response;
    if (Array.isArray(response?.value)) return response.value;
    if (Array.isArray(response?.data))  return response.data;
    return [];
  }

  // Returns raw API response — Edit & View modals handle the shape
  static async getById(id: number): Promise<any> {
    return await HttpService.callApi<any>(API_ENDPOINTS.DSO_DOCTOR.GET_BY_ID(id), "GET");
  }

  static async create(data: Partial<DSODoctor>): Promise<any> {
    const payload = {
      ...data,
      fullName:  `${data.firstName} ${data.lastName}`,
      isActive:  data.isActive ?? true,
      isDeleted: false,
    };
    return await HttpService.callApi<any>(API_ENDPOINTS.DSO_DOCTOR.CREATE, "POST", payload);
  }

  static async update(id: number, data: Partial<DSODoctor>): Promise<any> {
    const payload = {
      id,
      ...data,
      fullName: data.firstName && data.lastName
        ? `${data.firstName} ${data.lastName}`
        : data.fullName,
    };
    return await HttpService.callApi<any>(API_ENDPOINTS.DSO_DOCTOR.UPDATE(id), "PUT", payload);
  }

  static async delete(id: number): Promise<void> {
    await HttpService.callApi<void>(API_ENDPOINTS.DSO_DOCTOR.DELETE(id), "DELETE");
  }

  static async getPaginated(payload: Partial<DSODoctor>): Promise<{
    data: DSODoctor[];
    totalCount: number;
    totalPages?: number;
    currentPage?: number;
  }> {
    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.DSO_DOCTOR.UPDATE_PAGINATION,
      "POST",
      payload
    );
    return {
      data:        response.data        ?? response.items          ?? response.results ?? [],
      totalCount:  response.totalCount  ?? response.totalRecords   ?? response.total   ?? 0,
      totalPages:  response.totalPages,
      currentPage: response.currentPage ?? response.pageNumber,
    };
  }
}
