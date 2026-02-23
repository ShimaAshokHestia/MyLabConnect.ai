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

  // Status Fields
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string | null;
  lastlogin?: string | null;
  lastloginString?: string;
  createAtString?: string;

  // Pagination/Filtering Fields
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortDescending?: boolean;

  // Filtering Fields
  userId?: number;

  // Optional Audit Trail
  auditlog?: AuditTrails[];
}

export interface UserPasswordChange {
  userId?: number;
  oldPassword?: string;
  newPassword?: string;
}