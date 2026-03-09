import type { AuditTrails } from "../../../Types/Auditlog.types";

// ── Dental Office mapping (mirrors DSODoctorDentalOfficeCreateUpdateDTO) ───────
export interface DSODoctorDentalOffice {
  id?: number;
  dSODentalOfficeId?: number;
  dSODoctorId?: number;
  isActive?: boolean;
  isDeleted?: boolean;
}

export interface DSODoctor {
  // Core Identity Fields
  id?: number;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  doctorCode?: string;
  licenseNo?: string;

  // Contact Information
  email?: string;
  phoneNumber?: string;
  address?: string;

  // Professional Information
  info?: string; // Specialty/Additional info
  dsoMasterId?: number;
  dsoName?: string;

  // Dental Office Mappings (mirrors C# DsoDentalDoctors)
  dsoDentalDoctors?: DSODoctorDentalOffice[];

  // Audit Fields
  createdAt?: string;
  updatedAt?: string | null;
  isDeleted?: boolean;
  isActive?: boolean;

  // Pagination/Filtering Fields
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortDescending?: boolean;
  showDeleted?: boolean;
  showInactive?: boolean;

  // Optional Audit Trail
  auditlog?: AuditTrails[];
}