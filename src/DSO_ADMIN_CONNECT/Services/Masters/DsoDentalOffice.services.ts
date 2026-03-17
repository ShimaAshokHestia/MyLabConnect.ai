// src/Services/Masters/DentalOffice.services.ts

import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { TableRequestParams, TableResponse } from "../../../KIDU_COMPONENTS/KiduServerTable";
import HttpService from "../../../Services/Common/HttpService";
import type { DentalOffice } from "../../Types/Masters/DsoDentalOffice.types";

export default class DentalOfficeService {

  static async getPaginatedList(params: TableRequestParams): Promise<TableResponse<DentalOffice>> {
    
    // Map "Active"/"Inactive" select filter to showInactive boolean
    let showInactive: boolean | undefined = undefined;
    const statusFilter = params["isActive"];
    if (statusFilter === "Active") showInactive = true;
    if (statusFilter === "Inactive") showInactive = false;

    const payload = {
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
      searchTerm: params.searchTerm ?? "",
      sortBy: params.sortBy ?? "",
      sortDescending: params.sortDescending ?? false,
      showDeleted: false,
      showInactive: showInactive, // undefined = backend default (show all)

      // Column filters — keys match your API expectations
      officeCode: params["officeCode"] ?? "",
      officeName: params["officeName"] ?? "",
      city: params["city"] ?? "",
      country: params["country"] ?? "",
      dsoZoneId: params["dsoZoneId"] ? Number(params["dsoZoneId"]) : undefined,
      dsoMasterId: params["dsoMasterId"] ? Number(params["dsoMasterId"]) : undefined,
    };

    console.log("DentalOffice pagination payload:", payload);

    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.DSO_DENTAL_OFFICE.UPDATE_PAGINATION,
      "POST",
      payload
    );

    const result = response?.value ?? response;

    return {
      data: result.data ?? result.items ?? [],
      total: result.totalRecords ?? result.total ?? 0,
      totalPages: result.totalPages,
    };
  }

  static async getById(id: number): Promise<any> {
    return await HttpService.callApi<any>(
      API_ENDPOINTS.DSO_DENTAL_OFFICE.GET_BY_ID(id), 
      "GET"
    );
  }

  static async getByIdValue(id: number): Promise<DentalOffice | null> {
    try {
      const response = await this.getById(id);
      const result = response?.value ?? response?.data ?? response;
      return result || null;
    } catch (error) {
      console.error(`Error getting dental office with ID ${id}:`, error);
      return null;
    }
  }

  static async create(data: Partial<DentalOffice>): Promise<any> {
    const payload = {
      officeCode: data.officeCode,
      officeName: data.officeName,
      postCode: data.postCode,
      mobileNum: data.mobileNum,
      email: data.email,
      city: data.city,
      country: data.country,
      address: data.address,
      alternateAddress: data.alternateAddress,
      mapUrl: data.mapUrl,
      dsoZoneId: data.dsoZoneId,
      info: data.info,
      dsoMasterId: data.dsoMasterId,
      isActive: data.isActive ?? true,
      isDeleted: false,
    };
    
    return await HttpService.callApi<any>(
      API_ENDPOINTS.DSO_DENTAL_OFFICE.CREATE, 
      "POST", 
      payload
    );
  }

  static async update(id: number, data: Partial<DentalOffice>): Promise<any> {
    const payload = {
      id,
      officeCode: data.officeCode,
      officeName: data.officeName,
      postCode: data.postCode,
      mobileNum: data.mobileNum,
      email: data.email,
      city: data.city,
      country: data.country,
      address: data.address,
      alternateAddress: data.alternateAddress,
      mapUrl: data.mapUrl,
      dsoZoneId: data.dsoZoneId,
      info: data.info,
      dsoMasterId: data.dsoMasterId,
      isActive: data.isActive,
      isDeleted: data.isDeleted ?? false,
    };
    
    return await HttpService.callApi<any>(
      API_ENDPOINTS.DSO_DENTAL_OFFICE.UPDATE(id), 
      "PUT", 
      payload
    );
  }

  static async delete(id: number): Promise<void> {
    await HttpService.callApi<void>(
      API_ENDPOINTS.DSO_DENTAL_OFFICE.DELETE(id), 
      "DELETE"
    );
  }

  static async getAll(): Promise<DentalOffice[]> {
    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.DSO_DENTAL_OFFICE.GET_ALL, 
      "GET"
    );
    
    const result = response?.value ?? response?.data ?? response;
    return Array.isArray(result) ? result : [];
  }

  // Optional: Additional utility methods following the same pattern
  static async restore(id: number): Promise<any> {
    return await HttpService.callApi<any>(
      `${API_ENDPOINTS.DSO_DENTAL_OFFICE.GET_BY_ID(id)}/restore`, 
      "POST"
    );
  }

  static async toggleActive(id: number): Promise<any> {
    return await HttpService.callApi<any>(
      `${API_ENDPOINTS.DSO_DENTAL_OFFICE.GET_BY_ID(id)}/toggle-active`, 
      "PATCH"
    );
  }

  static async checkOfficeCode(officeCode: string, excludeId?: number): Promise<boolean> {
    let url = `/DentalOffice/check-officecode?officeCode=${encodeURIComponent(officeCode)}`;
    if (excludeId !== undefined) {
      url += `&excludeId=${excludeId}`;
    }
    
    const response = await HttpService.callApi<any>(url, "GET");
    const result = response?.value ?? response?.data ?? response;
    return result === true || result === false ? result : false;
  }
}