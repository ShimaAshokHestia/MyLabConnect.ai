import type { AuditTrails } from "../../../Types/Auditlog.types";

export interface DSOIndication {
  // Core Identity Fields
  id?: number;
  name?: string;
  
  // Restoration Type Relationship
  dsoProthesisTypeId?: number;
  dsoProthesisname?: string;
  dsoMasterId?: number;
 
  
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