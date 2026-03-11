import type { AuditTrails } from "../../../Types/Auditlog.types";

export interface DSOAdditionalService {
  // Core Identity Fields
  id?: number;
  serviceName?: string;
  serviceNotes?: string;
  
  // DSO Master Relationship
  dsoMasterId?: number;
  dsoName?: string;
  
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
  
  // Optional Audit Trail
  auditlog?: AuditTrails[];
}