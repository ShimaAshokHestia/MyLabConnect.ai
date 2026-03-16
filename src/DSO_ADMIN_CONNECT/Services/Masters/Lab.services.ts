// import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
// import type { TableRequestParams, TableResponse } from "../../../KIDU_COMPONENTS/KiduServerTable";
// import HttpService from "../../../Services/Common/HttpService";
// import type { LabMaster } from "../../Types/Masters/Lab.types";

// export default class LabMasterService {

//   static async getPaginatedList(params: TableRequestParams): Promise<TableResponse<LabMaster>> {

//     let showInactive: boolean | undefined = undefined;
//     const statusFilter = params["isActive"];
//     if (statusFilter === "Active")   showInactive = true;
//     if (statusFilter === "Inactive") showInactive = false;

//     const payload = {
//       pageNumber:     params.pageNumber,
//       pageSize:       params.pageSize,
//       searchTerm:     params.searchTerm     ?? "",
//       sortBy:         params.sortBy         ?? "",
//       sortDescending: params.sortDescending  ?? false,
//       showDeleted:    false,
//       showInactive,

//       // Column filters
//       labCode:         params["labCode"]       ?? "",
//       labName:         params["labName"]       ?? "",
//       displayName:     params["displayName"]   ?? "",
//       email:           params["email"]         ?? "",
//       labGroupId:      params["labGroupId"]    ? Number(params["labGroupId"]) : undefined,
//       authenticationType: params["authenticationType"]
//         ? Number(params["authenticationType"])
//         : undefined,
//     };

//     const response = await HttpService.callApi<any>(
//       API_ENDPOINTS.LAB_MASTER.UPDATE_PAGINATION,
//       "POST",
//       payload
//     );

//     const result = response?.value ?? response;

//     return {
//       data:       result.data         ?? result.items ?? [],
//       total:      result.totalRecords  ?? result.total ?? 0,
//       totalPages: result.totalPages,
//     };
//   }

//   static async getById(id: number): Promise<any> {
//     return await HttpService.callApi<any>(API_ENDPOINTS.LAB_MASTER.GET_BY_ID(id), "GET");
//   }

//   static async create(data: Partial<LabMaster>): Promise<any> {
//     const payload = {
//       ...data,
//       isActive:  data.isActive  ?? true,
//       isDeleted: false,
//     };
//     return await HttpService.callApi<any>(API_ENDPOINTS.LAB_MASTER.CREATE, "POST", payload);
//   }

//   static async update(id: number, data: Partial<LabMaster>): Promise<any> {
//     const payload = { id, ...data };
//     return await HttpService.callApi<any>(API_ENDPOINTS.LAB_MASTER.UPDATE(id), "PUT", payload);
//   }

//   static async delete(id: number): Promise<void> {
//     await HttpService.callApi<void>(API_ENDPOINTS.LAB_MASTER.DELETE(id), "DELETE");
//   }
// }




// src/Services/Masters/Lab.services.ts

import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { TableRequestParams, TableResponse } from "../../../KIDU_COMPONENTS/KiduServerTable";
import HttpService from "../../../Services/Common/HttpService";
import type { LabMaster, LabMasterPayload } from "../../Types/Masters/Lab.types";

export default class LabMasterService {

