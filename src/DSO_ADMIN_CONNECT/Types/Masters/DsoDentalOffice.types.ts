// import type { AuditTrails } from "../../../Types/Auditlog.types";

// export interface DSODentalOffice {
//   // Core Fields
//   id?: number;
//   officeCode?: string;
//   officeName?: string;
//   postCode?: string;
//   mobileNum?: string;
//   email?: string;
//   city?: string;
//   country?: string;
//   address?: string;
//   dsoZoneId?: number;
//   dsoZoneName?: string;
//   info?: string;
//   dsoMasterId?: number;
//   dsoName?: string;

//   // Status Fields
//   isActive?: boolean;
//   isDeleted?: boolean;

//   // Pagination/Filtering Fields
//   pageNumber?: number;
//   pageSize?: number;
//   searchTerm?: string;
//   sortBy?: string;
//   sortDescending?: boolean;
//   showDeleted?: boolean;
//   showInactive?: boolean;

//   // Optional Audit Trail
//   auditlog?: AuditTrails[];
// }


import type { AuditTrails } from "../../../Types/Auditlog.types";

export interface DentalOffice {
  // Core Fields
  id?: number;
  officeCode?: string;
  officeName?: string;
  postCode?: string;
  mobileNum?: string;
  email?: string;
  city?: string;
  country?: string;
  address?: string;
  alternateAddress?: string;
  mapUrl?: string;
  dsoZoneId?: number;
  dsoZoneName?: string;
  info?: string;
  dsoMasterId?: number;
  dsoName?: string;

  // Status Fields
  isActive?: boolean;
  isDeleted?: boolean;

  // Timestamp Fields
  createdAt?: string;
  updatedAt?: string | null;

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