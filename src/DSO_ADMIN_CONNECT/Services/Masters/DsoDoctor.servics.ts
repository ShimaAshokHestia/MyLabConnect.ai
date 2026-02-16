// src/Services/DSODoctor.service.ts

import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/Common/HttpService";
import type { CustomResponse } from "../../../Types/Common/ApiTypes";
import type { DSODoctor, DSODoctorPaginatedRequest, DSODoctorPaginatedResponse } from "../../Types/Masters/DsoDoctor.types";



const DSODoctorService = {
  /**
   * Get all DSO doctors (non-paginated)
   */
  async getAllDoctors(): Promise<DSODoctor[]> {
    try {
      const response = await HttpService.callApi<CustomResponse<DSODoctor[]>>(
        API_ENDPOINTS.DSODoctor.GET_ALL,
        "GET"
      );
      return response.value || [];
    } catch (error) {
      console.error("Error fetching all DSO doctors:", error);
      return [];
    }
  },

  /**
   * Get DSO doctor by ID
   */
  async getDoctorById(id: number): Promise<DSODoctor> {
    const response = await HttpService.callApi<CustomResponse<DSODoctor>>(
      API_ENDPOINTS.DSODoctor.GET_BY_ID(id),
      "GET"
    );
    return response.value;
  },

  /**
   * Get paginated DSO doctors
   * This is the main method used by KiduServerTable
   */
  async getDoctorsPaginated(
    params: DSODoctorPaginatedRequest
  ): Promise<DSODoctorPaginatedResponse> {
    try {
      console.log("📤 Fetching paginated DSO doctors with params:", params);

      const response = await HttpService.callApi<CustomResponse<DSODoctor[]>>(
        API_ENDPOINTS.DSODoctor.POST_PAGINATED,
        "POST",
        {
          pageNumber: params.pageNumber || 1,
          pageSize: params.pageSize || 10,
          searchTerm: params.searchTerm || "",
          sortBy: params.sortBy || "",
          sortDescending: params.sortDescending || false,
          showDeleted: params.showDeleted || false,
          showInactive: params.showInactive ?? true,
          
          // Specific filters
          code: params.code || "",
          name: params.name || "",
          dsoMasterId: params.dsoMasterId || 0,
          dsoName: params.dsoName || "",
        }
      );

      console.log("📥 Received response:", {
        statusCode: response.statusCode,
        isSuccess: response.isSucess || response.isSuccess,
        dataCount: response.value?.length || 0,
      });

      // Extract data from response
      const doctors = response.value || [];
      
      // Calculate total and pages
      // Note: If your API returns total count separately, use that instead
      const total = doctors.length;
      const totalPages = Math.ceil(total / params.pageSize);

      return {
        data: doctors,
        total: total,
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
        totalPages: totalPages,
      };
    } catch (error) {
      console.error("❌ Error fetching paginated DSO doctors:", error);
      throw error;
    }
  },

  /**
   * Create new DSO doctor
   */
  async createDoctor(
    data: Omit<DSODoctor, "id" | "createdAt" | "updatedAt">
  ): Promise<DSODoctor> {
    const response = await HttpService.callApi<CustomResponse<DSODoctor>>(
      API_ENDPOINTS.DSODoctor.CREATE,
      "POST",
      data
    );
    return response.value;
  },

  /**
   * Update DSO doctor
   */
  async updateDoctor(
    id: number,
    data: Partial<Omit<DSODoctor, "id" | "createdAt" | "updatedAt">>
  ): Promise<DSODoctor> {
    const response = await HttpService.callApi<CustomResponse<DSODoctor>>(
      API_ENDPOINTS.DSODoctor.UPDATE(id),
      "PUT",
      data
    );
    return response.value;
  },

  /**
   * Delete DSO doctor (soft delete)
   */
  async deleteDoctor(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.DSODoctor.DELETE(id),
      "DELETE"
    );
  },

  /**
   * Toggle doctor active status
   */
  async toggleDoctorStatus(id: number, isActive: boolean): Promise<DSODoctor> {
    return this.updateDoctor(id, { isActive });
  },
};

export default DSODoctorService;