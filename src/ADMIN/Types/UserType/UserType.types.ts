import type { AuditTrails } from "../../../Types/Auditlog.types";

export interface UserType {
  // Core Identity Fields
  id?: number;
  userTypeName?: string;

  // Permission Fields
  isAdminAdable?:   boolean;
  isDSOAddable?:    boolean;
  isLabAddable?:    boolean;
  isDoctorAddable?: boolean;
  isPMAddable?:     boolean;

  // Audit Fields
  createdAt?: string;
  updatedAt?: string | null;
  isDeleted?: boolean;
  isActive?:  boolean;

  // Pagination/Filtering Fields
  pageNumber?:    number;
  pageSize?:      number;
  searchTerm?:    string;
  sortBy?:        string;
  sortDescending?: boolean;
  showDeleted?:   boolean;
  showInactive?:  boolean;

  // Optional Audit Trail
  auditlog?: AuditTrails[];
}