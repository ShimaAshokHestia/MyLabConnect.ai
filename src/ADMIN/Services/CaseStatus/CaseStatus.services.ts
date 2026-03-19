// src/Services/Masters/CaseStatus.services.ts

import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";

import type { TableRequestParams, TableResponse } from "../../../KIDU_COMPONENTS/KiduServerTable";
import HttpService from "../../../Services/Common/HttpService";
import type { CaseStatus } from "../../Types/CaseStatusMaster/CaseStatus.types";


export default class CaseStatusService {

  static async getPaginatedList(params: TableRequestParams): Promise<TableResponse<CaseStatus>> {

  const payload = {
    pageNumber: params.pageNumber,
    pageSize: params.pageSize,
    searchTerm: params.searchTerm ?? "",
    sortBy: params.sortBy ?? "",
    sortDescending: params.sortDescending ?? false,
    showDeleted: false,
    caseStatusName: params["caseStatusName"] ?? "",
  };

  const response = await HttpService.callApi<any>(
    API_ENDPOINTS.CASE_REGISTRATION.CASE_STATUS_MASTER.GET_PAGINATED,
    "POST",
    payload
  );

  const result = response?.value ?? response;
  const data = result.data ?? result.items ?? [];

  // ── Paginated endpoint returning empty — fall back to GET_ALL ─────────────
  if (data.length === 0 && (result.totalRecords === 0 || result.total === 0)) {
    const allData = await CaseStatusService.getAll();
    return {
      data: allData,
      total: allData.length,
      totalPages: 1,
    };
  }

  return {
    data,
    total: result.totalRecords ?? result.total ?? 0,
    totalPages: result.totalPages,
  };
}

  static async getAll(): Promise<CaseStatus[]> {
    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.CASE_REGISTRATION.CASE_STATUS_MASTER.GET_ALL,
      "GET"
    );

    const result = response?.value ?? response?.data ?? response;
    return Array.isArray(result) ? result : [];
  }

  static async getById(id: number): Promise<any> {
    return await HttpService.callApi<any>(
      API_ENDPOINTS.CASE_REGISTRATION.CASE_STATUS_MASTER.GET_BY_ID(id),
      "GET"
    );
  }

  static async getByIdValue(id: number): Promise<CaseStatus | null> {
    try {
      const response = await this.getById(id);
      const result = response?.value ?? response?.data ?? response;
      return result || null;
    } catch (error) {
      console.error(`Error getting case status with ID ${id}:`, error);
      return null;
    }
  }

  static async create(data: Partial<CaseStatus>): Promise<any> {
    const payload = {
      caseStatusName: data.caseStatusName,
      isActive: data.isActive ?? true,
      isDeleted: false,
    };

    return await HttpService.callApi<any>(
      API_ENDPOINTS.CASE_REGISTRATION.CASE_STATUS_MASTER.GET_ALL,
      "POST",
      payload
    );
  }

  static async update(id: number, data: Partial<CaseStatus>): Promise<any> {
    const payload = {
      id,
      caseStatusName: data.caseStatusName,
      isActive: data.isActive,
      isDeleted: data.isDeleted ?? false,
    };

    return await HttpService.callApi<any>(
      API_ENDPOINTS.CASE_REGISTRATION.CASE_STATUS_MASTER.UPDATE(id),
      "PUT",
      payload
    );
  }

  static async delete(id: number): Promise<void> {
    await HttpService.callApi<void>(
      API_ENDPOINTS.CASE_REGISTRATION.CASE_STATUS_MASTER.DELETE(id),
      "DELETE"
    );
  }
}