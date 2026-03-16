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
  CasePickUpDetailItem,
  CasePickupUpdatePayload,
} from "../../Types/Pickup.type";

export interface CaseLookupItem {
  id: number;
  caseId: string;
  patientName: string;
  patientNameWithCase: string; // ✅ combined label: "Teena Rejin (CASE-20260313-00006)"
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

export default class CasePickupService {

  // ── Paginated list ────────────────────────────────────────────────────────
  static async getPaginatedList(
    params: TableRequestParams
  ): Promise<TableResponse<CasePickup>> {
    let showInactive: boolean | undefined = undefined;
    const statusFilter = params["isActive"];
    if (statusFilter === "Active")   showInactive = true;
    if (statusFilter === "Inactive") showInactive = false;

    const payload = {
      pageNumber:     params.pageNumber,
      pageSize:       params.pageSize,
      searchTerm:     params.searchTerm     ?? "",
      sortBy:         params.sortBy         ?? "",
      sortDescending: params.sortDescending ?? false,
      showDeleted:    false,
      showInactive,
      labName:        params["labName"]     ?? "",
      pickUpDate:     params["pickUpDate"]  ?? "",
      trackingNum:    params["trackingNum"] ?? "",
    };

    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.CASEPICKUP.GET_PAGINATED,
      "POST",
      payload
    );

    const result    = response?.value ?? response;
    const rawItems: any[] = result.data ?? result.items ?? [];

    const data: CasePickup[] = rawItems.map((item: any): CasePickup => ({
      id:                 item.id,
      labMasterId:        item.labMasterId,
      labMasterName:      item.labMasterName       ?? "",
      pickUpDate:         item.pickUpDate          ?? "",
      pickUpEarliestTime: item.pickUpEarliestTime  ?? "",
      pickUpLateTime:     item.pickUpLateTime       ?? "",
      pickUpAddress:      item.pickUpAddress        ?? "",
      trackingNum:        item.trackingNum          ?? "",
      isActive:           item.isActive             ?? true,
      isDeleted:          item.isDeleted            ?? false,
      createdAt:          item.createdAt,
      updatedAt:          item.updatedAt,
      caseCount:          item.caseCount            ?? 0,
      // ✅ FIX: backend paginated returns `cases`, getById returns `casePickUpDetails`
      cases: (item.cases ?? item.casePickUpDetails ?? []).map(
        (d: any): CasePickUpDetailItem => ({
          id:                       d.id                       ?? 0,
          casePickUpId:             d.casePickUpId             ?? 0,
          caseRegistrationMasterId: d.caseRegistrationMasterId ?? 0,
          isActive:                 d.isActive                 ?? true,
          isDeleted:                d.isDeleted                ?? false,
          createdAt:                d.createdAt,
          updatedAt:                d.updatedAt,
          patientName:              d.patientName              ?? "",
          caseNo:                   d.caseNo                   ?? "",
        })
      ),
      casePickUpDetails: (item.casePickUpDetails ?? item.cases ?? []).map(
        (d: any): CasePickUpDetailItem => ({
          id:                       d.id                       ?? 0,
          casePickUpId:             d.casePickUpId             ?? 0,
          caseRegistrationMasterId: d.caseRegistrationMasterId ?? 0,
          isActive:                 d.isActive                 ?? true,
          isDeleted:                d.isDeleted                ?? false,
          createdAt:                d.createdAt,
          updatedAt:                d.updatedAt,
          patientName:              d.patientName              ?? "",
          caseNo:                   d.caseNo                   ?? "",
        })
      ),
    }));

    return {
      data,
      total:      result.totalRecords ?? result.total ?? 0,
      totalPages: result.totalPages,
    };
  }

  // ── Get by ID ─────────────────────────────────────────────────────────────
  static async getById(id: number): Promise<any> {
    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.CASEPICKUP.GET_BY_ID(id),
      "GET"
    );

    const raw  = response?.value ?? response;
    const data = Array.isArray(raw) ? raw[0] : raw;

    const details: CasePickUpDetailItem[] = (
      data?.casePickUpDetails ?? data?.CasePickUpDetails ?? []
    ).map((d: any): CasePickUpDetailItem => ({
      id:                       d.id                       ?? d.Id                       ?? 0,
      casePickUpId:             d.casePickUpId             ?? d.CasePickUpId             ?? 0,
      caseRegistrationMasterId: d.caseRegistrationMasterId ?? d.CaseRegistrationMasterId ?? 0,
      isActive:                 d.isActive                 ?? d.IsActive                 ?? true,
      isDeleted:                d.isDeleted                ?? d.IsDeleted                ?? false,
      createdAt:                d.createdAt                ?? d.CreatedAt,
      updatedAt:                d.updatedAt                ?? d.UpdatedAt,
      patientName:              d.patientName              ?? d.PatientName              ?? "",
      caseNo:                   d.caseNo                   ?? d.CaseNo                   ?? "",
    }));

    const activeDetails             = details.filter((d) => !d.isDeleted);
    const caseRegistrationMasterIds = activeDetails.map((d) => d.caseRegistrationMasterId);
    const caseLabels                = activeDetails.map((d) =>
      d.patientName
        ? d.caseNo ? `${d.patientName} (${d.caseNo})` : d.patientName
        : String(d.caseRegistrationMasterId)
    );

