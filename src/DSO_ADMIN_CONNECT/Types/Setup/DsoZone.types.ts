import type { AuditTrails } from "../../../Types/Auditlog.types";

export interface DSOZone {
  // Core fields
  id?: number;
  name?: string;
  
  // DSO Master relationship
  dsoMasterId?: number;
  dsoName?: string;
  
  // Audit fields
  createdAt?: string;
  updatedAt?: string | null;
  isDeleted?: boolean;
  isActive?: boolean;
  
  // Pagination/Filtering fields
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortDescending?: boolean;
  showDeleted?: boolean;
  showInactive?: boolean;
  
  // Optional audit trail
  auditlog?: AuditTrails[];
}