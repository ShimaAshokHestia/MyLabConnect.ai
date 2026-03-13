// ─────────────────────────────────────────────────────────────────────────────
// FILE: src/DOCTOR_CONNECT/Service/Prescription/Case.services.ts
//
// Path matches what the screenshot shows:
//   src/DOCTOR_CONNECT/Service/Prescription/Case.services.ts
//   (alongside Prescription.services.ts)
// ─────────────────────────────────────────────────────────────────────────────

import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/Common/HttpService";
import type {
  CaseRegistrationDTO,
  CaseRegistrationDetailDTO,
  CaseRegistrationCreateDTO,
  CaseRegistrationUpdateDTO,
  CaseStatusChangeDTO,
  CaseProductDetailCreateUpdateDTO,
  CaseDocumentCreateUpdateDTO,
  CaseAdditionalServiceCreateUpdateDTO,
  CasePickUpCreateUpdateDTO,
} from "../../Types/Case.types";

// ── Paginated list params / response (matches KiduServerTableList signature) ──
export interface CasePaginationParams {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
  sortBy?: string;
  sortDescending?: boolean;
  showDeleted?: boolean;
  getAll?: boolean;
  caseNo?: string;
  patientName?: string;
  dSOMasterId?: number;
  dSODentalOfficeId?: number;
  dSODoctorId?: number;
  labMasterId?: number;
  caseStatusMasterId?: number;
}

export interface CasePaginatedResponse {
  data: CaseRegistrationDTO[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}

// ─────────────────────────────────────────────────────────────────────────────

const CaseService = {

  // ── Paginated list ─────────────────────────────────────────────────────────
  async getPaginatedList(params: Record<string, any>): Promise<{
    data: CaseRegistrationDTO[];
    total: number;
    totalPages?: number;
  }> {
    const payload: CasePaginationParams = {
      pageNumber:     params.pageNumber   ?? 1,
      pageSize:       params.pageSize     ?? 10,
      searchTerm:     params.searchTerm   ?? "",
      sortBy:         params.sortBy       ?? "",
      sortDescending: params.sortDescending ?? false,
      showDeleted:    false,
      caseNo:              params["caseNo"]             ?? "",
      patientName:         params["patientFirstName"]   ?? params["patientName"] ?? "",
      dSODentalOfficeId:   params["dSODentalOfficeId"]  ? Number(params["dSODentalOfficeId"])  : undefined,
      dSODoctorId:         params["dSODoctorId"]        ? Number(params["dSODoctorId"])         : undefined,
      labMasterId:         params["labMasterId"]        ? Number(params["labMasterId"])         : undefined,
      caseStatusMasterId:  params["caseStatusMasterId"] ? Number(params["caseStatusMasterId"])  : undefined,
      dSOMasterId:         params["dSOMasterId"]        ? Number(params["dSOMasterId"])         : undefined,
    };

    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.CASE_REGISTRATION.GET_PAGINATED,
      "POST",
      payload
    );

    const result = response?.value ?? response;
    return {
      data:       result?.data        ?? result?.items ?? [],
      total:      result?.totalRecords ?? result?.total ?? 0,
      totalPages: result?.totalPages,
    };
  },

  // ── Get by ID (flat) ───────────────────────────────────────────────────────
  async getById(id: number): Promise<any> {
    return await HttpService.callApi<any>(
      API_ENDPOINTS.CASE_REGISTRATION.GET_BY_ID(id),
      "GET",
      null,
      false
    );
  },

  // ── Get by ID with details ─────────────────────────────────────────────────
  async getByIdWithDetails(id: number): Promise<CaseRegistrationDetailDTO | null> {
    try {
      const res = await HttpService.callApi<any>(
        API_ENDPOINTS.CASE_REGISTRATION.GET_BY_ID(id),
        "GET",
        null,
        false
      );
      return res?.isSucess ? (res.value as CaseRegistrationDetailDTO) : null;
    } catch {
      return null;
    }
  },

  // ── Create ────────────────────────────────────────────────────────────────
  async create(dto: CaseRegistrationCreateDTO): Promise<any> {
    return await HttpService.callApi<any>(
      API_ENDPOINTS.CASE_REGISTRATION.CREATE,
      "POST",
      dto
    );
  },