    return {
      id:                 data.id                 ?? data.Id                 ?? id,
      pickUpDate:         data.pickUpDate         ?? data.PickUpDate         ?? "",
      pickUpEarliestTime: data.pickUpEarliestTime ?? data.PickUpEarliestTime ?? "",
      pickUpLateTime:     data.pickUpLateTime     ?? data.PickUpLateTime     ?? "",
      pickUpAddress:      data.pickUpAddress      ?? data.PickUpAddress      ?? "",
      trackingNum:        data.trackingNum        ?? data.TrackingNum        ?? "",
      labMasterId:        data.labMasterId        ?? data.LabMasterId        ?? 0,
      labMasterName:      data.labMasterName      ?? data.LabMasterName      ?? "",
      isActive:           data.isActive           ?? data.IsActive           ?? true,
      isDeleted:          data.isDeleted          ?? data.IsDeleted          ?? false,
      casePickUpDetails:  details,
      caseRegistrationMasterIds,
      caseLabels,
      pickUpAddressId:    undefined, // ✅ not returned by backend
    };
  }

  // ── Create ────────────────────────────────────────────────────────────────
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
      { ...data, id }
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
  static async getCasesByDoctor(dsoDoctorId: number): Promise<CaseLookupItem[]> {
    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.CASE_REGISTRATION.GET_PAGINATED,
      "POST",
      {
        pageNumber: 1, pageSize: 9999,
        searchTerm: "", sortBy: "", sortDescending: false,
        showDeleted: false, dsoDoctorId,
      }
    );

    const result = response?.value ?? response;
    const items: any[] = result?.data ?? result?.items ?? [];

    return items.map((c: any): CaseLookupItem => {
      const patientName = c.patientFirstName
        ? `${c.patientFirstName} ${c.patientLastName ?? ""}`.trim()
        : (c.patientName ?? "—");

      const caseId = c.caseNo ?? c.caseId ?? String(c.id);

      return {
        id:                  c.id,
        caseId,
        patientName,
        // ✅ Combined label shown in chip after selection
        patientNameWithCase: `${patientName} (${caseId})`,
        doctorName:          c.doctorName ? `Dr. ${c.doctorName}` : "",
        status:              c.caseStatusName ?? c.status ?? "",
      };
    });
  }

  // ── Get dental offices for a specific doctor ──────────────────────────────
  static async getPracticesByDoctor(dsoDoctorId: number): Promise<DoctorPracticeItem[]> {
    try {
      const doctorRes = await HttpService.callApi<any>(
        API_ENDPOINTS.DSO_DOCTOR.GET_BY_ID(dsoDoctorId),
        "GET", null, false
      );

      if (!doctorRes?.isSucess || !doctorRes.value) return [];

      const value    = doctorRes.value;
      const mappings: any[] =
        value.dsoDentalDoctors ?? value.DsoDentalDoctors ??
        value.officeMappings   ?? value.OfficeMappings   ??
        value.dentalOfficeMappings ?? [];

      const activeMappings = mappings.filter(
        (m: any) => !(m.isDeleted ?? m.IsDeleted ?? false)
      );

      if (activeMappings.length === 0) return [];

      const officeResults = await Promise.all(
        activeMappings.map((m: any) => {
          const officeId =
            m.dsoDentalOfficeId ?? m.dSODentalOfficeId ??
            m.DSODentalOfficeId ?? m.dentalOfficeId    ?? null;

          if (!officeId) return Promise.resolve(null);

          return HttpService.callApi<any>(
            API_ENDPOINTS.DSO_DENTAL_OFFICE.GET_BY_ID(officeId),
            "GET", null, false
          ).then((r: any) => (r?.isSucess && r.value ? r.value : null));
        })
      );

      return officeResults.filter(Boolean).map((o: any): DoctorPracticeItem => ({
        id:         o.id         ?? 0,
        officeName: o.officeName ?? "",
        officeCode: o.officeCode ?? "",
        address:    o.address    ?? "",
        city:       o.city       ?? "",
        postCode:   o.postCode   ?? "",
        country:    o.country    ?? "",
        isActive:   o.isActive   ?? true,
      }));
    } catch (err) {
      console.error("[CasePickupService] getPracticesByDoctor failed:", err);
      return [];
    }
  }

  // ── Get full dental office detail by ID (for View modal address panel) ───
  static async getOfficeById(officeId: number): Promise<{
    practiceName: string;
    address: string;
    email: string;
    mobileNo: string;
  } | null> {
    try {
      const res = await HttpService.callApi<any>(
        API_ENDPOINTS.DSO_DENTAL_OFFICE.GET_BY_ID(officeId),
        "GET", null, false
      );
      const o = res?.value ?? res;
      if (!o) return null;
      return {
        practiceName: o.officeName ?? "",
        address:      [o.address, o.city, o.postCode, o.country].filter(Boolean).join(", "),
        email:        o.email    ?? o.emailAddress ?? "",
        mobileNo:     o.mobileNo ?? o.phone        ?? o.mobile ?? "",
      };
    } catch {
      return null;
    }
  }
}