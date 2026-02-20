import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { TableRequestParams, TableResponse } from "../../../KIDU_COMPONENTS/KiduServerTable";
import HttpService from "../../../Services/Common/HttpService";
import type { DSODoctor } from "../../Types/Masters/DsoDoctor.types";

export default class DSODoctorService {

  static async getPaginatedList(params: TableRequestParams): Promise<TableResponse<DSODoctor>> {
    
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
      showInactive:   showInactive,          // undefined = backend default (show all)

      // Column filters — keys match DSODoctorPaginationParams exactly
      firstName:    params["fullName"]   ?? params["firstName"]   ?? "",
      lastName:     params["lastName"]   ?? "",
      licenseNo:    params["licenseNo"]  ?? "",
      doctorCode:   params["doctorCode"] ?? "",
      email:        params["email"]      ?? "",
      phoneNumber:  params["phoneNumber"] ?? "",
      dsoMasterId:  params["dsoMasterId"] ? Number(params["dsoMasterId"]) : undefined,
    };

    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.DSO_DOCTOR.UPDATE_PAGINATION,
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