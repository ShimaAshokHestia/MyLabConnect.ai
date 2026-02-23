import type { AuditTrails } from "../../../Types/Auditlog.types";

export interface LabSupportType {
  // Core Identity Fields
  id?: number;
  labSupportTypeName?: string;
  escalationDays?: number;
  
  // Lab Master Relationship
  labMasterId?: number;
  labMasterName?: string;
  
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