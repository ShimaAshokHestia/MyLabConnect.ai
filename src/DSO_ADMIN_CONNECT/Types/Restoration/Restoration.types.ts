import type { AuditTrails } from "../../../Types/Auditlog.types";

export interface DSORestoration {
  // Core Identity Fields
  id?: number;
  name?: string;

  // Foreign Key Relationships
  dsoProthesisTypeId?: number;
  dsoProthesisname?: string;
  dsoMasterId?: number;

  // Status Fields
  isActive?: boolean;
  isDeleted?: boolean;

  // Audit Fields
  createdAt?: string;
  updatedAt?: string | null;

  // Pagination / Filtering Fields
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