  /**
   * Get paginated list of Lab Masters (for server-side table)
   */
  static async getPaginatedList(params: TableRequestParams): Promise<TableResponse<LabMaster>> {
    
    // Map "Active"/"Inactive" select filter to showInactive boolean
    let showInactive: boolean | undefined = undefined;
    const statusFilter = params["isActive"];
    if (statusFilter === "Active") showInactive = true;    // Show active items
    if (statusFilter === "Inactive") showInactive = false; // Show inactive items

    const payload = {
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
      searchTerm: params.searchTerm ?? "",
      sortBy: params.sortBy ?? "",
      sortDescending: params.sortDescending ?? false,
      showDeleted: false,
      showInactive: showInactive, // undefined = backend default (show all)

      // Column filters — match your API's expected parameters
      id: params["id"] ? Number(params["id"]) : undefined,
      labCode: params["labCode"] ?? "",
      labName: params["labName"] ?? "",
      labGroupId: params["labGroupId"] ? Number(params["labGroupId"]) : undefined,
    };

    console.log("LabMaster pagination payload:", payload);

    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.LAB_MASTER.UPDATE_PAGINATION,
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

  /**
   * Get Lab Master by ID
   */
  static async getById(id: number): Promise<any> {
    return await HttpService.callApi<any>(
      API_ENDPOINTS.LAB_MASTER.GET_BY_ID(id), 
      "GET"
    );
  }

  /**
   * Create new Lab Master
   */
  // static async create(data: Partial<LabMasterPayload>): Promise<any> {
  //   const payload = {
  //     ...data,
  //     isActive: data.isActive ?? true,
  //     isDeleted: false,
  //   };
    
  //   return await HttpService.callApi<any>(
  //     API_ENDPOINTS.LAB_MASTER.CREATE, 
  //     "POST", 
  //     payload
  //   );
  // }

  // In Lab.services.ts
static async create(data: Partial<LabMasterPayload>): Promise<any> {
  const payload = {
    ...data,
    isActive: data.isActive ?? true,
    isDeleted: false,
  };
  
  console.log("Create payload:", payload); // Debug log
  
  const response = await HttpService.callApi<any>(
    API_ENDPOINTS.LAB_MASTER.CREATE, 
    "POST", 
    payload
  );
  
  console.log("Create response:", response); // Debug log
  
  return response;
}

  /**
   * Update existing Lab Master
   */
  static async update(id: number, data: Partial<LabMasterPayload>): Promise<any> {
    const payload = {
      id,
      ...data,
    };
    
    return await HttpService.callApi<any>(
      API_ENDPOINTS.LAB_MASTER.UPDATE(id), 
      "PUT", 
      payload
    );
  }

  /**
   * Delete Lab Master (soft delete)
   */
  static async delete(id: number): Promise<void> {
    await HttpService.callApi<void>(
      API_ENDPOINTS.LAB_MASTER.DELETE(id), 
      "DELETE"
    );
  }

  /**
   * Get all Lab Masters (for dropdowns, etc.)
   */
  static async getAll(): Promise<LabMaster[]> {
    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.LAB_MASTER.GET_ALL, 
      "GET"
    );
    
    const result = response?.value ?? response?.data ?? response;
    return Array.isArray(result) ? result : [];
  }

  /**
   * Get Lab Masters by DSO Master ID (if needed)
   */
  static async getByDSOMasterId(dsoMasterId: number): Promise<LabMaster[]> {
    const response = await HttpService.callApi<any>(
      `${API_ENDPOINTS.LAB_MASTER.GET_ALL}?dsoMasterId=${dsoMasterId}`,
      "GET"
    );
    
    const result = response?.value ?? response?.data ?? response;
    return Array.isArray(result) ? result : [];
  }

  /**
   * Get Lab Masters by Lab Group ID
   */
  static async getByLabGroupId(labGroupId: number): Promise<LabMaster[]> {
    const response = await HttpService.callApi<any>(
      `${API_ENDPOINTS.LAB_MASTER.GET_ALL}?labGroupId=${labGroupId}`,
      "GET"
    );
    
    const result = response?.value ?? response?.data ?? response;
    return Array.isArray(result) ? result : [];
  }

  /**
   * Bulk update Lab Masters (if needed)
   */
  static async bulkUpdate(ids: number[], data: Partial<LabMasterPayload>): Promise<any> {
    const payload = {
      ids,
      ...data,
    };
    
    return await HttpService.callApi<any>(
      `${API_ENDPOINTS.LAB_MASTER.GET_ALL}/bulk-update`,
      "PUT",
      payload
    );
  }

  /**
   * Export Lab Masters (if needed)
   */
/**
 * Export Lab Masters - Returns JSON data that can be exported on frontend
 */
static async export(params: any): Promise<any> {
    const response = await HttpService.callApi<any>(
        `${API_ENDPOINTS.LAB_MASTER.GET_ALL}/export`, 
        "POST", 
        params
    );
    
    return response; // Returns JSON data
}
}