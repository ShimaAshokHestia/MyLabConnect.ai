import type { AuditTrails } from "../../../Types/Auditlog.types";

export interface DSOSetting {
  // Core fields
  id?: number;
  settingType?: string;
  key?: string;
  value?: string;

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