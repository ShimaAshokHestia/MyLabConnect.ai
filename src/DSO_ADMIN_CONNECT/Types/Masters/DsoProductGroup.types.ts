import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface DSOProductGroup {
  id?: number;
  code?: string;
  name?: string;
  dsoMasterId?: number;
  dsoName?: string;
  createdAt?: string;
  updatedAt?: string | null;
  isDeleted?: boolean;
  isActive?: boolean;
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortDescending?: boolean;
  showDeleted?: boolean;
  showInactive?: boolean;
  auditlog:AuditTrails[];
};
