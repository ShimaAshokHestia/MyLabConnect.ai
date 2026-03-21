// import type { AuditTrails } from "../../../Types/Auditlog.types";

// export interface DSODentalDoctor {
//   id?: number;
//   createdAt?: string;
//   updatedAt?: string | null;
//   isDeleted?: boolean;
//   isActive?: boolean;
//   dsoDoctorId?: number;
//   dsoDentalOfficeId?: number;
//   dsoMasterId?: number;
// }

// export interface DSODoctor {
//   // Core Identity Fields
//   id?: number;
//   firstName?: string;
//   lastName?: string;
//   fullName?: string;
//   email?: string;
//   phoneNumber?: string;
//   address?: string;
//   licenseNo?: string;
//   doctorCode?: string;
//   info?: string;
  
//   // DSO Master Relationship
//   dsoMasterId?: number;
//   dsoName?: string;
  
//   // Related Entities
//   dsoDentalDoctors?: DSODentalDoctor[];
  
//   // Status Fields
//   isActive?: boolean;
//   isDeleted?: boolean;
  
//   // Audit Fields
//   createdAt?: string;
//   updatedAt?: string | null;
  
//   // Pagination/Filtering Fields (for API requests)
//   pageNumber?: number;
//   pageSize?: number;
//   searchTerm?: string;
//   sortBy?: string;
//   sortDescending?: boolean;
//   showDeleted?: boolean;
//   showInactive?: boolean;
//   getAll?: boolean;
  
//   // Optional Audit Trail
//   auditlog?: AuditTrails[];
// }

import type { AuditTrails } from "../../../Types/Auditlog.types";

export interface DSODentalDoctor {
  id?: number;
  createdAt?: string;
  updatedAt?: string | null;
  isDeleted?: boolean;
  isActive?: boolean;
  dsoDoctorId?: number;
  dsoDentalOfficeId?: number;
  dsoMasterId?: number;
  // Optional Audit Trail for nested objects
  auditlog?: AuditTrails[];
}

export interface LabMapping {
  id?: number;
  createdAt?: string;
  updatedAt?: string | null;
  isDeleted?: boolean;
  isActive?: boolean;
  dsoDoctorId?: number;
  labMasterId?: number;
  labName?: string;
  labDescription?: string;
  // Optional Audit Trail for nested objects
  auditlog?: AuditTrails[];
}

export interface DSODoctor {
  // Core Identity Fields
  id?: number;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  licenseNo?: string;
  doctorCode?: string;
  info?: string;
  triosDoctorId?:string;
  triosEmailId?:string;
  
  // DSO Master Relationship
  dsoMasterId?: number;
  dsoName?: string;
  
  // Related Entities
  dsoDentalDoctors?: DSODentalDoctor[];
  labMappings?: LabMapping[];
  
  // Status Fields
  isActive?: boolean;
  isDeleted?: boolean;
  
  // Audit Fields
  createdAt?: string;
  updatedAt?: string | null;
  
  // Pagination/Filtering Fields (for API requests)
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortDescending?: boolean;
  showDeleted?: boolean;
  showInactive?: boolean;
  getAll?: boolean;
  
  // Optional Audit Trail - Main entity audit log
  auditlog?: AuditTrails[];
}

// For API Response wrapper
export interface ApiResponse<T> {
  statusCode: number;
  error: string | null;
  customMessage: string | null;
  isSucess: boolean;
  value: T;
}