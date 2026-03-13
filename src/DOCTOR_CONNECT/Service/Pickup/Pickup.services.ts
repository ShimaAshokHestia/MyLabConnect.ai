// src/DOCTOR_CONNECT/Service/Pickup/Pickup.services.ts

import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type {
  TableRequestParams,
  TableResponse,
} from "../../../KIDU_COMPONENTS/KiduServerTable";
import HttpService from "../../../Services/Common/HttpService";
import type {
  CasePickup,
  CasePickupCreatePayload,
  CasePickupDetail,
  CasePickupUpdatePayload,
} from "../../Types/Pickup.type";

// ─── Local return types ───────────────────────────────────────────────────────

export interface CaseLookupItem {
  id: number;
  caseId: string;
  patientName: string;
  doctorName: string;
  status: string;
}

export interface DoctorPracticeItem {
  id: number;
  officeName: string;
  officeCode: string;
  address: string;
  city: string;
  postCode: string;
  country: string;
  isActive: boolean;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export default class CasePickupService {

  // ── Paginated list ────────────────────────────────────────────────────────
  static async getPaginatedList(
    params: TableRequestParams
  ): Promise<TableResponse<CasePickup>> {
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
      showInactive,
      labName: params["labName"] ?? "",
      pickUpDate: params["pickUpDate"] ?? "",
      trackingNum: params["trackingNum"] ?? "",
    };

    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.CASEPICKUP.GET_PAGINATED,
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

  // ── Get by ID ─────────────────────────────────────────────────────────────
 static async getById(id: number): Promise<CasePickupDetail> {
  const response = await HttpService.callApi<any>(
    API_ENDPOINTS.CASEPICKUP.GET_BY_ID(id),
    "GET"
  );

  // API returns { value: [...], statusCode: 200, ... }
  // unwrap the array
  const result = response?.value ?? response;
  return Array.isArray(result) ? result[0] : result;
}

  // ── Create ────────────────────────────────────────────────────────────────
  // Payload matches CasePickUpCreateUpdateDTO:
  //   id, pickUpDate, pickUpEarliestTime, pickUpLateTime,
  //   pickUpAddress, trackingNum, labMasterId, isActive, isDeleted,
  //   casePickUpDetails: [{ id, casePickUpId, isActive, isDeleted }]
  static async create(data: CasePickupCreatePayload): Promise<any> {
    return await HttpService.callApi<any>(
      API_ENDPOINTS.CASEPICKUP.CREATE,
      "POST",
      data
    );
  }

  // ── Update ────────────────────────────────────────────────────────────────
  static async update(id: number, data: CasePickupUpdatePayload): Promise<any> {
    return await HttpService.callApi<any>(
      API_ENDPOINTS.CASEPICKUP.UPDATE(id),
      "PUT",
      data
    );
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  static async delete(id: number): Promise<void> {
    await HttpService.callApi<void>(
      API_ENDPOINTS.CASEPICKUP.DELETE(id),
      "DELETE"
    );
  }

  // ── Get all (non-paginated) ───────────────────────────────────────────────
  static async getAll(): Promise<CasePickup[]> {
    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.CASEPICKUP.GET_ALL,
      "GET"
    );
    const result = response?.value ?? response?.data ?? response;
    return Array.isArray(result) ? result : [];
  }

  // ── Get cases for a specific doctor ──────────────────────────────────────
  static async getCasesByDoctor(
    dsoDoctorId: number
  ): Promise<CaseLookupItem[]> {
    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.CASE_REGISTRATION.GET_PAGINATED,
      "POST",
      {
        pageNumber: 1,
        pageSize: 9999,
        searchTerm: "",
        sortBy: "",
        sortDescending: false,
        showDeleted: false,
        dsoDoctorId,
      }
    );

    const result = response?.value ?? response;
    const items: any[] = result?.data ?? result?.items ?? [];

    return items.map(
      (c: any): CaseLookupItem => ({
        id: c.id,
        caseId: c.caseId ?? c.caseNumber ?? String(c.id),
        patientName: c.patientName ?? c.patientFirstName ?? "—",
        doctorName: c.doctorName ?? "",
        status: c.statusName ?? c.status ?? "",
      })
    );
  }

  // ── Get dental offices (practices) for a specific doctor ─────────────────
  static async getPracticesByDoctor(
    dsoDoctorId: number
  ): Promise<DoctorPracticeItem[]> {
    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.DSO_DOCTOR_DENTAL_OFFICE.UPDATE_PAGINATION,
      "POST",
      {
        pageNumber: 1,
        pageSize: 9999,
        searchTerm: "",
        sortBy: "",
        sortDescending: false,
        showDeleted: false,
        dsoDoctorId,
      }
    );

    const result = response?.value ?? response;
    const items: any[] = result?.data ?? result?.items ?? [];

    return items.map(
      (row: any): DoctorPracticeItem => ({
        id: row.dsodentalOfficeId ?? row.dentalOfficeId ?? row.id,
        officeName: row.officeName ?? row.dentalOfficeName ?? "",
        officeCode: row.officeCode ?? "",
        address: row.address ?? "",
        city: row.city ?? "",
        postCode: row.postCode ?? "",
        country: row.country ?? "",
        isActive: row.isActive ?? true,
      })
    );
  }
}