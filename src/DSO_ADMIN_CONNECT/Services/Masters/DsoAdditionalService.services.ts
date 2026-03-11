import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { TableRequestParams, TableResponse } from "../../../KIDU_COMPONENTS/KiduServerTable";
import HttpService from "../../../Services/Common/HttpService";
import type { DSOAdditionalService } from "../../Types/Masters/DsoAdditionalService.types";

export default class DSOAdditionalServiceService {

  static async getPaginatedList(params: TableRequestParams): Promise<TableResponse<DSOAdditionalService>> {
    
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
      showInactive: showInactive,

      // Column filters
      serviceName: params["serviceName"] ?? "",
      serviceNotes: params["serviceNotes"] ?? "",
      dsoMasterId: params["dsoMasterId"] ? Number(params["dsoMasterId"]) : undefined,
    };

    console.log("DSOAdditionalService pagination payload:", payload);

    try {
      const response = await HttpService.callApi<any>(
        API_ENDPOINTS.DSO_ADDITIONAL_SERVICE.UPDATE_PAGINATION,
        "POST",
        payload
      );

      console.log("Paginated Response:", response);

      const result = response?.value ?? response;

      return {
        data: result.data ?? result.items ?? [],
        total: result.totalRecords ?? result.total ?? 0,
        totalPages: result.totalPages,
      };
    } catch (error) {
      console.error("Error in getPaginatedList:", error);
      throw error;
    }
  }

  static async getById(id: number): Promise<any> {
    try {
      const response = await HttpService.callApi<any>(
        API_ENDPOINTS.DSO_ADDITIONAL_SERVICE.GET_BY_ID(id), 
        "GET"
      );
      console.log("GetById Response:", response);
      return response;
    } catch (error) {
      console.error("Error in getById:", error);
      throw error;
    }
  }

  static async create(data: Partial<DSOAdditionalService>): Promise<any> {
    try {
      const payload = {
        serviceName: data.serviceName,
        serviceNotes: data.serviceNotes ?? "",
        dsoMasterId: Number(data.dsoMasterId),
        isActive: data.isActive ?? true,
        isDeleted: false,
      };
      
      console.log("Create Payload:", payload);
      console.log("Create Endpoint:", API_ENDPOINTS.DSO_ADDITIONAL_SERVICE.CREATE);
      
      const response = await HttpService.callApi<any>(
        API_ENDPOINTS.DSO_ADDITIONAL_SERVICE.CREATE, 
        "POST", 
        payload
      );
      
      console.log("Create Response:", response);
      return response;
    } catch (error) {
      console.error("Error in create:", error);
      throw error;
    }
  }

  static async update(id: number, data: Partial<DSOAdditionalService>): Promise<any> {
    try {
      const payload = {
        id,
        serviceName: data.serviceName,
        serviceNotes: data.serviceNotes ?? "",
        dsoMasterId: Number(data.dsoMasterId),
        isActive: data.isActive ?? true,
      };
      
      console.log("Update Payload:", payload);
      
      const response = await HttpService.callApi<any>(
        API_ENDPOINTS.DSO_ADDITIONAL_SERVICE.UPDATE(id), 
        "PUT", 
        payload
      );
      
      console.log("Update Response:", response);
      return response;
    } catch (error) {
      console.error("Error in update:", error);
      throw error;
    }
  }

  static async delete(id: number): Promise<void> {
    try {
      await HttpService.callApi<void>(
        API_ENDPOINTS.DSO_ADDITIONAL_SERVICE.DELETE(id), 
        "DELETE"
      );
      console.log(`Deleted DSO Additional Service with id ${id}`);
    } catch (error) {
      console.error("Error in delete:", error);
      throw error;
    }
  }

  static async getAll(): Promise<DSOAdditionalService[]> {
    try {
      const response = await HttpService.callApi<any>(
        API_ENDPOINTS.DSO_ADDITIONAL_SERVICE.GET_ALL, 
        "GET"
      );
      console.log("GetAll Response:", response);
      
      const result = response?.value ?? response?.data ?? response;
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Error in getAll:", error);
      throw error;
    }
  }
}