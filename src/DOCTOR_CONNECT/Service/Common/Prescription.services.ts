// src/DOCTOR_CONNECT/Service/Prescription/Prescription.services.ts

import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/Common/HttpService";
import type { DentalOfficeItem } from "../../Pages/Analog Case Prescription/DentalOfficePopup";

export interface IdNameOption {
  id: number;
  name: string;
}

// ── Safe GET → always returns array ──────────────────────────────────────────
async function getArray<T>(url: string): Promise<T[]> {
  try {
    const res = await HttpService.callApi<any>(url, "GET", null, false);
    if (!res?.isSucess) return [];
    if (Array.isArray(res.value)) return res.value as T[];
    if (Array.isArray(res.value?.data)) return res.value.data as T[];
    return [];
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
const PrescriptionService = {

  // ── Get only the offices this doctor is mapped to ────────────────────────
  // doctorId is now passed in directly — read from JWT via AuthService.getUser().dsoDoctorId
  async getMyOffices(doctorId: number): Promise<DentalOfficeItem[]> {
    try {
      const res = await HttpService.callApi<any>(
        API_ENDPOINTS.DSO_DOCTOR.GET_BY_ID(doctorId),
        "GET",
        null,
        false
      );

      if (!res?.isSucess || !res.value) {
        console.warn("[PrescriptionService] getMyOffices: no data for doctorId", doctorId);
        return [];
      }

      console.log("[PrescriptionService] getMyOffices raw response value:", res.value);

      const mappings: any[] =
        res.value.dsoDentalDoctors   ??
        res.value.DsoDentalDoctors   ??
        res.value.dsaDentalDoctors   ??
        res.value.DsaDentalDoctors   ??
        res.value.officeMappings     ??
        res.value.OfficeMappings     ??
        res.value.dentalOfficeMappings ??
        [];

      const activeMappings = mappings.filter(
        (m: any) => !(m.isDeleted ?? m.IsDeleted ?? false)
      );

      if (activeMappings.length === 0) {
        console.warn("[PrescriptionService] No active office mappings for doctorId", doctorId);
        return [];
      }

      const officeResults = await Promise.all(
        activeMappings.map((m: any) => {
          const officeId =
            m.dsoDentalOfficeId  ??
            m.dSODentalOfficeId  ??
            m.DSODentalOfficeId  ??
            m.dentalOfficeId     ??
            m.DentalOfficeId     ??
            null;

          if (!officeId) return Promise.resolve(null);

          return HttpService.callApi<any>(
            API_ENDPOINTS.DSO_DENTAL_OFFICE.GET_BY_ID(officeId),
            "GET",
            null,
            false
          ).then((r: any) => r?.isSucess && r.value ? r.value : null);
        })
      );

      const offices = officeResults
        .filter(Boolean)
        .map((o: any): DentalOfficeItem => ({
          id:         o.id         ?? o.Id         ?? 0,
          officeName: o.officeName ?? o.OfficeName ?? "",
          officeCode: o.officeCode ?? o.OfficeCode ?? "",
          address:    o.address    ?? o.Address    ?? "",
          city:       o.city       ?? o.City       ?? "",
          postCode:   o.postCode   ?? o.PostCode   ?? "",
          country:    o.country    ?? o.Country    ?? "",
          isActive:   o.isActive   ?? o.IsActive   ?? true,
        }));

      console.log("[PrescriptionService] Final offices:", offices);
      return offices;

    } catch (err) {
      console.error("[PrescriptionService] getMyOffices failed:", err);
      return [];
    }
  },

  // ── Build the Ship To string ──────────────────────────────────────────────
  buildShipTo(office: DentalOfficeItem): string {
    return [office.officeName, office.address, office.city, office.country, office.postCode]
      .filter((s) => s?.trim())
      .join(", ");
  },

  // ── Get first DSO Schema ──────────────────────────────────────────────────
  async getFirstSchema(dsoMasterId: number): Promise<IdNameOption | null> {
    const all = await getArray<any>(API_ENDPOINTS.DSO_SCHEMA.GET_ALL);
    const match = all.find(
      (s: any) =>
        (s.dSOMasterId ?? s.DSOMasterId) === dsoMasterId &&
        !(s.isDeleted ?? s.IsDeleted ?? false)
    );
    if (!match) return null;
    return {
      id:   match.id   ?? match.Id,
      name: match.name ?? match.Name ?? "",
    };
  },

  // ── Restoration: Prothesis types ─────────────────────────────────────────
  async getProthesisTypes(dsoMasterId: number): Promise<IdNameOption[]> {
    const all = await getArray<any>(API_ENDPOINTS.DSO_PROTHESIS_TYPE.GET_ALL);
    return all
      .filter(
        (p: any) =>
          (p.dSOMasterId ?? p.DSOMasterId) === dsoMasterId &&
          !(p.isDeleted  ?? p.IsDeleted  ?? false) &&
          (p.isActive    ?? p.IsActive   ?? true)
      )
      .map((p: any) => ({ id: p.id ?? p.Id, name: p.name ?? p.Name ?? "" }));
  },

  // ── Restoration: Restoration types ───────────────────────────────────────
  async getRestorationTypes(prothesisTypeId: number): Promise<IdNameOption[]> {
    const all = await getArray<any>(API_ENDPOINTS.DSO_RESTORATION_TYPE.GET_ALL);
    return all
      .filter(
        (r: any) =>
          (r.dSOProthesisTypeId ?? r.DSOProthesisTypeId) === prothesisTypeId &&
          !(r.isDeleted ?? r.IsDeleted ?? false) &&
          (r.isActive   ?? r.IsActive  ?? true)
      )
      .map((r: any) => ({ id: r.id ?? r.Id, name: r.name ?? r.Name ?? "" }));
  },

  // ── Restoration: Indications ──────────────────────────────────────────────
  async getIndications(prothesisTypeId: number): Promise<IdNameOption[]> {
    const all = await getArray<any>(API_ENDPOINTS.DSO_INDICATION.GET_ALL);
    return all
      .filter(
        (i: any) =>
          (i.dSOProthesisTypeId ?? i.DSOProthesisTypeId) === prothesisTypeId &&
          !(i.isDeleted ?? i.IsDeleted ?? false) &&
          (i.isActive   ?? i.IsActive  ?? true)
      )
      .map((i: any) => ({ id: i.id ?? i.Id, name: i.name ?? i.Name ?? "" }));
  },

  // ── Restoration: Materials ────────────────────────────────────────────────
  async getMaterials(restorationTypeId: number): Promise<IdNameOption[]> {
    const all = await getArray<any>(API_ENDPOINTS.DSO_MATERIAL.GET_ALL);
    return all
      .filter(
        (m: any) =>
          (m.dSORestorationTypeId ?? m.DSORestorationTypeId) === restorationTypeId &&
          !(m.isDeleted ?? m.IsDeleted ?? false) &&
          (m.isActive   ?? m.IsActive  ?? true)
      )
      .map((m: any) => ({ id: m.id ?? m.Id, name: m.name ?? m.Name ?? "" }));
  },

  // ── Shade guides (static fallback) ────────────────────────────────────────
  getShadeGuides(): IdNameOption[] {
    return [
      { id: 1, name: "Default"        },
      { id: 2, name: "VITAPAN"        },
      { id: 3, name: "VITA_CLASSICAL" },
    ];
  },
};

export default PrescriptionService;