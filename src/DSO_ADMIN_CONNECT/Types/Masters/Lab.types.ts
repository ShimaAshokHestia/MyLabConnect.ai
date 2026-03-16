// export interface LabMaster {
//   id?: number;
//   labCode?: string;
//   labName?: string;
//   displayName?: string;
//   email?: string;
//   authenticationType?: number;       // 1 = Normal, 2 = SSO, 3 = Basic
//   logoforRX?: string;
//   lmsSystem?: string;
//   labGroupId?: number;
//   labGroupName?: string;             // display name resolved from API

//   // Audit
//   createdAt?: string;
//   updatedAt?: string | null;
//   isDeleted?: boolean;
//   isActive?: boolean;
//   //dsoMasterId?: number; 

//   // Pagination / filter params
//   pageNumber?: number;
//   pageSize?: number;
//   searchTerm?: string;
//   sortBy?: string;
//   sortDescending?: boolean;
//   showDeleted?: boolean;
//   showInactive?: boolean;
// }


import type { AuditTrails } from "../../../Types/Auditlog.types";

export interface LabMaster {
  // Core fields
  id: number;
  labCode: string;
  labName: string;
  displayName: string;
  email: string;
  authenticationType: number; // 1=Normal, 2=SSO, 3=Basic
  logoforRX: string;
  lmsSystem: string;
  labGroupId: number;
  
  // Audit fields
  createdAt: string; // ISO date string
  updatedAt: string | null;
  isDeleted: boolean;
  isActive: boolean;
  dsoMasterId: number;
  
  // Relationships
  labMappings: any[]; // Array of lab mappings (could be empty)
  dsoLabMappings?: DsoLabMapping[]; // Optional, appears in some responses
  
  // Audit trail
  auditlog?: AuditTrails[]; // Optional array of audit logs
  
  // Pagination/Filtering fields (used in requests)
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortDescending?: boolean;
  showDeleted?: boolean;
  showInactive?: boolean;
}

export interface DsoLabMapping {
  id: number;
  createdAt: string;
  updatedAt: string | null;
  isDeleted: boolean;
  isActive: boolean;
  dsoMasterId: number;
  labMasterId: number;
}

// For paginated requests
export interface LabMasterPaginationParams {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
  sortBy?: string;
  sortDescending?: boolean;
  showDeleted?: boolean;
  showInactive?: boolean;
  id?: number;
  labCode?: string;
  labName?: string;
  labGroupId?: number;
}

// For paginated responses
export interface LabMasterPaginatedResponse {
  data: LabMaster[];
  total: number;
  totalPages?: number;
  pageNumber?: number;
  pageSize?: number;
}

// For create/update payloads
export interface LabMasterPayload {
  labCode: string;
  labName: string;
  displayName?: string;
  email?: string;
  authenticationType: number;
  logoforRX?: string;
  lmsSystem?: string;
  labGroupId: number;
  isActive?: boolean;
  id?: number; // For updates
}

// API response wrapper (based on your service pattern)
export interface ApiResponse<T> {
  isSucess: boolean;
  value: T;
  customMessage?: string;
  error?: string;
  total?: number;
  data?: T[];
}