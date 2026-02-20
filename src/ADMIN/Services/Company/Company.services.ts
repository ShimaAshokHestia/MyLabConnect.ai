import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/Common/HttpService";
import type { Company, CompanyLookup } from "../../Types/Company/Company.types";

export default class CompanyService {

  static async getAll(): Promise<Company[]> {
    const response = await HttpService.callApi<any>(API_ENDPOINTS.COMPANY.GET_ALL, "GET");
    if (Array.isArray(response))        return response;
    if (Array.isArray(response?.value)) return response.value;
    if (Array.isArray(response?.data))  return response.data;
    return [];
  }

  static async getLookup(): Promise<CompanyLookup[]> {
    const response = await HttpService.callApi<any>(API_ENDPOINTS.COMPANY.GET_LOOKUP, "GET");
    if (Array.isArray(response))        return response;
    if (Array.isArray(response?.value)) return response.value;
    if (Array.isArray(response?.data))  return response.data;
    return [];
  }

  static async getById(id: number): Promise<any> {
    return await HttpService.callApi<any>(API_ENDPOINTS.COMPANY.GET_BY_ID(id), "GET");
  }

  static async create(data: Partial<Company>): Promise<any> {
    const payload = {
      ...data,
      isActive:  data.isActive  ?? true,
      isDeleted: data.isDeleted ?? false,
    };
    return await HttpService.callApi<any>(API_ENDPOINTS.COMPANY.CREATE, "POST", payload);
  }

  static async update(id: number, data: Partial<Company>): Promise<any> {
    const payload = { companyId: id, ...data };
    return await HttpService.callApi<any>(API_ENDPOINTS.COMPANY.UPDATE(id), "PUT", payload);
  }

  static async delete(id: number): Promise<void> {
    await HttpService.callApi<void>(API_ENDPOINTS.COMPANY.DELETE(id), "DELETE");
  }
}
