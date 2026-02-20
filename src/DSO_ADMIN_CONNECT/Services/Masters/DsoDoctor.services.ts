import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { TableRequestParams, TableResponse } from "../../../KIDU_COMPONENTS/KiduServerTable";
import HttpService from "../../../Services/Common/HttpService";
import type { DSODoctor } from "../../Types/Masters/DsoDoctor.types";

export default class DSODoctorService {

  static async getPaginatedList(params: TableRequestParams): Promise<TableResponse<DSODoctor>> {
    const payload = {
      pageNumber:     params.pageNumber,
      pageSize:       params.pageSize,
      searchTerm:     params.searchTerm    ?? "",
      sortBy:         params.sortBy        ?? "",
      sortDescending: params.sortDescending ?? false,

      // Column filter keys must match DSODoctorPaginationParams exactly
      firstName:    params["fullName"]    ?? params["firstName"]  ?? "",
      lastName:     params["lastName"]    ?? "",
      licenseNo:    params["licenseNo"]   ?? "",
      doctorCode:   params["doctorCode"]  ?? "",
      // DSOMasterId is int — only send if it's a valid number
      ...(params["dsoName"] ? {} : {}), // dsoName is display-only, not filterable server-side
    };

    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.DSO_DOCTOR.UPDATE_PAGINATION,
      "POST",
      payload
    );

    const result = response?.value ?? response;

    return {
      data:       result.data        ?? result.items ?? [],
      total:      result.totalRecords ?? result.total ?? 0,
      totalPages: result.totalPages,
    };
  }

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
}