  // ── Update ────────────────────────────────────────────────────────────────
  async update(id: number, dto: CaseRegistrationUpdateDTO): Promise<any> {
    return await HttpService.callApi<any>(
      API_ENDPOINTS.CASE_REGISTRATION.UPDATE(id),
      "PUT",
      { ...dto, id }
    );
  },

  // ── Delete ────────────────────────────────────────────────────────────────
  async delete(id: number): Promise<any> {
    return await HttpService.callApi<any>(
      API_ENDPOINTS.CASE_REGISTRATION.DELETE(id),
      "DELETE"
    );
  },

  // ── Change status ─────────────────────────────────────────────────────────
  async changeStatus(dto: CaseStatusChangeDTO): Promise<any> {
    return await HttpService.callApi<any>(
      API_ENDPOINTS.CASE_REGISTRATION.CHANGE_STATUS(dto.caseRegistrationMasterId),
      "POST",
      dto
    );
  },

  // ─────────────────────────────────────────────────────────────────────────
  //  Products
  // ─────────────────────────────────────────────────────────────────────────

  async addProduct(caseId: number, dto: CaseProductDetailCreateUpdateDTO): Promise<any> {
    return await HttpService.callApi<any>(
      API_ENDPOINTS.CASE_REGISTRATION.ADD_PRODUCT(caseId), "POST", dto
    );
  },

  async updateProduct(caseId: number, productId: number, dto: CaseProductDetailCreateUpdateDTO): Promise<any> {
    return await HttpService.callApi<any>(
      API_ENDPOINTS.CASE_REGISTRATION.UPDATE_PRODUCT(caseId, productId), "PUT", dto
    );
  },

  async removeProduct(caseId: number, productId: number): Promise<any> {
    return await HttpService.callApi<any>(
      API_ENDPOINTS.CASE_REGISTRATION.REMOVE_PRODUCT(caseId, productId), "DELETE"
    );
  },

  // ─────────────────────────────────────────────────────────────────────────
  //  Documents
  // ─────────────────────────────────────────────────────────────────────────

  async addDocument(caseId: number, dto: CaseDocumentCreateUpdateDTO): Promise<any> {
    return await HttpService.callApi<any>(
      API_ENDPOINTS.CASE_REGISTRATION.ADD_DOCUMENT(caseId), "POST", dto
    );
  },

  async removeDocument(caseId: number, docId: number): Promise<any> {
    return await HttpService.callApi<any>(
      API_ENDPOINTS.CASE_REGISTRATION.REMOVE_DOCUMENT(caseId, docId), "DELETE"
    );
  },

  // ─────────────────────────────────────────────────────────────────────────
  //  Additional Services
  // ─────────────────────────────────────────────────────────────────────────

  async addService(caseId: number, dto: CaseAdditionalServiceCreateUpdateDTO): Promise<any> {
    return await HttpService.callApi<any>(
      API_ENDPOINTS.CASE_REGISTRATION.ADD_SERVICE(caseId), "POST", dto
    );
  },

  async updateService(caseId: number, svcId: number, dto: CaseAdditionalServiceCreateUpdateDTO): Promise<any> {
    return await HttpService.callApi<any>(
      API_ENDPOINTS.CASE_REGISTRATION.UPDATE_SERVICE(caseId, svcId), "PUT", dto
    );
  },

  async removeService(caseId: number, svcId: number): Promise<any> {
    return await HttpService.callApi<any>(
      API_ENDPOINTS.CASE_REGISTRATION.REMOVE_SERVICE(caseId, svcId), "DELETE"
    );
  },

  // ─────────────────────────────────────────────────────────────────────────
  //  Pickups
  // ─────────────────────────────────────────────────────────────────────────

  async addPickup(caseId: number, dto: CasePickUpCreateUpdateDTO): Promise<any> {
    return await HttpService.callApi<any>(
      API_ENDPOINTS.CASE_REGISTRATION.ADD_PICKUP(caseId), "POST", dto
    );
  },

  async updatePickup(caseId: number, pickupId: number, dto: CasePickUpCreateUpdateDTO): Promise<any> {
    return await HttpService.callApi<any>(
      API_ENDPOINTS.CASE_REGISTRATION.UPDATE_PICKUP(caseId, pickupId), "PUT", dto
    );
  },

  async removePickup(caseId: number, pickupId: number): Promise<any> {
    return await HttpService.callApi<any>(
      API_ENDPOINTS.CASE_REGISTRATION.REMOVE_PICKUP(caseId, pickupId), "DELETE"
    );
  },
};

export default CaseService;