import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/Common/HttpService";
import type { FinancialYear, FinancialYearLookup } from "../../Types/Settings/FinancialYear.types";

export default class FinancialYearService {

  static async getAll(): Promise<FinancialYear[]> {
    const response = await HttpService.callApi<any>(API_ENDPOINTS.FINANCIAL_YEAR.GET_ALL, "GET");
    if (Array.isArray(response))        return response;
    if (Array.isArray(response?.value)) return response.value;
    if (Array.isArray(response?.data))  return response.data;
    return [];
  }

  static async getLookup(): Promise<FinancialYearLookup[]> {
    const response = await HttpService.callApi<any>(API_ENDPOINTS.FINANCIAL_YEAR.GET_LOOKUP, "GET");
    if (Array.isArray(response))        return response;
    if (Array.isArray(response?.value)) return response.value;
    if (Array.isArray(response?.data))  return response.data;
    return [];
  }

  static async getById(id: number): Promise<any> {
    return await HttpService.callApi<any>(API_ENDPOINTS.FINANCIAL_YEAR.GET_BY_ID(id), "GET");
  }

  static async create(data: Partial<FinancialYear>): Promise<any> {
    const payload = {
      ...data,
      isCurrent: data.isCurrent ?? false,
      isClosed:  data.isClosed  ?? false,
    };
    return await HttpService.callApi<any>(API_ENDPOINTS.FINANCIAL_YEAR.CREATE, "POST", payload);
  }

  static async update(id: number, data: Partial<FinancialYear>): Promise<any> {
    const payload = { financialYearId: id, ...data };
    return await HttpService.callApi<any>(API_ENDPOINTS.FINANCIAL_YEAR.UPDATE(id), "PUT", payload);
  }

  static async delete(id: number): Promise<void> {
    await HttpService.callApi<void>(API_ENDPOINTS.FINANCIAL_YEAR.DELETE(id), "DELETE");
  }
}
