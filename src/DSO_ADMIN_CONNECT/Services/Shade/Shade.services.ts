import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { TableRequestParams, TableResponse } from "../../../KIDU_COMPONENTS/KiduServerTable";
import HttpService from "../../../Services/Common/HttpService";
import type { DSOShade } from "../../Types/Shade/Shade.types";

export default class DSOShadeService {

  static async getPaginatedList(params: TableRequestParams): Promise<TableResponse<DSOShade>> {
    
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
      name: params["name"] ?? "",
      dsoMasterId: params["dsoMasterId"] ? Number(params["dsoMasterId"]) : undefined,
    };

    console.log("DSOShade pagination payload:", payload);

    try {
      const response = await HttpService.callApi<any>(
        API_ENDPOINTS.DSO_SHADE.UPDATE_PAGINATION,
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
        API_ENDPOINTS.DSO_SHADE.GET_BY_ID(id), 
        "GET"
      );
      console.log("GetById Response:", response);
      return response;
    } catch (error) {
      console.error("Error in getById:", error);
      throw error;
    }
  }

  static async create(data: Partial<DSOShade>): Promise<any> {
    try {
      const payload = {
        name: data.name,
        dsoMasterId: Number(data.dsoMasterId),
        isActive: data.isActive ?? true,
        isDeleted: false,
      };
      
      console.log("Create Payload:", payload);
      console.log("Create Endpoint:", API_ENDPOINTS.DSO_SHADE.CREATE);
      
      const response = await HttpService.callApi<any>(
        API_ENDPOINTS.DSO_SHADE.CREATE, 
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

  static async update(id: number, data: Partial<DSOShade>): Promise<any> {
    try {
      const payload = {
        id,
        name: data.name,
        dsoMasterId: Number(data.dsoMasterId),
        isActive: data.isActive ?? true,
      };
      
      console.log("Update Payload:", payload);
      
      const response = await HttpService.callApi<any>(
        API_ENDPOINTS.DSO_SHADE.UPDATE(id), 
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
        API_ENDPOINTS.DSO_SHADE.DELETE(id), 
        "DELETE"
      );
      console.log(`Deleted DSO Shade with id ${id}`);
    } catch (error) {
      console.error("Error in delete:", error);
      throw error;
    }
  }

  static async getAll(): Promise<DSOShade[]> {
    try {
      const response = await HttpService.callApi<any>(
        API_ENDPOINTS.DSO_SHADE.GET_ALL, 
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