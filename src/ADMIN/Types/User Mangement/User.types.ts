import type { AuditTrails } from "../../../Types/Auditlog.types";

export interface User {
  // Core Identity Fields
  id?: number;
  userName?: string;
  userEmail?: string;
  phoneNumber?: string;
  address?: string;
  companyName?: string;

  // Auth Fields
  passwordHash?: string;
  authenticationType?: number;
  islocked?: boolean;

  // Relation Fields
  userTypeId?: number;
  userTypeName?: string;
  companyId?: number;

  // Audit Fields
  isActive?: boolean;
  isDeleted?: boolean;
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

  // Filtering Fields
  userId?: number;

  // Optional Audit Trail
  auditlog?: AuditTrails[];
}

// Password Change Type
export interface UserPasswordChange {
  userId?: number;
  oldPassword?: string;
  newPassword?: string;
}